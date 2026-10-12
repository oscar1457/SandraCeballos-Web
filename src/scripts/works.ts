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
      // Como un contador mecánico: sale rápido y el nuevo entra con un pequeño rebote.
      gsap.killTweensOf(node);
      gsap.to(node, {
        yPercent: -105 * direction,
        duration: 0.12,
        ease: "power2.in",
        onComplete: () => {
          write();
          gsap.fromTo(node, { yPercent: 105 * direction }, { yPercent: 0, duration: 0.38, ease: "back.out(2)" });
        }
      });
    });
    rows.forEach((row, rowIndex) => row.classList.toggle("is-current", rowIndex === index));
    if (preview) {
      preview.src = work.thumb;
    }
  };

  // ---------- Galería en línea recta ----------
  // Cada tramo de scroll corresponde a una obra. Al cruzar de un tramo al
  // siguiente todo se mueve de golpe, se pasa un poco y vuelve a encajar: el
  // "clic" de la rueda de modos de una cámara.
  let current = 0;
  const gap = () => (window.innerWidth < 760 ? window.innerWidth * 0.8 : window.innerWidth * 0.42);

  const placeGallery = (index: number, animate: boolean) => {
    items.forEach((item, itemIndex) => {
      const offset = itemIndex - index;
      const distance = Math.abs(offset);
      const props = {
        x: Math.sign(offset) * Math.min(distance, 2) * gap(),
        scale: offset === 0 ? 1 : 0.62,
        autoAlpha: distance > 1 ? 0 : offset === 0 ? 1 : 0.35,
        filter: offset === 0 ? "grayscale(0)" : "grayscale(1)"
      };
      if (animate && !reduced) {
        gsap.to(item, { ...props, duration: 0.46, ease: "back.out(1.9)", overwrite: "auto" });
      } else {
        gsap.set(item, props);
      }
      const card = item.firstElementChild as HTMLElement | null;
      if (card) {
        card.tabIndex = offset === 0 ? 0 : -1;
      }
    });
    setNow(index, animate);
  };

  let trigger: ScrollTrigger | null = null;
  const enableWheel = () => {
    trigger?.kill();
    trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const index = Math.min(total - 1, Math.max(0, Math.round(self.progress * (total - 1))));
        if (index !== current) {
          current = index;
          placeGallery(index, true);
        }
      }
    });
    current = Math.min(total - 1, Math.max(0, Math.round(trigger.progress * (total - 1))));
    placeGallery(current, false);
  };

  // ---------- Cambio de modo ----------
  const setMode = (mode: "wheel" | "list") => {
    section.dataset.mode = mode;
    modeButtons.forEach((button) =>
      button.setAttribute("aria-pressed", String(button.dataset.modeButton === mode))
    );
    if (mode === "wheel") {
      enableWheel();
    } else {
      trigger?.kill();
      trigger = null;
    }
    ScrollTrigger.refresh();
  };

  modeButtons.forEach((button) =>
    button.addEventListener("click", () => setMode(button.dataset.modeButton === "list" ? "list" : "wheel"))
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
    history.replaceState(null, "", "#obra");
    opener?.focus({ preventScroll: true });
    opener = null;
  });

  // ---------- Inicio ----------
  setMode(reduced ? "list" : "wheel");
  window.addEventListener("resize", () => {
    if (section.dataset.mode === "wheel") {
      placeGallery(current, false);
    }
  });

  // Enlaces directos a una obra: #obra/<slug>, al cargar o sin recargar la página.
  const openFromHash = () => {
    const hash = window.location.hash.match(/^#obra\/(.+)$/);
    if (!hash) {
      return;
    }
    const index = works.findIndex((work) => work.slug === decodeURIComponent(hash[1]!));
    if (index >= 0) {
      openSheet(index);
    }
  };
  openFromHash();
  window.addEventListener("hashchange", openFromHash);
}
