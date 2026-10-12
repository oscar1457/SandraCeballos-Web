// Desplazamiento suave (Lenis) sincronizado con GSAP, y color de la cabecera
// según la sección que hay debajo. Con movimiento reducido no hay suavizado.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let lenis: Lenis | null = null;
if (!reduced) {
  // Los enlaces internos (#obra…) los gestiona navigate() más abajo, no Lenis.
  lenis = new Lenis({ lerp: 0.1 });
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

// ---------- Navegación interna ----------
// Un solo sitio decide qué pasa con los enlaces "#…": desplaza con suavidad
// hasta la sección y, si el enlace lleva algo más (#taller/<historia>,
// #obra/<obra>), avisa a esa sección para que muestre la historia o abra la
// ficha. La URL no se queda con "#obra" ni similares: así recargar la página
// no te lleva a otro sitio. Solo la ficha abierta escribe #obra/<obra> (para
// poder compartirla) y lo borra al cerrarse.
export type NavigateDetail = { section: string; slug: string };

const cleanUrl = () => {
  if (window.location.hash) {
    history.replaceState(history.state, "", window.location.pathname + window.location.search);
  }
};

const navigate = (hash: string, immediate = false) => {
  let raw = "";
  try {
    raw = decodeURIComponent(hash.replace(/^#/, ""));
  } catch {
    return false;
  }
  const [id = "", slug = ""] = raw.split("/");
  const section = id ? document.getElementById(id) : null;
  if (!section) return false;

  if (slug) {
    document.dispatchEvent(new CustomEvent<NavigateDetail>("sc:navigate", { detail: { section: id, slug } }));
  }
  const top = id === "inicio" ? 0 : section;
  if (lenis) {
    lenis.scrollTo(top, { immediate, force: true });
  } else if (top === 0) {
    window.scrollTo({ top: 0 });
  } else {
    section.scrollIntoView();
  }
  return true;
};

document.addEventListener("click", (event) => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return;
  }
  const link = (event.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href^="#"]');
  // El enlace "Saltar al contenido" mantiene su comportamiento normal (mueve el foco).
  if (!link || link.classList.contains("skip-link")) return;
  if (navigate(link.getAttribute("href") ?? "")) {
    event.preventDefault();
  }
});

// Entrar con un enlace directo (o cambiar el "#…" a mano en la barra de direcciones).
const navigateFromUrl = (immediate: boolean) => {
  const hash = window.location.hash;
  if (!hash) return;
  cleanUrl();
  ScrollTrigger.refresh();
  navigate(hash, immediate);
};
window.addEventListener("load", () => navigateFromUrl(true));
window.addEventListener("hashchange", () => navigateFromUrl(false));

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
