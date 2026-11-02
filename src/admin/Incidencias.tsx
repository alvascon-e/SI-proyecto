import { useState } from 'react';
import { Bot, ChevronRight, Radio, ShieldCheck, User, X } from 'lucide-react';
import { TIPOS_INCIDENCIA } from '../data/catalogos';
import { lotePorId, useParki } from '../store';
import { hace, horaReloj } from '../util';
import type { EstadoIncidencia, Incidencia } from '../types';

const ETIQUETA: Record<EstadoIncidencia, string> = { nueva: 'Nueva', en_atencion: 'En atención', resuelta: 'Resuelta' };
const corto = (n: string) => n.replace(/^Parqueadero |^Parqueo /, '');

function Detalle({ inc, cerrar }: { inc: Incidencia; cerrar: () => void }) {
  const notificar = useParki((s) => s.notificarGuardias);
  const resolver = useParki((s) => s.estadoIncidencia);
  const lote = lotePorId(inc.parqueaderoId);
  const notificada = (inc.mensajes?.length ?? 0) > 0;
  return (
    <div className="drawer-fondo" onClick={cerrar}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-head">
          <div><div className="eyebrow">{inc.origen === 'camara' ? 'Detección automática' : `Reporte de ${inc.usuario}`}</div><h2>{TIPOS_INCIDENCIA[inc.tipo]}</h2></div>
          <button className="icon-btn" onClick={cerrar}><X size={18} /></button>
        </div>
        <div className="drawer-meta">
          <span className={`est est-${inc.estado}`}>{ETIQUETA[inc.estado]}</span>
          <span>{lote.nombre}</span><span>·</span><span>{hace(inc.creada)}</span>
        </div>
        <p className="drawer-desc">{inc.descripcion}</p>
        {inc.foto && <img src={inc.foto} className="drawer-foto" alt="Foto del reporte" />}

        <div className="canal">
          <div className="canal-head"><Radio size={16} /><div><b>Grupo de seguridad · Campus</b><small>14 guardias en turno</small></div></div>
          <div className="canal-msgs">
            {!notificada && <div className="canal-vacio">Aún no se notificó al equipo de seguridad.</div>}
            {inc.mensajes?.map((m) => (
              <div key={m.id} className={`burbuja ${m.de}`}>
                <b>{m.autor}</b>
                <span>{m.texto}</span>
                <small>{horaReloj(m.ts)}</small>
              </div>
            ))}
            {notificada && inc.estado === 'en_atencion' && <div className="escribiendo"><i /><i /><i /></div>}
          </div>
        </div>

        <div className="drawer-acciones">
          {!notificada && inc.estado !== 'resuelta' && <button className="btn primario grande" onClick={() => notificar(inc.id)}><Radio size={16} /> Notificar al grupo de guardias</button>}
          {inc.estado !== 'resuelta' && <button className="btn grande" onClick={() => resolver(inc.id, 'resuelta')}><ShieldCheck size={16} /> Marcar como resuelta</button>}
        </div>
      </aside>
    </div>
  );
}

export default function Incidencias() {
  const incidencias = useParki((s) => s.incidencias);
  const [filtro, setFiltro] = useState<EstadoIncidencia | 'todas'>('todas');
  const [abierta, setAbierta] = useState<string | null>(null);
  const lista = incidencias.filter((i) => filtro === 'todas' || i.estado === filtro);
  const actual = incidencias.find((i) => i.id === abierta);
  return (
    <div>
      <div className="fila-sb">
        <div className="a-head"><h1 className="a-titulo">Incidencias</h1><p className="muted">Reportes de usuarios y detecciones de las cámaras, coordinados con seguridad.</p></div>
        <div className="seg">
          {(['todas', 'nueva', 'en_atencion', 'resuelta'] as const).map((f) => (
            <button key={f} className={filtro === f ? 'on' : ''} onClick={() => setFiltro(f)}>
              {f === 'todas' ? 'Todas' : ETIQUETA[f]} <span className="seg-n">{f === 'todas' ? incidencias.length : incidencias.filter((i) => i.estado === f).length}</span>
            </button>
          ))}
        </div>
      </div>
      {actual && <Detalle inc={actual} cerrar={() => setAbierta(null)} />}
      <div className="card sin-pad">
        <table className="tabla tabla-inc">
          <colgroup><col style={{ width: 170 }} /><col style={{ width: 190 }} /><col /><col style={{ width: 70 }} /><col style={{ width: 110 }} /><col style={{ width: 120 }} /><col style={{ width: 40 }} /></colgroup>
          <thead><tr><th>Origen</th><th>Parqueadero</th><th>Incidencia</th><th>Foto</th><th>Recibida</th><th>Estado</th><th /></tr></thead>
          <tbody>
            {lista.map((i) => (
              <tr key={i.id} className={`clic${i.estado === 'nueva' ? ' nueva' : ''}`} onClick={() => setAbierta(i.id)}>
                <td>{i.origen === 'camara' ? <span className="origen ia"><Bot size={15} /> Cámara IA</span> : <span className="origen"><User size={15} /> {i.usuario}</span>}</td>
                <td className="t-nombre">{corto(lotePorId(i.parqueaderoId).nombre)}</td>
                <td><b className="t-tipo">{TIPOS_INCIDENCIA[i.tipo]}</b><span className="t-desc">{i.descripcion}</span></td>
                <td>{i.foto ? <img src={i.foto} className="mini-foto" alt="" /> : <span className="muted">—</span>}</td>
                <td className="nowrap muted">{hace(i.creada)}</td>
                <td><span className={`est est-${i.estado}`}>{ETIQUETA[i.estado]}</span>{i.guardia && i.estado !== 'nueva' && <small className="t-guardia">{i.guardia.replace('Guardia ', '')}</small>}</td>
                <td><ChevronRight size={16} className="chev" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
