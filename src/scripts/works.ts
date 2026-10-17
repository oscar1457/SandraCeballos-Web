// Obra: rueda que gira con el scroll, modo lista y ficha de cada obra.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { attachSources, createHalftone, type Halftone } from "./halftone";

gsap.registerPlugin(ScrollTrigger);

type Work = {
  slug: string;
  thumb: string;
  full: string;
  fullSrcset: string;
  alt: string;
  title: string;
  year: string;
  technique: string;
  techniqueEn: string;
  dimensions: string;
  description: string;
  descriptionEn: string;
  process: string;
};

const section = document.querySelector<HTMLElement>("[data-works]");
const dataNode = document.getElementById("works-data");
const sheet = document.querySelector<HTMLDialogElement>("[data-sheet]");

if (section && dataNode && sheet) {
  const works = JSON.parse(dataNode.textContent ?? "[]") as Work[];
  const total = works.length;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const items = Array.from(section.querySelectorAll<HTMLElement>("[data-wheel-item]"));
  const rows = Array.from(section.querySelectorAll<HTMLButtonElement>("[data-list-row]"));
  const preview = section.querySelector<HTMLImageElement>("[data-list-preview]");
  const modeButtons = Array.from(section.querySelectorAll<HTMLButtonElement>("[data-mode-button]"));
  const nowField = (name: string) => section.querySelector<HTMLElement>(`[data-now="${name}"]`)!;

  // ---------- Pie de foto: número, título y datos ----------
  const pad = (n: number) => String(n).padStart(2, "0");
  const escapeHtml = (value: string) =>
    value.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
  const dataHtml = (work: Work) =>
    `${escapeHtml(work.year)} · <span data-lang="es">${escapeHtml(work.technique)}</span>` +
    `<span data-lang="en">${escapeHtml(work.techniqueEn)}</span> · ${escapeHtml(work.dimensions)}`;

  let shown = 0;
  const setNow = (index: number, animate = true) => {
    if (index === shown && animate) {
      return;
    }
    const direction = index >= shown ? 1 : -1;
    shown = index;
    const work = works[index]!;
    const values: Record<string, string> = {
      num: pad(index + 1),
      count: pad(index + 1),
      title: work.title,
      data: dataHtml(work)
    };
    Object.entries(values).forEach(([name, value]) => {
      const node = nowField(name);
      const write = () => {
        if (name === "data") {
          node.innerHTML = value;
        } else {
          node.textContent = value;
        }
      };
      if (reduced || !animate) {
        write();
        return;
      }
      // El texto anterior sale hacia arriba y el nuevo entra desde abajo.
      gsap.killTweensOf(node);
      gsap.to(node, {
        yPercent: -105 * direction,
        duration: 0.18,
        ease: "power2.in",
        onComplete: () => {
          write();
          gsap.fromTo(node, { yPercent: 105 * direction }, { yPercent: 0, duration: 0.45, ease: "power3.out" });
        }
      });
    });
    rows.forEach((row, rowIndex) => row.classList.toggle("is-current", rowIndex === index));
    if (preview) {
      preview.src = work.thumb;
    }
  };

  // ---------- Galería en línea recta ----------
  // Desplazamiento continuo: las obras se mueven a la par que el scroll. La
  // central va grande y a color; al alejarse se hacen pequeñas, grises y
  // transparentes.
  let current = 0;
  let position = 0;
  const gap = () => (window.innerWidth < 760 ? window.innerWidth * 0.8 : window.innerWidth * 0.42);

  const placeGallery = (value: number, animateText = true) => {
    position = value;
    items.forEach((item, itemIndex) => {
      const offset = itemIndex - value;
      const distance = Math.abs(offset);
      const near = Math.min(distance, 1);
      gsap.set(item, {
        x: offset * gap(),
        scale: 1 - near * 0.38,
        autoAlpha: distance <= 1 ? 1 - near * 0.65 : Math.max(0, 0.35 - (distance - 1) * 0.6),
        filter: `grayscale(${near})`
      });
    });
    const index = Math.min(total - 1, Math.max(0, Math.round(value)));
    if (index !== current || !animateText) {
      current = index;
      items.forEach((item, itemIndex) => {
        const card = item.firstElementChild as HTMLElement | null;
        if (card) card.tabIndex = itemIndex === index ? 0 : -1;
      });
      setNow(index, animateText);
    }
  };

  let trigger: ScrollTrigger | null = null;
  const enableWheel = () => {
    trigger?.kill();
    trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => placeGallery(self.progress * (total - 1))
    });
    placeGallery(trigger.progress * (total - 1), false);
  };

  // ---------- Cambio de modo ----------
  // La lista ocupa mucho menos que la galería (que se recorre con el scroll).
  // Al cambiar de modo, la página se queda en la sección: la lista se ve desde
  // arriba y la galería vuelve a la obra que estaba marcada. Antes el scroll se
  // quedaba donde estaba y, al encoger la sección, te dejaba en otra.
  const setMode = (mode: "wheel" | "list", keepPlace = false) => {
    const changed = section.dataset.mode !== mode;
    const marked = shown;
    section.dataset.mode = mode;
    modeButtons.forEach((button) =>
      button.setAttribute("aria-pressed", String(button.dataset.modeButton === mode))
    );
    if (mode === "list") {
      trigger?.kill();
      trigger = null;
    }
    // Primero se coloca el scroll (con la sección ya con su nueva altura) y
    // después se activa la galería, que lee la posición para elegir la obra.
    if (keepPlace && changed) {
      let top = section.getBoundingClientRect().top + window.scrollY;
      if (mode === "wheel" && total > 1) {
        top += (marked / (total - 1)) * Math.max(0, section.offsetHeight - window.innerHeight);
      }
      document.dispatchEvent(new CustomEvent("sc:scroll-to", { detail: { top: Math.round(top) } }));
    }
    if (mode === "wheel") {
      enableWheel();
    }
    ScrollTrigger.refresh();
  };

  modeButtons.forEach((button) =>
    button.addEventListener("click", () => setMode(button.dataset.modeButton === "list" ? "list" : "wheel", true))
  );

  rows.forEach((row) => {
    const index = Number(row.dataset.listRow);
    row.addEventListener("mouseenter", () => setNow(index));
    row.addEventListener("focus", () => setNow(index));
  });

  // ---------- Ficha ----------
  const sheetField = (name: string) => sheet.querySelector<HTMLElement>(`[data-sheet="${name}"]`)!;
  const sheetImage = sheetField("image") as HTMLImageElement;
  let sheetIndex = 0;
  let opener: HTMLElement | null = null;

  // ---------- Vídeo de proceso (solo algunas obras) ----------
  // Detalle pequeño en trama de imprenta marrón, suave, sobre el blanco de la ficha.
  const processFigure = sheet.querySelector<HTMLElement>("[data-sheet-process]");
  const processCanvas = sheet.querySelector<HTMLCanvasElement>("[data-sheet-process-canvas]");
  const processVideo = sheet.querySelector<HTMLVideoElement>("[data-sheet-process-video]");
  const processPoster = sheet.querySelector<HTMLImageElement>("[data-sheet-process-poster]");
  let processHalftone: Halftone | null = null;
  let processFrame = 0;
  let processLast = -1;
  let processHasVideoFrame = false;

  const processLoop = () => {
    processFrame = 0;
    if (!processHalftone || !processVideo || !sheet.open || processFigure?.hidden) return;
    if (processVideo.readyState >= 2 && processVideo.currentTime !== processLast) {
      processLast = processVideo.currentTime;
      processHasVideoFrame = true;
      processHalftone.upload(processVideo, processVideo.videoWidth, processVideo.videoHeight);
    }
    processHalftone.draw();
    processFrame = requestAnimationFrame(processLoop);
  };

  const showProcess = (base: string) => {
    if (!processFigure || !processCanvas || !processVideo || !processPoster) return;
    if (!base) {
      processFigure.hidden = true;
      processVideo.pause();
      return;
    }
    processFigure.hidden = false;
    processPoster.src = `${base}.jpg`;
    if (!processHalftone) {
      processHalftone = createHalftone(processCanvas, {
        paper: [255, 255, 255],
        ink: [140, 92, 62],
        cell: (width) => Math.max(3, width / 46),
        dotScale: 0.56,
        minDot: 0.06,
        contrast: 1.05
      });
      if (processHalftone) processFigure.classList.add("is-halftone");
    }
    const halftone = processHalftone;
    if (!halftone) return;
    processLast = -1;
    processHasVideoFrame = false;
    const image = new Image();
    image.decoding = "async";
    image.onload = () => {
      if (!processHasVideoFrame) halftone.upload(image, image.naturalWidth, image.naturalHeight);
      halftone.resize();
      halftone.draw();
    };
    image.src = `${base}.jpg`;
    if (!reduced) {
      attachSources(processVideo, base);
      processVideo.play().catch(() => {});
      requestAnimationFrame(() => {
        halftone.resize();
        if (!processFrame) processFrame = requestAnimationFrame(processLoop);
      });
    }
  };

  const fillSheet = (index: number) => {
    sheetIndex = (index + total) % total;
    const work = works[sheetIndex]!;
    sheetImage.src = work.full;
    sheetImage.srcset = work.fullSrcset;
    sheetImage.sizes = "(max-width: 760px) 100vw, 55vw";
    sheetImage.alt = work.alt;
    sheetField("count").textContent = `${sheetIndex + 1} / ${total}`;
    ["title", "year", "technique", "techniqueEn", "dimensions", "description", "descriptionEn"].forEach(
      (key) => {
        sheetField(key).textContent = work[key as keyof Work];
      }
    );
    showProcess(work.process);
    history.replaceState(null, "", `#obra/${work.slug}`);
  };

  const openSheet = (index: number) => {
    fillSheet(index);
    if (!sheet.open) {
      sheet.showModal();
    }
  };

  section.querySelectorAll<HTMLButtonElement>("[data-open-work]").forEach((button) => {
    button.addEventListener("click", () => {
      opener = button;
      openSheet(Number(button.dataset.openWork) || 0);
    });
  });

  // "Ver ficha" abre la obra que está en el centro.
  section.querySelector<HTMLButtonElement>("[data-open-current]")?.addEventListener("click", (event) => {
    opener = event.currentTarget as HTMLElement;
    openSheet(current);
  });

  sheet.querySelector("[data-sheet-close]")?.addEventListener("click", () => sheet.close());
  sheet.querySelector("[data-sheet-prev]")?.addEventListener("click", () => fillSheet(sheetIndex - 1));
  sheet.querySelector("[data-sheet-next]")?.addEventListener("click", () => fillSheet(sheetIndex + 1));
  sheet.addEventListener("click", (event) => {
    // Clic en la zona desenfocada (fuera del panel blanco) cierra la ficha.
    if (event.target === sheet) {
      sheet.close();
    }
  });
  sheet.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") fillSheet(sheetIndex - 1);
    if (event.key === "ArrowRight") fillSheet(sheetIndex + 1);
  });
  sheet.addEventListener("close", () => {
    processVideo?.pause();
    // Al cerrar, la URL vuelve a quedar limpia (sin #obra).
    history.replaceState(history.state, "", window.location.pathname + window.location.search);
    opener?.focus({ preventScroll: true });
    opener = null;
  });

  // ---------- Inicio ----------
  setMode(reduced ? "list" : "wheel");
  window.addEventListener("resize", () => {
    if (section.dataset.mode === "wheel") {
      placeGallery(position, false);
    }
  });

  // Enlaces directos a una obra (#obra/<slug>): smooth.ts avisa y aquí se abre la ficha.
  document.addEventListener("sc:navigate", (event) => {
    const { section: target, slug } = (event as CustomEvent<{ section: string; slug: string }>).detail;
    if (target !== "obra") return;
    const index = works.findIndex((work) => work.slug === slug);
    if (index >= 0) {
      openSheet(index);
    }
  });
}

// Miniaturas de la rueda que esperan: se cargan en cuanto la galería entra en pantalla.
{
  const gallery = document.getElementById("obra");
  const waiting = Array.from(document.querySelectorAll<HTMLImageElement>("img[data-src]"));
  if (gallery && waiting.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        waiting.forEach((img) => {
          if (img.dataset.srcset) img.srcset = img.dataset.srcset;
          img.src = img.dataset.src ?? "";
          delete img.dataset.src;
          delete img.dataset.srcset;
        });
      },
      { rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(gallery);
  }
}
