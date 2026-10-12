import { test, expect, clickNav, isMobile, isReduced, waitScrollStill } from "./helpers";

test("menú del teléfono: se abre, se cierra y lleva a la sección", async ({ page, issues }, testInfo) => {
  test.skip(!isMobile(testInfo), "El menú desplegable solo existe en el teléfono");
  await page.goto("/");
  const header = page.locator("[data-site-header]");
  await page.click("[data-menu-button]");
  await expect(header).toHaveClass(/is-open/);
  await expect(page.locator("[data-menu-button]")).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(header).not.toHaveClass(/is-open/);
  await clickNav(page, testInfo, "#publicaciones");
  await waitScrollStill(page);
  await expect(header).not.toHaveClass(/is-open/);
  await expect(page.locator("#publicaciones")).toBeInViewport();
  expect(issues).toEqual([]);
});

test("idioma: cambia a inglés, se recuerda al recargar y vuelve a español", async ({ page, issues }, testInfo) => {
  await page.goto("/");
  const pick = async (lang: "es" | "en") => {
    if (isMobile(testInfo)) await page.click("[data-menu-button]");
    await page.click(`.site-header [data-language-switch="${lang}"]`);
    if (isMobile(testInfo)) await page.keyboard.press("Escape");
  };
  await pick("en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator(".intro__role [data-lang='en']")).toBeVisible();
  await expect(page.locator(".intro__role [data-lang='es']")).toBeHidden();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await pick("es");
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(page.locator(".intro__role [data-lang='es']")).toBeVisible();
  expect(issues).toEqual([]);
});

test("galería: abre la ficha, la URL apunta a la obra y al cerrar queda limpia", async ({ page, issues }, testInfo) => {
  await page.goto("/");
  await clickNav(page, testInfo, "#obra");
  await waitScrollStill(page);
  const sheet = page.locator("dialog[data-sheet]");
  if (isReduced(testInfo)) {
    // Con movimiento reducido la obra se muestra como lista.
    await page.locator("[data-list-row]").first().click();
  } else {
    await page.click("[data-open-current]");
  }
  await expect(sheet).toHaveAttribute("open", "");
  await expect.poll(() => new URL(page.url()).hash).toMatch(/^#obra\/[a-z0-9-]+$/);
  await expect(sheet.locator('[data-sheet="title"]')).not.toBeEmpty();
  const firstTitle = await sheet.locator('[data-sheet="title"]').textContent();
  await page.click("[data-sheet-next]");
  await expect(sheet.locator('[data-sheet="title"]')).not.toHaveText(firstTitle ?? "");
  await page.keyboard.press("Escape");
  await expect(sheet).not.toHaveAttribute("open", "");
  // La URL se limpia con el evento «close» del diálogo, un instante después.
  await expect.poll(() => new URL(page.url()).hash).toBe("");
  expect(issues).toEqual([]);
});

test("galería: modo lista y vuelta a galería", async ({ page }, testInfo) => {
  test.skip(isReduced(testInfo), "Con movimiento reducido solo hay lista");
  await page.goto("/");
  await clickNav(page, testInfo, "#obra");
  await waitScrollStill(page);
  await page.click('[data-mode-button="list"]');
  await expect(page.locator("[data-list-row]").first()).toBeVisible();
  await page.click('[data-mode-button="wheel"]');
  await expect(page.locator("[data-list-row]").first()).toBeHidden();
});

test("un enlace directo a una obra abre su ficha", async ({ page, issues }) => {
  await page.goto("/?d#obra/guia-2");
  await expect(page.locator("dialog[data-sheet]")).toHaveAttribute("open", "");
  await expect(page.locator('[data-sheet="title"]')).toHaveText("Guía #2");
  expect(issues).toEqual([]);
});

test("In the studio: las flechas pasan las historias", async ({ page, issues }) => {
  await page.goto("/?d#taller");
  await waitScrollStill(page);
  const count = page.locator("[data-story-count]");
  await expect(count).toHaveText("01 / 02");
  await page.click("[data-story-next]");
  await expect(count).toHaveText("02 / 02");
  await expect(page.locator("[data-story-next]")).toBeDisabled();
  await page.click("[data-story-prev]");
  await expect(count).toHaveText("01 / 02");
  expect(issues).toEqual([]);
});

test("Trayectoria: los apartados se abren y se cierran", async ({ page, issues }, testInfo) => {
  await page.goto("/");
  await clickNav(page, testInfo, "#trayectoria");
  await waitScrollStill(page);
  const item = page.locator(".career__item").first();
  await item.locator("summary").click();
  await expect(item).toHaveAttribute("open", "");
  await expect(item.locator(".row").first()).toBeVisible();
  await item.locator("summary").click();
  await expect(item).not.toHaveAttribute("open", "", { timeout: 3000 });
  expect(issues).toEqual([]);
});

test("Archivo: el visor se abre, pasa fotos con las flechas y se cierra con Esc", async ({ page, issues }) => {
  await page.goto("/aglutinador/archivo/");
  await page.locator("[data-photo]").first().click();
  const viewer = page.locator("dialog[data-viewer]");
  await expect(viewer).toHaveAttribute("open", "");
  await expect.poll(() => viewer.locator("[data-viewer-img]").evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  const caption = viewer.locator("[data-viewer-caption]");
  const first = await caption.textContent();
  await page.keyboard.press("ArrowRight");
  await expect(caption).not.toHaveText(first ?? "");
  await page.keyboard.press("Escape");
  await expect(viewer).not.toHaveAttribute("open", "");
  expect(issues).toEqual([]);
});

// ---------- Formulario (Formspree simulado: nunca se envía nada real) ----------

const openForm = async (page: import("@playwright/test").Page) => {
  await page.goto("/?d#contacto");
  await waitScrollStill(page);
  // Si la web se construyó sin dirección de Formspree, se pone una de prueba.
  await page.evaluate(() => {
    const form = document.querySelector<HTMLFormElement>("[data-contact-form]")!;
    if (!form.dataset.endpoint) form.dataset.endpoint = "https://formspree.io/f/prueba";
  });
  return page.locator("[data-contact-form]");
};

const fill = async (form: import("@playwright/test").Locator, email = "ana@example.com") => {
  await form.locator('[name="name"]').fill("Ana Prueba");
  await form.locator('[name="email"]').fill(email);
  await form.locator('[name="message"]').fill("Mensaje de prueba automática.");
};

test("formulario: vacío y con correo inválido muestra los errores", async ({ page }) => {
  const form = await openForm(page);
  await form.locator('button[type="submit"]').click();
  await expect(form.locator('[data-error-for="name"]')).not.toBeEmpty();
  await expect(form.locator('[data-error-for="email"]')).not.toBeEmpty();
  await expect(form.locator('[data-error-for="message"]')).not.toBeEmpty();
  await expect(form.locator('[name="name"]')).toBeFocused();
  await fill(form, "no-es-un-correo");
  await form.locator('button[type="submit"]').click();
  await expect(form.locator('[data-error-for="email"]')).not.toBeEmpty();
  await expect(form.locator('[data-error-for="name"]')).toBeEmpty();
});

test("formulario: envío correcto (simulado)", async ({ page }) => {
  let sent: string | null = null;
  await page.route(/formspree\.io/, async (route) => {
    sent = route.request().postData();
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) });
  });
  const form = await openForm(page);
  await fill(form);
  await form.locator('button[type="submit"]').click();
  await expect(form.locator("[data-form-status]")).toHaveText(/Mensaje enviado|Message sent/);
  await expect(form.locator('[name="name"]')).toHaveValue("");
  expect(sent).toContain("Ana Prueba");
});

test("formulario: error del servidor y fallo de red (simulados)", async ({ page }) => {
  let reply: "error" | "offline" = "error";
  await page.route(/formspree\.io/, async (route) => {
    if (reply === "offline") return route.abort("internetdisconnected");
    return route.fulfill({
      status: 422,
      contentType: "application/json",
      body: JSON.stringify({ errors: [{ field: "email", message: "Correo rechazado" }] })
    });
  });
  const form = await openForm(page);
  await fill(form);
  await form.locator('button[type="submit"]').click();
  await expect(form.locator("[data-form-status]")).toHaveText(/No se pudo|could not/);
  await expect(form.locator('[data-error-for="email"]')).toHaveText("Correo rechazado");
  await expect(form.locator('[name="name"]')).toHaveValue("Ana Prueba");
  reply = "offline";
  await form.locator('button[type="submit"]').click();
  await expect(form.locator("[data-form-status]")).toHaveText(/No se pudo|could not/);
  await expect(form.locator('button[type="submit"]')).toBeEnabled();
});
