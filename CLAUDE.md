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

## ImageKit - Direkte URLs (Empfohlen)

### Warum direkte URLs?

- **Volle Kontrolle** über Transformationen (Breite, Höhe, Qualität)
- **Einheitlich** - kein Mix aus Shortcodes und direkten URLs
- **Einfacher** - keine Shortcode-Syntax lernen

### URL-Format

```
https://ik.imagekit.io/ACCOUNT/tr:TRANSFORMATIONEN/PFAD/BILD.jpg
```

### Transformationen

| Parameter | Beschreibung | Beispiel |
|-----------|--------------|----------|
| `w-800` | Breite 800px | `tr:w-800` |
| `h-600` | Höhe 600px | `tr:h-600` |
| `f-auto` | Auto-Format (WebP/AVIF) | `tr:f-auto` |
| `q-85` | Qualität 85% | `tr:q-85` |
| `fo-face` | Face Detection Focus | `tr:fo-face` |

### Beispiele

```html
<!-- Content-Bild (800px breit) -->
<img
  src="https://ik.imagekit.io/ACCOUNT/tr:w-800,f-auto,q-85/ordner/bild.jpg"
  alt="Beschreibung"
  class="w-full h-auto"
  loading="lazy"
>

<!-- Hintergrundbild (1920px breit) -->
<div
  class="bg-cover bg-center"
  style="background-image: url('https://ik.imagekit.io/ACCOUNT/tr:w-1920,f-auto,q-80/ordner/bg.jpg')"
>

<!-- Logo mit fester Höhe -->
<img
  src="https://ik.imagekit.io/ACCOUNT/tr:h-80,f-auto,q-85/ordner/logo.png"
  alt="Logo"
  class="h-20 w-auto"
  loading="lazy"
>

<!-- Referenz-Karten (600px breit) -->
<img
  src="https://ik.imagekit.io/ACCOUNT/tr:w-600,f-auto,q-85/ordner/projekt.jpg"
  alt="Projekt"
  class="w-full h-full object-cover"
  loading="lazy"
>
```

### Empfohlene Breiten

| Verwendung | Breite | Qualität |
|------------|--------|----------|
| Hero/Background | `w-1920` | `q-80` |
| Content-Bilder | `w-800` | `q-85` |
| Karten/Thumbnails | `w-600` | `q-85` |
| Logos (Höhe) | `h-80` | `q-85` |

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
    workload_identity_provider: 'projects/PROJEKT-NUMMER/locations/global/workloadIdentityPools/github/providers/github-provider'
    service_account: 'firebase-github-deploy@PROJEKT-ID.iam.gserviceaccount.com'
    create_credentials_file: true  # Zwingend für Firebase CLI/Action
    export_environment_variables: true
    access_token_scopes: 'email, openid, https://www.googleapis.com/auth/cloud-platform, https://www.googleapis.com/auth/firebase'
```

### WICHTIG: Projekt-Nummer

**Jedes GCP-Projekt hat eine eigene Projekt-Nummer!**

Die Nummer findest du unter:
- **GCP Console → IAM & Admin → Settings → Project number**
- Oder: https://console.cloud.google.com/iam-admin/settings?project=DEIN-PROJEKT

**Beispiel:**
- Projekt `websitemeinkraftwerk` → Nummer `754482953970`
- Projekt `websiteeinfachnachhilfe` → Nummer `279653166750`

### Attribute Condition (GCP)

Im Workload Identity Provider muss die Condition das GitHub-Repo erlauben:

```
assertion.repository == "USERNAME/REPO-NAME"
```

Oder für alle Repos eines Users:
```
assertion.repository.startsWith("USERNAME/")
```

**Einstellungen in GCP Console:**
1. IAM & Admin → Workload Identity Federation
2. Pool `github` auswählen
3. Provider `github-provider` bearbeiten
4. Attribute Condition anpassen

### Deployment Methoden

- **Merge (Main):** Nutzt `firebase-tools` (CLI) direkt, da dies robuster mit WIF ist.
- **Pull Request:** Nutzt `FirebaseExtended/action-hosting-deploy` für Preview-URLs (benötigt das JSON aus `steps.auth.outputs.credentials_json`).

### IAM Rollen für Service Account

Der Service Account (`firebase-github-deploy@PROJEKT-ID.iam.gserviceaccount.com`) benötigt folgende Rollen:

#### Nur Hosting (Minimum)

| Rolle | Beschreibung |
|-------|--------------|
| Firebase Hosting-Administrator | Deploy zu Firebase Hosting |

#### Mit Cloud Functions (Gen 2)

| Rolle | Beschreibung |
|-------|--------------|
| Firebase Hosting-Administrator | Deploy zu Firebase Hosting |
| Cloud Functions-Admin | Deploy von Cloud Functions |
| Cloud Run Administrator | Gen 2 Functions laufen auf Cloud Run |
| Dienstkontonutzer (Service Account User) | Erlaubt Impersonation des App Engine SA |
| Firebase Extensions Viewer | Lesen von Extensions (wird bei Functions geprüft) |
| Service Account Token Creator | Erstellen von Auth-Tokens für APIs |

**Rollen hinzufügen:**
1. GCP Console → IAM & Admin → IAM
2. Service Account finden → Bearbeiten
3. Rollen hinzufügen → Speichern

---

## Firebase Cloud Functions (Optional)

### Gen 2 Functions Setup

Cloud Functions Gen 2 laufen auf Cloud Run und bieten bessere Performance.

#### Projektstruktur mit Functions

```text
project-root/
├── functions/                    # Cloud Functions
│   ├── index.js                  # Function Definitionen
│   ├── package.json              # Dependencies
│   └── .eslintrc.js              # Linting
├── src/                          # Website Source
└── ...
```

#### Beispiel Gen 2 Function

```javascript
// functions/index.js
const { onRequest } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');

// Secrets aus Google Secret Manager
const apiKey = defineSecret('API_KEY');

exports.myFunction = onRequest(
  {
    region: 'europe-west1',
    cors: true,
    secrets: ['API_KEY']
  },
  async (request, response) => {
    const key = apiKey.value();
    // ... Function Logic
    response.json({ success: true });
  }
);
```

#### Workflow für Hosting + Functions

```yaml
# .github/workflows/firebase-hosting-merge.yml
- name: Install Functions dependencies
  run: |
    cd functions
    npm ci
    cd ..

- name: Deploy Hosting
  run: firebase deploy --only hosting --project PROJEKT-ID

- name: Deploy Functions
  run: firebase deploy --only functions --project PROJEKT-ID --force
```

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

---

## Troubleshooting

### "The given credential is rejected by the attribute condition"

**Ursache:** Die Attribute Condition im GCP Workload Identity Provider erlaubt das GitHub-Repo nicht.

**Lösung:**
1. GCP Console → IAM & Admin → Workload Identity Federation
2. Pool `github` → Provider `github-provider` bearbeiten
3. Attribute Condition anpassen:
   ```
   assertion.repository == "USERNAME/REPO-NAME"
   ```
   Oder für alle Repos:
   ```
   assertion.repository.startsWith("USERNAME/")
   ```

### Falsche GCP Projekt-Nummer

**Symptom:** Auth schlägt fehl, obwohl alles korrekt aussieht.

**Ursache:** Die `workload_identity_provider` URL zeigt auf ein anderes GCP-Projekt.

**Lösung:**
1. Projekt-Nummer in GCP Console prüfen (IAM → Settings)
2. In `.github/workflows/*.yml` die richtige Nummer eintragen:
   ```yaml
   workload_identity_provider: 'projects/RICHTIGE-NUMMER/locations/global/...'
   ```

### "Input required: firebaseServiceAccount" in GitHub Actions

**Lösung:** Checken, ob `create_credentials_file: true` im Auth-Step gesetzt ist.

### "Failed to authenticate" / "Scopes required"

**Lösung:** `access_token_scopes` im Auth-Step prüfen (muss `.../auth/firebase` enthalten).

### Tailwind Styles fehlen

**Lösung:** Prüfen, ob `npm run dev` läuft (Vite kompiliert CSS on-the-fly). `main.css` muss `@import "tailwindcss";` enthalten.

### "Missing permissions required for functions deploy"

**Ursache:** Service Account fehlt `iam.serviceAccounts.ActAs` Berechtigung.

**Lösung:** Rolle **"Dienstkontonutzer"** (Service Account User) zum Service Account hinzufügen.

### "HTTP Error: 403, The caller does not have permission" (Extensions)

**Ursache:** Service Account kann Firebase Extensions nicht lesen.

**Lösung:** Rolle **"Firebase Extensions Viewer"** (oder "Firebase Extensions Publisher – Extensions Viewer (Beta)") hinzufügen.

### "401 UNAUTHENTICATED" / "CREDENTIALS_MISSING"

**Ursache:** WIF-Token kann nicht für API-Calls generiert werden.

**Lösung:** Rolle **"Service Account Token Creator"** zum Service Account hinzufügen.

### Functions Deploy schlägt fehl (Gen 2)

**Ursache:** Gen 2 Functions laufen auf Cloud Run, fehlende Berechtigungen.

**Lösung:** Rolle **"Cloud Run Administrator"** hinzufügen.

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

---

## Cookiebot Integration

### Setup

1. **Cookiebot Account erstellen:** [cookiebot.com](https://www.cookiebot.com/)
2. **Domain hinzufügen** und Cookiebot-ID (CBID) erhalten
3. **CBID in `base.njk` eintragen:**

```html
<script id="Cookiebot" src="https://consent.cookiebot.com/uc.js"
        data-cbid="DEINE-COOKIEBOT-ID-HIER"
        data-blockingmode="auto"
        type="text/javascript"></script>
```

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
