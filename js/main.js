/* ============================================================
   Nitro — interactions
   GSAP scroll reveals + hero parallax + nav behaviour
   ============================================================ */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Sticky header state ---------- */
  const header = document.getElementById("siteHeader");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("mobileMenu");
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    toggle.setAttribute("aria-label", open ? "Menü öffnen" : "Menü schließen");
    menu.hidden = open;
  });
  menu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      menu.hidden = true;
    })
  );

  /* ---------- Motion (guarded by reduced-motion) ---------- */
  if (prefersReduced || !window.gsap) {
    document.querySelectorAll("[data-reveal], [data-stagger] > *")
      .forEach((el) => el.classList.add("is-in"));
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* Single elements */
  gsap.utils.toArray("[data-reveal]").forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 85%", once: true },
      onStart: () => el.classList.add("is-in"),
    });
  });

  /* Staggered groups (cards, timeline, grids) */
  gsap.utils.toArray("[data-stagger]").forEach((group) => {
    const items = group.children;
    gsap.to(items, {
      opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.09,
      scrollTrigger: { trigger: group, start: "top 80%", once: true },
      onStart: () => Array.from(items).forEach((i) => i.classList.add("is-in")),
    });
  });

  /* Hero liquid — gentle parallax drift inside the panel on scroll */
  gsap.to(".hero-fluid", {
    yPercent: 12, scale: 1.06, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.6 },
  });
})();
