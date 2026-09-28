document.documentElement.classList.add("js");

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const menuToggle = document.querySelector(".menu-toggle");
const siteNavigation = document.querySelector("#site-navigation");
const topbar = document.querySelector(".topbar");

if (topbar) {
  const updateTopbar = () => topbar.classList.toggle("is-scrolled", window.scrollY > 18);
  updateTopbar();
  window.addEventListener("scroll", updateTopbar, { passive: true });
}

if (menuToggle && siteNavigation) {
  const closeNavigation = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    siteNavigation.classList.remove("is-open");
  };

  menuToggle.addEventListener("click", () => {
    const willOpen = menuToggle.getAttribute("aria-expanded") !== "true";
    menuToggle.setAttribute("aria-expanded", String(willOpen));
    menuToggle.setAttribute("aria-label", willOpen ? "Close navigation" : "Open navigation");
    siteNavigation.classList.toggle("is-open", willOpen);
  });

  siteNavigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNavigation));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNavigation();
  });
  window.matchMedia("(min-width: 901px)").addEventListener("change", (event) => {
    if (event.matches) closeNavigation();
  });
}

if (!reducedMotion && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -10%", threshold: 0.08 },
  );

  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
}

const statCounters = document.querySelectorAll(".stat-strip strong[data-count]");
if (!reducedMotion && "IntersectionObserver" in window && statCounters.length) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const counter = entry.target;
        const target = Number(counter.dataset.count || 0);
        const suffix = counter.dataset.suffix || "";
        const startedAt = performance.now();

        const tick = (now) => {
          const progress = Math.min((now - startedAt) / 700, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          counter.textContent = `${Math.round(target * eased)}${suffix}`;
          if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
        counterObserver.unobserve(counter);
      }
    },
    { threshold: 0.6 },
  );

  statCounters.forEach((counter) => {
    counter.textContent = `0${counter.dataset.suffix || ""}`;
    counterObserver.observe(counter);
  });
}

const year = document.querySelector("#year");
if (year) year.textContent = String(new Date().getFullYear());
