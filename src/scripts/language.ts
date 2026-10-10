type SupportedLanguage = "es" | "en";

const languageButtons = Array.from(
  document.querySelectorAll<HTMLButtonElement>("[data-language-switch]")
);

const isSupportedLanguage = (value: string | null | undefined): value is SupportedLanguage =>
  value === "es" || value === "en";

const setLanguage = (language: SupportedLanguage) => {
  document.documentElement.lang = language;
  document.documentElement.dataset.currentLang = language;
  languageButtons.forEach((button) => {
    button.setAttribute(
      "aria-current",
      button.dataset.languageSwitch === language ? "true" : "false"
    );
  });
  // Etiquetas para lectores de pantalla: el español es el valor por defecto
  // y el inglés vive en data-aria-label-en.
  document.querySelectorAll<HTMLElement>("[data-aria-label-en]").forEach((element) => {
    if (element.dataset.ariaLabelEs === undefined) {
      element.dataset.ariaLabelEs = element.getAttribute("aria-label") ?? "";
    }
    const label =
      language === "en" ? element.dataset.ariaLabelEn : element.dataset.ariaLabelEs;
    if (label) {
      element.setAttribute("aria-label", label);
    }
  });
  try {
    window.localStorage.setItem("sandra-language", language);
  } catch {
    // Sin almacenamiento (modo privado): el idioma no se recuerda, pero funciona.
  }
};

if (languageButtons.length > 0) {
  let savedLanguage: string | null = null;
  try {
    savedLanguage = window.localStorage.getItem("sandra-language");
  } catch {
    savedLanguage = null;
  }
  setLanguage(isSupportedLanguage(savedLanguage) ? savedLanguage : "es");

  languageButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextLanguage = button.dataset.languageSwitch;
      if (isSupportedLanguage(nextLanguage)) {
        setLanguage(nextLanguage);
      }
    });
  });
}
