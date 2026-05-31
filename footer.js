// footer.js - Footer Component
(function () {
  function renderFooter() {
    const footer = document.createElement("footer");
    footer.id = "site-footer";
    footer.innerHTML = `
      <div class="footer-wave">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="var(--footer-bg)"/>
        </svg>
      </div>
      <div class="footer-body">
        <div class="footer-grid">
          <div class="footer-brand">
            <a href="/" class="footer-logo" aria-label="Draw A Sketch">
              <svg width="32" height="32" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="18" cy="18" r="17" fill="url(#footerGrad)"/>
                <path d="M10 26 Q14 16 18 18 Q22 20 26 10" stroke="white" stroke-width="2.5" stroke-linecap="round" fill="none"/>
                <circle cx="26" cy="10" r="2.5" fill="#FFE066"/>
                <defs>
                  <linearGradient id="footerGrad" x1="0" y1="0" x2="36" y2="36">
                    <stop offset="0%" stop-color="#FF6B9D"/>
                    <stop offset="100%" stop-color="#06B6D4"/>
                  </linearGradient>
                </defs>
              </svg>
              <span>DrawASketch</span>
            </a>
            <p class="footer-tagline">Your free online sketchpad for pencil drawings, animal sketches, flower art & more. Create, explore, and share your creativity.</p>
            <div class="footer-social" aria-label="Social media links">
              <a href="#" class="social-link" aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" class="social-link" aria-label="Pinterest">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
              </a>
              <a href="#" class="social-link" aria-label="YouTube">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="#" class="social-link" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
              </a>
            </div>
          </div>
          <div class="footer-col">
            <h3 class="footer-heading">Drawing Tools</h3>
            <ul class="footer-links">
              <li><a href="#sketch-app">Free Online Drawing</a></li>
              <li><a href="#sketch-app">Sketchpad Online</a></li>
              <li><a href="#sketch-app">Pencil Drawing Tool</a></li>
              <li><a href="#sketch-app">Brush Painter</a></li>
              <li><a href="#sketch-app">Shape Creator</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h3 class="footer-heading">Sketch Guides</h3>
            <ul class="footer-links">
              <li><a href="#tutorials">Animal Drawings</a></li>
              <li><a href="#tutorials">Flower Sketch Tips</a></li>
              <li><a href="#tutorials">Portrait Drawing</a></li>
              <li><a href="#tutorials">Landscape Sketching</a></li>
              <li><a href="#tutorials">Beginner Techniques</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h3 class="footer-heading">Company</h3>
            <ul class="footer-links">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Sitemap</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; ${new Date().getFullYear()} DrawASketch.github.io — Free Online Sketchpad & Drawing App. All rights reserved.</p>
          <p class="footer-credit">Made with <span aria-label="love">♥</span> for artists & doodlers worldwide</p>
        </div>
      </div>
    `;
    document.body.appendChild(footer);
  }

  document.addEventListener("DOMContentLoaded", renderFooter);
})();
