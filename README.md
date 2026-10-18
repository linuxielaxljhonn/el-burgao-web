# Web de la Asociación Autocaravanista El Burgao

Web informativa de la asociación: agenda, noticias, rutas, ventajas y solicitud de alta.
Construida con **Astro 4**, publicada en **Netlify**. Sin base de datos ni área privada
(se añadirán en la fase de integración con las apps de socios y tesorería).

Autor: **Jhonn V. Ardila Jara** — cede el uso de la web a la asociación.

---

## Arrancar en local

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # genera /dist
npm run preview   # sirve /dist en http://localhost:4322
```

## Datos que faltan

Todo lo que pone `[PENDIENTE: …]` en la web viene de **un solo archivo**:
`src/config/site.ts` (contacto, redes, datos legales, cuotas, menú).
Además:

| Dónde | Qué falta |
|---|---|
| `src/pages/la-asociacion.astro` | Texto de presentación, junta directiva, PDF de estatutos |
| `src/pages/hazte-socio.astro` | Forma de pago y periodo de renovación |
| `src/content/eventos/` | Eventos reales (los actuales son ejemplos de 2025) |
| `src/content/noticias/` | Noticias reales (las actuales son ejemplos) |
| `public/assets/img/galeria/` | Fotos con permiso de publicación |

## Editor de contenidos (Pages CMS)

La junta edita la web en **https://app.pagescms.org** sin tocar código.
La configuración está en `.pages.yml`. Secciones:

- **Agenda**: eventos, reuniones, asambleas, manifestaciones (con cartel y PDF).
- **Noticias y anuncios**: los anuncios pueden tener fecha de caducidad.
- **Rutas**.
- **Galería de fotos**.
- **Datos de la asociación**: contacto, datos legales, cuotas, redes, junta, estatutos.

Cada cambio guardado se publica solo en 1–2 minutos (GitHub → Netlify).
Imágenes en `public/assets/img/uploads/`, PDF en `public/docs/`.

### Puesta en marcha (una vez, el administrador)
1. Entrar en app.pagescms.org con GitHub.
2. Instalar la GitHub App de Pages CMS solo en el repositorio `el-burgao-web`.
3. Abrir el repositorio → Ajustes → Colaboradores → invitar por email a cada editor.

## Añadir contenido a mano (alternativa)

- **Evento / reunión / asamblea / manifestación:** nuevo `.md` en `src/content/eventos/`.
  Campo `type`: `Concentración`, `Ruta`, `Reunión`, `Asamblea`, `Manifestación`, `Formación`, `Social` u `Otro`.
- **Noticia o anuncio:** nuevo `.md` en `src/content/noticias/`.
- **Ruta:** nuevo `.md` en `src/content/rutas/`.

Los esquemas completos están en `src/content/config.ts`.

## Formularios

Solicitud de socio y contacto usan **Netlify Forms** (sin servidor).
En Netlify: *Site configuration → Forms → Form notifications* → añadir el email de la junta.
Incluyen casilla de consentimiento RGPD y campo trampa anti-spam.

## Publicar en Netlify

1. Subir esta carpeta a un repositorio privado de GitHub.
2. Netlify → *Add new site → Import from Git* → elegir el repositorio.
3. Build command `npm run build`, publish directory `dist` (ya están en `netlify.toml`).
4. Cuando la junta apruebe el dominio: *Domain management → Add domain* y cambiar
   `site` en `astro.config.mjs` y `url` en `src/config/site.ts`.

## Qué cambió respecto a la versión anterior (v2 → v3)

- Retirados área de socios, panel `/admin`, verificación de carnet y Firebase
  (el código anterior sigue en la carpeta original `el-burgao-astro`).
- Nuevas páginas: La asociación, Hazte socio, Aviso legal, Cookies.
- Cuotas de alta (30 €) y renovación (25 €).
- Fuentes alojadas en la propia web (sin Google Fonts) y sin banner de cookies.
- Tipos de evento nuevos: Reunión y Manifestación.
- Contacto, redes y datos legales centralizados; lo que falta se muestra como `[PENDIENTE]`.
- Service worker corregido (página sin conexión) y cabeceras de seguridad simplificadas.
