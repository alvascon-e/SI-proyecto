import { PARQUEADEROS } from './data/parqueaderos';
import type { Categoria, EstadoLote, Parqueadero } from './types';

export const libres = (p: Parqueadero, l: EstadoLote) => (l.cerrado ? 0 : p.capacidad - l.ocupados);
export const pct = (p: Parqueadero, l: EstadoLote) => Math.round((l.ocupados / p.capacidad) * 100);

export type Nivel = 'libre' | 'medio' | 'lleno' | 'cerrado';
export function nivel(p: Parqueadero, l: EstadoLote): Nivel {
  if (l.cerrado) return 'cerrado';
  const r = l.ocupados / p.capacidad;
  return r >= 0.92 ? 'lleno' : r >= 0.72 ? 'medio' : 'libre';
}
export const COLOR_NIVEL: Record<Nivel, string> = { libre: '#16a34a', medio: '#f59e0b', lleno: '#dc2626', cerrado: '#64748b' };
export const TEXTO_NIVEL: Record<Nivel, string> = { libre: 'Disponible', medio: 'Llenándose', lleno: 'Casi lleno', cerrado: 'Cerrado' };

export function metros(a: [number, number], b: [number, number]) {
  const R = 6371000, r = Math.PI / 180;
  const dLat = (b[0] - a[0]) * r, dLon = (b[1] - a[1]) * r;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Minutos hasta llenarse al ritmo actual (null si no se está llenando). */
export function seLlenaEn(p: Parqueadero, l: EstadoLote) {
  const lib = libres(p, l);
  if (l.cerrado || l.tendencia <= 0.3 || lib <= 0) return null;
  return Math.max(1, Math.round(lib / l.tendencia));
}

export interface Opcion { p: Parqueadero; libres: number; caminata: number; minutosCaminando: number; prediccion: number; score: number; permitido: boolean }

/** Recomendación: parqueaderos permitidos para la categoría, ordenados por cercanía al destino y espacio previsto al llegar. */
export function recomendar(destino: [number, number], categoria: Categoria, lotes: Record<string, EstadoLote>, minutosHastaLlegar = 4): Opcion[] {
  return PARQUEADEROS.map((p) => {
    const l = lotes[p.id];
    const lib = libres(p, l);
    const caminata = Math.round(metros(p.centro, destino) * 1.25);
    const prediccion = Math.max(0, Math.round(lib - Math.max(0, l.tendencia) * minutosHastaLlegar));
    const permitido = p.categorias.includes(categoria) && !l.cerrado;
    const minutosCaminando = Math.max(1, Math.round(caminata / 75));
    const score = minutosCaminando + (prediccion < 3 ? 40 : prediccion < 8 ? 8 : 0) + (permitido ? 0 : 1000);
    return { p, libres: lib, caminata, minutosCaminando, prediccion, score, permitido };
  }).sort((a, b) => a.score - b.score);
}

export const horaReloj = (ts: number) => new Date(ts).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' });
export function hace(ts: number) {
  const m = Math.round((Date.now() - ts) / 60000);
  if (m < 1) return 'ahora';
  if (m < 60) return `hace ${m} min`;
  const h = Math.round(m / 60);
  return h < 24 ? `hace ${h} h` : `hace ${Math.round(h / 24)} d`;
}
