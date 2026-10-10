// Desplazamiento suave (Lenis) para las páginas largas de Aglutinador, igual que
// en la web principal. Se detiene mientras hay un visor (<dialog>) abierto para
// que la página de detrás no se mueva. Con movimiento reducido no se activa.
import Lenis from "lenis";

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduced) {
  const lenis = new Lenis({ lerp: 0.1, anchors: { offset: 0 } });
  const raf = (time: number) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);

  const syncWithDialogs = () => {
    if (document.querySelector("dialog[open]")) {
      lenis.stop();
    } else {
      lenis.start();
    }
  };
  document.querySelectorAll("dialog").forEach((dialog) => {
    new MutationObserver(syncWithDialogs).observe(dialog, { attributes: true, attributeFilter: ["open"] });
  });
}
