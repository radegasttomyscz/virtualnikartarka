# 🔮 Virtuální kartářka – Deployment Guide

Kompletní průvodce nasazením na GitHub Pages + vlastní doménu `virtualnikartarka.cz`.

---

## 📁 Struktura souborů

```
/
├── index.html        # Hlavní landing page
├── tarot.html        # Interaktivní AI tarot
├── blog.html         # AI-powered blog
├── 404.html          # Stránka nenalezena
├── CNAME             # Vlastní doména (virtualnikartarka.cz)
├── robots.txt        # SEO
├── sitemap.xml       # SEO sitemap
└── README.md         # Tento soubor
```

---

## 🚀 Nasazení na GitHub Pages

### 1. Vytvoř GitHub repozitář

```bash
# Inicializuj git v adresáři s projektem
git init
git add .
git commit -m "🔮 Initial commit – Virtuální kartářka"
```

### 2. Vytvoř repozitář na GitHubu

Jdi na [github.com/new](https://github.com/new) a vytvoř **veřejný** repozitář (např. `virtualnikartarka`).

```bash
git remote add origin https://github.com/TVUJ_NICK/virtualnikartarka.git
git branch -M main
git push -u origin main
```

### 3. Zapni GitHub Pages

1. Jdi do repozitáře → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **main** / **/ (root)**
4. Klikni **Save**

Web bude dostupný na `https://TVUJ_NICK.github.io/virtualnikartarka/`

---

## 🌐 Vlastní doména (virtualnikartarka.cz)

### DNS nastavení u registrátora

Přidej tyto záznamy u svého DNS poskytovatele (např. Wedos, Forpsi, Cloudflare):

| Typ   | Název | Hodnota              |
|-------|-------|----------------------|
| A     | @     | 185.199.108.153      |
| A     | @     | 185.199.109.153      |
| A     | @     | 185.199.110.153      |
| A     | @     | 185.199.111.153      |
| CNAME | www   | TVUJ_NICK.github.io  |

### GitHub Pages – Custom domain

1. Settings → Pages → Custom domain
2. Zadej: `virtualnikartarka.cz`
3. Zaškrtni **Enforce HTTPS**

CNAME soubor je již připraven v repozitáři.

---

## 🔑 Anthropic API klíč

### Možnost A – Přes UI (nejjednodušší, vhodné pro testování)

Web má zabudované rozhraní pro vložení API klíče:
- Na stránce `tarot.html` klikni na ikonu ⚙️
- Vlož svůj klíč z [console.anthropic.com](https://console.anthropic.com)
- Klíč se uloží lokálně v prohlížeči

### Možnost B – Cloudflare Worker proxy (doporučeno pro produkci)

Skryje API klíč před uživateli a přidá rate limiting.

#### 1. Vytvoř Cloudflare Worker

Na [dash.cloudflare.com](https://dash.cloudflare.com) → Workers & Pages → Create Worker

```javascript
export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': 'https://virtualnikartarka.cz',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const body = await request.json();

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://virtualnikartarka.cz',
      }
    });
  }
};
```

#### 2. Nastav secret

Worker → Settings → Variables → Add variable:
- Name: `ANTHROPIC_API_KEY`
- Value: `sk-ant-...` (tvůj klíč)
- Zaškrtni **Encrypt**

#### 3. Aktualizuj URL v kódu

V `tarot.html` a `blog.html` změň URL pro API volání:
```javascript
// Z:
const response = await fetch('https://api.anthropic.com/v1/messages', ...);

// Na:
const response = await fetch('https://tvuj-worker.workers.dev', ...);
```

---

## 📊 SEO checklist

- [x] Meta description & keywords
- [x] Open Graph tagy (Facebook/WhatsApp)
- [x] Twitter Card tagy
- [x] JSON-LD structured data
- [x] sitemap.xml
- [x] robots.txt
- [x] HTTPS (GitHub Pages)
- [x] Mobile-first design
- [ ] Registrace v Google Search Console
- [ ] Registrace v Bing Webmaster Tools

### Google Search Console

1. Jdi na [search.google.com/search-console](https://search.google.com/search-console)
2. Přidej doménu `virtualnikartarka.cz`
3. Ověř vlastnictví (DNS TXT záznam)
4. Nahraj sitemap: `https://virtualnikartarka.cz/sitemap.xml`

---

## 🤖 AI Blog – automatické články

Blog (`blog.html`) je připraven pro AI generování obsahu. Každý článek se generuje při kliknutí a cachuje v localStorage.

Pro plně automatický blog (publikace bez zásahu) zvažte:
- **GitHub Actions** – scheduled workflow generující nové HTML soubory
- **Cloudflare Workers Cron** – automatické volání Anthropic API v naplánovaných časech

---

## 💡 Tipy pro provoz

- Aktualizuj `sitemap.xml` při přidávání nových stránek
- Sleduj náklady na Anthropic API v [console.anthropic.com](https://console.anthropic.com)
- Pro monitoring webu použij [Google Analytics](https://analytics.google.com) (přidej GA4 skript do `<head>`)

---

*Vytvořeno s ✨ mystickou energií*
