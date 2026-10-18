/**
 * site.ts
 * ─────────────────────────────────────────────────────────────
 * Configuración global de la web de El Burgao.
 * ÚNICO sitio donde viven nombre, contacto, redes, cuotas y menú:
 * cambiar un dato aquí lo cambia en toda la web.
 *
 * Los valores que empiezan por "[PENDIENTE" faltan por confirmar
 * con la junta. Mientras sigan así, la web los muestra tal cual
 * para que se vea qué queda por completar.
 *
 * Autor de la web: Jhonn V. Ardila Jara
 */

const PENDIENTE = (que: string) => `[PENDIENTE: ${que}]`;

const foundedYear = 2014;

const siteConfig = {

  // ── Identidad básica ────────────────────────────────────────
  name:      'Asociación Autocaravanista El Burgao',
  shortName: 'El Burgao',
  fullTitle: 'Asociación Autocaravanista El Burgao — Autocaravanistas de Canarias',
  tagline:   'La carretera nos une',

  // ── Descripción SEO (155 caracteres máx.) ───────────────────
  description:
    'Asociación de autocaravanistas de Canarias. Agenda de encuentros, ' +
    'rutas, paradas y pernoctas en las islas, ventajas para socios y cómo unirte.',

  // ── URLs ────────────────────────────────────────────────────
  // Cambiar cuando la junta apruebe el dominio definitivo
  // (también en astro.config.mjs → site).
  url:     'https://elburgao.org',
  ogImage: '/assets/img/og-image.jpg',

  // ── Fundación y cifras ──────────────────────────────────────
  foundedYear,
  stats: {
    socios: 400,                                   // PENDIENTE: confirmar cifra
    años:   new Date().getFullYear() - foundedYear, // se calcula solo
    islas:  8,
  },

  // ── Contacto (un solo origen para toda la web) ─────────────
  contact: {
    email:        PENDIENTE('email de la asociación'),
    telefono:     PENDIENTE('teléfono'),
    whatsapp:     '',      // solo dígitos con prefijo, ej. "34600111222". Vacío = no se muestra
    location:     'Islas Canarias, España',
    // Email que recibe solicitudes de alta y sugerencias (se configura en Netlify)
    emailJunta:   PENDIENTE('email que recibe los formularios'),
  },

  // ── Datos legales (aviso legal y privacidad) ───────────────
  legal: {
    razonSocial:  'Asociación Autocaravanista El Burgao',
    cif:          PENDIENTE('CIF'),
    registro:     PENDIENTE('n.º de inscripción en el Registro de Asociaciones de Canarias'),
    domicilio:    PENDIENTE('domicilio social'),
  },

  // ── Cuotas ──────────────────────────────────────────────────
  cuota: {
    alta:        30,   // primer año
    renovacion:  25,   // años siguientes
    moneda:      'EUR',
    nota:        'Una cuota por vehículo y unidad familiar',  // PENDIENTE: confirmar
  },

  // ── Redes sociales ──────────────────────────────────────────
  // Deja url vacía ('') para ocultar una red.
  social: [
    { name: 'Facebook',  url: '', icon: 'facebook'  },
    { name: 'Instagram', url: '', icon: 'instagram' },
    { name: 'WhatsApp',  url: '', icon: 'whatsapp'  },
  ],

  // ── Navegación principal ────────────────────────────────────
  nav: [
    { label: 'Inicio',         href: '/',               icon: '🏠' },
    { label: 'La asociación',  href: '/la-asociacion',  icon: '🚐' },
    { label: 'Agenda',         href: '/eventos',        icon: '📅' },
    { label: 'Rutas',          href: '/rutas',          icon: '🗺️' },
    { label: 'Noticias',       href: '/noticias',       icon: '📰' },
    { label: 'Contacto',       href: '/contacto',       icon: '📬' },
  ],

  // Botón destacado del menú
  navCta: {
    label: 'Hazte socio',
    href:  '/hazte-socio',
  },

  // ── Islas Canarias ──────────────────────────────────────────
  islas: [
    { value: 'gran-canaria',  label: 'Gran Canaria' },
    { value: 'tenerife',      label: 'Tenerife' },
    { value: 'lanzarote',     label: 'Lanzarote' },
    { value: 'fuerteventura', label: 'Fuerteventura' },
    { value: 'la-palma',      label: 'La Palma' },
    { value: 'la-gomera',     label: 'La Gomera' },
    { value: 'el-hierro',     label: 'El Hierro' },
    { value: 'la-graciosa',   label: 'La Graciosa' },
  ],

  // ── Tipos de vehículo ───────────────────────────────────────
  vehiculos: [
    { value: 'autocaravana', label: 'Autocaravana' },
    { value: 'campervan',    label: 'Campervan' },
    { value: 'remolque',     label: 'Remolque / Caravana' },
    { value: 'furgoneta',    label: 'Furgoneta camperizada' },
    { value: 'otro',         label: 'Otro' },
  ],

  // ── Autoría ─────────────────────────────────────────────────
  author: 'Jhonn V. Ardila Jara',

} as const;

export const isPendiente = (v: string | undefined | null) =>
  !v || v.startsWith('[PENDIENTE');

export default siteConfig;
export type SiteConfig = typeof siteConfig;
