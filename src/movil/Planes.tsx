import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { PLANES } from '../data/catalogos';
import { useParki } from '../store';
import type { Plan } from '../types';

export default function Planes() {
  const nav = useNavigate();
  const loc = useLocation() as { state?: { agotado?: boolean } };
  const u = useParki((s) => s.usuario)!;
  return (
    <div>
      <header className="m-header con-volver">
        <button className="icon-btn" onClick={() => nav(-1)}><ArrowLeft size={20} /></button>
        <h1 className="h-chico">Planes</h1><span />
      </header>
      <div className="pad">
        {loc.state?.agotado && <div className="banner-alerta">Usaste tus {PLANES[u.plan].consultas} consultas de hoy. Mejora tu plan para seguir consultando.</div>}
        {(Object.keys(PLANES) as Plan[]).map((k) => {
          const pl = PLANES[k];
          const actual = u.plan === k;
          return (
            <div key={k} className={`plan-card ${k}${actual ? ' actual' : ''}`}>
              <div className="plan-top">
                <b>{pl.nombre}</b>
                <span className="precio">{pl.precio ? `$${pl.precio.toFixed(2)}` : 'Gratis'}{pl.precio ? <small>/mes</small> : null}</span>
              </div>
              <ul>{pl.beneficios.map((b) => <li key={b}><Check size={14} /> {b}</li>)}</ul>
              {actual ? <button className="btn" disabled>Tu plan actual</button>
                : k !== 'gratis' && <button className="btn primario" onClick={() => nav(`/app/pago/${k}`)}>Elegir {pl.nombre}</button>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
