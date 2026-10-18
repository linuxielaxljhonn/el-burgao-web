/**
 * search.ts
 * ─────────────────────────────────────────────────────────────
 * Motor de búsqueda global de El Burgao.
 * Migrado y mejorado desde search.js de v1.
 *
 * Arquitectura:
 * - Índice construido en build (JSON estático)
 * - Búsqueda en cliente sin servidor
 * - Resultados con highlight del término buscado
 * - Accesible con teclado (↑↓ Enter Escape)
 */

interface SearchItem {
  type:    'noticia' | 'evento' | 'ruta' | 'pagina';
  title:   string;
  excerpt: string;
  url:     string;
  emoji:   string;
  date?:   string;
  tags?:   string[];
}

// El índice se genera en build y se sirve como JSON estático
let searchIndex: SearchItem[] = [];
let indexLoaded = false;

async function loadIndex(): Promise<void> {
  if (indexLoaded) return;
  try {
    const res = await fetch('/search-index.json');
    if (res.ok) {
      searchIndex = await res.json();
      indexLoaded = true;
    }
  } catch {
    console.warn('[Search] No se pudo cargar el índice de búsqueda');
    // Fallback con datos mínimos hardcodeados
    searchIndex = [
      { type: 'pagina', title: 'Inicio',    excerpt: 'Asociación de autocaravanistas de Canarias',         url: '/',          emoji: '🏠' },
      { type: 'pagina', title: 'Rutas',     excerpt: 'Rutas recomendadas por las Islas Canarias',          url: '/rutas',     emoji: '🗺️' },
      { type: 'pagina', title: 'Contacto',  excerpt: 'Contacta con la asociación El Burgao',               url: '/contacto',  emoji: '📬' },
      { type: 'pagina', title: 'Hazte socio', excerpt: 'Cuotas, ventajas y solicitud de alta', url: '/hazte-socio', emoji: '✋' },
    ];
    indexLoaded = true;
  }
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quitar acentos
    .trim();
}

function highlight(text: string, query: string): string {
  if (!query) return text;
  const normalized = normalizeText(query);
  const words = normalized.split(/\s+/).filter(Boolean);

  let result = text;
  words.forEach(word => {
    const regex = new RegExp(`(${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    result = result.replace(regex, '<mark>$1</mark>');
  });
  return result;
}

function searchItems(query: string): SearchItem[] {
  if (!query || query.length < 2) return [];

  const normalized = normalizeText(query);
  const words = normalized.split(/\s+/).filter(Boolean);

  return searchIndex
    .map(item => {
      const searchable = normalizeText(
        `${item.title} ${item.excerpt} ${(item.tags || []).join(' ')}`
      );

      // Puntuación: más puntos si coincide en título
      let score = 0;
      const titleNorm = normalizeText(item.title);

      words.forEach(word => {
        if (titleNorm.includes(word))   score += 10;
        if (searchable.includes(word))  score += 1;
      });

      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(({ item }) => item);
}

function renderResults(results: SearchItem[], query: string, container: HTMLElement): void {
  if (!results.length) {
    container.innerHTML = `
      <div class="search-empty">
        <span aria-hidden="true">🔍</span>
        <span>Sin resultados para "<strong>${query}</strong>"</span>
      </div>
    `;
    return;
  }

  container.innerHTML = results.map((item, i) => `
    <a
      href="${item.url}"
      class="search-result"
      role="option"
      aria-selected="false"
      data-index="${i}"
    >
      <span class="search-result__icon" aria-hidden="true">${item.emoji}</span>
      <div class="search-result__body">
        <div class="search-result__title">${highlight(item.title, query)}</div>
        <div class="search-result__excerpt">${highlight(item.excerpt.slice(0, 100), query)}…</div>
      </div>
      <span class="search-result__type">${item.type}</span>
    </a>
  `).join('');

  // Estilos de los resultados (solo una vez)
  if (!document.getElementById('searchResultStyles')) {
    const style = document.createElement('style');
    style.id = 'searchResultStyles';
    style.textContent = `
      .search-result {
        display: flex;
        align-items: center;
        gap: var(--space-4);
        padding: var(--space-3) var(--space-4);
        border-radius: var(--radius-md);
        text-decoration: none;
        color: rgba(255,255,255,0.85);
        background: rgba(255,255,255,0.04);
        border: 1px solid transparent;
        transition: all var(--duration-fast);
      }
      .search-result:hover,
      .search-result[aria-selected="true"] {
        background: rgba(255,255,255,0.1);
        border-color: rgba(201,169,110,0.3);
        color: white;
      }
      .search-result__icon { font-size: 1.4rem; flex-shrink: 0; }
      .search-result__body { flex: 1; min-width: 0; }
      .search-result__title {
        font-weight: var(--weight-semibold);
        font-size: var(--text-sm);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .search-result__title mark {
        background: rgba(201,169,110,0.3);
        color: var(--color-accent-light);
        border-radius: 2px;
        padding: 0 2px;
      }
      .search-result__excerpt {
        font-size: var(--text-xs);
        color: rgba(255,255,255,0.5);
        margin-top: 2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .search-result__excerpt mark {
        background: transparent;
        color: rgba(255,255,255,0.75);
        font-weight: 600;
      }
      .search-result__type {
        font-size: var(--text-2xs);
        letter-spacing: var(--tracking-widest);
        text-transform: uppercase;
        color: rgba(255,255,255,0.35);
        flex-shrink: 0;
      }
      .search-empty {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        padding: var(--space-5);
        color: rgba(255,255,255,0.45);
        font-size: var(--text-sm);
      }
    `;
    document.head.appendChild(style);
  }
}

// ── Inicialización ───────────────────────────────────────────
(function initSearch() {
  const resultsContainer = document.getElementById('searchResults') as HTMLElement;
  const searchInput      = document.getElementById('searchInput') as HTMLInputElement;
  if (!resultsContainer || !searchInput) return;

  // Precargar índice cuando el usuario hace hover en el buscador
  document.getElementById('searchToggle')?.addEventListener('mouseenter', loadIndex, { once: true });

  // Escuchar evento global del Header
  document.addEventListener('burgao:search', async (e: Event) => {
    const { query } = (e as CustomEvent).detail;

    if (!query || query.length < 2) {
      resultsContainer.innerHTML = '';
      return;
    }

    await loadIndex();
    const results = searchItems(query);
    renderResults(results, query, resultsContainer);

    // Actualizar ARIA
    const links = resultsContainer.querySelectorAll<HTMLElement>('.search-result');
    let activeIndex = -1;

    // Navegación con teclado
    searchInput.addEventListener('keydown', (e: KeyboardEvent) => {
      if (!links.length) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        links[activeIndex]?.setAttribute('aria-selected', 'false');
        activeIndex = Math.min(activeIndex + 1, links.length - 1);
        links[activeIndex].setAttribute('aria-selected', 'true');
        links[activeIndex].scrollIntoView({ block: 'nearest' });
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        links[activeIndex]?.setAttribute('aria-selected', 'false');
        activeIndex = Math.max(activeIndex - 1, 0);
        links[activeIndex].setAttribute('aria-selected', 'true');
        links[activeIndex].scrollIntoView({ block: 'nearest' });
      }

      if (e.key === 'Enter' && activeIndex >= 0) {
        e.preventDefault();
        (links[activeIndex] as HTMLAnchorElement).click();
      }
    });
  });
})();
