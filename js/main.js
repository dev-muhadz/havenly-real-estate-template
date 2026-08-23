/* ============================================================
   HAVENLY — VANILLA JAVASCRIPT
   No framework or library required.

   Features:
   1. Mobile navigation toggle
   2. Saved/favourite property buttons
   3. Listings filtering and sorting
   4. Property image gallery
   5. Contact form modal
   ============================================================ */

"use strict";

function getFocusableElements(container) {
  return [...container.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
    .filter((element) => !element.hidden && element.getAttribute("aria-hidden") !== "true");
}

/* ============================================================
   1. MOBILE NAVIGATION
   ============================================================ */
function initMobileNavigation() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".primary-nav");

  if (!toggle || !nav) return;

  function closeNavigation({ restoreFocus = true } = {}) {
    nav.classList.remove("open");
    toggle.classList.remove("active");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");
    if (restoreFocus) toggle.focus();
  }

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.classList.toggle("active", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");

    if (isOpen) nav.querySelector("a")?.focus();
    else toggle.focus();
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => closeNavigation({ restoreFocus: false }));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("open")) closeNavigation();
  });
}

/* ============================================================
   2. SAVE/FAVOURITE BUTTONS
   ============================================================ */
function initSaveButtons() {
  document.querySelectorAll("[data-save]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const saved = button.classList.toggle("saved");
      button.setAttribute("aria-pressed", String(saved));
      button.textContent = saved ? "♥" : "♡";
    });
  });
}

/* ============================================================
   3. LISTING FILTERS + SORTING
   ============================================================ */
function initListingFilters() {
  const form = document.querySelector("#filters-form");
  const grid = document.querySelector("#listing-grid");
  const cards = [...document.querySelectorAll(".listing-card")];
  const resultCount = document.querySelector("#result-count");
  const emptyState = document.querySelector("#empty-state");
  const sortSelect = document.querySelector("#sort-select");
  const resetButton = document.querySelector("#reset-filters");
  const emptyResetButton = document.querySelector("#empty-reset");

  if (!form || !grid || cards.length === 0) return;

  function getFilterValues() {
    const selectedType = form.querySelector('input[name="type"]:checked');
    const selectedRooms = form.querySelector('input[name="rooms"]:checked');

    return {
      city: document.querySelector("#filter-city")?.value || "",
      type: selectedType?.value || "",
      rooms: Number(selectedRooms?.value || 0),
      minPrice: Number(document.querySelector("#min-price")?.value || 0),
      maxPrice: Number(document.querySelector("#max-price")?.value || 0)
    };
  }

  function cardMatchesFilters(card, filters) {
    const data = card.dataset;
    const price = Number(data.price || 0);
    const rooms = Number(data.rooms || 0);

    const matchesCity = !filters.city || data.city === filters.city;
    const matchesType = !filters.type || data.type === filters.type;
    const matchesRooms = !filters.rooms || rooms >= filters.rooms;
    const matchesMin = !filters.minPrice || price >= filters.minPrice;
    const matchesMax = !filters.maxPrice || price <= filters.maxPrice;

    return matchesCity && matchesType && matchesRooms && matchesMin && matchesMax;
  }

  function renderListings() {
    const filters = getFilterValues();
    const matchingCards = cards.filter((card) => cardMatchesFilters(card, filters));

    cards.forEach((card) => {
      card.hidden = !matchingCards.includes(card);
    });

    const sortMode = sortSelect?.value || "featured";
    const sorted = [...matchingCards].sort((a, b) => {
      if (sortMode === "price-low") return Number(a.dataset.price) - Number(b.dataset.price);
      if (sortMode === "price-high") return Number(b.dataset.price) - Number(a.dataset.price);
      if (sortMode === "size-high") return Number(b.dataset.size) - Number(a.dataset.size);
      return cards.indexOf(a) - cards.indexOf(b);
    });

    sorted.forEach((card) => grid.appendChild(card));

    if (resultCount) resultCount.textContent = String(matchingCards.length);
    if (emptyState) emptyState.hidden = matchingCards.length !== 0;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    renderListings();
    closeFilterDrawer();
  });

  sortSelect?.addEventListener("change", renderListings);

  function resetFilters() {
    form.reset();
    renderListings();
  }

  resetButton?.addEventListener("click", resetFilters);
  emptyResetButton?.addEventListener("click", resetFilters);

  const params = new URLSearchParams(window.location.search);
  const queryCity = params.get("city");
  const queryType = params.get("type");

  if (queryCity) {
    const citySelect = document.querySelector("#filter-city");
    if (citySelect) citySelect.value = queryCity;
  }

  if (queryType) {
    const typeRadio = form.querySelector(`input[name="type"][value="${CSS.escape(queryType)}"]`);
    if (typeRadio) typeRadio.checked = true;
  }

  renderListings();
}

/* ============================================================
   4. MOBILE FILTER DRAWER
   ============================================================ */
let closeFilterDrawer = () => {};

function initFilterDrawer() {
  const openButton = document.querySelector("#open-filters");
  const closeButton = document.querySelector(".filter-close");
  const panel = document.querySelector(".filter-panel");

  if (!openButton || !panel) return;

  let lastFocusedElement = null;

  function openDrawer() {
    lastFocusedElement = document.activeElement;
    panel.classList.add("open");
    openButton.setAttribute("aria-expanded", "true");
    closeButton?.focus();
  }

  closeFilterDrawer = function closeDrawer({ restoreFocus = true } = {}) {
    panel.classList.remove("open");
    openButton.setAttribute("aria-expanded", "false");
    if (restoreFocus) (lastFocusedElement || openButton)?.focus();
    lastFocusedElement = null;
  };

  openButton.addEventListener("click", openDrawer);
  closeButton?.addEventListener("click", () => closeFilterDrawer());

  panel.addEventListener("keydown", (event) => {
    if (!panel.classList.contains("open")) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeFilterDrawer();
      return;
    }

    if (event.key !== "Tab") return;

    const focusable = getFocusableElements(panel);
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}

/* ============================================================
   5. PROPERTY IMAGE GALLERY
   ============================================================ */
function initGallery() {
  const gallery = document.querySelector("[data-gallery]");
  if (!gallery) return;

  const mainImage = gallery.querySelector("[data-gallery-main]");
  const thumbnails = [...gallery.querySelectorAll("[data-gallery-thumb]")];
  const previous = gallery.querySelector("[data-gallery-prev]");
  const next = gallery.querySelector("[data-gallery-next]");
  const count = gallery.querySelector("[data-gallery-count]");

  if (!mainImage || thumbnails.length === 0) return;

  let currentIndex = 0;

  function showImage(index) {
    currentIndex = (index + thumbnails.length) % thumbnails.length;
    const activeThumb = thumbnails[currentIndex];

    mainImage.src = activeThumb.dataset.src;
    mainImage.alt = activeThumb.dataset.alt || "Property image";

    thumbnails.forEach((thumb, thumbIndex) => {
      const active = thumbIndex === currentIndex;
      thumb.classList.toggle("active", active);
      thumb.setAttribute("aria-current", active ? "true" : "false");
    });

    if (count) count.textContent = `${currentIndex + 1} / ${thumbnails.length}`;
  }

  thumbnails.forEach((thumb, index) => {
    thumb.addEventListener("click", () => showImage(index));
  });

  previous?.addEventListener("click", () => showImage(currentIndex - 1));
  next?.addEventListener("click", () => showImage(currentIndex + 1));

  gallery.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") showImage(currentIndex - 1);
    if (event.key === "ArrowRight") showImage(currentIndex + 1);
  });

  showImage(0);
}

/* ============================================================
   6. CONTACT MODAL
   ============================================================ */
function initContactModal() {
  const modal = document.querySelector("#contact-modal");
  const openButtons = document.querySelectorAll("[data-modal-open]");
  const closeButtons = document.querySelectorAll("[data-modal-close]");
  const form = document.querySelector("#contact-form");
  const success = document.querySelector("#form-success");

  if (!modal || openButtons.length === 0) return;

  let lastFocusedElement = null;

  function openModal() {
    lastFocusedElement = document.activeElement;
    modal.hidden = false;
    document.body.classList.add("modal-open");
    document.querySelector("#contact-name")?.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    lastFocusedElement?.focus();
  }

  openButtons.forEach((button) => button.addEventListener("click", openModal));
  closeButtons.forEach((button) => button.addEventListener("click", closeModal));

  modal.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeModal();
      return;
    }

    if (event.key !== "Tab") return;

    const focusable = getFocusableElements(modal);
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (success) success.hidden = false;
    form.reset();
  });
}

/* ============================================================
   INITIALISE EVERYTHING AFTER THE HTML HAS LOADED
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  initMobileNavigation();
  initSaveButtons();
  initListingFilters();
  initFilterDrawer();
  initGallery();
  initContactModal();
});
