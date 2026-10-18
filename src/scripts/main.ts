/**
 * main.ts
 * ─────────────────────────────────────────────────────────────
 * Scripts globales de El Burgao.
 * Se carga en todas las páginas desde BaseLayout.astro.
 * Responsabilidades: back-to-top, toast system, utils globales.
 */

'use strict';

// ── BACK TO TOP ───────────────────────────────────────────────
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  btn.removeAttribute('hidden');

  const toggle = () => btn.classList.toggle('visible', window.scrollY > 500);
  window.addEventListener('scroll', toggle, { passive: true });
  toggle();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


// ── TOAST SYSTEM ─────────────────────────────────────────────
interface ToastOptions {
  message: string;
  type?: 'success' | 'error' | 'accent' | 'default';
  duration?: number;
}

function showToast({ message, type = 'default', duration = 3500 }: ToastOptions) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast${type !== 'default' ? ` toast--${type}` : ''}`;
  toast.setAttribute('role', 'status');
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'fade-in 0.3s reverse forwards';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Exponer globalmente para uso desde otros módulos
(window as any).showToast = showToast;


// ── SMOOTH ANCHOR SCROLL ──────────────────────────────────────
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = (anchor as HTMLAnchorElement).getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const headerH = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--header-h')) || 72;

      const top = (target as HTMLElement).offsetTop - headerH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


// ── LAZY IMAGES (sin JS externo) ─────────────────────────────
(function initLazyImages() {
  if (!('IntersectionObserver' in window)) return;

  const images = document.querySelectorAll<HTMLImageElement>('img[data-src]');
  if (!images.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const img = entry.target as HTMLImageElement;
      img.src = img.dataset.src!;
      if (img.dataset.srcset) img.srcset = img.dataset.srcset;
      img.removeAttribute('data-src');
      img.removeAttribute('data-srcset');
      observer.unobserve(img);
    });
  }, { rootMargin: '200px 0px' });

  images.forEach(img => observer.observe(img));
})();


// ── EXTERNAL LINKS (seguridad) ───────────────────────────────
(function initExternalLinks() {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="http"]').forEach(a => {
    if (a.hostname !== window.location.hostname) {
      a.setAttribute('rel', 'noopener noreferrer');
      if (!a.hasAttribute('target')) {
        a.setAttribute('target', '_blank');
      }
    }
  });
})();


// ── COUNTER ANIMATION ────────────────────────────────────────
function animateCounter(el: HTMLElement, target: number, duration = 1800) {
  const start = performance.now();
  const startVal = 0;

  function ease(t: number): number {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  function step(now: number) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const current = Math.round(startVal + (target - startVal) * ease(progress));
    el.textContent = current.toLocaleString('es-ES');
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

// Activar contadores cuando son visibles
(function initCounters() {
  const counters = document.querySelectorAll<HTMLElement>('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target as HTMLElement;
      const target = parseInt(el.dataset.counter || '0', 10);
      animateCounter(el, target);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();


// Sin banner de cookies: la web no usa cookies de seguimiento (ver /cookies).

