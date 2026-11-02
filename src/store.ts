import { create } from 'zustand';
import { PARQUEADEROS } from './data/parqueaderos';
import { ANUNCIOS_INICIALES, PLANES, TIPOS_INCIDENCIA, curvaHora } from './data/catalogos';
import { POPULARIDAD } from './data/historico';
import type {
  Admin, MensajeGuardia, Anuncio, Calificacion, Categoria, EstadoIncidencia, EstadoLote, Evento, Incidencia, Notificacion, Pago, Plan,
  TipoEvento, TipoIncidencia, Usuario,
} from './types';

/**
 * Estado compartido entre pestañas (app móvil y panel admin) vía localStorage:
 * lo que se haga en una pestaña aparece en la otra al instante. Una sola pestaña
 * ("líder") corre la simulación para que no avance dos veces.
 */
export interface Compartido {
  version: number;
  hora: number; // minutos desde medianoche (reloj simulado del campus)
  simActiva: boolean;
  velocidad: number; // minutos simulados por tick (1 tick ≈ 1.2 s)
  lotes: Record<string, EstadoLote>;
  incidencias: Incidencia[];
  eventos: Evento[];
  pagos: Pago[];
  calificaciones: Calificacion[];
  anuncios: Anuncio[];
  usuario: Usuario | null;
  admin: Admin | null;
  favorito: string | null;
  notificaciones: Notificacion[];
  serie: { hora: number; ocupacion: number }[];
}

const CLAVE = 'parkipol-estado-v2';
const VERSION = 2;
// Modo guion (?guion): azar con semilla fija y estado expuesto para grabar el video.
export const MODO_GUION = typeof location !== 'undefined' && new URLSearchParams(location.search).has('guion');
let semilla = 20261102;
const azar = MODO_GUION ? () => { semilla = (semilla * 1664525 + 1013904223) >>> 0; return semilla / 4294967296; } : Math.random;
const uid = () => azar().toString(36).slice(2, 9);
export const lotePorId = (id: string) => PARQUEADEROS.find((p) => p.id === id)!;

export function objetivo(id: string, hora: number) {
  const p = lotePorId(id);
  return Math.round(p.capacidad * Math.min(0.99, curvaHora(hora) * (POPULARIDAD[id] ?? 1)));
}

function estadoInicial(): Compartido {
  const hora = 8 * 60 + 40;
  const lotes: Record<string, EstadoLote> = {};
  PARQUEADEROS.forEach((p) => {
    lotes[p.id] = { ocupados: objetivo(p.id, hora), tendencia: 0.8, cerrado: null, camarasOnline: p.camaras };
  });
  const ahora = Date.now();
  const incidencias: Incidencia[] = [
    { id: uid(), parqueaderoId: 'fiec-fimcp', tipo: 'mal_estacionado', descripcion: 'Camioneta ocupando dos plazas en la fila C.', origen: 'camara', estado: 'en_atencion', creada: ahora - 38 * 60000 },
    { id: uid(), parqueaderoId: 'biblioteca', tipo: 'dano', descripcion: 'Reductor de velocidad roto a la entrada.', origen: 'usuario', usuario: 'Andrea Castillo', estado: 'nueva', creada: ahora - 95 * 60000 },
    { id: uid(), parqueaderoId: 'fcsh', tipo: 'obstruccion', descripcion: 'Contenedor de basura bloqueando la salida.', origen: 'usuario', usuario: 'Kevin Mora', estado: 'resuelta', creada: ahora - 26 * 3600000 },
  ];
  const pagos: Pago[] = [
    { id: uid(), ts: ahora - 3 * 3600000, concepto: 'Plan Premium · mensual', monto: 3.99, cliente: 'María Vera', metodo: 'Visa •••• 1881', comprobante: 'PKP-004812' },
    { id: uid(), ts: ahora - 5 * 3600000, concepto: 'Plan Plus · mensual', monto: 1.99, cliente: 'Luis Andrade', metodo: 'Mastercard •••• 0034', comprobante: 'PKP-004811' },
    { id: uid(), ts: ahora - 26 * 3600000, concepto: 'Anuncio · Copias Express · 30 días', monto: 45, cliente: 'Copias Express', metodo: 'Transferencia', comprobante: 'PKP-004790' },
    { id: uid(), ts: ahora - 50 * 3600000, concepto: 'Anuncio · Sweet & Coffee · 30 días', monto: 60, cliente: 'Sweet & Coffee', metodo: 'Visa •••• 7720', comprobante: 'PKP-004771' },
  ];
  const calificaciones: Calificacion[] = PARQUEADEROS.flatMap((p, i) => [
    { id: uid(), parqueaderoId: p.id, estrellas: 3 + (i % 3), comentario: '', ts: ahora - i * 3600000 },
    { id: uid(), parqueaderoId: p.id, estrellas: 4 + (i % 2), comentario: '', ts: ahora - i * 7200000 },
  ]);
  return {
    version: VERSION, hora, simActiva: true, velocidad: 1, lotes, incidencias,
    eventos: [{ id: uid(), ts: ahora, tipo: 'camara', texto: 'Sistema iniciado · 34 cámaras con visión por computadora en línea' }],
    pagos, calificaciones, anuncios: ANUNCIOS_INICIALES, usuario: null, admin: null, favorito: null, notificaciones: [],
    serie: Array.from({ length: 40 }, (_, k) => {
      const h = hora - (40 - k) * 3;
      const tot = PARQUEADEROS.reduce((a, p) => a + objetivo(p.id, h), 0);
      return { hora: h, ocupacion: Math.round((tot / PARQUEADEROS.reduce((a, p) => a + p.capacidad, 0)) * 100) };
    }),
  };
}

function cargar(): Compartido {
  try {
    const raw = localStorage.getItem(CLAVE);
    if (raw) {
      const s = JSON.parse(raw) as Compartido;
      if (s.version === VERSION) return s;
    }
  } catch { /* sin localStorage: arranca limpio */ }
  return estadoInicial();
}

interface Acciones {
  login: (nombre: string, correo: string, categoria: Categoria) => void;
  logout: () => void;
  loginAdmin: (correo: string) => void;
  logoutAdmin: () => void;
  notificarGuardias: (id: string) => void;
  consumirConsulta: () => boolean;
  reportar: (d: { parqueaderoId: string; tipo: TipoIncidencia; descripcion: string; foto?: string }) => void;
  estadoIncidencia: (id: string, estado: EstadoIncidencia) => void;
  calificar: (parqueaderoId: string, estrellas: number, comentario: string) => void;
  pagarPlan: (plan: Plan, metodo: string) => Pago;
  setFavorito: (id: string | null) => void;
  descartarNotificacion: (id: string) => void;
  toggleAnuncio: (id: string) => void;
  clicAnuncio: (id: string) => void;
  impresionAnuncio: (id: string) => void;
  // demo
  tick: () => void;
  setHora: (min: number) => void;
  setSim: (activa: boolean) => void;
  setVelocidad: (v: number) => void;
  llenar: (id: string) => void;
  liberar: (id: string, n: number) => void;
  cerrar: (id: string, motivo: string) => void;
  abrir: (id: string) => void;
  camaraOffline: (id: string) => void;
  camaraOnline: (id: string) => void;
  incidenciaCamara: (id: string) => void;
  horaPico: () => void;
  reiniciar: () => void;
}

export type Store = Compartido & Acciones;

const fmtHora = (m: number) => `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(Math.floor(m % 60)).padStart(2, '0')}`;
export { fmtHora };

export const useParki = create<Store>((set, get) => {
  const ev = (tipo: TipoEvento, texto: string, parqueaderoId?: string): Evento => ({ id: uid(), ts: Date.now(), tipo, texto, parqueaderoId });
  const conEvento = (s: Compartido, e: Evento) => [e, ...s.eventos].slice(0, 80);
  const notif = (s: Compartido, titulo: string, texto: string, tono: Notificacion['tono']) =>
    [{ id: uid(), ts: Date.now(), titulo, texto, tono }, ...s.notificaciones].slice(0, 6);

  return {
    ...cargar(),

    login: (nombre, correo, categoria) =>
      set({ usuario: { nombre, correo, categoria, plan: 'gratis', consultasHoy: 0 } }),
    logout: () => set({ usuario: null }),
    loginAdmin: (correo) => set({ admin: { nombre: 'Ing. Carlos Hidalgo', correo } }),
    logoutAdmin: () => set({ admin: null }),

    // El centro de control avisa al grupo de guardias; el más cercano responde y luego reporta la resolución.
    notificarGuardias: (id) => {
      const inc = get().incidencias.find((i) => i.id === id);
      if (!inc || inc.estado === 'resuelta') return;
      const lote = lotePorId(inc.parqueaderoId);
      const msg = (de: MensajeGuardia['de'], autor: string, texto: string): MensajeGuardia => ({ id: uid(), ts: Date.now(), de, autor, texto });
      const agregar = (m: MensajeGuardia, cambios: Partial<Incidencia> = {}) =>
        set((s) => ({ incidencias: s.incidencias.map((i) => (i.id === id ? { ...i, ...cambios, mensajes: [...(i.mensajes ?? []), m] } : i)) }));
      const guardias = ['Guardia R. Salazar', 'Guardia M. Quimí', 'Guardia J. Villón', 'Guardia L. Tomalá'];
      const guardia = guardias[lote.nombre.length % guardias.length];
      agregar(msg('control', 'Centro de control', `Atención en ${lote.nombre}: ${TIPOS_INCIDENCIA[inc.tipo].toLowerCase()}. ${inc.descripcion.trim().replace(/[.\s]*$/, '.')} El guardia más cercano, por favor acérquese y confirme.`), { estado: 'en_atencion' });
      set((s) => ({ eventos: conEvento(s, ev('incidencia', `Grupo de seguridad notificado: ${lote.nombre}`, lote.id)) }));
      setTimeout(() => agregar(msg('guardia', guardia, `Recibido, estoy en la garita más cercana. Voy para ${lote.nombre.replace(/^Parqueadero |^Parqueo /, '')}, llego en 2 min.`), { guardia }), 4000);
      setTimeout(() => {
        const cierre = inc.tipo === 'mal_estacionado' ? 'Ubiqué al conductor y movió el vehículo. Plazas liberadas.'
          : inc.tipo === 'obstruccion' ? 'Se retiró el objeto. El paso quedó despejado.'
          : inc.tipo === 'dano' ? 'Zona señalizada con conos. Se reportó a mantenimiento para la reparación.'
          : 'Situación verificada y controlada. Sin novedad.';
        agregar(msg('guardia', guardia, `Resuelto: ${cierre}`), { estado: 'resuelta' });
        set((s) => ({
          eventos: conEvento(s, ev('apertura', `${guardia} resolvió la incidencia en ${lote.nombre}`, lote.id)),
          notificaciones: inc.origen === 'usuario' ? notif(s, 'Incidencia resuelta', `Seguridad atendió tu reporte en ${lote.nombre}. ¡Gracias!`, 'ok') : s.notificaciones,
        }));
      }, 13000);
    },

    consumirConsulta: () => {
      const u = get().usuario;
      if (!u) return false;
      const lim = PLANES[u.plan].consultas;
      if (lim !== null && u.consultasHoy >= lim) return false;
      set({ usuario: { ...u, consultasHoy: u.consultasHoy + 1 } });
      return true;
    },

    reportar: ({ parqueaderoId, tipo, descripcion, foto }) =>
      set((s) => {
        const inc: Incidencia = { id: uid(), parqueaderoId, tipo, descripcion, foto, origen: 'usuario', usuario: s.usuario?.nombre ?? 'Usuario', estado: 'nueva', creada: Date.now() };
        return {
          incidencias: [inc, ...s.incidencias],
          eventos: conEvento(s, ev('incidencia', `Nuevo reporte: ${TIPOS_INCIDENCIA[tipo]} en ${lotePorId(parqueaderoId).nombre}`, parqueaderoId)),
        };
      }),

    estadoIncidencia: (id, estado) =>
      set((s) => {
        const inc = s.incidencias.find((i) => i.id === id);
        const extra = inc && estado === 'resuelta'
          ? { notificaciones: notif(s, 'Incidencia resuelta', `Tu reporte en ${lotePorId(inc.parqueaderoId).nombre} fue atendido. ¡Gracias!`, 'ok') }
          : {};
        return { incidencias: s.incidencias.map((i) => (i.id === id ? { ...i, estado } : i)), ...extra };
      }),

    calificar: (parqueaderoId, estrellas, comentario) =>
      set((s) => ({
        calificaciones: [{ id: uid(), parqueaderoId, estrellas, comentario, ts: Date.now() }, ...s.calificaciones],
        eventos: conEvento(s, ev('calificacion', `${s.usuario?.nombre ?? 'Un usuario'} calificó ${lotePorId(parqueaderoId).nombre} con ${estrellas}★`, parqueaderoId)),
      })),

    pagarPlan: (plan, metodo) => {
      const s = get();
      const pago: Pago = {
        id: uid(), ts: Date.now(), concepto: `Plan ${PLANES[plan].nombre} · mensual`, monto: PLANES[plan].precio,
        cliente: s.usuario?.nombre ?? 'Usuario', metodo, comprobante: `PKP-${String(4813 + s.pagos.length).padStart(6, '0')}`,
      };
      set({
        pagos: [pago, ...s.pagos],
        usuario: s.usuario ? { ...s.usuario, plan } : s.usuario,
        eventos: conEvento(s, ev('pago', `Pago recibido: ${pago.concepto} · $${pago.monto.toFixed(2)} (${pago.cliente})`)),
      });
      return pago;
    },

    setFavorito: (id) => set({ favorito: id }),
    descartarNotificacion: (id) => set((s) => ({ notificaciones: s.notificaciones.filter((n) => n.id !== id) })),
    toggleAnuncio: (id) => set((s) => ({ anuncios: s.anuncios.map((a) => (a.id === id ? { ...a, activo: !a.activo } : a)) })),
    clicAnuncio: (id) => set((s) => ({ anuncios: s.anuncios.map((a) => (a.id === id ? { ...a, clics: a.clics + 1 } : a)) })),
    impresionAnuncio: (id) => set((s) => ({ anuncios: s.anuncios.map((a) => (a.id === id ? { ...a, impresiones: a.impresiones + 1 } : a)) })),

    // ---------------- simulación ----------------
    tick: () =>
      set((s) => {
        const hora = (s.hora + s.velocidad) % 1440;
        const lotes = { ...s.lotes };
        let eventos = s.eventos;
        let notificaciones = s.notificaciones;
        let incidencias = s.incidencias;
        const movimientos: { id: string; delta: number }[] = [];

        for (const p of PARQUEADEROS) {
          const l = lotes[p.id];
          const meta = l.cerrado ? 0 : objetivo(p.id, hora);
          const ruido = (azar() - 0.5) * 3;
          let delta = Math.round((meta - l.ocupados) * (l.cerrado ? 0.12 : 0.22) * Math.min(3, s.velocidad) + ruido);
          if (l.cerrado && delta > 0) delta = 0;
          const ocupados = Math.max(0, Math.min(p.capacidad, l.ocupados + delta));
          const real = ocupados - l.ocupados;
          lotes[p.id] = { ...l, ocupados, tendencia: +(l.tendencia * 0.6 + (real / Math.max(1, s.velocidad)) * 0.4).toFixed(2) };
          if (real) movimientos.push({ id: p.id, delta: real });

          const antes = l.ocupados / p.capacidad;
          const ahora = ocupados / p.capacidad;
          if (antes < 0.95 && ahora >= 0.95) {
            eventos = [ev('alerta', `${p.nombre} llegó al ${Math.round(ahora * 100)}% · casi sin espacios`, p.id), ...eventos];
            if (s.favorito === p.id) notificaciones = [{ id: uid(), ts: Date.now(), titulo: `${p.nombre} se está llenando`, texto: `Quedan ${p.capacidad - ocupados} espacios. Te sugerimos una alternativa.`, tono: 'alerta' as const }, ...notificaciones];
          }
          if (antes >= 0.95 && ahora < 0.9) {
            eventos = [ev('apertura', `Se liberaron espacios en ${p.nombre} (${p.capacidad - ocupados} libres)`, p.id), ...eventos];
            if (s.favorito === p.id) notificaciones = [{ id: uid(), ts: Date.now(), titulo: `¡Hay espacio en ${p.nombre}!`, texto: `Se liberaron ${p.capacidad - ocupados} espacios en tu parqueadero favorito.`, tono: 'ok' as const }, ...notificaciones];
          }
        }

        // un movimiento visible en el feed por tick (detección de cámara)
        if (movimientos.length) {
          const m = movimientos[Math.floor(azar() * movimientos.length)];
          const p = lotePorId(m.id);
          const cam = `CAM-${m.id.toUpperCase().slice(0, 6)}-0${1 + Math.floor(azar() * p.camaras)}`;
          eventos = [ev(m.delta > 0 ? 'entrada' : 'salida', `${cam} · ${m.delta > 0 ? 'ingresaron' : 'salieron'} ${Math.abs(m.delta)} vehículo${Math.abs(m.delta) > 1 ? 's' : ''} en ${p.nombre}`, m.id), ...eventos];
        }

        // de vez en cuando la visión por computadora detecta un auto mal estacionado
        if (!MODO_GUION && azar() < 0.012) {
          const p = PARQUEADEROS[Math.floor(azar() * PARQUEADEROS.length)];
          incidencias = [{ id: uid(), parqueaderoId: p.id, tipo: 'mal_estacionado', descripcion: 'Detección automática: vehículo ocupando dos plazas.', origen: 'camara', estado: 'nueva', creada: Date.now() }, ...incidencias];
          eventos = [ev('incidencia', `Visión por computadora: vehículo mal estacionado en ${p.nombre}`, p.id), ...eventos];
        }

        const total = PARQUEADEROS.reduce((a, p) => a + lotes[p.id].ocupados, 0);
        const cap = PARQUEADEROS.reduce((a, p) => a + p.capacidad, 0);
        return {
          hora, lotes, incidencias, notificaciones: notificaciones.slice(0, 6), eventos: eventos.slice(0, 80),
          serie: [...s.serie, { hora, ocupacion: Math.round((total / cap) * 100) }].slice(-240),
        };
      }),

    setHora: (min) =>
      set((s) => {
        const lotes = { ...s.lotes };
        PARQUEADEROS.forEach((p) => { if (!lotes[p.id].cerrado) lotes[p.id] = { ...lotes[p.id], ocupados: objetivo(p.id, min) }; });
        return { hora: min, lotes, eventos: MODO_GUION ? s.eventos : conEvento(s, ev('camara', `Reloj de demo movido a las ${fmtHora(min)}`)) };
      }),
    setSim: (simActiva) => set({ simActiva }),
    setVelocidad: (velocidad) => set({ velocidad }),

    llenar: (id) =>
      set((s) => {
        const p = lotePorId(id);
        return {
          lotes: { ...s.lotes, [id]: { ...s.lotes[id], ocupados: p.capacidad - 1, tendencia: 4 } },
          eventos: conEvento(s, ev('alerta', `${p.nombre} llegó al ${Math.round(((p.capacidad - 1) / p.capacidad) * 100)}% · casi sin espacios`, id)),
          notificaciones: s.favorito === id ? notif(s, `${p.nombre} se llenó`, 'Queda 1 espacio. Te sugerimos una alternativa cercana.', 'alerta') : s.notificaciones,
        };
      }),
    liberar: (id, n) =>
      set((s) => {
        const p = lotePorId(id);
        const ocupados = Math.max(0, s.lotes[id].ocupados - n);
        return {
          lotes: { ...s.lotes, [id]: { ...s.lotes[id], ocupados, tendencia: -3 } },
          eventos: conEvento(s, ev('apertura', `Se liberaron ${n} espacios en ${p.nombre} (${p.capacidad - ocupados} libres)`, id)),
          notificaciones: s.favorito === id ? notif(s, `¡Hay espacio en ${p.nombre}!`, `Se liberaron ${n} espacios en tu parqueadero favorito.`, 'ok') : s.notificaciones,
        };
      }),
    cerrar: (id, motivo) =>
      set((s) => ({
        lotes: { ...s.lotes, [id]: { ...s.lotes[id], cerrado: motivo } },
        eventos: conEvento(s, ev('cierre', `${lotePorId(id).nombre} cerrado: ${motivo}`, id)),
        notificaciones: notif(s, 'Cambio en los parqueaderos', `${lotePorId(id).nombre} está cerrado por ${motivo.toLowerCase()}. Elige otra alternativa.`, 'alerta'),
      })),
    abrir: (id) =>
      set((s) => ({
        lotes: { ...s.lotes, [id]: { ...s.lotes[id], cerrado: null } },
        eventos: conEvento(s, ev('apertura', `${lotePorId(id).nombre} habilitado nuevamente`, id)),
      })),
    camaraOffline: (id) =>
      set((s) => ({
        lotes: { ...s.lotes, [id]: { ...s.lotes[id], camarasOnline: Math.max(0, s.lotes[id].camarasOnline - 1) } },
        eventos: conEvento(s, ev('alerta', `Cámara sin señal en ${lotePorId(id).nombre}`, id)),
      })),
    camaraOnline: (id) =>
      set((s) => ({
        lotes: { ...s.lotes, [id]: { ...s.lotes[id], camarasOnline: lotePorId(id).camaras } },
        eventos: conEvento(s, ev('camara', `Cámaras restablecidas en ${lotePorId(id).nombre}`, id)),
      })),
    incidenciaCamara: (id) =>
      set((s) => ({
        incidencias: [{ id: uid(), parqueaderoId: id, tipo: 'mal_estacionado', descripcion: 'Detección automática: vehículo ocupando dos plazas.', origen: 'camara', estado: 'nueva', creada: Date.now() }, ...s.incidencias],
        eventos: conEvento(s, ev('incidencia', `Visión por computadora: vehículo mal estacionado en ${lotePorId(id).nombre}`, id)),
      })),
    horaPico: () => {
      get().setHora(9 * 60 + 55);
    },
    reiniciar: () => set((s) => ({ ...estadoInicial(), usuario: s.usuario, admin: s.admin })),
  };
});

// ---------------- sincronización entre pestañas ----------------
const CAMPOS: (keyof Compartido)[] = ['version', 'hora', 'simActiva', 'velocidad', 'lotes', 'incidencias', 'eventos', 'pagos', 'calificaciones', 'anuncios', 'usuario', 'admin', 'favorito', 'notificaciones', 'serie'];
let aplicandoRemoto = false;

function guardar(s: Compartido) {
  try {
    const o: Record<string, unknown> = {};
    CAMPOS.forEach((k) => (o[k] = s[k]));
    localStorage.setItem(CLAVE, JSON.stringify(o));
  } catch { /* lleno o bloqueado */ }
}

useParki.subscribe((s) => { if (!aplicandoRemoto) guardar(s); });
window.addEventListener('storage', (e) => {
  if (e.key !== CLAVE || !e.newValue) return;
  try {
    aplicandoRemoto = true;
    useParki.setState(JSON.parse(e.newValue));
  } finally {
    aplicandoRemoto = false;
  }
});

// líder de la simulación: la primera pestaña viva; si se cierra, otra toma el relevo
const yo = uid();
setInterval(() => {
  try {
    const l = JSON.parse(localStorage.getItem('parkipol-lider') || 'null') as { id: string; ts: number } | null;
    const soyLider = !l || l.id === yo || Date.now() - l.ts > 3500;
    if (soyLider) {
      localStorage.setItem('parkipol-lider', JSON.stringify({ id: yo, ts: Date.now() }));
      if (useParki.getState().simActiva) useParki.getState().tick();
    }
  } catch { /* noop */ }
}, 1200);

// en modo guion, el estado queda accesible para preparar cada toma desde el grabador
if (MODO_GUION) (window as unknown as { __parki: typeof useParki }).__parki = useParki;
