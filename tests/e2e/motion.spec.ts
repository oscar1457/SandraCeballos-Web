import { test, expect, isMobile, waitScrollStill } from "./helpers";
import type { Page } from "@playwright/test";

// Tests de movimiento: con las animaciones activas, se anota en CADA fotograma
// el tono de la cabecera y si la noticia está en pantalla, mientras se hace
// scroll de verdad. Así se ven los parpadeos que una captura final no detecta.

type Frame = { t: number; tone: string; news: "on" | "off" | "none"; y: number; phase: string };

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
        w.__frames.push({ t: performance.now(), tone: header.dataset.tone ?? "", news, y: window.scrollY, phase: w.__phase });
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

  // 1. Cabecera: un cruce entre secciones cambia el tono una sola vez.
  //    Parpadeo = vuelve al tono anterior en menos de 300 ms.
  const tone = changes(all, "tone");
  const flickers = tone.filter((change, i) => {
    const next = tone[i + 1];
    return next && next.to === change.from && next.t - change.t < 300;
  });
  expect(flickers, `parpadeos de la cabecera: ${JSON.stringify(flickers.slice(0, 3))}`).toEqual([]);
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
  const tone = changes(all, "tone");
  const flickers = tone.filter((change, i) => {
    const next = tone[i + 1];
    return next && next.to === change.from && next.t - change.t < 300;
  });
  expect(flickers, `parpadeos: ${JSON.stringify(flickers.slice(0, 3))}`).toEqual([]);
});
