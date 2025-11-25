import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import EleventyVitePlugin from "@11ty/eleventy-plugin-vite";
import tailwindcss from "@tailwindcss/vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default function(eleventyConfig) {

  // ============================================
  // VITE PLUGIN
  // ============================================
  eleventyConfig.addPlugin(EleventyVitePlugin, {
    viteOptions: {
      clearScreen: false,
      plugins: [
        tailwindcss()  // Aktiviert Tailwind v4 Oxide Engine + HMR
      ],
      resolve: {
        alias: {
          '/src': path.resolve(__dirname, 'src')
        }
      },
      server: {
        port: 8080,
        open: false
      },
      build: {
        emptyOutDir: false,
        rollupOptions: {
          output: {
            assetFileNames: 'assets/[name].[hash][extname]',
            chunkFileNames: 'assets/[name].[hash].js',
            entryFileNames: 'assets/[name].[hash].js'
          }
        }
      },
      css: {
        devSourcemap: true
      }
    }
  });

  // ============================================
  // IMAGEKIT CONFIGURATION
  // ============================================
  const IMAGEKIT_URL = process.env.IMAGEKIT_URL || "https://ik.imagekit.io/your-account";

  // Simple image shortcode
  eleventyConfig.addShortcode("img", function(src, alt, width = 800, options = "") {
    const transform = `tr:w-${width},f-auto,q-80${options ? ',' + options : ''}`;
    const url = `${IMAGEKIT_URL}/${transform}/${src}`;

    return `<img src="${url}" alt="${alt}" loading="lazy" decoding="async" class="rounded-lg">`;
  });

  // Responsive picture shortcode
  eleventyConfig.addShortcode("picture", function(src, alt, sizes = "100vw", className = "") {
    const widths = [400, 800, 1200, 1600];

    const srcset = widths
      .map(w => `${IMAGEKIT_URL}/tr:w-${w},f-auto,q-80/${src} ${w}w`)
      .join(", ");

    const defaultSrc = `${IMAGEKIT_URL}/tr:w-800,f-auto,q-80/${src}`;

    return `<img
      src="${defaultSrc}"
      srcset="${srcset}"
      sizes="${sizes}"
      alt="${alt}"
      loading="lazy"
      decoding="async"
      ${className ? `class="${className}"` : ''}
    >`;
  });

  // Background image URL helper
  eleventyConfig.addShortcode("bgimg", function(src, width = 1920) {
    return `${IMAGEKIT_URL}/tr:w-${width},f-auto,q-80/${src}`;
  });

  // Low Quality Image Placeholder (LQIP)
  eleventyConfig.addShortcode("lazyimg", function(src, alt, width = 800, className = "") {
    const placeholder = `${IMAGEKIT_URL}/tr:w-40,bl-30,q-20/${src}`;
    const full = `${IMAGEKIT_URL}/tr:w-${width},f-auto,q-80/${src}`;

    return `<img
      src="${placeholder}"
      data-src="${full}"
      alt="${alt}"
      loading="lazy"
      decoding="async"
      class="lazyload ${className}"
      onload="this.src=this.dataset.src"
    >`;
  });

  // Avatar/Profile image with face detection
  eleventyConfig.addShortcode("avatar", function(src, alt, size = 64) {
    const url = `${IMAGEKIT_URL}/tr:w-${size},h-${size},fo-face,r-max,f-auto/${src}`;
    return `<img src="${url}" alt="${alt}" width="${size}" height="${size}" loading="lazy" class="rounded-full">`;
  });

  // ============================================
  // PASSTHROUGH COPY (für statische Assets)
  // ============================================
  eleventyConfig.addPassthroughCopy({ "src/assets/images": "images" });
  eleventyConfig.addPassthroughCopy({ "src/assets/fonts": "fonts" });
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  // ============================================
  // SHORTCODES
  // ============================================
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // Icon shortcode (Lucide Icons via CDN)
  eleventyConfig.addShortcode("icon", function(name, size = 24, className = "") {
    return `<i data-lucide="${name}" class="inline-block ${className}" style="width:${size}px;height:${size}px;"></i>`;
  });

  // ============================================
  // FILTERS
  // ============================================
  eleventyConfig.addFilter("limit", (arr, limit) => arr.slice(0, limit));

  // Hash filter for cache busting
  eleventyConfig.addFilter("hash", function(content) {
    return crypto.createHash('md5').update(String(content)).digest('hex').slice(0, 8);
  });

  // Date formatting
  eleventyConfig.addFilter("date", (date, format = "de-DE") => {
    return new Date(date).toLocaleDateString(format, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  });

  // Slugify
  eleventyConfig.addFilter("slugify", (str) => {
    return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  });

  // ============================================
  // COLLECTIONS
  // ============================================
  eleventyConfig.addCollection("pages", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/pages/**/*.njk");
  });

  // ============================================
  // CONFIGURATION
  // ============================================
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
}
