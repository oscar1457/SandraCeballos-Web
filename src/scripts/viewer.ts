// Visor de obras: abre una obra en grande en un <dialog> nativo.
// El enlace #obra/<slug> abre directamente esa obra (útil para compartir).

type ViewerWork = {
  slug: string;
  src: string;
  srcset: string;
  alt: string;
  title: string;
  year: string;
  technique: string;
  techniqueEn: string;
  dimensions: string;
  description: string;
  descriptionEn: string;
};

const dialog = document.querySelector<HTMLDialogElement>("[data-viewer]");
const dataNode = document.getElementById("viewer-data");

if (dialog && dataNode) {
  const works = JSON.parse(dataNode.textContent ?? "[]") as ViewerWork[];
  const image = dialog.querySelector<HTMLImageElement>("[data-viewer-image]")!;
  const field = (name: string) => dialog.querySelector<HTMLElement>(`[data-viewer-${name}]`)!;
  const openers = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-open-work]"));

  let current = 0;
  let lastOpener: HTMLElement | null = null;

  const show = (index: number) => {
    current = (index + works.length) % works.length;
    const work = works[current]!;
    image.src = work.src;
    image.srcset = work.srcset;
    image.sizes = "(max-width: 900px) 100vw, calc(100vw - 22rem)";
    image.alt = work.alt;
    field("title").textContent = work.title;
    field("year").textContent = work.year;
    field("technique").textContent = work.technique;
    field("technique-en").textContent = work.techniqueEn;
    field("dimensions").textContent = work.dimensions;
    field("description").textContent = work.description;
    field("description-en").textContent = work.descriptionEn;
    field("count").textContent = `${current + 1} / ${works.length}`;
    history.replaceState(null, "", `#obra/${work.slug}`);
  };

  const open = (index: number) => {
    show(index);
    if (!dialog.open) {
      dialog.showModal();
    }
  };

  const close = () => {
    if (dialog.open) {
      dialog.close();
    }
  };

  dialog.addEventListener("close", () => {
    history.replaceState(null, "", "#obra");
    (lastOpener ?? openers[current])?.focus({ preventScroll: true });
    lastOpener = null;
  });

  openers.forEach((button) => {
    button.addEventListener("click", () => {
      lastOpener = button;
      open(Number(button.dataset.openWork) || 0);
    });
  });

  dialog.querySelector("[data-viewer-close]")?.addEventListener("click", close);
  dialog.querySelector("[data-viewer-prev]")?.addEventListener("click", () => show(current - 1));
  dialog.querySelector("[data-viewer-next]")?.addEventListener("click", () => show(current + 1));

  // Clic fuera de la imagen y de la ficha (en el fondo del visor) cierra.
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog || (event.target as HTMLElement).classList.contains("viewer__figure")) {
      close();
    }
  });

  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      show(current - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      show(current + 1);
    }
  });

  const openFromHash = () => {
    const match = window.location.hash.match(/^#obra\/(.+)$/);
    if (!match) {
      return;
    }
    const index = works.findIndex((work) => work.slug === decodeURIComponent(match[1]!));
    if (index >= 0) {
      open(index);
    }
  };

  openFromHash();
}
