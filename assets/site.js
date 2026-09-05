(() => {
  const VK_UPGRADE_NOTICE_ACTIVE = false;
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
            <a class="${is('blog')}" href="/blog.html">Magazín</a>
            <a class="nav-button${is('tarot')}" href="/tarot.html">Zahájit výklad</a>
          </nav>
        </div>
      </header>`;
    if (VK_UPGRADE_NOTICE_ACTIVE && !document.querySelector('.vk-upgrade-notice')) {
      document.body.classList.add('vk-has-upgrade-notice');
      header.insertAdjacentHTML('afterend', `
        <div class="vk-upgrade-notice" role="status" aria-live="polite">
          <div class="container vk-upgrade-notice__inner">
            <span class="vk-upgrade-notice__icon" aria-hidden="true">✦</span>
            <div>
              <strong>Virtuální kartářka přechází na vylepšený režim výkladů.</strong>
              <span>Nové objednávky mohou být dočasně pozastavené. Jakmile hláška zmizí, výklady opět běží naplno.</span>
            </div>
          </div>
        </div>`);
    }

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
                <a href="mailto:info@tomys.cz">Kontakt</a>
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
          <div class="footer-small"><span>© ${new Date().getFullYear()} Virtuální kartářka</span><span>Symbolický vhled, ne odborné doporučení.</span></div>
        </div>
      </footer>`;
  }
})();
