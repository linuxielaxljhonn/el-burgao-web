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
 * Los datos que cambian (contacto, redes, cuotas, junta…) están en
 * src/data/asociacion.json y se editan desde el editor de contenidos
 * (sección «Datos de la asociación»). Un campo vacío se muestra como
 * [PENDIENTE: …] para que se vea qué falta.
 *
 * Autor de la web: Jhonn V. Ardila Jara
 */

import datos from '../data/asociacion.json';

const PENDIENTE = (que: string) => `[PENDIENTE: ${que}]`;
const o = (v: string | undefined, que: string) => (v && v.trim()) ? v.trim() : PENDIENTE(que);

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
    socios: datos.sociosAprox || 400,
    años:   new Date().getFullYear() - foundedYear, // se calcula solo
    islas:  8,
  },

  // ── Contacto (un solo origen para toda la web) ─────────────
  contact: {
    email:        o(datos.contacto.email, 'email de la asociación'),
    telefono:     o(datos.contacto.telefono, 'teléfono'),
    // solo dígitos con prefijo, ej. "34600111222". Vacío = no se muestra
    whatsapp:     (datos.contacto.whatsapp || '').replace(/\D/g, ''),
    location:     'Islas Canarias, España',
    emailJunta:   o(datos.contacto.emailJunta, 'email que recibe los formularios'),
  },

  // ── Datos legales (aviso legal y privacidad) ───────────────
  legal: {
    razonSocial:  'Asociación Autocaravanista El Burgao',
    cif:          o(datos.legal.cif, 'CIF'),
    registro:     o(datos.legal.registro, 'n.º de inscripción en el Registro de Asociaciones de Canarias'),
    domicilio:    o(datos.legal.domicilio, 'domicilio social'),
  },

  // ── Cuotas ──────────────────────────────────────────────────
  cuota: {
    alta:        datos.cuotas.alta,        // primer año
    renovacion:  datos.cuotas.renovacion,  // años siguientes
    moneda:      'EUR',
    nota:        datos.cuotas.nota,
    formaPago:   o(datos.cuotas.formaPago, 'forma de pago'),
    renovacionCuando: o(datos.cuotas.renovacionCuando, 'periodo de renovación'),
  },

  // ── Redes sociales ──────────────────────────────────────────
  // Deja url vacía ('') para ocultar una red.
  social: [
    { name: 'Facebook',  url: datos.redes.facebook  || '', icon: 'facebook'  },
    { name: 'Instagram', url: datos.redes.instagram || '', icon: 'instagram' },
    { name: 'WhatsApp',  url: datos.redes.whatsapp  || '', icon: 'whatsapp'  },
  ],

  // ── Página La asociación ────────────────────────────────────
  presentacion: datos.presentacion || '',
  junta:        datos.junta.map(j => ({ cargo: j.cargo, nombre: o(j.nombre, 'nombre') })),
  estatutosPdf: datos.estatutosPdf || '',

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
