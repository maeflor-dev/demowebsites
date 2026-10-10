
// =========================================================
// LUNA BEAUTY STUDIO
// Interactive features — vanilla JavaScript (ES6)
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
  // 1. Mobile navigation
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const navItems = document.querySelectorAll(".nav-links a");

  function closeMenu() {
    if (!menuToggle || !navLinks) return;

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    navLinks.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Open navigation menu" : "Close navigation menu"
      );

      navLinks.classList.toggle("is-open", !isOpen);
      document.body.classList.toggle("menu-open", !isOpen);
    });

    // Close the menu after a navigation link is selected.
    navItems.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Close the menu when Escape is pressed.
    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        menuToggle.getAttribute("aria-expanded") === "true"
      ) {
        closeMenu();
        menuToggle.focus();
      }
    });

    // Close the menu when the user clicks outside it.
    document.addEventListener("click", (event) => {
      const clickedInsideNavigation =
        navLinks.contains(event.target) ||
        menuToggle.contains(event.target);

      if (!clickedInsideNavigation) {
        closeMenu();
      }
    });

    // Restore the desktop navigation layout after resizing.
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 992) {
        closeMenu();
      }
    });
  }

  // 2. Highlight today's opening-hours row.
  const today = new Date().getDay();
  const hoursRows = document.querySelectorAll(".hours-table tr");

  hoursRows.forEach((row) => {
    const rowDay = Number(row.dataset.day);
    const isToday = rowDay === today;

    row.classList.toggle("today", isToday);

    if (isToday) {
      row.setAttribute("aria-current", "date");
    } else {
      row.removeAttribute("aria-current");
    }
  });

  // 3. Automatic copyright year.
  const yearElement = document.getElementById("current-year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 4. Gallery lightbox.
  const galleryItems = Array.from(
    document.querySelectorAll(".gallery-item")
  );

  const lightbox = document.querySelector(".lightbox");
  const lightboxImage = document.querySelector(".lightbox-image");
  const lightboxCaption = document.querySelector(".lightbox-caption");
  const closeButton = document.querySelector(".lightbox-close");
  const previousButton = document.querySelector(".lightbox-prev");
  const nextButton = document.querySelector(".lightbox-next");

  if (
    !lightbox ||
    !lightboxImage ||
    !lightboxCaption ||
    !closeButton ||
    !previousButton ||
    !nextButton ||
    typeof lightbox.showModal !== "function"
  ) {
    // The rest of the website still works if native dialog
    // support is unavailable; the gallery simply won't open.
    return;
  }

  let currentImageIndex = 0;
  let lastFocusedGalleryItem = null;

  function displayImage(index) {
    if (galleryItems.length === 0) return;

    // Wrap around when moving past the first or last image.
    currentImageIndex =
      (index + galleryItems.length) % galleryItems.length;

    const item = galleryItems[currentImageIndex];
    const thumbnail = item.querySelector("img");
    const fullImageUrl = item.dataset.full || thumbnail.src;
    const caption =
      item.dataset.caption || thumbnail.alt || "Beauty gallery image";

    lightboxImage.src = fullImageUrl;
    lightboxImage.alt = thumbnail.alt;
    lightboxCaption.textContent =
      `${caption} (${currentImageIndex + 1} of ${galleryItems.length})`;
  }

  function openLightbox(index) {
    lastFocusedGalleryItem = galleryItems[index];
    displayImage(index);

    if (!lightbox.open) {
      lightbox.showModal();
      document.body.classList.add("lightbox-open");
    }

    closeButton.focus();
  }

  function closeLightbox() {
    if (lightbox.open) {
      lightbox.close();
    }
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      openLightbox(index);
    });
  });

  previousButton.addEventListener("click", () => {
    displayImage(currentImageIndex - 1);
  });

  nextButton.addEventListener("click", () => {
    displayImage(currentImageIndex + 1);
  });

  closeButton.addEventListener("click", closeLightbox);

  // Close when the backdrop itself is clicked.
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  // Keep keyboard navigation available inside the lightbox.
  lightbox.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      displayImage(currentImageIndex - 1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      displayImage(currentImageIndex + 1);
    }
  });

  // Restore focus to the gallery image that was opened.
  lightbox.addEventListener("close", () => {
    document.body.classList.remove("lightbox-open");

    if (lastFocusedGalleryItem) {
      lastFocusedGalleryItem.focus();
    }
  });
});
