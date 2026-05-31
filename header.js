// header.js - Header Component
(function () {
  function renderHeader() {
    const header = document.createElement("header");
    header.id = "site-header";
    header.innerHTML = `
      <nav class="navbar" role="navigation" aria-label="Main navigation">
        <div class="nav-container">
          <a href="/" class="logo" aria-label="Draw A Sketch Home">
            <div class="logo-icon">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="18" cy="18" r="17" fill="url(#logoGrad)" stroke="white" stroke-width="1.5"/>
                <path d="M10 26 Q14 16 18 18 Q22 20 26 10" stroke="white" stroke-width="2.5" stroke-linecap="round" fill="none"/>
                <circle cx="26" cy="10" r="2.5" fill="#FFE066"/>
                <defs>
                  <linearGradient id="logoGrad" x1="0" y1="0" x2="36" y2="36">
                    <stop offset="0%" stop-color="#FF6B9D"/>
                    <stop offset="50%" stop-color="#A855F7"/>
                    <stop offset="100%" stop-color="#06B6D4"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span class="logo-text">Draw<span class="logo-accent">A</span>Sketch</span>
          </a>
          <ul class="nav-links" id="nav-links" role="menubar">
            <li role="none"><a href="#sketch-app" role="menuitem" class="nav-link">Start Drawing</a></li>
            <li role="none"><a href="#features" role="menuitem" class="nav-link">Features</a></li>
            <li role="none"><a href="#tutorials" role="menuitem" class="nav-link">Tutorials</a></li>
            <li role="none"><a href="#gallery" role="menuitem" class="nav-link">Gallery</a></li>
            <li role="none"><a href="#tools" role="menuitem" class="nav-link">Tools</a></li>
            <li role="none"><a href="#faq" role="menuitem" class="nav-link">FAQ</a></li>
          </ul>
          <div class="nav-actions">
            <a href="#sketch-app" class="cta-btn nav-cta" aria-label="Start drawing for free">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
              Free Drawing
            </a>
            <button class="hamburger" id="hamburger" aria-label="Toggle menu" aria-expanded="false" aria-controls="nav-links">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </nav>
    `;
    document.body.prepend(header);

    // Hamburger toggle
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("nav-links");
    hamburger.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      hamburger.classList.toggle("active", isOpen);
      hamburger.setAttribute("aria-expanded", isOpen);
    });

    // Smooth scroll for nav links
    document.querySelectorAll(".nav-link, .nav-cta").forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (href && href.startsWith("#")) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
          navLinks.classList.remove("open");
          hamburger.classList.remove("active");
        }
      });
    });

    // Scroll effect
    window.addEventListener("scroll", () => {
      header.classList.toggle("scrolled", window.scrollY > 50);
    });
  }

  document.addEventListener("DOMContentLoaded", renderHeader);
})();
