// scripts/importar-osm.mjs
// Descarga de OpenStreetMap las áreas de autocaravanas, puntos de vaciado
// y campings de Canarias y los guarda en src/data/osm-lugares.json.
// Son datos de partida SIN VERIFICAR: la junta los revisa en el mapa.
// Uso: node scripts/importar-osm.mjs   (lo ejecuta la acción de GitHub)
import { writeFile } from 'node:fs/promises';

// Rectángulo que cubre las Islas Canarias (sur, oeste, norte, este)
const BBOX = '27.55,-18.25,29.50,-13.30';
const Q = `[out:json][timeout:150][bbox:${BBOX}];
(
  nwr["tourism"="caravan_site"];
  nwr["amenity"="sanitary_dump_station"];
  nwr["tourism"="camp_site"];
);
out center tags;`;

const SERVIDORES = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
];

let datos;
for (const url of SERVIDORES) {
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'el-burgao-web/1.0 (asociacion autocaravanista)' },
      body: 'data=' + encodeURIComponent(Q),
      signal: AbortSignal.timeout(170_000),
    });
    if (!r.ok) throw new Error(r.status);
    datos = await r.json();
    console.log('OK', url, datos.elements.length);
    break;
  } catch (e) { console.log(`::warning::Fallo ${url}: ${e.message}`); }
}
if (!datos) process.exit(1);

const tipo = t =>
  t.amenity === 'sanitary_dump_station' ? 'servicio'
  : t.tourism === 'caravan_site' ? 'area'
  : 'camping';

const lugares = datos.elements.map(e => {
  const t = e.tags || {};
  return {
    osm: `${e.type}/${e.id}`,
    tipo: tipo(t),
    nombre: t.name || '',
    lat: +(e.lat ?? e.center?.lat).toFixed(5),
    lng: +(e.lon ?? e.center?.lon).toFixed(5),
    municipio: t['addr:city'] || t['addr:municipality'] || '',
    precio: t.fee === 'no' ? 'Gratuito' : (t.charge || (t.fee === 'yes' ? 'De pago' : '')),
    agua: t.drinking_water === 'yes' || t.water_point === 'yes',
    vaciadoGrises: t['sanitary_dump_station:grey_water'] === 'yes' || t.sanitary_dump_station === 'yes' || t.amenity === 'sanitary_dump_station',
    vaciadoNegras: t['sanitary_dump_station:chemical_toilet'] === 'yes' || t.amenity === 'sanitary_dump_station',
    electricidad: t.power_supply === 'yes',
    caravanas: t.caravans || t.motorhome || '',
    web: t.website || t['contact:website'] || '',
    telefono: t.phone || t['contact:phone'] || '',
  };
}).filter(l => Number.isFinite(l.lat) && Number.isFinite(l.lng))
  .sort((a, b) => a.osm.localeCompare(b.osm));

await writeFile('src/data/osm-lugares.json', JSON.stringify({
  fuente: 'OpenStreetMap (© colaboradores de OpenStreetMap, licencia ODbL)',
  actualizado: new Date().toISOString().slice(0, 10),
  lugares,
}, null, 1) + '\n');
console.log(`::notice::Guardados ${lugares.length} lugares`);
