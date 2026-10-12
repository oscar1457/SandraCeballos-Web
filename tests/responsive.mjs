// Auditoría responsive: varias anchuras de teléfono/tablet, en todas las páginas.
// Comprueba lo mismo que miran Lighthouse / los tests "mobile friendly":
//  1. scroll horizontal (contenido más ancho que la pantalla)
//  2. elementos visibles que se salen de la pantalla
//  3. texto cortado dentro de su caja
//  4. letra demasiado pequeña (< 12 px)
//  5. zonas táctiles pequeñas (< 24 px, mínimo de WCAG 2.2 AA)
//  6. botones/enlaces tapados por otro elemento
//
// Uso (una vez: npm i -D playwright && npx playwright install chromium):
//   npm run build && npm run preview      (en otra terminal)
//   node tests/responsive.mjs             (o: BASE=http://localhost:4321 node tests/responsive.mjs shots)
// Con "shots" guarda capturas de cada sección a 390 px en tests/shots/.
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";
const BASE = process.env.BASE ?? "http://localhost:4321";
const PAGES = ["/", "/aglutinador/", "/aglutinador/historia/", "/aglutinador/archivo/", "/aviso-legal/"];
const SIZES = [
  [360, 740],
  [390, 844],
  [430, 932],
  [768, 1024]
];
const SHOTS = process.argv.includes("shots");

const audit = () => {
  const vw = innerWidth;
  // El recorte "overflow-x: clip" de html/body esconde el problema en Chrome,
  // pero Safari del iPhone puede dejar mover la página de lado: se mide sin él.
  const root = document.documentElement;
  root.style.overflowX = "visible";
  document.body.style.overflowX = "visible";
  const wide = root.scrollWidth - root.clientWidth;
  root.style.overflowX = "";
  document.body.style.overflowX = "";
  const out = { hscroll: wide, outside: [], clipped: [], tiny: [], small: [], covered: [] };
  const name = (el) => {
    const cls = typeof el.className === "string" ? el.className.trim().split(/\s+/).slice(0, 2).join(".") : "";
    const txt = (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 30);
    return `${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}${cls ? "." + cls : ""} «${txt}»`;
  };
  const visible = (el) => {
    const s = getComputedStyle(el);
    if (s.visibility === "hidden" || s.display === "none" || Number(s.opacity) === 0) return false;
    if (el.closest("[hidden],[aria-hidden='true'],dialog:not([open]),[inert],.sr-only,.visually-hidden")) return false;
    const det = el.closest("details");
    if (det && !det.open && !el.closest("summary")) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  // ¿Lo recorta algún antepasado con overflow distinto de visible?
  const clippedByAncestor = (el, r) => {
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const s = getComputedStyle(p);
      if (s.overflowX !== "visible" || s.clipPath !== "none") {
        const pr = p.getBoundingClientRect();
        if (r.right > pr.right + 1 || r.left < pr.left - 1) return true;
      }
    }
    return false;
  };
  const langHidden = (el) => !!el.closest("[data-lang]") && getComputedStyle(el.closest("[data-lang]")).display === "none";
  for (const el of document.body.querySelectorAll("*")) {
    if (["SCRIPT", "STYLE", "SVG", "PATH", "SOURCE", "BR"].includes(el.tagName.toUpperCase())) continue;
    if (langHidden(el) || !visible(el)) continue;
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    if (s.position !== "fixed" && (r.right > vw + 1 || r.left < -1) && !clippedByAncestor(el, r) && r.width < vw * 3) {
      out.outside.push(`${name(el)} x ${Math.round(r.left)}→${Math.round(r.right)}`);
    }
    const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (hasText) {
      if (parseFloat(s.fontSize) < 12 && el.tagName !== "SUP") out.tiny.push(`${name(el)} ${s.fontSize}`);
      if (s.overflowX === "hidden" && s.textOverflow !== "ellipsis" && el.scrollWidth > el.clientWidth + 2) {
        out.clipped.push(`${name(el)} ${el.scrollWidth}>${el.clientWidth}`);
      }
    }
  }
  for (const el of document.querySelectorAll("a[href], button, summary, input, select, textarea, [role=button]")) {
    if (langHidden(el) || !visible(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) continue; // solo lo que está en pantalla
    if ((r.height < 24 || r.width < 24) && getComputedStyle(el).display !== "inline") out.small.push(`${name(el)} ${Math.round(r.width)}×${Math.round(r.height)}`);
    const x = Math.min(Math.max(r.left + r.width / 2, 1), vw - 1);
    const y = Math.min(Math.max(r.top + r.height / 2, 1), innerHeight - 1);
    const hit = document.elementFromPoint(x, y);
    let barFixed = false;
    for (let n = hit; n && n !== document.body; n = n.parentElement) {
      if (["fixed", "sticky"].includes(getComputedStyle(n).position) && !n.matches("section, main, [class*='__sticky']")) barFixed = true;
    }
    if (r.left < 0 || r.right > vw) continue; // fuera de la pantalla en horizontal (carrusel)
    if (hit && !barFixed && hit !== el && !el.contains(hit) && !hit.contains(el)) out.covered.push(`${name(el)} tapado por ${name(hit)}`);
  }
  return out;
};

(async () => {
  if (SHOTS) mkdirSync("tests/shots", { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, args: ["--headless=new"] });
  const report = {};
  for (const [w, h] of SIZES) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: w < 700, hasTouch: true, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    for (const path of PAGES) {
      await page.goto(BASE + path, { waitUntil: "networkidle" });
      await page.waitForTimeout(500);
      // Recorre la página por pantallas para que entren las animaciones y audita cada vista.
      const total = await page.evaluate(() => document.documentElement.scrollHeight);
      const merged = { hscroll: 0, outside: new Set(), clipped: new Set(), tiny: new Set(), small: new Set(), covered: new Set() };
      for (let y = 0; y < total; y += h * 0.8) {
        await page.evaluate((top) => window.scrollTo(0, top), y);
        await page.waitForTimeout(350);
        const r = await page.evaluate(audit);
        merged.hscroll = Math.max(merged.hscroll, r.hscroll);
        for (const k of ["outside", "clipped", "tiny", "small", "covered"]) r[k].forEach((v) => merged[k].add(v));
      }
      report[`${w}px ${path}`] = merged;
    }
    if (SHOTS && w === 390) {
      await page.goto(BASE + "/", { waitUntil: "networkidle" });
      const ids = await page.evaluate(() => [...document.querySelectorAll("main > section[id], main > [id]")].map((s) => s.id));
      for (const id of ids) {
        await page.evaluate((i) => document.getElementById(i).scrollIntoView(), id);
        await page.waitForTimeout(1600);
        await page.screenshot({ path: `tests/shots/m-${id}.png` });
      }
    }
    await ctx.close();
  }
  await browser.close();
  let problems = 0;
  for (const [key, r] of Object.entries(report)) {
    const lines = [];
    if (r.hscroll > 0) lines.push(`  ✗ scroll horizontal de ${r.hscroll}px`);
    for (const [k, label] of [["outside", "se sale"], ["clipped", "texto cortado"], ["tiny", "letra pequeña"], ["small", "toque pequeño"], ["covered", "tapado"]]) {
      [...r[k]].slice(0, 8).forEach((v) => lines.push(`  ✗ ${label}: ${v}`));
      if (r[k].size > 8) lines.push(`    … y ${r[k].size - 8} más`);
    }
    problems += lines.length;
    console.log(lines.length ? `${key}\n${lines.join("\n")}` : `${key}  ✓`);
  }
  console.log(problems ? `\n${problems} avisos` : "\nTodo bien");
  process.exitCode = problems ? 1 : 0;
})();
