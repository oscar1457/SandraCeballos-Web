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

  // ---------- Texto grande: número, título, año ----------
  let shown = 0;
  const setNow = (index: number) => {
    if (index === shown) {
      return;
    }
    const direction = index > shown ? 1 : -1;
    shown = index;
    const work = works[index]!;
    const next = works[(index + 1) % total]!;
    const values: Record<string, string> = {
      num: String(index + 1),
      title: work.title,
      next: next.title,
      year: work.year
    };
    Object.entries(values).forEach(([name, value]) => {
      const node = nowField(name);
      if (reduced) {
        node.textContent = value;
        return;
      }
      gsap.killTweensOf(node);
      gsap.to(node, {
        yPercent: -105 * direction,
        duration: 0.18,
        ease: "power2.in",
        onComplete: () => {
          node.textContent = value;
          gsap.fromTo(node, { yPercent: 105 * direction }, { yPercent: 0, duration: 0.45, ease: "power3.out" });
        }
      });
    });
    rows.forEach((row, rowIndex) => row.classList.toggle("is-current", rowIndex === index));
    if (preview) {
      preview.src = work.thumb;
    }
  };

  // ---------- Rueda ----------
  const placeWheel = (position: number) => {
    const narrow = window.innerWidth < 760;
    // Grados entre obras: el abanico se abre más cuanto más ancha es la pantalla.
    const step = narrow ? 30 : 26;
    items.forEach((item, index) => {
      const angle = (index - position) * step;
      const distance = Math.abs(angle);
      item.style.transform = `translateX(-50%) rotate(${angle}deg) translateY(calc(-1 * var(--radius)))`;
      item.style.opacity = distance > 85 ? "0" : String(1 - Math.max(0, distance - 40) / 60);
      item.style.zIndex = String(100 - Math.round(distance));
      item.style.visibility = distance > 90 ? "hidden" : "visible";
      const card = item.firstElementChild as HTMLElement | null;
      if (card) {
        card.style.filter = distance < 6 ? "none" : `grayscale(${Math.min(distance / 40, 0.85)})`;
        card.tabIndex = distance > 90 ? -1 : 0;
      }
    });
    setNow(Math.min(total - 1, Math.max(0, Math.round(position))));
  };

  let trigger: ScrollTrigger | null = null;
  const enableWheel = () => {
    trigger?.kill();
    trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => placeWheel(self.progress * (total - 1))
    });
    placeWheel(0);
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
    if (section.dataset.mode === "wheel" && trigger) {
      placeWheel(trigger.progress * (total - 1));
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
