import { PARQUEADEROS } from './parqueaderos';
import { curvaHora } from './catalogos';

// Histórico simulado y determinista (misma semilla → mismos números en cada demo).
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
export const HORAS = Array.from({ length: 15 }, (_, i) => 7 + i); // 07:00–21:00

/** Popularidad relativa de cada parqueadero (algunos se saturan siempre). */
export const POPULARIDAD: Record<string, number> = {
  'fiec-fimcp': 1.12, 'fiec-docentes': 1.0, rectorado: 0.82, biblioteca: 1.06, bloque9: 1.1, fcsh: 0.95,
  celex: 0.9, fcnm: 0.98, fict: 0.85, fimcm: 0.74, coliseo: 0.55, fadcom: 0.7, tesoreria: 0.9,
};

const factorDia = [1.0, 1.04, 0.98, 1.02, 0.86, 0.28];

/** % de ocupación promedio por día y hora para un parqueadero (o todo el campus si id = 'todos'). */
export function heatmap(id: string): number[][] {
  const ids = id === 'todos' ? PARQUEADEROS.map((p) => p.id) : [id];
  return DIAS.map((_, d) =>
    HORAS.map((h) => {
      let acc = 0;
      ids.forEach((pid, k) => {
        const r = rng(d * 97 + h * 13 + k * 7 + 3)();
        acc += Math.min(1, curvaHora(h * 60 + 30) * factorDia[d] * (POPULARIDAD[pid] ?? 1) * (0.93 + r * 0.14));
      });
      return Math.round((acc / ids.length) * 100);
    }),
  );
}

/** Rotación (autos distintos por plaza al día) y permanencia media (min) por parqueadero. */
export function rotacion() {
  return PARQUEADEROS.map((p, i) => {
    const r = rng(i * 31 + 5);
    const pop = POPULARIDAD[p.id] ?? 1;
    const docente = p.categorias.includes('docente') && !p.categorias.includes('estudiante');
    const permanencia = Math.round((docente ? 230 : 135) + r() * 60 - pop * 1.3);
    return {
      id: p.id,
      nombre: p.nombre.replace('Parqueadero ', '').replace('Parqueo ', ''),
      rotacion: +(((11 * 60) / permanencia) * Math.min(1, pop) * (0.8 + r() * 0.2)).toFixed(2),
      permanencia,
      permanenciaH: +(permanencia / 60).toFixed(1),
      largaEstancia: Math.round((docente ? 22 : 9) + r() * 8), // % de autos > 6 h
    };
  });
}

/** Ocupación pico semanal del semestre: real hasta la semana actual y proyección hasta la 18. */
export function proyeccionSemestre(semanaActual = 9) {
  const r = rng(77);
  return Array.from({ length: 18 }, (_, i) => {
    const s = i + 1;
    // inicio de semestre alto, baja a mitad, sube en evaluaciones (sem 8–9 y 16–17)
    const base = 78 + 10 * Math.exp(-((s - 1) ** 2) / 6) + 9 * Math.exp(-((s - 8.5) ** 2) / 1.5) + 11 * Math.exp(-((s - 16.5) ** 2) / 1.8) - s * 0.25;
    const real = s <= semanaActual ? Math.round(base + (r() - 0.5) * 4) : null;
    const proy = s >= semanaActual ? Math.round(base + 1.5) : null;
    return { semana: `S${s}`, real, proyeccion: proy, min: proy !== null ? Math.round(base - 3) : null, max: proy !== null ? Math.min(100, Math.round(base + 6)) : null };
  });
}

/** Probabilidad (%) de encontrar el parqueadero lleno por hora, para la vista móvil. */
export function probabilidadLleno(id: string): { hora: string; prob: number }[] {
  const pop = POPULARIDAD[id] ?? 1;
  return HORAS.map((h) => {
    const occ = curvaHora(h * 60 + 30) * pop;
    return { hora: `${h}h`, prob: Math.round(Math.min(0.98, Math.max(0.02, (occ - 0.62) * 2.6)) * 100) };
  });
}

// ---------------------------------------------------------------- reportería: dato → hallazgo → decisión
export const HORA_PICO = 10;

/** Demanda en la hora pico frente a la capacidad: cuántas plazas faltan y con qué frecuencia se satura. */
export function deficit() {
  return PARQUEADEROS.map((p, i) => {
    const pop = POPULARIDAD[p.id] ?? 1;
    const demanda = Math.round(p.capacidad * curvaHora(HORA_PICO * 60 + 30) * pop * 1.3);
    const faltan = Math.max(0, demanda - p.capacidad);
    const r = rng(i * 13 + 2);
    const diasSaturado = Math.min(100, Math.max(0, Math.round((pop - 0.78) * 260 + r() * 8)));
    return { id: p.id, nombre: p.nombre.replace(/^Parqueadero |^Parqueo /, ''), capacidad: p.capacidad, demanda, faltan, diasSaturado };
  }).sort((a, b) => b.faltan - a.faltan || b.diasSaturado - a.diasSaturado);
}

/** Impacto de ParkiPol por semana (se lanzó en la semana 3). */
export function impacto(semanaActual = 9) {
  const r = rng(91);
  let redir = 0;
  return Array.from({ length: semanaActual }, (_, i) => {
    const s = i + 1;
    const busqueda = s < 3 ? 12 + r() * 0.8 : +(4.1 + 7.9 * Math.exp(-(s - 3) * 0.75) + (r() - 0.5) * 0.4).toFixed(1);
    const semana = s < 3 ? 0 : Math.round(380 + (s - 3) * 95 + r() * 60);
    redir += semana;
    return { semana: `S${s}`, busqueda: +busqueda.toFixed(1), redirigidos: semana, acumulado: redir };
  });
}

/** Seguridad: tiempo medio de respuesta de los guardias por semana e incidencias por parqueadero. */
export function seguridad(semanaActual = 9) {
  const r = rng(57);
  const semanas = Array.from({ length: semanaActual }, (_, i) => ({ semana: `S${i + 1}`, respuesta: +(i < 2 ? 21 - i + r() * 2 : 6.2 + 11 * Math.exp(-(i - 2) * 0.7) + r()).toFixed(1) }));
  const porLote = PARQUEADEROS.map((p, i) => ({ nombre: p.nombre.replace(/^Parqueadero |^Parqueo /, ''), incidencias: Math.round((POPULARIDAD[p.id] ?? 1) * 14 * (0.6 + rng(i * 7 + 1)() * 0.8)) }))
    .sort((a, b) => b.incidencias - a.incidencias).slice(0, 6);
  return { semanas, porLote };
}

/** Proyección del semestre con escenarios: habilitar Coliseo Nuevo en evaluaciones y límite de 6 h. */
export function escenario(coliseo: boolean, limite: boolean) {
  return proyeccionSemestre().map((d, i) => {
    const s = i + 1;
    const evaluaciones = Math.exp(-((s - 8.5) ** 2) / 1.5) + Math.exp(-((s - 16.5) ** 2) / 1.8);
    const baja = (coliseo ? 13 * evaluaciones : 0) + (limite ? 3.5 : 0);
    const base = d.proyeccion ?? d.real;
    return { ...d, escenario: s >= 9 && (coliseo || limite) && base !== null ? Math.round(base - baja) : null };
  });
}
