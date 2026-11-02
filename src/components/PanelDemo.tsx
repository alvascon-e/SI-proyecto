import { useEffect, useState } from 'react';
import { FlaskConical, X } from 'lucide-react';
import { PARQUEADEROS } from '../data/parqueaderos';
import { MODO_GUION, fmtHora, useParki } from '../store';

// Panel para disparar eventos simulados durante la demo (Shift + D lo muestra/oculta).
export default function PanelDemo() {
  const [abierto, setAbierto] = useState(false);
  const [oculto, setOculto] = useState(false);
  const s = useParki();
  const [lote, setLote] = useState('fiec-fimcp');
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key.toLowerCase() === 'd') { setOculto((o) => !o); setAbierto(false); }
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, []);
  if (oculto || MODO_GUION) return null;
  const p = PARQUEADEROS.find((x) => x.id === lote)!;
  const l = s.lotes[lote];

  if (!abierto)
    return <button className="demo-fab" onClick={() => setAbierto(true)} title="Panel de demo (Shift+D oculta)"><FlaskConical size={18} /><span className="demo-txt">Demo</span></button>;

  return (
    <div className="demo-panel">
      <div className="demo-head">
        <b>Panel de demo</b>
        <span className="muted">Shift+D oculta</span>
        <button className="icon-btn" onClick={() => setAbierto(false)}><X size={16} /></button>
      </div>

      <div className="demo-sec">
        <div className="demo-label">Reloj del campus · <b>{fmtHora(s.hora)}</b></div>
        <input type="range" min={360} max={1320} step={5} value={s.hora} onChange={(e) => s.setHora(+e.target.value)} />
        <div className="demo-row">
          <button onClick={() => s.setSim(!s.simActiva)}>{s.simActiva ? '⏸ Pausar' : '▶ Reanudar'}</button>
          {[1, 3, 10].map((v) => <button key={v} className={s.velocidad === v ? 'on' : ''} onClick={() => s.setVelocidad(v)}>×{v}</button>)}
          <button onClick={() => s.setHora(7 * 60)}>07:00</button>
          <button onClick={s.horaPico}>Hora pico</button>
        </div>
      </div>

      <div className="demo-sec">
        <div className="demo-label">Parqueadero</div>
        <select value={lote} onChange={(e) => setLote(e.target.value)}>
          {PARQUEADEROS.map((x) => <option key={x.id} value={x.id}>{x.nombre}</option>)}
        </select>
        <div className="muted" style={{ margin: '4px 0' }}>{l.ocupados}/{p.capacidad} ocupados · cámaras {l.camarasOnline}/{p.camaras}{l.cerrado ? ` · cerrado (${l.cerrado})` : ''}</div>
        <div className="demo-row">
          <button onClick={() => s.llenar(lote)}>Llenar</button>
          <button onClick={() => s.liberar(lote, 15)}>Liberar 15</button>
          {l.cerrado ? <button onClick={() => s.abrir(lote)}>Reabrir</button> : <button onClick={() => s.cerrar(lote, 'Evento de graduación')}>Cerrar por evento</button>}
        </div>
        <div className="demo-row">
          <button onClick={() => s.incidenciaCamara(lote)}>IA: auto mal estacionado</button>
          {l.camarasOnline < p.camaras ? <button onClick={() => s.camaraOnline(lote)}>Restablecer cámaras</button> : <button onClick={() => s.camaraOffline(lote)}>Cámara sin señal</button>}
        </div>
      </div>

      <div className="demo-sec demo-row">
        <button className="peligro" onClick={() => { s.reiniciar(); }}>Reiniciar datos</button>
      </div>
    </div>
  );
}
