(() => {
  const path = location.pathname.replace(/\/$/, '') || '/';
  const page = document.body.dataset.page || '';
  const is = (key) => page === key ? ' is-active' : '';
  const header = document.querySelector('[data-site-header]');
  if (header) {
    header.innerHTML = `
      <header class="site-header">
        <div class="container site-header__inner">
          <a class="brand" href="/">Virtuální <span>kartářka</span></a>
          <button class="menu-btn" type="button" aria-expanded="false" aria-controls="siteNav">Menu</button>
          <nav class="site-nav" id="siteNav" aria-label="Hlavní navigace">
            <a class="${is('home')}" href="/">Úvod</a>
            <a href="/#jak-to-funguje">Jak to funguje</a>
            <a href="/#cenik">Ceník</a>
            <a class="nav-button${is('tarot')}" href="/tarot.html">Zahájit výklad</a>
          </nav>
        </div>
      </header>`;
    const btn = header.querySelector('.menu-btn');
    const nav = header.querySelector('#siteNav');
    btn?.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  const footer = document.querySelector('[data-site-footer]');
  if (footer) {
    footer.innerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div>
              <div class="footer-title">Virtuální kartářka</div>
              <p>Osobní tarotový výklad na následujících 30 dní. Tři karty, jedna otázka a soukromá stránka s výkladem.</p>
            </div>
            <div>
              <strong>Projekt</strong>
              <div class="footer-links">
                <a href="/tarot.html">Zahájit výklad</a>
                <a href="/blog.html">Magazín</a>
                <a href="/#faq">FAQ</a>
                <a href="/kontakt.html">Kontakt</a>
              </div>
            </div>
            <div>
              <strong>Dokumenty</strong>
              <div class="footer-links">
                <a href="/obchodni-podminky.html">Obchodní podmínky</a>
                <a href="/ochrana-osobnich-udaju.html">Ochrana osobních údajů</a>
                <a href="/cookies.html">Cookies</a>
              </div>
            </div>
          </div>
          <div class="footer-small"><span>© ${new Date().getFullYear()} Virtuální kartářka · Tomáš Čaňa · IČO 14090759</span><span>Symbolický vhled, ne odborné doporučení.</span></div>
        </div>
      </footer>`;
  }

  // Cookie banner — informativní, jen pro nezbytně nutné cookies/úložiště.
  // Pokud se v budoucnu přidá analytika/marketing, je potřeba toto rozšířit o opt-in volbu.
  (() => {
    const CONSENT_KEY = 'vk_cookie_consent_v1';
    let alreadyAccepted = false;
    try {
      alreadyAccepted = !!localStorage.getItem(CONSENT_KEY);
    } catch (_) {
      // localStorage zablokovaný — banner stejně zobrazíme, jen ho nepůjde "zapamatovat"
    }
    if (alreadyAccepted) return;

    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Informace o cookies');
    banner.innerHTML = `
      <div class="cookie-banner__inner">
        <p>Tento web používá pouze technicky nezbytné cookies a úložiště prohlížeče pro funkci objednávky a předání údajů k výkladu. <a href="/cookies.html">Více o cookies</a>.</p>
        <button class="cookie-banner__btn" type="button" data-cookie-accept>Rozumím</button>
      </div>`;
    document.body.appendChild(banner);
    banner.querySelector('[data-cookie-accept]').addEventListener('click', () => {
      try {
        localStorage.setItem(CONSENT_KEY, JSON.stringify({ accepted: true, date: new Date().toISOString() }));
      } catch (_) {}
      banner.hidden = true;
      setTimeout(() => banner.remove(), 100);
    });
  })();
})();
