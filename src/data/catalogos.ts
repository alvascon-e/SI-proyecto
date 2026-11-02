import type { Anuncio, Categoria, Plan, TipoIncidencia } from '../types';

export const CATEGORIAS: Record<Categoria, string> = {
  estudiante: 'Estudiante',
  docente: 'Docente',
  administrativo: 'Administrativo',
};

export const TIPOS_INCIDENCIA: Record<TipoIncidencia, string> = {
  mal_estacionado: 'Vehículo mal estacionado',
  dano: 'Daño en la infraestructura',
  obstruccion: 'Obstrucción del paso',
  seguridad: 'Seguridad',
  otro: 'Otro',
};

export const PLANES: Record<Plan, { nombre: string; precio: number; consultas: number | null; beneficios: string[] }> = {
  gratis: {
    nombre: 'Gratis',
    precio: 0,
    consultas: 10,
    beneficios: ['10 consultas de disponibilidad al día', 'Mapa en tiempo real', 'Reporte de incidencias'],
  },
  plus: {
    nombre: 'Plus',
    precio: 1.99,
    consultas: 40,
    beneficios: ['40 consultas al día', 'Recomendación de parqueo óptimo', 'Alertas cuando tu parqueadero se llena', 'Sin anuncios'],
  },
  premium: {
    nombre: 'Premium',
    precio: 3.99,
    consultas: null,
    beneficios: ['Consultas ilimitadas', 'Todo lo de Plus', 'Probabilidad de ocupación por hora', 'Parqueadero favorito con aviso cuando se libera'],
  },
};

export const ANUNCIOS_INICIALES: Anuncio[] = [
  { id: 'ad1', cliente: 'Sweet & Coffee ESPOL', titulo: '2x1 en capuchino', texto: 'Muestra ParkiPol en caja · Bloque 9', color: '#7a4b2a', emoji: '☕', activo: true, impresiones: 18240, clics: 612 },
  { id: 'ad2', cliente: 'Copias Express', titulo: 'Impresiones a $0.05', texto: 'Frente al parqueadero FIEC–FIMCP', color: '#0f766e', emoji: '🖨️', activo: true, impresiones: 12115, clics: 398 },
  { id: 'ad3', cliente: 'Lubricadora La Prosperina', titulo: 'Cambio de aceite −15%', texto: 'A 5 min del campus, Vía Perimetral', color: '#b45309', emoji: '🛠️', activo: true, impresiones: 9802, clics: 221 },
  { id: 'ad4', cliente: 'Banco del Pacífico', titulo: 'Cuenta Joven sin costo', texto: 'Agencia junto al Rectorado', color: '#1d4ed8', emoji: '🏦', activo: false, impresiones: 4410, clics: 87 },
];

/** Curva de ocupación típica del campus por hora (0–1), lunes a viernes. */
export function curvaHora(minutos: number): number {
  const h = minutos / 60;
  const g = (c: number, w: number, a: number) => a * Math.exp(-((h - c) ** 2) / (2 * w * w));
  return Math.min(0.99, 0.04 + g(10, 1.7, 0.86) + g(15, 1.6, 0.7) + g(19.2, 1.0, 0.25));
}
