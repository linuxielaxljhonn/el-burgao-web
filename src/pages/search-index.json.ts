/**
 * search-index.json.ts
 * ─────────────────────────────────────────────────────────────
 * Genera el índice de búsqueda estático en build.
 * Lo consume search.ts en el cliente sin llamadas al servidor.
 */

import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const noticias = await getCollection('noticias', ({ data }) => !data.draft);
  const eventos  = await getCollection('eventos',  ({ data }) => !data.draft);
  const rutas    = await getCollection('rutas',    ({ data }) => !data.draft);

  const index = [
    // Páginas estáticas
    { type: 'pagina', title: 'Inicio',       excerpt: 'Asociación de autocaravanistas de las Islas Canarias desde 2014.', url: '/',          emoji: '🏠', tags: ['inicio','home','asociacion'] },
    { type: 'pagina', title: 'Noticias',     excerpt: 'Últimas noticias de El Burgao: eventos, rutas, normativa y comunidad.',                url: '/noticias',  emoji: '📰', tags: ['noticias','actualidad','blog'] },
    { type: 'pagina', title: 'Agenda',       excerpt: 'Encuentros, rutas, reuniones, asambleas y convocatorias.',                   url: '/eventos',   emoji: '📅', tags: ['eventos','concentracion','agenda','calendario'] },
    { type: 'pagina', title: 'Rutas',        excerpt: 'Rutas en autocaravana por las islas Canarias. Itinerarios detallados.',              url: '/rutas',     emoji: '🗺️', tags: ['rutas','itinerarios','canarias','viaje'] },
    { type: 'pagina', title: 'Contacto',     excerpt: 'Contacta con la Asociación El Burgao por email, WhatsApp o formulario.',               url: '/contacto',  emoji: '📬', tags: ['contacto','email','whatsapp'] },
    { type: 'pagina', title: 'La asociación', excerpt: 'Quiénes somos, junta directiva y estatutos.', url: '/la-asociacion', emoji: '🚐', tags: ['asociacion','junta','estatutos'] },
    { type: 'pagina', title: 'Hazte socio', excerpt: 'Cuotas, ventajas y solicitud de alta.', url: '/hazte-socio', emoji: '✋', tags: ['socios','alta','cuota','inscripcion'] },

    // Noticias
    ...noticias.map(n => ({
      type:    'noticia',
      title:   n.data.title,
      excerpt: n.data.excerpt,
      url:     `/noticias/${n.slug}`,
      emoji:   n.data.emoji,
      date:    n.data.date.toISOString().split('T')[0],
      tags:    [n.data.category.toLowerCase(), ...n.data.tags],
    })),

    // Eventos
    ...eventos.map(e => ({
      type:    'evento',
      title:   e.data.title,
      excerpt: e.data.description,
      url:     `/eventos/${e.slug}`,
      emoji:   e.data.emoji,
      date:    e.data.date.toISOString().split('T')[0],
      tags:    [e.data.type.toLowerCase(), e.data.location.toLowerCase()],
    })),

    // Rutas
    ...rutas.map(r => ({
      type:    'ruta',
      title:   r.data.title,
      excerpt: r.data.excerpt,
      url:     `/rutas/${r.slug}`,
      emoji:   r.data.emoji,
      tags:    [r.data.isla, r.data.difficulty.toLowerCase(), ...r.data.highlights.slice(0,3).map(h => h.toLowerCase())],
    })),
  ];

  return new Response(JSON.stringify(index), {
    headers: {
      'Content-Type':  'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
