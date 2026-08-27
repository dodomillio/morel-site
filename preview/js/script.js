(function () {
  "use strict";

  const overlay = document.querySelector("[data-overlay]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  const cartDrawer = document.querySelector("[data-cart-drawer]");
  const searchDrawer = document.querySelector("[data-search-drawer]");

  function lockScroll(locked) {
    document.body.classList.toggle("no-scroll", locked);
  }

  function anyPanelOpen() {
    return (
      mobileMenu.classList.contains("is-open") ||
      cartDrawer.classList.contains("is-open") ||
      searchDrawer.classList.contains("is-open")
    );
  }

  function syncOverlay() {
    const open = anyPanelOpen();
    overlay.classList.toggle("is-visible", open);
    lockScroll(open);
  }

  function closeAllPanels() {
    mobileMenu.classList.remove("is-open");
    cartDrawer.classList.remove("is-open");
    searchDrawer.classList.remove("is-open");
    closeAllMegaMenus();
    syncOverlay();
  }

  /* ---------- Mobile full-screen menu ---------- */
  document.querySelectorAll("[data-menu-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      mobileMenu.classList.add("is-open");
      syncOverlay();
    });
  });
  document.querySelectorAll("[data-menu-close]").forEach((btn) => {
    btn.addEventListener("click", closeAllPanels);
  });

  document.querySelectorAll("[data-mobile-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-mobile-open");
      const panel = mobileMenu.querySelector(
        `[data-mobile-panel="${target}"]`
      );
      if (panel) panel.classList.add("is-active");
    });
  });
  document.querySelectorAll("[data-mobile-back]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const panel = btn.closest("[data-mobile-panel]");
      if (panel && panel.getAttribute("data-mobile-panel") !== "root") {
        panel.classList.remove("is-active");
      }
    });
  });

  /* ---------- Cart drawer ---------- */
  document.querySelectorAll("[data-cart-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      cartDrawer.classList.add("is-open");
      syncOverlay();
    });
  });
  document.querySelectorAll("[data-cart-close]").forEach((btn) => {
    btn.addEventListener("click", closeAllPanels);
  });

  /* ---------- Search drawer ---------- */
  document.querySelectorAll("[data-search-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      searchDrawer.classList.add("is-open");
      syncOverlay();
      const input = searchDrawer.querySelector("input");
      if (input) setTimeout(() => input.focus(), 200);
    });
  });
  document.querySelectorAll("[data-search-close]").forEach((btn) => {
    btn.addEventListener("click", closeAllPanels);
  });

  /* ---------- Overlay click closes everything ---------- */
  overlay.addEventListener("click", closeAllPanels);

  /* ---------- Escape key closes everything ---------- */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllPanels();
  });

  /* ---------- Desktop mega-menu (hover / click / focus) ---------- */
  const triggers = document.querySelectorAll("[data-submenu-trigger]");
  const megaMenus = document.querySelectorAll("[data-submenu]");

  function closeAllMegaMenus() {
    megaMenus.forEach((m) => m.classList.remove("is-open"));
    document
      .querySelectorAll("[data-has-submenu].is-open")
      .forEach((li) => li.classList.remove("is-open"));
  }

  function openMegaMenu(name) {
    closeAllMegaMenus();
    const menu = document.querySelector(`[data-submenu="${name}"]`);
    const item = document.querySelector(`[data-has-submenu="${name}"]`);
    if (menu) menu.classList.add("is-open");
    if (item) item.classList.add("is-open");
  }

  triggers.forEach((trigger) => {
    const name = trigger.getAttribute("data-submenu-trigger");
    const parentItem = trigger.closest("[data-has-submenu]");

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = parentItem.classList.contains("is-open");
      closeAllMegaMenus();
      if (!isOpen) openMegaMenu(name);
    });

    parentItem.addEventListener("mouseenter", () => {
      if (window.innerWidth >= 900) openMegaMenu(name);
    });
  });

  const headerEl = document.querySelector(".site-header");
  if (headerEl) {
    headerEl.addEventListener("mouseleave", () => {
      if (window.innerWidth >= 900) closeAllMegaMenus();
    });
  }

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".site-header")) closeAllMegaMenus();
  });

  /* ---------- Sticky header shadow on scroll ---------- */
  let lastScroll = 0;
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    headerEl.classList.toggle("is-scrolled", y > 4);
    lastScroll = y;
  });
})();
