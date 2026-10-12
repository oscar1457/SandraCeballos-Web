import { test, expect, ROUTES } from "./helpers";
import type { Page } from "@playwright/test";

// Responsive: en teléfonos y tableta, en todas las páginas y recorriéndolas
// de arriba abajo, comprueba que no haya:
//  1. desplazamiento lateral (medido sin el recorte overflow-x: clip, que en
//     Safari del iPhone no siempre lo evita),
//  2. elementos visibles que se salgan de la pantalla,
//  3. texto cortado dentro de su caja,
//  4. letra de menos de 12 px,
//  5. botones o enlaces de menos de 24 px (mínimo de WCAG 2.2),
//  6. botones o enlaces tapados por otro elemento,
//  7. textos o imágenes que se pisan entre sí (aunque sea en parte).

const SIZES = [
  { width: 360, height: 740 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 }
];

type Report = { wide: number; outside: string[]; clipped: string[]; tiny: string[]; small: string[]; covered: string[]; overlap: string[] };

const audit = (page: Page) =>
  page.evaluate((): Report => {
    const vw = window.innerWidth;
    const root = document.documentElement;
    root.style.overflowX = "visible";
    document.body.style.overflowX = "visible";
    const wide = root.scrollWidth - root.clientWidth;
    root.style.overflowX = "";
    document.body.style.overflowX = "";

    const out: Report = { wide, outside: [], clipped: [], tiny: [], small: [], covered: [], overlap: [] };
    const name = (el: Element) => {
      const cls = typeof el.className === "string" ? el.className.trim().split(/\s+/).slice(0, 2).join(".") : "";
      const text = (el.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 30);
      return `${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}${cls ? "." + cls : ""} «${text}»`;
    };
    // painted = lo que se pinta en pantalla (aunque esté oculto a lectores de
    // pantalla); sin painted, además se descarta lo marcado aria-hidden.
    const visible = (el: Element, painted = false) => {
      const style = getComputedStyle(el);
      if (style.visibility === "hidden" || style.display === "none" || Number(style.opacity) === 0) return false;
      if (el.closest(painted ? "[hidden],dialog:not([open]),.sr-only" : "[hidden],[aria-hidden='true'],dialog:not([open]),[inert],.sr-only")) return false;
      const details = el.closest("details");
      if (details && !details.open && !el.closest("summary")) return false;
      const langBox = el.closest("[data-lang]");
      if (langBox && getComputedStyle(langBox).display === "none") return false;
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    };
    const clippedByParent = (el: Element, rect: DOMRect) => {
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
        const style = getComputedStyle(p);
        if (style.overflowX !== "visible" || style.clipPath !== "none") {
          const box = p.getBoundingClientRect();
          if (rect.right > box.right + 1 || rect.left < box.left - 1) return true;
        }
      }
      return false;
    };
    for (const el of Array.from(document.body.querySelectorAll("*"))) {
      if (["SCRIPT", "STYLE", "SOURCE", "BR", "svg", "path"].includes(el.tagName)) continue;
      if (!visible(el)) continue;
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      // Lo que va dentro de algo fijo (cabecera, noticia) no crea scroll lateral.
      let insideFixed = false;
      for (let n: Element | null = el; n && n !== document.body; n = n.parentElement) {
        if (getComputedStyle(n).position === "fixed") insideFixed = true;
      }
      if (!insideFixed && (rect.right > vw + 1 || rect.left < -1) && !clippedByParent(el, rect) && rect.width < vw * 3) {
        out.outside.push(`${name(el)} ${Math.round(rect.left)}→${Math.round(rect.right)}`);
      }
      const ownText = Array.from(el.childNodes).some((n) => n.nodeType === 3 && (n.textContent ?? "").trim());
      if (ownText) {
        if (parseFloat(style.fontSize) < 12 && el.tagName !== "SUP") out.tiny.push(`${name(el)} ${style.fontSize}`);
        if (style.overflowX === "hidden" && style.textOverflow !== "ellipsis" && el.scrollWidth > el.clientWidth + 2) {
          out.clipped.push(`${name(el)} ${el.scrollWidth}>${el.clientWidth}`);
        }
      }
    }
    for (const el of Array.from(document.querySelectorAll("a[href], button, summary, input, select, textarea, [role=button]"))) {
      if (!visible(el)) continue;
      const rect = el.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight || rect.left < 0 || rect.right > vw) continue;
      if ((rect.height < 24 || rect.width < 24) && getComputedStyle(el).display !== "inline") {
        out.small.push(`${name(el)} ${Math.round(rect.width)}×${Math.round(rect.height)}`);
      }
      const x = Math.min(Math.max(rect.left + rect.width / 2, 1), vw - 1);
      const y = Math.min(Math.max(rect.top + rect.height / 2, 1), window.innerHeight - 1);
      const hit = document.elementFromPoint(x, y);
      let underFixedBar = false;
      for (let n: Element | null = hit; n && n !== document.body; n = n.parentElement) {
        if (["fixed", "sticky"].includes(getComputedStyle(n).position) && !n.matches("section, main, [class*='__sticky']")) underFixedBar = true;
      }
      if (hit && !underFixedBar && hit !== el && !el.contains(hit) && !hit.contains(el)) out.covered.push(`${name(el)} tapado por ${name(hit)}`);
    }
    // 7. Textos e imágenes que se pisan: se comparan las cajas de lo que se ve
    //    (sin capas decorativas marcadas aria-hidden, sin imágenes de fondo
    //    —alt vacío y posicionadas detrás— ni lo que va fijo). Los textos se
    //    miden línea a línea: la caja de un párrafo partido abarca huecos.
    const content: { el: Element; rects: DOMRect[] }[] = [];
    for (const el of Array.from(document.body.querySelectorAll("*"))) {
      const isImage = el.tagName === "IMG";
      const ownText = Array.from(el.childNodes).some((n) => n.nodeType === 3 && (n.textContent ?? "").trim());
      if (!isImage && !ownText) continue;
      if (!visible(el, true)) continue;
      if (!(el as HTMLElement).checkVisibility?.({ opacityProperty: true, visibilityProperty: true })) continue;
      // Capa decorativa = oculta a lectores de pantalla Y colocada detrás
      // (absoluta), como las letras gigantes de fondo. Un texto aria-hidden
      // normal (p. ej. el nombre con el rayo) sí cuenta.
      let fixedOrDecor = false;
      for (let n: Element | null = el; n && n !== document.body; n = n.parentElement) {
        const position = getComputedStyle(n).position;
        if (position === "fixed") fixedOrDecor = true;
        if (n.closest("[aria-hidden='true']") && position === "absolute") fixedOrDecor = true;
      }
      if (fixedOrDecor) continue;
      if (isImage && el.getAttribute("alt") === "" && ["absolute", "fixed"].includes(getComputedStyle(el).position)) continue;
      // Cada línea de texto se mide con su altura de línea real (la caja de la
      // fuente es más alta e incluye el hueco de los descendentes, que en
      // títulos con interlineado apretado se monta sin que las letras se toquen).
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
      const toLine = (r: DOMRect) =>
        Number.isFinite(lineHeight) && lineHeight < r.height
          ? new DOMRect(r.left, r.top + (r.height - lineHeight) / 2, r.width, lineHeight)
          : r;
      const rects = (isImage ? [el.getBoundingClientRect()] : Array.from(el.getClientRects()).map(toLine)).filter(
        (r) => r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < vw && r.width >= 2 && r.height >= 2
      );
      if (rects.length) content.push({ el, rects });
    }
    for (let i = 0; i < content.length; i++) {
      for (let j = i + 1; j < content.length; j++) {
        const a = content[i]!;
        const b = content[j]!;
        if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
        const hit = a.rects.some((ra) =>
          b.rects.some((rb) => {
            const w = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left);
            const h = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
            if (w <= 0 || h <= 0) return false;
            return (w * h) / Math.min(ra.width * ra.height, rb.width * rb.height) > 0.15;
          })
        );
        if (hit) out.overlap.push(`${name(a.el)} pisa ${name(b.el)}`);
      }
    }
    return out;
  });

for (const size of SIZES) {
  test.describe(`${size.width}px`, () => {
    test.use({ viewport: size, isMobile: size.width < 700, hasTouch: true });

    for (const route of ROUTES) {
      test(`responsive ${route}`, async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== "desktop" && testInfo.project.name !== "webkit-desktop", "Una pasada por motor basta (los tamaños los pone este test)");
        test.setTimeout(90_000);
        await page.goto(route);
        const height = await page.evaluate(() => document.documentElement.scrollHeight);
        const merged: Report = { wide: 0, outside: [], clipped: [], tiny: [], small: [], covered: [], overlap: [] };
        for (let y = 0; y < height; y += size.height * 0.8) {
          await page.evaluate((top) => window.scrollTo(0, top), y);
          await page.waitForTimeout(300);
          const report = await audit(page);
          merged.wide = Math.max(merged.wide, report.wide);
          for (const key of ["outside", "clipped", "tiny", "small", "covered", "overlap"] as const) {
            report[key].forEach((item) => !merged[key].includes(item) && merged[key].push(item));
          }
        }
        expect(merged.wide, "desplazamiento lateral (px)").toBe(0);
        expect(merged.outside, "se sale de la pantalla").toEqual([]);
        expect(merged.clipped, "texto cortado").toEqual([]);
        expect(merged.tiny, "letra pequeña").toEqual([]);
        expect(merged.small, "zona táctil pequeña").toEqual([]);
        expect(merged.covered, "tapado por otro elemento").toEqual([]);
        expect(merged.overlap, "textos o imágenes que se pisan").toEqual([]);
      });
    }
  });
}
