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
  window.localStorage.setItem("sandra-language", language);
};

if (languageButtons.length > 0) {
  const savedLanguage = window.localStorage.getItem("sandra-language");
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
