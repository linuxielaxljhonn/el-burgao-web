// astro.config.mjs
// ─────────────────────────────────────────────────────────────
// El Burgao — Configuración Astro 4 — web informativa (v3)
// ─────────────────────────────────────────────────────────────

import { defineConfig } from 'astro/config';

export default defineConfig({

  // URL canónica del sitio (usada por sitemap y OG tags)
  site: 'https://el-burgao.pages.dev',

  // Generación estática por defecto (0 JS salvo islas interactivas)
  output: 'static',

  // Configuración de Vite (bundler interno)
  vite: {
    build: {
      // Dividir vendor chunk para mejor caché del navegador
      // Reducir tamaño del build
      cssCodeSplit:  true,
      sourcemap:     false,
      // Inline assets pequeños (< 4kb) directamente en el HTML
      assetsInlineLimit: 4096,
    },

    // Optimizaciones de CSS
    css: {
      devSourcemap: true,
    },

  },

  // Markdown — para los artículos de Content Collections
  markdown: {
    shikiConfig: {
      theme:     'github-dark',
      wrap:      true,
    },
    // Añadir clases a elementos de markdown para estilar
    remarkPlugins: [],
    rehypePlugins: [],
  },

  // Compresión de HTML en build
  compressHTML: true,

  // Configuración del servidor de desarrollo
  server: {
    port: 4321,
    open: false,
  },

  // Configuración del preview
  preview: {
    port: 4322,
  },

});
