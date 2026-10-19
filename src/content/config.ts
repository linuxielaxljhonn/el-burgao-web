/**
 * content/config.ts
 * ─────────────────────────────────────────────────────────────
 * Esquemas de las Content Collections de Astro.
 *
 * Estos esquemas son TOLERANTES a propósito: el editor de contenidos
 * (Pages CMS, en /admin de app.pagescms.org) puede guardar campos vacíos
 * como "" o null. Un campo vacío se trata como "sin valor" en lugar de
 * romper la publicación de la web.
 *
 * Si cambias un campo aquí, cambia también .pages.yml (raíz del repo).
 */

import { defineCollection, z } from 'astro:content';

// ── Ayudantes: "" / null → sin valor ─────────────────────────
const vacio = (v: unknown) => (v === '' || v === null ? undefined : v);
const texto      = () => z.preprocess(vacio, z.string().optional());
const fecha      = () => z.coerce.date();
const fechaOpc   = () => z.preprocess(vacio, z.coerce.date().optional());
const numeroOpc  = () => z.preprocess(vacio, z.coerce.number().optional());
const numero     = (d: number) => z.preprocess(vacio, z.coerce.number().default(d));
const booleano   = (d = false) => z.preprocess(vacio, z.boolean().default(d));
const lista      = () => z.preprocess(v => (v == null ? [] : v), z.array(z.string()).default([]));
const emoji      = (d: string) => z.preprocess(vacio, z.string().default(d));

const ISLAS = [
  'gran-canaria', 'tenerife', 'lanzarote', 'fuerteventura',
  'la-palma', 'la-gomera', 'el-hierro', 'la-graciosa',
] as const;

// ── NOTICIAS Y ANUNCIOS ───────────────────────────────────────
const noticiasCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title:     z.string(),
    excerpt:   z.string(),
    date:      fecha(),
    category:  z.enum([
      'Anuncio', 'Evento', 'Ruta', 'Normativa', 'Comunidad',
      'Consejo', 'Galería', 'Asociación', 'General',
    ]).default('General'),
    emoji:     emoji('📰'),
    featured:  booleano(),
    draft:     booleano(),
    // Anuncios: deja de mostrarse en portada a partir de esta fecha
    expires:   fechaOpc(),
    image:     texto(),
    imageAlt:  texto(),
    author:    z.preprocess(vacio, z.string().default('El Burgao')),
    tags:      lista(),
  }),
});

// ── EVENTOS (encuentros, reuniones, asambleas, manifestaciones…) ─
const eventosCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title:       z.string(),
    description: z.string(),
    date:        fecha(),
    time:        texto(),          // "10:00" (opcional)
    endDate:     fechaOpc(),
    location:    z.string(),
    isla:        z.preprocess(vacio, z.enum([...ISLAS, 'varias']).optional()),
    type:        z.enum([
      'Concentración', 'Ruta', 'Reunión', 'Asamblea',
      'Manifestación', 'Formación', 'Social', 'Otro',
    ]),
    emoji:       emoji('📅'),
    tag:         texto(),
    image:       texto(),          // cartel o foto
    imageAlt:    texto(),
    poster:      texto(),          // PDF (orden del día, convocatoria…)
    capacity:    numeroOpc(),
    price:       numero(0),
    registrationUrl: texto(),
    membersOnly: booleano(),
    draft:       booleano(),
  }),
});

// ── RUTAS ─────────────────────────────────────────────────────
const rutasCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title:       z.string(),
    excerpt:     z.string(),
    isla:        z.enum(ISLAS),
    difficulty:  z.enum(['Fácil', 'Moderada', 'Difícil']).default('Fácil'),
    duration:    z.string(),
    distance:    texto(),
    emoji:       emoji('🗺️'),
    image:       texto(),
    imageAlt:    texto(),
    gpxFile:     texto(),
    kmlFile:     texto(),
    pdfFile:     texto(),
    highlights:  lista(),
    services:    lista(),
    lat:         numeroOpc(),
    lng:         numeroOpc(),
    // Etapas por día con sus paradas (para el mapa del recorrido)
    etapas:      z.preprocess(v => (v == null ? [] : v), z.array(z.object({
      titulo:      z.string(),
      descripcion: texto(),
      paradas:     z.preprocess(v => (v == null ? [] : v), z.array(z.object({
        nombre: z.string(),
        tipo:   z.preprocess(vacio, z.enum(['visita', 'pernocta', 'servicio', 'otro']).default('visita')),
        lat:    z.coerce.number(),
        lng:    z.coerce.number(),
        nota:   texto(),
      })).default([])),
    })).default([])),
    draft:       booleano(),
    featured:    booleano(),
    order:       numero(99),
  }),
});

// ── LUGARES (áreas, pernoctas, servicios, campings, paradas, prohibidos)

const lugaresCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title:        z.string(),
    tipo:         z.enum(['area', 'pernocta', 'servicio', 'lavado', 'camping', 'parada', 'prohibido']),
    isla:         z.enum(ISLAS),
    municipio:    texto(),
    lat:          z.coerce.number(),
    lng:          z.coerce.number(),
    osm:          texto(),          // "node/123" si viene de OpenStreetMap
    precio:       texto(),          // "Gratuito", "10 €/noche"…
    estanciaMax:  texto(),          // "72 h", "1 noche"…
    plazas:       numeroOpc(),
    longitudMax:  numeroOpc(),      // metros
    alturaMax:    numeroOpc(),      // metros
    agua:         booleano(),
    vaciadoGrises: booleano(),
    vaciadoNegras: booleano(),
    electricidad: booleano(),
    wc:           booleano(),
    duchas:       booleano(),
    normativa:    texto(),          // ordenanza, señal, restricciones
    fuente:       texto(),          // enlace a la ordenanza o web oficial
    verificado:   fechaOpc(),       // última comprobación de la junta
    image:        texto(),
    imageAlt:     texto(),
    draft:        booleano(),
  }),
});

// ── GALERÍA (álbumes con texto largo; las fotos sueltas van en gallery.json)
const galeriaCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title:       z.string(),
    date:        fecha(),
    category:    z.enum(['rutas', 'eventos', 'paisajes', 'vehiculos', 'general']),
    emoji:       emoji('📸'),
    coverImage:  texto(),
    images:      z.array(z.object({
      src:     z.string(),
      alt:     z.string(),
      caption: texto(),
    })).default([]),
    draft:       booleano(),
  }),
});

export const collections = {
  noticias: noticiasCollection,
  eventos:  eventosCollection,
  rutas:    rutasCollection,
  galeria:  galeriaCollection,
  lugares:  lugaresCollection,
};
