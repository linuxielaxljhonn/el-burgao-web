/**
 * content/config.ts
 * ─────────────────────────────────────────────────────────────
 * Esquemas de las Content Collections de Astro.
 * Define la "forma" de cada tipo de contenido con TypeScript.
 *
 * Beneficios:
 * - Errores de tipo en build si falta un campo obligatorio
 * - Autocompletado en el editor
 * - Validación automática de fechas, slugs, etc.
 *
 * Para añadir una noticia: crear un .md en /src/content/noticias/
 * Para añadir un evento:   crear un .md en /src/content/eventos/
 * etc. — nunca tocar código JS/HTML.
 */

import { defineCollection, z } from 'astro:content';

// ── NOTICIAS ──────────────────────────────────────────────────
const noticiasCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title:     z.string().max(100),
    excerpt:   z.string().max(280),
    date:      z.date(),
    category:  z.enum([
      'Evento', 'Ruta', 'Normativa', 'Comunidad',
      'Consejo', 'Galería', 'Asociación', 'General'
    ]),
    emoji:     z.string().emoji().default('📰'),
    featured:  z.boolean().default(false),
    draft:     z.boolean().default(false),
    // Imagen opcional (cuando haya fotos reales)
    image:     z.string().optional(),
    imageAlt:  z.string().optional(),
    // Autor opcional
    author:    z.string().default('El Burgao'),
    // Tags para SEO y filtrado futuro
    tags:      z.array(z.string()).default([]),
  }),
});

// ── EVENTOS ───────────────────────────────────────────────────
const eventosCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title:       z.string().max(100),
    description: z.string().max(400),
    date:        z.date(),
    endDate:     z.date().optional(),
    location:    z.string(),
    isla:        z.enum([
      'gran-canaria', 'tenerife', 'lanzarote', 'fuerteventura',
      'la-palma', 'la-gomera', 'el-hierro', 'la-graciosa', 'varias'
    ]).optional(),
    type:        z.enum([
      'Concentración', 'Ruta', 'Reunión', 'Asamblea',
      'Manifestación', 'Formación', 'Social', 'Otro'
    ]),
    emoji:       z.string().emoji().default('📅'),
    tag:         z.string().optional(),
    // Para inscripciones futuras
    capacity:    z.number().optional(),
    price:       z.number().default(0),
    registrationUrl: z.string().url().optional(),
    // Solo socios
    membersOnly: z.boolean().default(false),
    draft:       z.boolean().default(false),
  }),
});

// ── RUTAS ─────────────────────────────────────────────────────
const rutasCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title:       z.string().max(100),
    excerpt:     z.string().max(280),
    isla:        z.enum([
      'gran-canaria', 'tenerife', 'lanzarote', 'fuerteventura',
      'la-palma', 'la-gomera', 'el-hierro', 'la-graciosa'
    ]),
    difficulty:  z.enum(['Fácil', 'Moderada', 'Difícil']).default('Fácil'),
    duration:    z.string(),          // "2 días", "1 semana"
    distance:    z.string().optional(), // "150 km"
    emoji:       z.string().emoji().default('🗺️'),
    image:       z.string().optional(),
    imageAlt:    z.string().optional(),
    // Archivos descargables (path relativo a /public)
    gpxFile:     z.string().optional(),
    kmlFile:     z.string().optional(),
    pdfFile:     z.string().optional(),
    // Puntos de interés en formato libre
    highlights:  z.array(z.string()).default([]),
    services:    z.array(z.string()).default([]),
    // Coordenadas del punto de inicio (para mapa futuro)
    lat:         z.number().optional(),
    lng:         z.number().optional(),
    draft:       z.boolean().default(false),
    featured:    z.boolean().default(false),
    order:       z.number().default(99),
  }),
});

// ── GALERÍA ───────────────────────────────────────────────────
// La galería se gestiona con JSON en /src/data/gallery.json
// (más práctico que múltiples .md para datos sin texto largo)
// Este collection es opcional para álbumes con descripción extensa.
const galeriaCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title:       z.string(),
    date:        z.date(),
    category:    z.enum(['rutas', 'eventos', 'paisajes', 'vehiculos', 'general']),
    emoji:       z.string().emoji().default('📸'),
    coverImage:  z.string().optional(),
    images:      z.array(z.object({
      src:     z.string(),
      alt:     z.string(),
      caption: z.string().optional(),
    })).default([]),
    draft:       z.boolean().default(false),
  }),
});


// ── EXPORTAR COLECCIONES ──────────────────────────────────────
export const collections = {
  noticias: noticiasCollection,
  eventos:  eventosCollection,
  rutas:    rutasCollection,
  galeria:  galeriaCollection,
};
