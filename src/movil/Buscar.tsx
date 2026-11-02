import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Footprints, MapPin, Sparkles, TrendingUp } from 'lucide-react';
import MapaCampus from '../components/MapaCampus';
import { DESTINOS } from '../data/parqueaderos';
import { useParki } from '../store';
import { COLOR_NIVEL, nivel, recomendar, seLlenaEn } from '../util';
import { useConsulta } from './cuota';

// Recomendación de parqueo óptimo según destino, perfil y espacio previsto al llegar (funcionalidad 2).
export default function Buscar() {
  const { usuario, lotes } = useParki();
  const [destinoId, setDestinoId] = useState<string | null>(null);
  const nav = useNavigate();
  const consultar = useConsulta();
  const destino = DESTINOS.find((d) => d.id === destinoId);
  const opciones = destino ? recomendar(destino.pos, usuario!.categoria, lotes).filter((o) => o.permitido).slice(0, 4) : [];
  const mejor = opciones[0];

  return (
    <div>
      <header className="m-header"><div><div className="eyebrow">Recomendación inteligente</div><h1>¿A dónde vas?</h1></div></header>
      <div className="chips pad wrap">
        {DESTINOS.map((d) => (
          <button key={d.id} className={`chip${destinoId === d.id ? ' on' : ''}`} onClick={() => consultar(() => setDestinoId(d.id))}>
            <MapPin size={13} /> {d.nombre}
          </button>
        ))}
      </div>
      {destino && mejor && (
        <>
          <div className="m-mapa">
            <MapaCampus alto={220} categoria={usuario!.categoria} seleccionado={mejor.p.id} destino={destino.pos}
              encuadre={[destino.pos, ...opciones.map((o) => o.p.centro)]} onSelect={(id) => nav(`/app/p/${id}`)} />
          </div>
          <div className="pad">
            <div className="mejor">
              <div className="mejor-tag"><Sparkles size={14} /> Mejor opción para ti</div>
              <h2>{mejor.p.nombre}</h2>
              <div className="mejor-datos">
                <div><b style={{ color: COLOR_NIVEL[nivel(mejor.p, lotes[mejor.p.id])] }}>{mejor.libres}</b><small>libres ahora</small></div>
                <div><b>~{mejor.prediccion}</b><small>al llegar</small></div>
                <div><b>{mejor.minutosCaminando} min</b><small>a pie a {destino.nombre.split(' –')[0]}</small></div>
              </div>
              <button className="btn primario grande" onClick={() => nav(`/app/ruta/${mejor.p.id}`)}>Llévame ahí</button>
            </div>
            <h3 className="sub">Alternativas</h3>
            {opciones.slice(1).map((o) => {
              const lleno = seLlenaEn(o.p, lotes[o.p.id]);
              return (
                <button key={o.p.id} className="alt" onClick={() => nav(`/app/p/${o.p.id}`)}>
                  <div>
                    <b>{o.p.nombre}</b>
                    <small><Footprints size={12} /> {o.minutosCaminando} min a pie · {o.caminata} m</small>
                    {lleno && lleno < 20 && <small className="alerta-txt"><TrendingUp size={12} /> se llena en ~{lleno} min</small>}
                  </div>
                  <div className="alt-num" style={{ color: COLOR_NIVEL[nivel(o.p, lotes[o.p.id])] }}>{o.libres}<small>libres</small></div>
                </button>
              );
            })}
          </div>
        </>
      )}
      {!destino && <p className="pad muted">Elige tu destino y te sugerimos el parqueadero autorizado más conveniente, considerando cuánto espacio quedará cuando llegues.</p>}
    </div>
  );
}
