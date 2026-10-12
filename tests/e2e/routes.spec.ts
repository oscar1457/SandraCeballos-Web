import { test, expect, ROUTES, HOME_SECTIONS, sectionTop, waitScrollStill, scrollThrough, clickNav, isMobile } from "./helpers";

// Cada página: carga nueva, recorrido completo y recarga, sin errores.
for (const route of ROUTES) {
  test(`${route} carga, se recorre y se recarga sin errores`, async ({ page, issues }) => {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/\S/);
    expect(await page.locator("h1").count()).toBeGreaterThan(0);

    await scrollThrough(page);
    await page.reload();
    await expect.poll(() => new URL(page.url()).hash).toBe("");

    // Todas las imágenes tienen texto alternativo (aunque sea vacío, si son decorativas).
    const withoutAlt = await page.$$eval("img:not([alt])", (images) => images.map((img) => img.getAttribute("src")));
    expect(withoutAlt, "imágenes sin alt").toEqual([]);

    // Todo texto en español tiene su versión en inglés al lado.
    const withoutEnglish = await page.$$eval('[data-lang="es"]', (nodes) =>
      nodes
        .filter((node) => !node.parentElement?.querySelector(':scope > [data-lang="en"]'))
        .map((node) => (node.textContent ?? "").trim().slice(0, 50))
    );
    expect(withoutEnglish, "textos sin versión en inglés").toEqual([]);

    expect(issues, "errores de consola, JavaScript o recursos").toEqual([]);
  });
}

test("el menú lleva a cada sección y la URL no se queda con #", async ({ page, issues }, testInfo) => {
  await page.goto("/");
  for (const id of HOME_SECTIONS) {
    await clickNav(page, testInfo, `#${id}`);
    await waitScrollStill(page);
    expect(Math.abs(await sectionTop(page, id)), `sección ${id}`).toBeLessThanOrEqual(2);
    await expect.poll(() => new URL(page.url()).hash).toBe("");
    if (isMobile(testInfo)) await expect(page.locator("[data-site-header]")).not.toHaveClass(/is-open/);
  }
  // El logo vuelve arriba del todo.
  await page.click(".site-header__logo");
  await waitScrollStill(page);
  expect(await page.evaluate(() => window.scrollY)).toBeLessThan(2);
  expect(issues).toEqual([]);
});

test("pulsar dos veces el mismo enlace vuelve a llevar a la sección", async ({ page }, testInfo) => {
  await page.goto("/");
  await clickNav(page, testInfo, "#trayectoria");
  await waitScrollStill(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  await waitScrollStill(page);
  await clickNav(page, testInfo, "#trayectoria");
  await waitScrollStill(page);
  expect(Math.abs(await sectionTop(page, "trayectoria"))).toBeLessThanOrEqual(2);
});

test("un enlace directo /#sección abre esa sección y limpia la URL", async ({ page, issues }) => {
  for (const id of HOME_SECTIONS) {
    await page.goto(`/?d=${id}#${id}`);
    await waitScrollStill(page);
    expect(Math.abs(await sectionTop(page, id)), `sección ${id}`).toBeLessThanOrEqual(2);
    await expect.poll(() => new URL(page.url()).hash).toBe("");
  }
  expect(issues).toEqual([]);
});

test("recargar la portada después de navegar se queda en la portada", async ({ page }, testInfo) => {
  await page.goto("/");
  await clickNav(page, testInfo, "#obra");
  await waitScrollStill(page);
  await page.reload();
  await waitScrollStill(page);
  await expect.poll(() => new URL(page.url()).hash).toBe("");
});

test("Atrás y Adelante entre la portada y Aglutinador", async ({ page, issues }, testInfo) => {
  await page.goto("/");
  await clickNav(page, testInfo, "/aglutinador/");
  await page.waitForURL("**/aglutinador/");
  await page.goBack();
  await page.waitForURL((url) => url.pathname === "/");
  await expect(page.locator("#inicio")).toBeInViewport();
  await page.goForward();
  await page.waitForURL("**/aglutinador/");
  await expect(page.locator("h1").first()).toBeVisible();

  // Dentro de Aglutinador: Historia, Archivo y vuelta a la portada.
  await page.click('.agl-bar__nav a[href="/aglutinador/historia/"]');
  await page.waitForURL("**/historia/");
  await page.click('.agl-bar__nav a[href="/aglutinador/archivo/"]');
  await page.waitForURL("**/archivo/");
  await page.goBack();
  await page.waitForURL("**/historia/");
  await page.click('.agl-bar a[href="/"]');
  await page.waitForURL((url) => url.pathname === "/");
  expect(issues).toEqual([]);
});
