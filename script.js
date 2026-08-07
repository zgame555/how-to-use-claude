(() => {
  const root = document.documentElement;
  const menuButton = document.querySelector("[data-menu-toggle]");
  const sidebar = document.querySelector(".sidebar");
  const scrim = document.querySelector(".mobile-scrim");
  const themeButton = document.querySelector("[data-theme-toggle]");

  const closeMenu = () => {
    sidebar?.classList.remove("is-open");
    scrim?.classList.remove("is-visible");
    menuButton?.setAttribute("aria-expanded", "false");
  };

  menuButton?.addEventListener("click", () => {
    const isOpen = sidebar?.classList.toggle("is-open");
    scrim?.classList.toggle("is-visible", isOpen);
    menuButton.setAttribute("aria-expanded", String(Boolean(isOpen)));
  });

  scrim?.addEventListener("click", closeMenu);
  document.querySelectorAll(".nav-link").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  const savedTheme = window.localStorage.getItem("claude-code-theme");
  if (savedTheme === "light" || savedTheme === "dark") root.dataset.theme = savedTheme;

  themeButton?.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = nextTheme;
    window.localStorage.setItem("claude-code-theme", nextTheme);
  });

  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const original = button.querySelector("span");
      const text = button.dataset.copy || "";
      try {
        await navigator.clipboard.writeText(text);
        if (original) original.textContent = "คัดลอกแล้ว";
      } catch {
        const fallback = document.createElement("textarea");
        fallback.value = text;
        fallback.setAttribute("readonly", "");
        fallback.style.position = "fixed";
        fallback.style.opacity = "0";
        document.body.appendChild(fallback);
        fallback.select();
        document.execCommand("copy");
        fallback.remove();
        if (original) original.textContent = "คัดลอกแล้ว";
      }
      window.setTimeout(() => {
        if (original) original.textContent = "คัดลอก";
      }, 1800);
    });
  });

  const sections = [...document.querySelectorAll("main section[id]")];
  const links = [...document.querySelectorAll(".nav-link[href^='#']")];
  const linkById = new Map(links.map((link) => [link.getAttribute("href").slice(1), link]));
  const activeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => link.classList.remove("active"));
        linkById.get(entry.target.id)?.classList.add("active");
      });
    },
    { rootMargin: "-20% 0px -65% 0px", threshold: 0 },
  );
  sections.forEach((section) => activeObserver.observe(section));

  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const percentage = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    root.style.setProperty("--scroll-progress", `${percentage}%`);
  };
  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
})();
