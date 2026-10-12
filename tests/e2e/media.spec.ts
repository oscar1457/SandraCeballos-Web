import { test, expect, isReduced, waitScrollStill } from "./helpers";
import type { Locator, Page } from "@playwright/test";

// Vídeos y trama de imprenta (WebGL). Las capturas visuales los tapan porque
// se mueven; aquí se comprueba de verdad que se dibujan: se hace una captura
// del elemento y se cuentan sus píxeles por color.

type RGB = [number, number, number];
const PAPER_RED: RGB = [210, 43, 24];
const INK_DARK: RGB = [26, 8, 6];
const STONE: RGB = [161, 159, 151];
const STONE_INK: RGB = [112, 109, 101];
const WHITE: RGB = [255, 255, 255];

// Analiza la captura de un elemento en el navegador (sin dependencias extra):
// parte de píxeles cerca de cada color y color en puntos concretos (0–1).
// Captura solo la parte visible del elemento, sin mover la página (la captura
// de elemento de Playwright hace scroll si es muy alto, y eso pausa los vídeos).
const capture = async (page: Page, target: Locator) => {
  const box = await target.boundingBox();
  const view = page.viewportSize()!;
  if (!box) throw new Error("El elemento no se ve");
  const x = Math.max(0, box.x);
  const y = Math.max(0, box.y);
  const clip = { x, y, width: Math.min(box.x + box.width, view.width) - x, height: Math.min(box.y + box.height, view.height) - y };
  if (clip.width < 10 || clip.height < 10) throw new Error("El elemento no está en pantalla");
  return page.screenshot({ clip });
};

const analyse = async (page: Page, target: Locator, colors: RGB[], points: [number, number][] = []) => {
  const png = await capture(page, target);
  return page.evaluate(
    async ({ b64, colors, points }) => {
      const img = new Image();
      img.src = `data:image/png;base64,${b64}`;
      await img.decode();
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, img.width, img.height).data;
      const near = (i: number, c: number[]) => Math.hypot(data[i]! - c[0]!, data[i + 1]! - c[1]!, data[i + 2]! - c[2]!) < 60;
      const counts = colors.map(() => 0);
      let total = 0;
      for (let i = 0; i < data.length; i += 4 * 3) {
        total++;
        colors.forEach((c, k) => near(i, c) && counts[k]!++);
      }
      const at = points.map(([x, y]) => {
        const i = (Math.floor(y * (img.height - 1)) * img.width + Math.floor(x * (img.width - 1))) * 4;
        return [data[i]!, data[i + 1]!, data[i + 2]!];
      });
      return { share: counts.map((n) => n / total), at, width: img.width, height: img.height };
    },
    { b64: png.toString("base64"), colors, points }
  );
};
const dist = (a: number[], b: number[]) => Math.hypot(a[0]! - b[0]!, a[1]! - b[1]!, a[2]! - b[2]!);

test("In the studio: la trama roja se dibuja y el vídeo avanza", async ({ page }, testInfo) => {
  await page.goto("/?d#taller");
  await waitScrollStill(page);
  const section = page.locator("#taller");
  await expect(section).toHaveClass(/is-halftone/, { timeout: 10_000 });
  await page.waitForTimeout(1500);
  const video = section.locator("video");
  if (isReduced(testInfo)) {
    expect(await video.evaluate((v: HTMLVideoElement) => v.paused), "con movimiento reducido no se reproduce").toBe(true);
  } else {
    const t0 = await video.evaluate((v: HTMLVideoElement) => v.currentTime);
    await page.waitForTimeout(1200);
    const t1 = await video.evaluate((v: HTMLVideoElement) => v.currentTime);
    expect(t1, "el vídeo del taller avanza").toBeGreaterThan(t0);
  }

  const { share } = await analyse(page, section.locator("canvas").first(), [PAPER_RED, INK_DARK]);
  expect(share[0], "papel rojo de la trama").toBeGreaterThan(0.1);
  expect(share[1], "puntos oscuros de la trama").toBeGreaterThan(0.05);
});

test("Trayectoria: la C lleva el vídeo en trama, con la forma de la letra y sin otra C detrás", async ({ page }) => {
  const checkC = async (label: string) => {
    const glyph = page.locator(".career__glyph");
    await expect(glyph, `${label}: la C tiene el vídeo`).toHaveClass(/has-video/, { timeout: 10_000 });
    await page.waitForTimeout(1200);
    // La C de texto no se pinta (si se viera, habría dos C).
    expect(await glyph.evaluate((el) => getComputedStyle(el).color), `${label}: C de texto invisible`).toBe("rgba(0, 0, 0, 0)");
    // El retrato tapa parte de la C a propósito (en el teléfono van lado a lado):
    // se oculta solo para medir la letra.
    await page.locator(".career__portrait").evaluate((el) => ((el as HTMLElement).style.visibility = "hidden"));
    // Centro del lienzo = hueco de la C (fondo blanco); 12 % desde la izquierda
    // a media altura = trazo de la C (color piedra con puntos).
    const { share, at } = await analyse(page, page.locator("[data-career-letter-video]"), [STONE, STONE_INK], [
      [0.5, 0.5],
      [0.12, 0.5]
    ]);
    expect(share[0]! + share[1]!, `${label}: trama en color piedra`).toBeGreaterThan(0.15);
    expect(dist(at[0]!, WHITE), `${label}: el hueco de la C se ve vacío`).toBeLessThan(40);
    expect(Math.min(dist(at[1]!, STONE), dist(at[1]!, STONE_INK)), `${label}: el trazo de la C lleva la trama`).toBeLessThan(80);
    await page.locator(".career__portrait").evaluate((el) => ((el as HTMLElement).style.visibility = ""));
  };
  await page.goto("/?d#trayectoria");
  await waitScrollStill(page);
  await checkC("al llegar");
  // Cambiar el tamaño de la ventana (o girar el teléfono) no descoloca la C.
  const size = page.viewportSize()!;
  await page.setViewportSize({ width: size.width > 700 ? 600 : 700, height: size.height });
  await page.evaluate(() => document.getElementById("trayectoria")!.scrollIntoView());
  await page.waitForTimeout(800);
  await checkC("tras cambiar el tamaño");
});

test("Ficha de Guía espiritual #9: el vídeo del proceso se dibuja en trama", async ({ page }) => {
  await page.goto("/?d#obra/guia-espiritual-9");
  await expect(page.locator("dialog[data-sheet]")).toHaveAttribute("open", "");
  const process = page.locator("[data-sheet-process]");
  await expect(process).toBeVisible();
  await page.waitForTimeout(1500);
  const canvas = process.locator("canvas");
  const box = await canvas.boundingBox();
  expect(box && box.width > 100 && box.height > 50, "el lienzo del proceso tiene tamaño").toBe(true);
  // Trama marrón: el lienzo no es de un solo color (tiene puntos).
  const { share } = await analyse(page, canvas, [[255, 255, 255], [0, 0, 0]]);
  const variety = await capture(page, canvas).then((png) =>
    page.evaluate(async (b64) => {
      const img = new Image();
      img.src = `data:image/png;base64,${b64}`;
      await img.decode();
      const c = document.createElement("canvas");
      c.width = img.width;
      c.height = img.height;
      const ctx = c.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const d = ctx.getImageData(0, 0, c.width, c.height).data;
      const colors = new Set<number>();
      for (let i = 0; i < d.length; i += 4 * 7) colors.add(((d[i]! >> 4) << 8) | ((d[i + 1]! >> 4) << 4) | (d[i + 2]! >> 4));
      return colors.size;
    }, png.toString("base64"))
  );
  expect(variety, "la trama tiene puntos (no es un bloque liso)").toBeGreaterThan(8);
  expect(share[1], "no es un recuadro negro (vídeo sin cargar)").toBeLessThan(0.6);
});
