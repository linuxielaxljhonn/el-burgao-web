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

import datosJson from '../data/asociacion.json';

// El editor elimina los campos vacíos al guardar: todo es opcional aquí.
const datos: any = datosJson ?? {};
const contacto = datos.contacto ?? {};
const legalD   = datos.legal ?? {};
const cuotasD  = datos.cuotas ?? {};
const redes    = datos.redes ?? {};
const juntaD: { cargo?: string; nombre?: string }[] = Array.isArray(datos.junta) ? datos.junta : [];

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
    socios: Number(datos.sociosAprox) || 400,
    años:   new Date().getFullYear() - foundedYear, // se calcula solo
    islas:  8,
  },

  // ── Contacto (un solo origen para toda la web) ─────────────
  contact: {
    email:        o(contacto.email, 'email de la asociación'),
    telefono:     o(contacto.telefono, 'teléfono'),
    // solo dígitos con prefijo, ej. "34600111222". Vacío = no se muestra
    whatsapp:     (contacto.whatsapp || '').replace(/\D/g, ''),
    location:     'Islas Canarias, España',
    emailJunta:   o(contacto.emailJunta, 'email que recibe los formularios'),
  },

  // ── Datos legales (aviso legal y privacidad) ───────────────
  legal: {
    razonSocial:  'Asociación Autocaravanista El Burgao',
    cif:          o(legalD.cif, 'CIF'),
    registro:     o(legalD.registro, 'n.º de inscripción en el Registro de Asociaciones de Canarias'),
    domicilio:    o(legalD.domicilio, 'domicilio social'),
  },

  // ── Cuotas ──────────────────────────────────────────────────
  cuota: {
    alta:        Number(cuotasD.alta) || 30,        // primer año
    renovacion:  Number(cuotasD.renovacion) || 25,  // años siguientes
    moneda:      'EUR',
    nota:        cuotasD.nota || '',
    formaPago:   o(cuotasD.formaPago, 'forma de pago'),
    renovacionCuando: o(cuotasD.renovacionCuando, 'periodo de renovación'),
  },

  // ── Redes sociales ──────────────────────────────────────────
  // Deja url vacía ('') para ocultar una red.
  social: [
    { name: 'Facebook',  url: redes.facebook  || '', icon: 'facebook'  },
    { name: 'Instagram', url: redes.instagram || '', icon: 'instagram' },
    { name: 'WhatsApp',  url: redes.whatsapp  || '', icon: 'whatsapp'  },
  ],

  // ── Página La asociación ────────────────────────────────────
  presentacion: datos.presentacion || '',
  // Imagen de la sección «Quiénes somos» de la portada (vacío = dibujo de las islas)
  portada: {
    imagen: datos.portada?.imagen || '',
    alt:    datos.portada?.alt || 'Autocaravanas de socios de El Burgao en Canarias',
  },
  junta:        juntaD.filter(j => j && j.cargo).map(j => ({ cargo: j.cargo as string, nombre: o(j.nombre, 'nombre') })),
  estatutosPdf: datos.estatutosPdf || '',

  // ── Navegación principal ────────────────────────────────────
  nav: [
    { label: 'Inicio',         href: '/',               icon: '🏠' },
    { label: 'La asociación',  href: '/la-asociacion',  icon: '🚐' },
    { label: 'Agenda',         href: '/eventos',        icon: '📅' },
    { label: 'Mapa',           href: '/mapa',           icon: '📍' },
    { label: 'Ventajas',       href: '/ventajas',       icon: '💳' },
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
