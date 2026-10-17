import { test, expect, isMobile, newsState, introRatio, waitScrollStill, clickNav } from "./helpers";

// Comportamiento acordado de la tarjeta de noticias (News):
//  - Solo en escritorio y tableta (> 760 px). En el teléfono está oculta a propósito.
//  - Sale 1 s después de abrir la portada, con la primera noticia (documenta fifteen).
//  - Se ve mientras se vea al menos el 80 % de la portada; si no, se retira.
//  - Las noticias se turnan cada 5 s, también con el ratón encima.
//  - Cerrar (×) o pulsar la noticia: no vuelve mientras sigas en la portada;
//    vuelve cuando sales de la portada (o de la página) y regresas.
const REAPPEARS_AFTER_LEAVING_HOME = true;
const FIRST_KICKER = "documenta fifteen";

const expectShown = async (page: import("@playwright/test").Page, message: string) => {
  await expect.poll(async () => (await newsState(page)).onScreen, { message, timeout: 5000 }).toBe(true);
  const state = await newsState(page);
  expect(state.kicker, `${message}: la noticia visible tiene contenido`).not.toBe("");
};

const expectGone = async (page: import("@playwright/test").Page, message: string) => {
  await expect.poll(async () => (await newsState(page)).onScreen, { message, timeout: 5000 }).toBe(false);
};

test.describe("News en escritorio", () => {
  test.skip(({ isMobile: mobile }) => mobile, "En el teléfono está oculta (ver test de móvil)");

  test("inicio nuevo: se ve la tarjeta con la primera noticia y su foto", async ({ page, issues }) => {
    await page.goto("/");
    await expectShown(page, "News al abrir la portada");
    const state = await newsState(page);
    expect(state.item).toBe(0);
    expect(state.kicker.toLowerCase()).toBe(FIRST_KICKER);
    await expect
      .poll(() => page.locator("[data-news-item='0'] img").evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0))
      .toBe(true);
    expect(issues).toEqual([]);
  });

  test("las noticias se turnan cada 5 s, también con el ratón encima", async ({ page }) => {
    await page.goto("/");
    await expectShown(page, "News al abrir");
    await page.hover("[data-news]");
    // Pasa por todas y vuelve a la primera.
    const total = await page.locator("[data-news-item]").count();
    for (let item = 1; item < total; item++) {
      await expect.poll(async () => (await newsState(page)).item, { timeout: 8000 }).toBe(item);
    }
    await expect.poll(async () => (await newsState(page)).item, { timeout: 8000 }).toBe(0);
  });

  test("Aglutinador → Inicio por enlace", async ({ page }) => {
    await page.goto("/aglutinador/");
    await page.click('.agl-bar a[href="/"]');
    await page.waitForURL((url) => url.pathname === "/");
    await expectShown(page, "News al llegar desde Aglutinador");
  });

  test("Inicio → Aglutinador → Atrás, tres veces; después Adelante y recarga", async ({ page }, testInfo) => {
    await page.goto("/");
    await expectShown(page, "News al abrir");
    for (let round = 1; round <= 3; round++) {
      await clickNav(page, testInfo, "/aglutinador/");
      await page.waitForURL("**/aglutinador/");
      await page.goBack();
      await page.waitForURL((url) => url.pathname === "/");
      await expectShown(page, `News tras volver atrás (vuelta ${round})`);
    }
    await page.goForward();
    await page.waitForURL("**/aglutinador/");
    await page.goBack();
    await expectShown(page, "News tras Adelante y Atrás");
    await page.reload();
    await expectShown(page, "News tras recargar");
  });

  test("se retira al salir de la portada (< 80 %) y vuelve al regresar (≥ 80 %)", async ({ page }) => {
    await page.goto("/");
    await expectShown(page, "News al abrir");
    // Con el 85 % de la portada a la vista sigue ahí.
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.15));
    await waitScrollStill(page);
    expect(await introRatio(page)).toBeGreaterThanOrEqual(0.8);
    await page.waitForTimeout(800);
    expect((await newsState(page)).onScreen).toBe(true);
    // Con el 65 % se retira.
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.35));
    await waitScrollStill(page);
    expect(await introRatio(page)).toBeLessThan(0.8);
    await expectGone(page, "News al salir de la portada");
    // Volver arriba: vuelve a salir.
    await page.evaluate(() => window.scrollTo(0, 0));
    await expectShown(page, "News al volver a la portada");
  });

  test("cerrar con × la quita; vuelve solo al salir de la portada y regresar", async ({ page }) => {
    await page.goto("/");
    await expectShown(page, "News al abrir");
    await page.click("[data-news-close]");
    await expectGone(page, "News tras cerrar");
    // Moverse un poco dentro de la portada no la trae de vuelta.
    await page.evaluate(() => window.scrollTo(0, 40));
    await page.waitForTimeout(1500);
    expect((await newsState(page)).onScreen).toBe(false);
    // Salir de la portada y volver.
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.5));
    await waitScrollStill(page);
    await page.evaluate(() => window.scrollTo(0, 0));
    await waitScrollStill(page);
    if (REAPPEARS_AFTER_LEAVING_HOME) await expectShown(page, "News tras salir y volver");
    else await expectGone(page, "News sigue cerrada");
  });

  test("pulsar la noticia lleva a su historia y la tarjeta se retira", async ({ page }) => {
    await page.goto("/");
    await expectShown(page, "News al abrir");
    await page.locator("[data-news-item='0']").click();
    await waitScrollStill(page);
    await expect(page.locator("#taller")).toBeInViewport({ ratio: 0.5 });
    await expect(page.locator("[data-story-count]")).toHaveText(/^01 \/ \d\d$/);
    await expectGone(page, "News tras pulsarla");
    await expect.poll(() => new URL(page.url()).hash).toBe("");
  });

  test("con red lenta nunca queda vacía, oculta por error ni con dos noticias a la vez", async ({ page, browserName }) => {
    test.skip(browserName !== "chromium", "La simulación de red lenta usa Chrome DevTools");
    test.setTimeout(120_000);
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: 400,
      downloadThroughput: (400 * 1024) / 8,
      uploadThroughput: (200 * 1024) / 8
    });
    await page.goto("/", { waitUntil: "commit" });
    // Mientras carga: nunca dos noticias a la vez.
    const end = Date.now() + 20_000;
    while (Date.now() < end) {
      // Solo cuenta cuando ya hay estilos (antes el navegador aún no pinta nada).
      const visibleItems = await page
        .evaluate(() => {
          const card = document.querySelector("[data-news]");
          if (!card || getComputedStyle(card).position !== "fixed") return 0;
          return Array.from(card.querySelectorAll("[data-news-item]")).filter((el) => getComputedStyle(el).visibility !== "hidden").length;
        })
        .catch(() => 0);
      expect(visibleItems).toBeLessThanOrEqual(1);
      if ((await newsState(page).catch(() => null))?.onScreen) break;
      await page.waitForTimeout(250);
    }
    await expectShown(page, "News con red lenta");
    expect((await newsState(page)).item).toBe(0);
    await expect
      .poll(() => page.locator("[data-news-item='0'] img").evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0), {
        timeout: 60_000
      })
      .toBe(true);
    // Con la caché ya llena, recargar la vuelve a mostrar enseguida.
    await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
    await page.reload();
    await expectShown(page, "News con caché");
    expect((await newsState(page)).item).toBe(0);
  });

  test("entrar con un enlace a otra sección no muestra la tarjeta", async ({ page }) => {
    await page.goto("/?d#trayectoria");
    await waitScrollStill(page);
    await page.waitForTimeout(2000);
    expect((await newsState(page)).onScreen).toBe(false);
  });
});

test("en el teléfono la tarjeta está oculta a propósito", async ({ page }, testInfo) => {
  test.skip(!isMobile(testInfo), "Solo teléfono");
  await page.goto("/");
  for (let i = 0; i < 6; i++) {
    const state = await newsState(page);
    expect(state.exists, "la tarjeta existe en la página").toBe(true);
    expect(state.shown, "pero no se muestra").toBe(false);
    await page.waitForTimeout(500);
  }
});
