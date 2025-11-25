# CLAUDE.md - Project Stack Definition

> Diese Datei dient als Referenz für Claude Code und Entwickler.

## Tech Stack

### Static Site Generator
- **Eleventy (11ty)** v3.x - Static Site Generator
- **Nunjucks (.njk)** - Template Engine

### Build Tool
- **Vite** v6.x - Blitzschneller Dev Server mit HMR
- **eleventy-plugin-vite** - Eleventy + Vite Integration
- **@tailwindcss/vite** - Native Tailwind v4 Oxide Engine

### Frontend
- **Tailwind CSS v4** - CSS-first Configuration (kein tailwind.config.js)
- **Alpine.js** v3.x - Lightweight JavaScript Framework
- **Lucide Icons** - Icon Library

### Image Optimization
- **ImageKit.io** - Cloud-based Image CDN
- On-the-fly Transformations (Resize, Format, Quality)
- Auto WebP/AVIF Conversion

### Hosting & Deployment
- **Firebase Hosting** - Static Hosting mit CDN
- **Firebase Cloud Functions** (optional) - Serverless Backend

### Build Tools
- **Node.js** v20+

---

## Projektstruktur

```
project-root/
├── src/                          # Source Code (11ty Input)
│   ├── _data/                    # Globale Daten (JSON)
│   │   └── site.json             # Website-Konfiguration + ImageKit
│   ├── _includes/                # Templates & Components
│   │   ├── layouts/
│   │   │   └── base.njk          # Base Layout
│   │   └── components/
│   │       ├── header.njk        # Header mit Alpine.js
│   │       ├── footer.njk        # Footer
│   │       └── head-meta.njk     # Meta Tags + Schema.org
│   ├── pages/                    # Seiten-Content
│   │   └── index.njk
│   └── assets/
│       ├── css/
│       │   └── main.css          # Tailwind v4 Entry Point
│       ├── js/
│       │   └── main.js
│       ├── images/               # Lokale Images (Fallback)
│       └── fonts/                # Custom Fonts
│
├── _site/                        # Build Output (Vite Output)
│
├── .eleventy.js                  # Eleventy + Vite + ImageKit Config
├── firebase.json                 # Firebase Hosting Config
├── .firebaserc                   # Firebase Project Config
├── package.json
└── CLAUDE.md                     # Diese Datei
```

---

## Tailwind CSS v4 - Wichtige Änderungen

### Keine tailwind.config.js mehr!

Alle Konfigurationen erfolgen direkt in CSS:

```css
/* src/assets/css/main.css */
@import "tailwindcss";

@theme {
  --color-primary: #3b82f6;
  --color-primary-dark: #2563eb;
  --font-family-sans: "Inter", system-ui, sans-serif;
}
```

### Neue Syntax

| Tailwind v3 | Tailwind v4 |
|-------------|-------------|
| `tailwind.config.js` | `@theme { }` in CSS |
| `extend: { colors }` | `--color-*` Custom Properties |
| `@apply` | Weiterhin verfügbar |
| `theme()` | `var(--*)` |

---

## ImageKit Shortcodes

### Verfügbare Shortcodes

```njk
{# Einfaches Bild #}
{% img "foto.jpg", "Alt Text", 800 %}

{# Responsive Picture #}
{% picture "foto.jpg", "Alt Text", "(max-width: 768px) 100vw, 50vw" %}

{# Avatar mit Face Detection #}
{% avatar "person.jpg", "Name", 64 %}

{# Lazy Load mit Blur Placeholder #}
{% lazyimg "foto.jpg", "Alt Text", 1200 %}

{# Background Image URL #}
<div style="background-image: url('{% bgimg "bg.jpg", 1920 %}')">
```

### ImageKit URL-Parameter

| Parameter | Beschreibung | Beispiel |
|-----------|--------------|----------|
| `w-800` | Breite | 800px |
| `h-600` | Höhe | 600px |
| `f-auto` | Auto Format | WebP/AVIF |
| `q-80` | Qualität | 80% |
| `fo-face` | Face Focus | Gesichtserkennung |
| `fo-auto` | Auto Focus | Smart Crop |
| `bl-10` | Blur | Stärke 10 |
| `r-max` | Border Radius | Rund |

### ImageKit Setup

1. Account erstellen: https://imagekit.io
2. URL in `src/_data/site.json` eintragen:
```json
"imagekit": {
  "url": "https://ik.imagekit.io/DEIN-ACCOUNT"
}
```
3. Bilder hochladen ins ImageKit Media Library

---

## Befehle

```bash
# Development (Vite Dev Server mit HMR)
npm run dev              # Startet auf http://localhost:8080

# Build
npm run build            # Production Build nach _site/

# Deployment
firebase deploy          # Deploy zu Firebase Hosting

# Clean
npm run clean            # Löscht _site/ und .vite/ Ordner
```

---

## Vite Integration

### Vorteile
- **Instant HMR** - CSS/JS Änderungen ohne Page Reload
- **Schneller Dev Server** - Kein Warten auf Rebuilds
- **Automatisches Bundling** - JS/CSS wird optimiert
- **Asset Hashing** - Automatische Cache-Busting Dateinamen

### Wie es funktioniert
```
npm run dev
    │
    ▼
┌──────────────┐
│   Eleventy   │  → Kompiliert .njk → HTML
└──────────────┘
        │
        ▼
┌──────────────┐
│    Vite      │  → Served HTML + HMR für CSS/JS
└──────────────┘
        │
        ▼
   localhost:8080
```

### Vite Config Referenz
```javascript
// .eleventy.js - Tailwind v4 + Vite Setup
import tailwindcss from "@tailwindcss/vite";
import EleventyVitePlugin from "@11ty/eleventy-plugin-vite";

eleventyConfig.addPlugin(EleventyVitePlugin, {
  viteOptions: {
    plugins: [tailwindcss()],  // Oxide Engine aktivieren!
    server: { port: 8080 },
    build: { emptyOutDir: false }
  }
});
```

### Assets einbinden
```html
<!-- CSS via Vite (in base.njk) - Link-Tag für optimales Laden -->
<link rel="stylesheet" href="/assets/css/main.css">

<!-- JS als ES Module -->
<script type="module" src="/assets/js/main.js"></script>
```

---

## Konventionen

### Dateinamen
- Seiten: `kebab-case.njk` (z.B. `ueber-uns.njk`)
- Components: `kebab-case.njk` (z.B. `service-card.njk`)
- Bilder auf ImageKit: `kebab-case.jpg`

### Nunjucks Templates
- Layouts erweitern `base.njk`
- Components werden mit `{% include %}` eingebunden
- Daten aus `_data/` sind global verfügbar

### CSS (Tailwind v4)
- Tailwind Utility Classes bevorzugen
- Custom Styles in `@layer components { }`
- Farben in `@theme { }` definieren
- Custom Properties verwenden: `var(--color-primary)`

### JavaScript
- Alpine.js für DOM-Interaktionen
- `x-data`, `x-show`, `x-on:click` für Komponenten
- Lucide Icons mit `data-lucide="icon-name"`
- **Wichtig:** `lucide.createIcons()` muss nach DOMContentLoaded aufgerufen werden

---

## Performance Optimierungen

### Bilder (ImageKit)
- Automatische WebP/AVIF Konvertierung
- Responsive srcset
- Lazy Loading
- Face Detection für Avatare

### CSS
- Tailwind v4 ist ~50% schneller als v3
- Automatisches Purging
- CSS Custom Properties

### HTML
- Minification in Production
- Asset Hashing für Cache Busting

### Caching (Firebase)
| Asset Type | Cache Duration |
|------------|----------------|
| HTML | no-cache |
| CSS/JS | 1 Jahr |
| Images | 1 Jahr |
| Fonts | 1 Jahr |

### Preconnects
```html
<link rel="preconnect" href="https://ik.imagekit.io">
<link rel="preconnect" href="https://fonts.googleapis.com">
```

---

## Security Headers

Die folgenden Security Headers sind in `firebase.json` konfiguriert:

| Header | Wert |
|--------|------|
| X-Content-Type-Options | nosniff |
| X-Frame-Options | DENY |
| X-XSS-Protection | 1; mode=block |
| Referrer-Policy | strict-origin-when-cross-origin |
| Permissions-Policy | geolocation=(), microphone=() |

---

## SEO Features

- Meta Tags Component (`head-meta.njk`)
- Open Graph Images via ImageKit
- Schema.org Organization Markup
- Canonical URLs
- Sitemap (`sitemap.njk`)
- robots.txt

---

## Komponenten

### Button Classes
```html
<a class="btn btn-primary">Primary</a>
<a class="btn btn-secondary">Secondary</a>
<a class="btn btn-outline">Outline</a>
<a class="btn btn-ghost">Ghost</a>
```

### Card
```html
<div class="card">
  <h3>Title</h3>
  <p>Content</p>
</div>
```

### Section
```html
<section class="section">
  <div class="container">
    <!-- Content -->
  </div>
</section>
```

### Input
```html
<input type="text" class="input" placeholder="...">
```

---

## Ports

| Service | Port |
|---------|------|
| Eleventy Dev Server | 8080 |
| Firebase Emulator Hosting | 5000 |

---

## Troubleshooting

### Tailwind-Klassen werden nicht angewendet
- Prüfe dass `src/assets/css/main.css` die richtige Syntax hat
- Prüfe ob der Vite Dev Server läuft (`npm run dev`) - kein manueller CSS-Build nötig
- Prüfe Browser DevTools Console auf Fehler

### Eleventy findet Template nicht
- Prüfe `_includes` Pfad (relativ zu src/)
- Prüfe Dateiendung (.njk)

### ImageKit Bilder laden nicht
- Prüfe ImageKit URL in `site.json`
- Prüfe ob Bild in ImageKit hochgeladen wurde

### Firebase Deploy schlägt fehl
- Prüfe `firebase login` Status
- Prüfe `.firebaserc` Projekt-ID

---

## Externe Integrationen (optional)

- **Google Analytics / Tag Manager** - Tracking
- **Cookiebot** - Cookie Consent
- **FormSystem** - Formulare (extern)
- **HubSpot** - Meeting Scheduling
