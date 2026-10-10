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
  const coverRail = experience.querySelector<HTMLElement>("[data-cover-rail]");
  const coverRailList = coverRail?.querySelector<HTMLElement>(".artwork-rail__list");
  const coverPreviewLinks = Array.from(
    coverRail?.querySelectorAll<HTMLAnchorElement>("[data-cover-preview-link]") ?? []
  );

  let activeArtwork = 0;
  let coverPreviewIndex = 0;
  let coverPreviewTimer: number | undefined;
  let returnFocus: HTMLElement | null = null;
  let pendingFocus = false;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const total = artworkPanels.length;

  const normaliseIndex = (index: number) => ((index % total) + total) % total;
  const slugFromPanel = (panel: HTMLElement) => panel.id.replace("artwork-", "");
  const slugForIndex = (index: number) => slugFromPanel(artworkPanels[normaliseIndex(index)]!);
  const indexForSlug = (slug: string) =>
    artworkPanels.findIndex((panel) => slugFromPanel(panel) === decodeURIComponent(slug));
  const normalisePreviewIndex = (index: number) =>
    coverPreviewLinks.length === 0
      ? 0
      : ((index % coverPreviewLinks.length) + coverPreviewLinks.length) % coverPreviewLinks.length;

  type CareerMode = "essentials" | "timeline";

  const setCoverPreview = (index: number, shouldScroll = true) => {
    if (coverPreviewLinks.length === 0) {
      return;
    }

    coverPreviewIndex = normalisePreviewIndex(index);
    coverPreviewLinks.forEach((link, linkIndex) => {
      if (linkIndex === coverPreviewIndex) {
        link.dataset.previewCurrent = "true";
      } else {
        delete link.dataset.previewCurrent;
      }
    });

    if (!shouldScroll || !coverRailList || reducedMotion.matches) {
      return;
    }

    const activeLink = coverPreviewLinks[coverPreviewIndex];
    if (!activeLink) {
      return;
    }

    const listRect = coverRailList.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();
    const nextLeft =
      coverRailList.scrollLeft +
      linkRect.left -
      listRect.left -
      (listRect.width - linkRect.width) / 2;

    coverRailList.scrollTo({
      left: Math.max(0, nextLeft),
      behavior: "smooth"
    });
  };

  const stopCoverPreview = () => {
    if (coverPreviewTimer !== undefined) {
      window.clearInterval(coverPreviewTimer);
      coverPreviewTimer = undefined;
    }
  };

  const startCoverPreview = () => {
    if (coverPreviewLinks.length < 2 || reducedMotion.matches || coverPreviewTimer !== undefined) {
      return;
    }

    coverPreviewTimer = window.setInterval(() => {
      if (experience.dataset.mode !== "home") {
        stopCoverPreview();
        return;
      }
      setCoverPreview(coverPreviewIndex + 1);
    }, 3200);
  };

  const setCareerMode = (careerMode: CareerMode) => {
    if (careerHost) {
      careerHost.dataset.careerMode = careerMode;
    }
  };

  const focusCareerTitle = (careerMode: CareerMode) => {
    const headingId = careerMode === "timeline" ? "#career-timeline-title" : "#career-essentials-title";
    experience.querySelector<HTMLElement>(headingId)?.focus({ preventScroll: true });
  };

  const updateMode = (mode: "home" | "gallery" | "career", careerMode?: CareerMode) => {
    experience.dataset.mode = mode;
    if (careerMode) {
      setCareerMode(careerMode);
    }
    if (mode === "home") {
      startCoverPreview();
    } else {
      stopCoverPreview();
    }
    galleryHost?.setAttribute("aria-hidden", mode === "gallery" ? "false" : "true");
    careerHost?.setAttribute("aria-hidden", mode === "career" ? "false" : "true");
    galleryOpeners.forEach((opener) =>
      opener.setAttribute("aria-expanded", mode === "gallery" ? "true" : "false")
    );
    careerOpeners.forEach((opener) => {
      const isCurrentCareer =
        mode === "career" && (!careerMode || opener.dataset.careerTarget === careerMode);
      opener.setAttribute("aria-expanded", isCurrentCareer ? "true" : "false");
    });
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

    if (hash === "#esenciales" || hash === "#trayectoria") {
      const careerMode = hash === "#esenciales" ? "essentials" : "timeline";
      updateMode("career", careerMode);
      bringStageIntoView();
      if (shouldFocus) {
        focusCareerTitle(careerMode);
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
      if (link.dataset.coverPreviewLink !== undefined) {
        setCoverPreview(Number(link.dataset.index) || 0, false);
      }
    });
  });

  coverRail?.addEventListener("mouseenter", stopCoverPreview);
  coverRail?.addEventListener("mouseleave", () => {
    if (experience.dataset.mode === "home") {
      startCoverPreview();
    }
  });
  coverRail?.addEventListener("focusin", stopCoverPreview);
  coverRail?.addEventListener("focusout", () => {
    if (experience.dataset.mode === "home") {
      startCoverPreview();
    }
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
