const experience = document.querySelector<HTMLElement>("[data-experience]");

if (experience) {
  const galleryHost = experience.querySelector<HTMLElement>("[data-gallery-panel-host]");
  const careerHost = experience.querySelector<HTMLElement>("[data-career-panel-host]");
  const galleryOpeners = Array.from(
    experience.querySelectorAll<HTMLAnchorElement>("[data-open-gallery]")
  );
  const careerOpeners = Array.from(experience.querySelectorAll<HTMLAnchorElement>("[data-open-career]"));
  const artworkLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>("[data-artwork-link]"));
  const artworkPanels = Array.from(experience.querySelectorAll<HTMLElement>("[data-artwork-panel]"));
  const artworkHeadings = Array.from(
    experience.querySelectorAll<HTMLElement>("[data-artwork-heading]")
  );
  const counter = experience.querySelector<HTMLElement>("[data-artwork-counter]");
  const closeButtons = Array.from(experience.querySelectorAll<HTMLButtonElement>("[data-close-panel]"));
  const previousButton = experience.querySelector<HTMLButtonElement>("[data-gallery-prev]");
  const nextButton = experience.querySelector<HTMLButtonElement>("[data-gallery-next]");
  const galleryClose = galleryHost?.querySelector<HTMLButtonElement>("[data-close-panel]");
  const careerTitle = experience.querySelector<HTMLElement>("#career-title");
  const careerItems = Array.from(experience.querySelectorAll<HTMLElement>("[data-career-item]"));
  const careerTriggers = Array.from(
    experience.querySelectorAll<HTMLButtonElement>("[data-career-trigger]")
  );

  let activeArtwork = 0;
  let returnFocus: HTMLElement | null = null;
  let pendingFocus = false;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const total = artworkPanels.length;

  const normaliseIndex = (index: number) => ((index % total) + total) % total;
  const slugFromPanel = (panel: HTMLElement) => panel.id.replace("artwork-", "");
  const slugForIndex = (index: number) => slugFromPanel(artworkPanels[normaliseIndex(index)]!);
  const indexForSlug = (slug: string) =>
    artworkPanels.findIndex((panel) => slugFromPanel(panel) === decodeURIComponent(slug));

  const updateMode = (mode: "home" | "gallery" | "career") => {
    experience.dataset.mode = mode;
    galleryHost?.setAttribute("aria-hidden", mode === "gallery" ? "false" : "true");
    careerHost?.setAttribute("aria-hidden", mode === "career" ? "false" : "true");
    galleryOpeners.forEach((opener) =>
      opener.setAttribute("aria-expanded", mode === "gallery" ? "true" : "false")
    );
    careerOpeners.forEach((opener) =>
      opener.setAttribute("aria-expanded", mode === "career" ? "true" : "false")
    );
  };

  const bringStageIntoView = () => {
    experience.scrollIntoView({
      block: "start",
      behavior: reducedMotion.matches ? "auto" : "smooth"
    });
  };

  const setArtwork = (index: number, shouldFocus = false) => {
    activeArtwork = normaliseIndex(index);
    artworkPanels.forEach((panel, panelIndex) => {
      const isActive = panelIndex === activeArtwork;
      panel.classList.toggle("is-active", isActive);
      panel.setAttribute("aria-hidden", isActive ? "false" : "true");
    });
    artworkLinks.forEach((link) => {
      const isCurrent = Number(link.dataset.index) === activeArtwork;
      if (isCurrent) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
    if (counter) {
      counter.textContent = `${String(activeArtwork + 1).padStart(2, "0")}/${String(total).padStart(2, "0")}`;
    }
    if (shouldFocus) {
      artworkHeadings[activeArtwork]?.focus({ preventScroll: true });
    }
  };

  const setCareerItem = (index: number) => {
    careerItems.forEach((item, itemIndex) => {
      const isActive = itemIndex === index;
      item.classList.toggle("is-active", isActive);
      careerTriggers[itemIndex]?.setAttribute("aria-expanded", isActive ? "true" : "false");
    });
  };

  const moveHash = (hash: string, shouldFocus = true) => {
    pendingFocus = shouldFocus;
    if (window.location.hash === hash) {
      syncFromHash();
      return;
    }
    window.location.hash = hash;
  };

  function syncFromHash() {
    const hash = window.location.hash || "#inicio";
    const shouldFocus = pendingFocus;
    pendingFocus = false;

    if (hash.startsWith("#obra/")) {
      const nextIndex = indexForSlug(hash.replace("#obra/", ""));
      const previousMode = experience!.dataset.mode;
      updateMode("gallery");
      setArtwork(nextIndex >= 0 ? nextIndex : 0, false);
      bringStageIntoView();
      if (shouldFocus) {
        if (previousMode === "gallery") {
          artworkHeadings[activeArtwork]?.focus({ preventScroll: true });
        } else {
          galleryClose?.focus({ preventScroll: true });
        }
      }
      return;
    }

    if (hash === "#trayectoria") {
      updateMode("career");
      bringStageIntoView();
      if (shouldFocus) {
        careerTitle?.focus({ preventScroll: true });
      }
      return;
    }

    updateMode("home");
    if (shouldFocus && returnFocus) {
      returnFocus.focus({ preventScroll: true });
    }
  }

  artworkLinks.forEach((link) => {
    link.addEventListener("click", () => {
      returnFocus = link;
      pendingFocus = true;
    });
  });

  galleryOpeners.forEach((opener) => {
    opener.addEventListener("click", () => {
      returnFocus = opener;
      pendingFocus = true;
    });
  });

  careerOpeners.forEach((opener) => {
    opener.addEventListener("click", () => {
      returnFocus = opener;
      pendingFocus = true;
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      moveHash("#inicio");
    });
  });

  previousButton?.addEventListener("click", () => {
    moveHash(`#obra/${slugForIndex(activeArtwork - 1)}`);
  });

  nextButton?.addEventListener("click", () => {
    moveHash(`#obra/${slugForIndex(activeArtwork + 1)}`);
  });

  careerTriggers.forEach((trigger, index) => {
    trigger.addEventListener("click", () => {
      setCareerItem(index);
    });
  });

  window.addEventListener("hashchange", syncFromHash);

  window.addEventListener("keydown", (event) => {
    const mode = experience.dataset.mode;
    if (event.key === "Escape" && mode !== "home") {
      event.preventDefault();
      moveHash("#inicio");
    }
    if (mode === "gallery" && event.key === "ArrowLeft") {
      event.preventDefault();
      moveHash(`#obra/${slugForIndex(activeArtwork - 1)}`, false);
    }
    if (mode === "gallery" && event.key === "ArrowRight") {
      event.preventDefault();
      moveHash(`#obra/${slugForIndex(activeArtwork + 1)}`, false);
    }
  });

  syncFromHash();
}
