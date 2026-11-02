import { useState } from 'react';
import { Bot, User } from 'lucide-react';
import { TIPOS_INCIDENCIA } from '../data/catalogos';
import { lotePorId, useParki } from '../store';
import { hace } from '../util';
import type { EstadoIncidencia } from '../types';

const ETIQUETA: Record<EstadoIncidencia, string> = { nueva: 'Nueva', en_atencion: 'En atención', resuelta: 'Resuelta' };

export default function Incidencias() {
  const { incidencias, estadoIncidencia } = useParki();
  const [filtro, setFiltro] = useState<EstadoIncidencia | 'todas'>('todas');
  const [foto, setFoto] = useState<string | null>(null);
  const lista = incidencias.filter((i) => filtro === 'todas' || i.estado === filtro);
  return (
    <div>
      <div className="fila-sb">
        <h1 className="a-titulo">Incidencias</h1>
        <div className="seg">
          {(['todas', 'nueva', 'en_atencion', 'resuelta'] as const).map((f) => (
            <button key={f} className={filtro === f ? 'on' : ''} onClick={() => setFiltro(f)}>
              {f === 'todas' ? 'Todas' : ETIQUETA[f]} ({f === 'todas' ? incidencias.length : incidencias.filter((i) => i.estado === f).length})
            </button>
          ))}
        </div>
      </div>
      {foto && <div className="modal" onClick={() => setFoto(null)}><img src={foto} className="modal-img" alt="Foto del reporte" /></div>}
      <div className="card sin-pad">
        <table className="tabla">
          <thead><tr><th>Origen</th><th>Parqueadero</th><th>Tipo</th><th>Descripción</th><th>Foto</th><th>Hace</th><th>Estado</th><th></th></tr></thead>
          <tbody>
            {lista.map((i) => (
              <tr key={i.id} className={i.estado === 'nueva' ? 'nueva' : ''}>
                <td>{i.origen === 'camara' ? <span className="origen ia"><Bot size={14} /> Cámara IA</span> : <span className="origen"><User size={14} /> {i.usuario}</span>}</td>
                <td>{lotePorId(i.parqueaderoId).nombre}</td>
                <td>{TIPOS_INCIDENCIA[i.tipo]}</td>
                <td className="desc">{i.descripcion}</td>
                <td>{i.foto ? <img src={i.foto} className="mini-foto" onClick={() => setFoto(i.foto!)} alt="" /> : '—'}</td>
                <td>{hace(i.creada)}</td>
                <td><span className={`est est-${i.estado}`}>{ETIQUETA[i.estado]}</span></td>
                <td className="nowrap">
                  {i.estado === 'nueva' && <button className="btn chico" onClick={() => estadoIncidencia(i.id, 'en_atencion')}>Asignar guardia</button>}
                  {i.estado !== 'resuelta' && <button className="btn chico primario" onClick={() => estadoIncidencia(i.id, 'resuelta')}>Resolver</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
