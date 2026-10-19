/**
 * worker/index.js — Lógica de servidor (Cloudflare Workers).
 * ─────────────────────────────────────────────────────────────
 * Todo lo demás de la web son archivos estáticos (carpeta dist/).
 * Este código solo atiende las rutas /api/*:
 *
 *   POST /api/socios/acceso   → comprueba la clave de socio y guarda una cookie
 *   POST /api/socios/salir    → borra la cookie
 *   GET  /api/ventajas        → devuelve los descuentos (solo con cookie válida)
 *
 * La clave se cambia desde el editor: «Datos de la asociación» → «Clave de socio».
 * Al cambiarla, todos los socios tienen que volver a escribirla.
 */
import asociacion from '../src/data/asociacion.json';
import ventajas from '../src/data/ventajas.json';

const COOKIE = 'burgao_socio';
const UN_ANIO = 60 * 60 * 24 * 365;

const normaliza = (s) => String(s ?? '').trim().toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');

const claveActual = () => normaliza(asociacion?.claveSocios);

async function huella(clave) {
  const datos = new TextEncoder().encode('el-burgao::' + clave);
  const hash = await crypto.subtle.digest('SHA-256', datos);
  return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function leeCookie(req, nombre) {
  const c = req.headers.get('Cookie') || '';
  const m = c.match(new RegExp('(?:^|;\\s*)' + nombre + '=([^;]+)'));
  return m ? m[1] : null;
}

const json = (datos, status = 200, extra = {}) => new Response(JSON.stringify(datos), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extra },
});

async function esSocio(req) {
  const clave = claveActual();
  if (!clave) return false;
  return leeCookie(req, COOKIE) === await huella(clave);
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);

    // Acceso con la clave de socio
    if (url.pathname === '/api/socios/acceso' && req.method === 'POST') {
      const clave = claveActual();
      if (!clave) return json({ ok: false, error: 'La junta aún no ha activado la clave de socio.' }, 503);
      let enviada = '';
      try {
        const tipo = req.headers.get('Content-Type') || '';
        enviada = tipo.includes('application/json')
          ? (await req.json()).clave
          : (await req.formData()).get('clave');
      } catch { /* cuerpo vacío o mal formado */ }
      if (normaliza(enviada) !== clave) {
        // Pequeña espera para que no compense probar claves a lo loco
        await new Promise(r => setTimeout(r, 800));
        return json({ ok: false, error: 'Clave incorrecta.' }, 401);
      }
      const cookie = `${COOKIE}=${await huella(clave)}; Path=/; Max-Age=${UN_ANIO}; HttpOnly; Secure; SameSite=Lax`;
      return json({ ok: true }, 200, { 'Set-Cookie': cookie });
    }

    if (url.pathname === '/api/socios/salir' && req.method === 'POST') {
      return json({ ok: true }, 200, { 'Set-Cookie': `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax` });
    }

    // Descuentos: solo para socios
    if (url.pathname === '/api/ventajas') {
      if (!(await esSocio(req))) return json({ ok: false }, 401);
      const empresas = Array.isArray(ventajas?.empresas) ? ventajas.empresas : [];
      const descuentos = {};
      empresas.forEach((e, i) => { if (e && e.nombre && e.oculta !== true) descuentos[i] = e.descuento || ''; });
      return json({ ok: true, descuentos, nota: ventajas?.nota || '' });
    }

    if (url.pathname.startsWith('/api/')) return json({ ok: false, error: 'No encontrado' }, 404);

    return env.ASSETS.fetch(req);
  },
};
