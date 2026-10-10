// Desplazamiento suave (Lenis) sincronizado con GSAP, y color de la cabecera
// según la sección que hay debajo. Con movimiento reducido no hay suavizado.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let lenis: Lenis | null = null;
if (!reduced) {
  lenis = new Lenis({ lerp: 0.1, anchors: { offset: 0 } });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

// Recalcula las posiciones de las animaciones de scroll cuando cambia la altura
// de la página (por ejemplo al abrir un apartado). Solo lo hace con el scroll
// quieto: si se hace en pleno movimiento, la página da un salto.
let pending: number | undefined;
const refreshWhenIdle = () => {
  window.clearTimeout(pending);
  pending = window.setTimeout(() => {
    if (lenis?.isScrolling) {
      refreshWhenIdle();
      return;
    }
    ScrollTrigger.refresh();
  }, 200);
};

let lastHeight = document.documentElement.scrollHeight;
new ResizeObserver(() => {
  const height = document.documentElement.scrollHeight;
  if (Math.abs(height - lastHeight) > 2) {
    lastHeight = height;
    refreshWhenIdle();
  }
}).observe(document.body);

// Si se entra con un enlace a una sección (#trayectoria…), vamos a ella cuando
// la página ya tiene su altura definitiva.
window.addEventListener("load", () => {
  const id = window.location.hash.slice(1);
  const target = id && !id.includes("/") ? document.getElementById(id) : null;
  if (target) {
    ScrollTrigger.refresh();
    if (lenis) {
      lenis.scrollTo(target, { immediate: true, force: true });
    } else {
      target.scrollIntoView();
    }
  }
});

const header = document.querySelector<HTMLElement>("[data-site-header]");
const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-header]"));

if (header && sections.length > 0) {
  const updateTone = () => {
    // La sección que está justo debajo de la cabecera decide el color.
    const probe = header.offsetHeight / 2;
    const current = sections.find((section) => {
      const rect = section.getBoundingClientRect();
      return rect.top <= probe && rect.bottom > probe;
    });
    header.dataset.tone = current?.dataset.header === "dark" ? "dark" : "light";
    // La cabecera toma el color de fondo de la sección para que el texto de la
    // página no se mezcle con el menú al pasar por debajo.
    const background = current ? getComputedStyle(current).backgroundColor : "transparent";
    header.style.setProperty("--header-bg", background);
  };
  updateTone();
  window.addEventListener("scroll", updateTone, { passive: true });
  window.addEventListener("resize", updateTone);
  ScrollTrigger.addEventListener("refresh", updateTone);
}
