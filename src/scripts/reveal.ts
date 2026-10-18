/**
 * reveal.ts
 * ─────────────────────────────────────────────────────────────
 * Animaciones de scroll reveal con IntersectionObserver.
 * Sin dependencias externas. Respeta prefers-reduced-motion.
 *
 * Uso en HTML/Astro:
 *   <div data-reveal="up">...</div>
 *   <div data-reveal="left" data-delay="200">...</div>
 *
 * Variantes: up | down | left | right | scale | fade
 * Delays:    100 | 200 | 300 | 400 | 500 | 600 | 700 | 800
 */

(function initReveal() {
  // Respetar preferencia de movimiento reducido
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Mostrar todo inmediatamente sin animación
    document.querySelectorAll('[data-reveal]').forEach(el => {
      el.classList.add('is-revealed');
    });
    return;
  }

  if (!('IntersectionObserver' in window)) {
    // Fallback: mostrar todo si no hay soporte
    document.querySelectorAll('[data-reveal]').forEach(el => {
      el.classList.add('is-revealed');
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  document.querySelectorAll('[data-reveal]').forEach(el => {
    observer.observe(el);
  });
})();
