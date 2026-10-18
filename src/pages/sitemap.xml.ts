/**
 * sitemap.xml.ts
 * ─────────────────────────────────────────────────────────────
 * Sitemap dinámico generado en build.
 * Incluye todas las páginas estáticas + URLs de content collections.
 * Se actualiza automáticamente al añadir noticias, eventos o rutas.
 */

import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const SITE = 'https://elburgao.org';

function url(path: string, lastmod: string, priority = '0.8', changefreq = 'monthly') {
  return `
  <url>
    <loc>${SITE}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export const GET: APIRoute = async () => {
  const now = new Date().toISOString().split('T')[0];

  const noticias = await getCollection('noticias', ({ data }) => !data.draft);
  const eventos  = await getCollection('eventos',  ({ data }) => !data.draft);
  const rutas    = await getCollection('rutas',    ({ data }) => !data.draft);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <!-- Páginas principales -->
  ${url('/', now, '1.0', 'weekly')}
  ${url('/noticias', now, '0.9', 'weekly')}
  ${url('/eventos',  now, '0.9', 'weekly')}
  ${url('/rutas',    now, '0.8', 'monthly')}
  ${url('/contacto', now, '0.6', 'yearly')}
  ${url('/la-asociacion', now, '0.7', 'yearly')}
  ${url('/hazte-socio',   now, '0.8', 'yearly')}
  ${url('/galeria',       now, '0.5', 'monthly')}

  <!-- Noticias -->
  ${noticias.map(n =>
    url(
      `/noticias/${n.slug}`,
      n.data.date.toISOString().split('T')[0],
      '0.7',
      'yearly'
    )
  ).join('')}

  <!-- Eventos -->
  ${eventos.map(e =>
    url(
      `/eventos/${e.slug}`,
      e.data.date.toISOString().split('T')[0],
      '0.7',
      'weekly'
    )
  ).join('')}

  <!-- Rutas -->
  ${rutas.map(r =>
    url(`/rutas/${r.slug}`, now, '0.7', 'monthly')
  ).join('')}

</urlset>`;

  return new Response(sitemap.trim(), {
    headers: {
      'Content-Type':  'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
