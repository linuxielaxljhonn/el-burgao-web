/** Tipos de lugar del mapa: etiqueta, emoji y color del marcador. */
export const TIPOS_LUGAR = {
  area:      { label: 'Área de autocaravanas',   emoji: '🅿️', color: '#1B4F72' },
  pernocta:  { label: 'Pernocta tolerada',       emoji: '🌙', color: '#6c3483' },
  servicio:  { label: 'Vaciado y agua',          emoji: '🚰', color: '#117a65' },
  camping:   { label: 'Camping',                 emoji: '🏕️', color: '#b9770e' },
  parada:    { label: 'Parada de día',           emoji: '📍', color: '#2e86c1' },
  prohibido: { label: 'Prohibido / conflictivo', emoji: '⛔', color: '#c0392b' },
} as const;
export type TipoLugar = keyof typeof TIPOS_LUGAR;

/** Isla aproximada a partir de coordenadas (para datos de OpenStreetMap). */
const CAJAS: [string, number, number, number, number][] = [
  // isla, latMin, latMax, lngMin, lngMax
  ['la-graciosa',   29.20, 29.30, -13.56, -13.45],
  ['lanzarote',     28.83, 29.25, -13.90, -13.40],
  ['fuerteventura', 28.04, 28.76, -14.53, -13.80],
  ['gran-canaria',  27.73, 28.19, -15.85, -15.35],
  ['tenerife',      27.99, 28.60, -16.95, -16.10],
  ['la-gomera',     28.00, 28.23, -17.36, -17.08],
  ['la-palma',      28.45, 28.86, -18.02, -17.71],
  ['el-hierro',     27.63, 27.86, -18.17, -17.86],
];
export function islaDe(lat: number, lng: number): string {
  for (const [isla, a, b, c, d] of CAJAS) if (lat >= a && lat <= b && lng >= c && lng <= d) return isla;
  return '';
}

export const ISLAS_LABEL: Record<string, string> = {
  'gran-canaria': 'Gran Canaria', 'tenerife': 'Tenerife', 'lanzarote': 'Lanzarote',
  'fuerteventura': 'Fuerteventura', 'la-palma': 'La Palma', 'la-gomera': 'La Gomera',
  'el-hierro': 'El Hierro', 'la-graciosa': 'La Graciosa',
};
