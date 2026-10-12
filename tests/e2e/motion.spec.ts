import { test, expect, isMobile, waitScrollStill } from "./helpers";
import type { Page } from "@playwright/test";

// Tests de movimiento: con las animaciones activas, se anota en CADA fotograma
// el tono de la cabecera y si la noticia está en pantalla, mientras se hace
// scroll de verdad. Así se ven los parpadeos que una captura final no detecta.

// tone: tono de la cabecera; expected: tono de la sección que tiene debajo en
// ese mismo fotograma (lo que debería mostrar).
// color/bg: color de texto y de fondo que tiene la cabecera en pantalla en ese
// fotograma (con la transición de 300 ms incluida); target*: los que le tocan.
type RGB = [number, number, number];
type Frame = {
  t: number;
  tone: string;
  expected: string;
  color: RGB;
  bg: RGB;
  targetColor: RGB;
  targetBg: RGB;
  news: "on" | "off" | "none";
  menu: boolean; // menú del teléfono abierto (la cabecera pasa a blanco sobre negro a propósito)
  // Fondo de la cabecera frente a la página de debajo, en su borde de arriba,
  // su centro y su borde de abajo: [color de la cabecera, color de la sección].
  // La comprobación usa el centro (la cabecera es de un solo color).
  rows: [RGB, RGB][];
  y: number;
  phase: string;
};

const startRecorder = (page: Page) =>
  page.addInitScript(() => {
    const w = window as unknown as { __frames: unknown[]; __phase: string };
    w.__frames = [];
    w.__phase = "carga";
    const tick = () => {
      const header = document.querySelector<HTMLElement>("[data-site-header]");
      const card = document.querySelector<HTMLElement>("[data-news]");
      if (header) {
        let news = "none";
        if (card) {
          const rect = card.getBoundingClientRect();
          const style = getComputedStyle(card);
          news = !card.hidden && style.display !== "none" && rect.left < window.innerWidth - 20 && rect.right > 20 ? "on" : "off";
        }
        const probe = header.offsetHeight / 2;
        const under = Array.from(document.querySelectorAll<HTMLElement>("[data-header]")).find((section) => {
          const rect = section.getBoundingClientRect();
          return rect.top <= probe && rect.bottom > probe;
        });
        const expected = under?.dataset.header === "dark" ? "dark" : "light";
        const sectionAt = (y: number) =>
          Array.from(document.querySelectorAll<HTMLElement>("[data-header]")).find((section) => {
            const rect = section.getBoundingClientRect();
            return rect.top <= y && rect.bottom > y;
          });
        const parse = (value: string) => (value.match(/[\d.]+/g) ?? ["0", "0", "0"]).map(Number);
        const rgb = (value: string) => parse(value).slice(0, 3);
        const style = getComputedStyle(header);
        const sectionBg = under ? rgb(getComputedStyle(under).backgroundColor) : [0, 0, 0];
        // Fondo con transparencia: lo que se ve es la mezcla con la sección de debajo.
        const [r = 0, g = 0, b = 0, alpha = 1] = parse(style.backgroundColor);
        const seenBg = [r, g, b].map((c, k) => c * alpha + sectionBg[k]! * (1 - alpha));
        // Color del fondo de la cabecera a una altura y: degradado con corte
        // (linear-gradient(colorA Npx, colorB Npx)) o color liso con transparencia.
        const image = style.backgroundImage;
        const headerAt = (y: number, below: number[]) => {
          const colors = image.match(/rgba?\([^)]*\)/g);
          if (image !== "none" && colors && colors.length >= 2) {
            const stop = Number((image.match(/\)\s*([\d.]+)px/) ?? [])[1] ?? Infinity);
            return rgb(y < stop ? colors[0]! : colors[1]!);
          }
          return [r, g, b].map((c, k) => c * alpha + below[k]! * (1 - alpha));
        };
        const rowsAt = [1, probe, header.offsetHeight - 1].map((y) => {
          const section = sectionAt(y);
          const below = section ? rgb(getComputedStyle(section).backgroundColor) : [0, 0, 0];
          return [headerAt(y, below), below];
        });
        w.__frames.push({
          t: performance.now(),
          tone: header.dataset.tone ?? "",
          expected,
          color: rgb(style.color),
          bg: seenBg,
          targetColor: expected === "dark" ? [0, 0, 0] : [255, 255, 255],
          targetBg: sectionBg,
          news,
          menu: header.classList.contains("is-open"),
          rows: rowsAt,
          y: window.scrollY,
          phase: w.__phase
        });
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

const setPhase = (page: Page, phase: string) => page.evaluate((p) => ((window as unknown as { __phase: string }).__phase = p), phase);
const frames = (page: Page) => page.evaluate(() => (window as unknown as { __frames: Frame[] }).__frames);

// Scroll real: rueda del ratón en escritorio (pasa por el desplazamiento suave),
// pasos cortos en el teléfono (como un dedo).
const scrollTo = async (page: Page, target: "bottom" | "top", mobile: boolean) => {
  for (let i = 0; i < 400; i++) {
    const { y, max } = await page.evaluate(() => ({ y: window.scrollY, max: document.documentElement.scrollHeight - window.innerHeight }));
    if ((target === "bottom" && y >= max - 2) || (target === "top" && y <= 1)) break;
    const delta = target === "bottom" ? 260 : -260;
    if (mobile) await page.evaluate((d) => window.scrollBy(0, d), delta / 2);
    else await page.mouse.wheel(0, delta);
    await page.waitForTimeout(mobile ? 20 : 45);
  }
  await waitScrollStill(page);
};

// Cambios de valor a lo largo de los fotogramas.
const changes = <K extends "tone" | "news">(list: Frame[], key: K) => {
  const out: { t: number; from: Frame[K]; to: Frame[K]; y: number }[] = [];
  for (let i = 1; i < list.length; i++) {
    if (list[i]![key] !== list[i - 1]![key]) out.push({ t: list[i]!.t, from: list[i - 1]![key], to: list[i]![key], y: list[i]!.y });
  }
  return out;
};

// Color que se ve: distancia (0–441) entre el color de la cabecera y el que le toca.
const distance = (a: RGB, b: RGB) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const TRANSITION_MS = 0; // el color de la cabecera cambia sin transición

// Lo que ve el usuario: tras cruzar una frontera, el color de texto y de fondo
// de la cabecera solo puede acercarse al de la nueva sección (nunca alejarse:
// eso sería un destello), y pasada la transición tiene que ser exactamente ése.
const perceivedProblems = (list: Frame[]) => {
  const out: string[] = [];
  let crossingAt = -Infinity;
  for (let i = 1; i < list.length; i++) {
    const prev = list[i - 1]!;
    const frame = list[i]!;
    // Con el menú abierto (y mientras se cierra) los colores cambian a propósito.
    const crossed = frame.expected !== prev.expected || distance(frame.targetBg, prev.targetBg) > 1 || frame.menu || prev.menu;
    if (crossed) {
      crossingAt = frame.t;
      continue;
    }
    // Texto de la cabecera (el fondo lo comprueba seamProblems).
    const before = distance(prev.color, frame.targetColor);
    const now = distance(frame.color, frame.targetColor);
    if (now > before + 6) out.push(`${frame.phase} y=${Math.round(frame.y)}: el texto de la cabecera se aleja del color que le toca (${Math.round(before)}→${Math.round(now)})`);
    if (frame.t - crossingAt > TRANSITION_MS + 120 && now > 8) out.push(`${frame.phase} y=${Math.round(frame.y)}: el texto de la cabecera no es el que le toca (distancia ${Math.round(now)})`);
  }
  return [...new Set(out)].slice(0, 5);
};

// Lo que se ve: en cada fotograma el fondo de la cabecera es exactamente el de
// la sección que tiene bajo su centro (la que decide el tono). Se permite 1
// fotograma de retraso al cruzar. Un fundido que va por detrás del scroll deja
// la cabecera de otro color sobre la sección nueva: eso se ve como un destello.
const seamProblems = (list: Frame[]) => {
  const out: string[] = [];
  for (let i = 1; i < list.length; i++) {
    const frame = list[i]!;
    const prev = list[i - 1]!;
    if (frame.menu || prev.menu) continue;
    const [seen, page] = frame.rows[1]!;
    if (distance(seen, page) <= 20) continue;
    const [, before] = prev.rows[1]!;
    if (distance(seen, before) <= 20) continue; // 1 fotograma de retraso
    out.push(`${frame.phase} y=${Math.round(frame.y)}: cabecera rgb(${seen.map(Math.round)}) sobre sección rgb(${page})`);
  }
  return [...new Set(out)].slice(0, 6);
};

// Fotogramas en los que la cabecera no coincide con la sección de debajo,
// salvo los 2 primeros fotogramas después de cruzar una frontera.
const LAG_FRAMES = 2;
const headerMismatches = (list: Frame[]) => {
  const out: string[] = [];
  let sinceCrossing = LAG_FRAMES + 1;
  for (let i = 0; i < list.length; i++) {
    sinceCrossing = i > 0 && list[i]!.expected !== list[i - 1]!.expected ? 0 : sinceCrossing + 1;
    const frame = list[i]!;
    if (frame.tone !== frame.expected && sinceCrossing > LAG_FRAMES) {
      out.push(`${frame.phase} y=${Math.round(frame.y)}: cabecera ${frame.tone}, sección ${frame.expected}`);
    }
  }
  return out.slice(0, 5);
};

test("cabecera y noticia sin parpadeos durante el scroll", async ({ page }, testInfo) => {
  test.setTimeout(120_000);
  const mobile = isMobile(testInfo);
  await startRecorder(page);
  await page.goto("/");
  if (!mobile) await expect.poll(async () => (await frames(page)).at(-1)?.news, { timeout: 5000 }).toBe("on");
  await page.mouse.move(200, 400);

  await setPhase(page, "quieto-arriba");
  await page.waitForTimeout(2500);
  await setPhase(page, "bajando");
  await scrollTo(page, "bottom", mobile);
  await setPhase(page, "quieto-abajo");
  await page.waitForTimeout(1500);
  await setPhase(page, "subiendo");
  await scrollTo(page, "top", mobile);
  await setPhase(page, "quieto-arriba-2");
  await page.waitForTimeout(2500);

  const all = await frames(page);
  expect(all.length, "se grabaron fotogramas").toBeGreaterThan(200);

  // 1. Cabecera: en cada fotograma tiene el tono de la sección que hay debajo
  //    (con como mucho 2 fotogramas de retraso tras cruzar una frontera), y
  //    entre dos cruces cambia como mucho una vez. Así un parpadeo falla
  //    siempre, aunque el scroll sea muy rápido.
  const tone = changes(all, "tone");
  expect(headerMismatches(all), "cabecera con un tono distinto de la sección de debajo").toEqual([]);
  expect(perceivedProblems(all), "color visible de la cabecera").toEqual([]);
  expect(seamProblems(all), "el fondo de la cabecera es el de la sección de debajo").toEqual([]);
  expect(tone.length, "la cabecera cambia de tono al pasar por las secciones").toBeGreaterThan(2);

  // Resumen adjunto al informe (y en consola con DEBUG_MOTION=1).
  const summary = {
    fotogramas: all.length,
    cambiosCabecera: tone.map((c) => `${c.from}→${c.to} @${Math.round(c.y)}px`),
    cambiosNoticia: changes(all, "news").map((c) => `${c.from}→${c.to} @${Math.round(c.y)}px`)
  };
  await testInfo.attach("movimiento.json", { body: JSON.stringify(summary, null, 2), contentType: "application/json" });
  if (process.env.DEBUG_MOTION) console.log(JSON.stringify(summary));

  // 2. Noticia: nunca aparece y desaparece sola.
  const byPhase = (phase: string) => changes(all.filter((f) => f.phase === phase), "news");
  if (mobile) {
    expect(all.every((f) => f.news !== "on"), "en el teléfono la noticia nunca se ve").toBe(true);
  } else {
    expect(byPhase("quieto-arriba"), "quieta en la portada: no cambia").toEqual([]);
    expect(byPhase("bajando").length, "al bajar se retira una sola vez").toBeLessThanOrEqual(1);
    expect(byPhase("quieto-abajo"), "quieta abajo: no aparece").toEqual([]);
    expect(byPhase("subiendo").length, "al subir vuelve una sola vez").toBeLessThanOrEqual(1);
    const lastPhase = all.filter((f) => f.phase === "quieto-arriba-2");
    expect(changes(lastPhase, "news").filter((c) => c.to === "off"), "de vuelta arriba no se va sola").toEqual([]);
    expect(lastPhase.at(-1)?.news, "al final se ve en la portada").toBe("on");
    expect(all.filter((f) => f.phase === "quieto-abajo").every((f) => f.news === "off"), "abajo está retirada").toBe(true);
  }
});

test("cabecera sin parpadeos al usar los enlaces del menú", async ({ page }, testInfo) => {
  test.setTimeout(90_000);
  const mobile = isMobile(testInfo);
  await startRecorder(page);
  await page.goto("/");
  for (const id of ["obra", "trayectoria", "publicaciones", "contacto"]) {
    if (mobile) await page.click("[data-menu-button]");
    await setPhase(page, `menu-${id}`);
    await page.click(`.site-header__nav a[href="#${id}"]`);
    await waitScrollStill(page);
  }
  const all = (await frames(page)).filter((f) => f.phase.startsWith("menu-"));
  expect(headerMismatches(all), "cabecera con un tono distinto de la sección de debajo").toEqual([]);
  expect(perceivedProblems(all), "color visible de la cabecera").toEqual([]);
  expect(seamProblems(all), "el fondo de la cabecera es el de la sección de debajo").toEqual([]);
});
