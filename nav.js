// Shared nav + footer injection
(function () {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const pages = [
    { href: 'index.html', label: 'Home' },
    { href: 'about.html', label: 'About' },
    { href: 'coaching.html', label: 'Coaching' },
    { href: 'resources.html', label: 'Resources' },
  ];

  const logoSVG = `<svg viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="13" cy="13" r="11" stroke="white" stroke-width="1.5" fill="none"/>
    <path d="M13 6 L13 20 M6 13 L20 13" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="13" cy="13" r="3" fill="white" opacity="0.9"/>
  </svg>`;

  const navLinks = pages.map(p => {
    const active = currentPage === p.href ? ' active' : '';
    return `<a href="${p.href}" class="${active}">${p.label}</a>`;
  }).join('');

  const navHTML = `
<nav class="site-nav" role="navigation">
  <div class="nav-inner">
    <a href="index.html" class="nav-logo">
      <div class="nav-logo-mark">${logoSVG}</div>
      <div class="nav-brand">
        <span class="nav-company">Unified Solutions Inc.</span>
        <span class="nav-cred">ICF PCC · ACTC Candidate · ExecOnline &amp; Emeritus Faculty</span>
      </div>
    </a>
    <div class="nav-links">
      ${navLinks}
      <a href="book.html" class="nav-cta btn" style="white-space:nowrap;">Book a Call</a>
    </div>
    <button class="nav-hamburger" aria-label="Menu" onclick="document.querySelector('.mobile-menu').classList.toggle('open')">
      <span></span><span></span><span></span>
    </button>
  </div>
  <div class="mobile-menu">
    ${pages.map(p => `<a href="${p.href}">${p.label}</a>`).join('')}
    <a href="book.html" class="nav-cta">Book a Call</a>
  </div>
</nav>`;

  const footerHTML = `
<footer class="site-footer">
  <div class="footer-inner">
    <div class="footer-left">
      <p class="footer-brand">Unified Solutions Inc.</p>
      <p>Maplewood, MN<br>ICF PCC · ACTC Candidate<br>© 2025 Unified Solutions Inc.</p>
    </div>
    <div class="footer-center">
      <nav>
        <a href="index.html">Home</a>
        <a href="about.html">About</a>
        <a href="coaching.html">Coaching Services</a>
        <a href="resources.html">Resources</a>
        <a href="#">Privacy</a>
        <a href="#" style="color:rgba(255,255,255,0.3);font-size:0.75rem;margin-top:0.5rem;">Government Contracting</a>
      </nav>
    </div>
    <div class="footer-right">
      <div class="footer-social">
        <a href="https://www.linkedin.com/in/juliancjohnson/" target="_blank" rel="noopener">LinkedIn</a>
        <a href="https://www.instagram.com/unifiedsolutionsinc/" target="_blank" rel="noopener">Instagram</a>
        <a href="https://www.youtube.com/channel/UC6KBjPftSlQGD5bWPPpgOIg" target="_blank" rel="noopener">YouTube</a>
      </div>
      <p style="font-size:0.8rem;">contact@unifiedsolutionsinc.com<br>952.594.8611</p>
    </div>
  </div>
  <div class="footer-bottom">
    <p style="color:rgba(255,255,255,0.25);">Unified Solutions Inc. · Maplewood, MN · unifiedsolutionsinc.com</p>
  </div>
</footer>`;

  // Inject nav
  const navTarget = document.getElementById('nav-mount');
  if (navTarget) navTarget.outerHTML = navHTML;

  // Inject footer
  const footerTarget = document.getElementById('footer-mount');
  if (footerTarget) footerTarget.outerHTML = footerHTML;

  // Tabs
  document.querySelectorAll('.tabs-nav').forEach(tabNav => {
    tabNav.querySelectorAll('.tab-btn').forEach((btn, i) => {
      btn.addEventListener('click', () => {
        const group = btn.closest('.tabs-wrapper') || btn.closest('.section');
        group.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        group.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        group.querySelector(`.tab-panel[data-tab="${btn.dataset.tab}"]`).classList.add('active');
      });
    });
  });

  // AOS
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('[data-aos]').forEach(el => obs.observe(el));

  // Progress bars animate
  const barObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.progress-fill').forEach(bar => {
          bar.style.width = bar.dataset.width;
        });
        barObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.progress-section').forEach(el => barObs.observe(el));
})();
