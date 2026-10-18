/**
 * performance.ts
 * src/scripts/performance.ts
 * ─────────────────────────────────────────────────────────────
 * Monitorización de Web Vitals y optimizaciones de rendimiento.
 *
 * Web Vitals objetivo (Lighthouse 100):
 * - LCP  < 2.5s   (Largest Contentful Paint)
 * - FID  < 100ms  (First Input Delay)
 * - CLS  < 0.1    (Cumulative Layout Shift)
 * - INP  < 200ms  (Interaction to Next Paint)
 * - TTFB < 800ms  (Time to First Byte)
 */

// ── PREFETCH INTELIGENTE ─────────────────────────────────────
// Prefetchea páginas cuando el usuario hace hover sobre un link
(function initSmartPrefetch() {
  if (!('IntersectionObserver' in window)) return;

  const prefetched = new Set<string>();

  function prefetch(url: string) {
    if (prefetched.has(url)) return;
    if (!url.startsWith(window.location.origin)) return;

    prefetched.add(url);
    const link = document.createElement('link');
    link.rel  = 'prefetch';
    link.href = url;
    link.as   = 'document';
    document.head.appendChild(link);
  }

  // Prefetch al hacer hover en links internos
  document.addEventListener('mouseover', (e) => {
    const target = (e.target as HTMLElement).closest('a');
    if (!target) return;

    const href = target.href;
    if (!href || href.includes('#') || href.includes('mailto:') || href.includes('tel:')) return;
    if (!href.startsWith(window.location.origin)) return;

    prefetch(href);
  }, { passive: true });

  // Prefetch links visibles en viewport (para mobile)
  const navLinks = document.querySelectorAll<HTMLAnchorElement>('.header-nav__link, .admin-nav__link');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const link = entry.target as HTMLAnchorElement;
        if (link.href) prefetch(link.href);
      }
    });
  }, { rootMargin: '0px 0px 200px 0px' });

  navLinks.forEach(link => io.observe(link));
})();


// ── WEB VITALS LOGGING (desarrollo) ─────────────────────────
(function initWebVitals() {
  // Solo en desarrollo o con flag especial
  if (!import.meta.env.DEV) return;

  function logVital(name: string, value: number, rating: string) {
    const emoji = rating === 'good' ? '✅' : rating === 'needs-improvement' ? '⚠️' : '❌';
    console.log(`%c${emoji} ${name}: ${Math.round(value)}ms (${rating})`,
      `color: ${rating === 'good' ? '#27AE60' : rating === 'needs-improvement' ? '#f59e0b' : '#e74c3c'};font-weight:bold`
    );
  }

  // LCP
  if ('PerformanceObserver' in window) {
    try {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last    = entries[entries.length - 1] as any;
        const value   = last.startTime;
        const rating  = value < 2500 ? 'good' : value < 4000 ? 'needs-improvement' : 'poor';
        logVital('LCP', value, rating);
      }).observe({ type: 'largest-contentful-paint', buffered: true });

      // CLS
      let clsValue = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const e = entry as any;
          if (!e.hadRecentInput) clsValue += e.value;
        }
        const rating = clsValue < 0.1 ? 'good' : clsValue < 0.25 ? 'needs-improvement' : 'poor';
        logVital('CLS', clsValue * 1000, rating);
      }).observe({ type: 'layout-shift', buffered: true });

      // INP / FID
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const e = entry as any;
          const value  = e.processingStart - e.startTime;
          const rating = value < 100 ? 'good' : value < 300 ? 'needs-improvement' : 'poor';
          logVital('FID/INP', value, rating);
        }
      }).observe({ type: 'first-input', buffered: true });

    } catch { /* PerformanceObserver no disponible */ }
  }
})();


// ── OPTIMIZACIÓN DE IMÁGENES TARDÍAS ─────────────────────────
// Imágenes que no son lazy pero están fuera del viewport
(function initImageOptimization() {
  // Añadir decoding="async" a todas las imágenes que no tengan atributo
  document.querySelectorAll<HTMLImageElement>('img:not([decoding])').forEach(img => {
    img.decoding = 'async';
  });

  // Detectar imágenes rotas y reemplazar con placeholder
  document.querySelectorAll<HTMLImageElement>('img[src]').forEach(img => {
    img.addEventListener('error', function() {
      if (!this.dataset.fallbackSet) {
        this.dataset.fallbackSet = '1';
        this.style.opacity = '0.3';
        this.alt = this.alt || 'Imagen no disponible';
      }
    }, { once: true });
  });
})();


// ── RESOURCE HINTS DINÁMICOS ─────────────────────────────────
// Añadir preload para fuentes críticas detectadas en uso
(function initResourceHints() {
  if (!document.fonts?.ready) return;

  document.fonts.ready.then(() => {
    // Verificar que las fuentes cargaron correctamente
    const playfairLoaded = document.fonts.check('700 1rem "Playfair Display"');
    const interLoaded    = document.fonts.check('400 1rem "Inter"');

    if (import.meta.env.DEV) {
      console.log(`%c🔤 Fuentes: Playfair Display ${playfairLoaded ? '✅' : '❌'} · Inter ${interLoaded ? '✅' : '❌'}`,
        'color:#1B4F72;font-weight:bold');
    }
  });
})();
