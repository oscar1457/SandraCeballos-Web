// Desplazamiento suave (Lenis) sincronizado con GSAP, y color de la cabecera
// según la sección que hay debajo. Con movimiento reducido no hay suavizado.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduced) {
  const lenis = new Lenis({ lerp: 0.1, anchors: { offset: 0 } });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

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
  ScrollTrigger.addEventListener("refresh", updateTone);
  window.addEventListener("resize", updateTone);
}
