# CLAUDE.md - Sample Website Template

> Template für Firebase + Eleventy + Tailwind v4 Projekte

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
- **GitHub Actions** - CI/CD Pipeline mit Workload Identity Federation

### Build Tools
- **Node.js** v20+

---

## Projektstruktur

```text
project-root/
├── .github/
│   └── workflows/
│       ├── firebase-hosting-merge.yml        # CI/CD: Deploy on push (Main)
│       └── firebase-hosting-pull-request.yml # CI/CD: Preview on PR
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

  /* Breakpoints */
  --breakpoint-xs: 475px;
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

### ImageKit Setup

URL in `src/_data/site.json` eintragen:

```json
"imagekit": {
  "url": "https://ik.imagekit.io/DEIN-ACCOUNT"
}
```

---

## Befehle

```bash
# Development (Vite Dev Server mit HMR)
npm run dev              # Startet auf http://localhost:8080

# Build
npm run build            # Production Build nach _site/

# Deployment
firebase deploy          # Manuelles Deploy (nur wenn eingeloggt)

# Clean
npm run clean            # Löscht _site/ und .vite/ Ordner
```

---

## GitHub Actions & CI/CD (Workload Identity)

### Architektur

Das Projekt nutzt **Workload Identity Federation (WIF)**. Es werden **keine langlebigen JSON-Keys** in GitHub Secrets gespeichert!

### Workflow Konfiguration (Critical!)

Damit Firebase und Google Cloud Auth zusammenspielen, müssen in den YAML-Dateien folgende Parameter **zwingend** gesetzt sein:

1. **Permissions:** `id-token: write`
2. **Google Auth Action:** Muss `create_credentials_file: true` und `export_environment_variables: true` haben.
3. **Scopes:** `access_token_scopes` müssen explizit für Firebase gesetzt werden.

```yaml
# Snippet für .github/workflows/*.yml
- id: 'auth'
  uses: 'google-github-actions/auth@v2'
  with:
    workload_identity_provider: 'projects/NUMMER/locations/global/workloadIdentityPools/POOL/providers/PROVIDER'
    service_account: 'EMAIL@PROJECT.iam.gserviceaccount.com'
    create_credentials_file: true  # Zwingend für Firebase CLI/Action
    export_environment_variables: true
    access_token_scopes: 'email, openid, https://www.googleapis.com/auth/cloud-platform, https://www.googleapis.com/auth/firebase'
```

### Deployment Methoden

- **Merge (Main):** Nutzt `firebase-tools` (CLI) direkt, da dies robuster mit WIF ist.
- **Pull Request:** Nutzt `FirebaseExtended/action-hosting-deploy` für Preview-URLs (benötigt das JSON aus `steps.auth.outputs.credentials_json`).

---

## Vite Integration

### Konfiguration

Die Integration läuft über `@11ty/eleventy-plugin-vite` in `.eleventy.js`.

```javascript
eleventyConfig.addPlugin(EleventyVitePlugin, {
  viteOptions: {
    plugins: [tailwindcss()],  // Tailwind v4 Plugin
    server: { port: 8080 },
    build: { emptyOutDir: false }
  }
});
```

---

## Konventionen

### Dateinamen & Struktur

- **Seiten:** `kebab-case.njk`
- **Components:** `kebab-case.njk` (in `_includes/components/`)
- **Bilder:** `kebab-case.jpg` (in ImageKit & lokal)

### JavaScript (Alpine.js)

- Alpine.js wird für Interaktivität genutzt (Mobile Menu, Modals).
- **Icons:** Lucide Icons via `data-lucide="..."`. `lucide.createIcons()` Aufruf beachten.

---

## Performance

- **Preconnect:** ImageKit & Google Fonts in `base.njk`.
- **Caching:** Firebase Hosting Headers sind konfiguriert (HTML no-cache, Assets 1 Jahr).

### Minification

| Asset | Tool | Automatisch |
|-------|------|-------------|
| **CSS** | Vite (esbuild) | Ja, bei `npm run build` |
| **JavaScript** | Vite (esbuild) | Ja, bei `npm run build` |
| **HTML** | html-minifier-terser | Ja, via Eleventy Transform |

#### HTML-Minification

Konfiguriert in `.eleventy.js` als Transform:

```javascript
import htmlmin from "html-minifier-terser";

eleventyConfig.addTransform("htmlmin", async function (content, outputPath) {
  if (outputPath && outputPath.endsWith(".html")) {
    let minified = await htmlmin.minify(content, {
      useShortDoctype: true,
      removeComments: true,
      collapseWhitespace: true,
      minifyCSS: true,   // Minifiziert inline <style>
      minifyJS: true     // Minifiziert inline <script>
    });
    return minified;
  }
  return content;
});
```

**Testen:** Nach `npm run build` eine `.html` Datei in `_site/` öffnen - Code sollte komprimiert sein.

---

## Troubleshooting

### "Input required: firebaseServiceAccount" in GitHub Actions

**Lösung:** Checken, ob `create_credentials_file: true` im Auth-Step gesetzt ist.

### "Failed to authenticate" / "Scopes required"

**Lösung:** `access_token_scopes` im Auth-Step prüfen (muss `.../auth/firebase` enthalten).

### Tailwind Styles fehlen

**Lösung:** Prüfen, ob `npm run dev` läuft (Vite kompiliert CSS on-the-fly). `main.css` muss `@import "tailwindcss";` enthalten.

---

## Google Tag Manager (GTM)

### Setup

1. **GTM Account erstellen:** [tagmanager.google.com](https://tagmanager.google.com/)
2. **Container erstellen** und GTM-ID erhalten (Format: `GTM-XXXXXXXX`)
3. **GTM-ID in `base.njk` ersetzen** (an 2 Stellen!)

### Integration

GTM wird in `src/_includes/layouts/base.njk` an zwei Stellen eingebunden:

**1. Im `<head>` (direkt nach öffnendem Tag):**

```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXXX');</script>
<!-- End Google Tag Manager -->
```

**2. Im `<body>` (direkt nach öffnendem Tag):**

```html
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXXX"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
```

### Platzhalter ersetzen

Ersetze `GTM-XXXXXXXX` mit deiner echten GTM-ID an beiden Stellen in `base.njk`.

---

## Cookiebot Integration

### Setup

1. **Cookiebot Account erstellen:** [cookiebot.com](https://www.cookiebot.com/)
2. **Domain hinzufügen** und Cookiebot-ID (CBID) erhalten
3. **CBID in `base.njk` eintragen:**

```html
<!-- src/_includes/layouts/base.njk -->
<script id="Cookiebot" src="https://consent.cookiebot.com/uc.js"
        data-cbid="DEINE-COOKIEBOT-ID-HIER"
        data-blockingmode="auto"
        type="text/javascript"></script>
```

### Dateien

| Datei | Beschreibung |
|-------|-------------|
| `src/_includes/layouts/base.njk` | Cookiebot Script (vor `</body>`) |
| `src/_includes/components/footer.njk` | "Cookie-Einstellungen" Button |
| `src/assets/css/main.css` | Cookiebot CSS-Anpassungen |

### Cookie-Einstellungen Button

Der Button im Footer öffnet den Cookiebot-Dialog:

```html
<button type="button" onclick="Cookiebot.show()">
  Cookie-Einstellungen
</button>
```

### CSS-Anpassungen

Die Cookiebot-Styles sind in `main.css` am Ende definiert und nutzen die Theme-Farben:

- **Primary Button ("Alle zulassen"):** `--color-primary`
- **Secondary Button ("Auswahl erlauben"):** `--color-secondary`
- **Ablehnen Button:** `--color-gray-500`
- **Toggle Switches:** `--color-primary`
- **Links:** `--color-primary`

### Farben anpassen

Die Cookiebot-Styles nutzen automatisch die CSS-Variablen aus `@theme`.
Bei Farbänderungen in `@theme` werden die Cookiebot-Buttons automatisch angepasst.
