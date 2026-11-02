export type Categoria = 'estudiante' | 'docente' | 'administrativo';
export type Plan = 'gratis' | 'plus' | 'premium';

export interface Parqueadero {
  id: string;
  osmId: number;
  nombre: string;
  capacidad: number;
  categorias: Categoria[];
  preferenciales: number;
  camaras: number;
  centro: [number, number];
  poligono: [number, number][];
}

export interface Destino {
  id: string;
  nombre: string;
  pos: [number, number];
}

export interface EstadoLote {
  ocupados: number;
  /** autos por minuto (+ entran, − salen), promedio reciente */
  tendencia: number;
  cerrado: string | null;
  camarasOnline: number;
}

export type TipoIncidencia = 'mal_estacionado' | 'dano' | 'obstruccion' | 'seguridad' | 'otro';
export type EstadoIncidencia = 'nueva' | 'en_atencion' | 'resuelta';

export interface Incidencia {
  id: string;
  parqueaderoId: string;
  tipo: TipoIncidencia;
  descripcion: string;
  origen: 'usuario' | 'camara';
  usuario?: string;
  foto?: string;
  estado: EstadoIncidencia;
  creada: number;
  /** canal con el grupo de guardias de seguridad */
  mensajes?: MensajeGuardia[];
  guardia?: string;
}

export interface MensajeGuardia {
  id: string;
  ts: number;
  de: 'control' | 'guardia';
  autor: string;
  texto: string;
}

export interface Admin {
  nombre: string;
  correo: string;
}

export type TipoEvento = 'entrada' | 'salida' | 'incidencia' | 'cierre' | 'apertura' | 'camara' | 'pago' | 'alerta' | 'calificacion';

export interface Evento {
  id: string;
  ts: number;
  tipo: TipoEvento;
  texto: string;
  parqueaderoId?: string;
}

export interface Usuario {
  nombre: string;
  correo: string;
  categoria: Categoria;
  plan: Plan;
  consultasHoy: number;
}

export interface Pago {
  id: string;
  ts: number;
  concepto: string;
  monto: number;
  cliente: string;
  metodo: string;
  comprobante: string;
}

export interface Calificacion {
  id: string;
  parqueaderoId: string;
  estrellas: number;
  comentario: string;
  ts: number;
}

export interface Anuncio {
  id: string;
  cliente: string;
  titulo: string;
  texto: string;
  color: string;
  emoji: string;
  activo: boolean;
  impresiones: number;
  clics: number;
}

export interface Notificacion {
  id: string;
  ts: number;
  titulo: string;
  texto: string;
  tono: 'info' | 'alerta' | 'ok';
}
