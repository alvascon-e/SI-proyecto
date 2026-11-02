import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Star } from 'lucide-react';
import MapaCampus from '../components/MapaCampus';
import { GARITA, RUTAS } from '../data/rutas';
import { lotePorId, useParki } from '../store';
import { COLOR_NIVEL, libres, nivel } from '../util';

// Navegación guiada dentro del campus (funcionalidad 5) y calificación al llegar (funcionalidad 8).
export default function Ruta() {
  const { id = '' } = useParams();
  const nav = useNavigate();
  const p = lotePorId(id);
  const ruta = RUTAS[id];
  const l = useParki((s) => s.lotes[id]);
  const calificar = useParki((s) => s.calificar);
  const [avance, setAvance] = useState(0); // 0..1
  const [estrellas, setEstrellas] = useState(0);
  const [hecho, setHecho] = useState(false);
  const DURACION = 24; // s de demo para recorrer la ruta

  useEffect(() => {
    if (avance >= 1) return;
    const t = setInterval(() => setAvance((a) => Math.min(1, a + 0.25 / DURACION)), 250);
    return () => clearInterval(t);
  }, [avance >= 1]);

  const pos = useMemo<[number, number]>(() => {
    const pts = ruta.puntos;
    const k = avance * (pts.length - 1);
    const i = Math.min(pts.length - 2, Math.floor(k)), f = k - i;
    return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f];
  }, [avance, ruta]);

  const restante = Math.round(ruta.metros * (1 - avance));
  const minutos = Math.max(0, Math.ceil((ruta.segundos * (1 - avance)) / 60));
  const llego = avance >= 1;

  return (
    <div className="ruta">
      <header className="m-header con-volver">
        <button className="icon-btn" onClick={() => nav(-1)}><ArrowLeft size={20} /></button>
        <h1 className="h-chico">Hacia {p.nombre}</h1>
        <span />
      </header>
      <MapaCampus alto={380} seleccionado={id} ruta={ruta.puntos.slice(Math.floor(avance * (ruta.puntos.length - 1)))} yo={pos}
        encuadre={avance < 0.05 ? [GARITA, ...ruta.puntos] : [pos, p.centro]} zoom={17} />
      <div className="pad">
        {!llego ? (
          <div className="nav-card">
            <div className="nav-grande">{minutos} min <small>· {(restante / 1000).toFixed(1)} km</small></div>
            <div className="muted">Sigue la ruta azul por las vías internas del campus</div>
            <div className="nav-libres" style={{ color: COLOR_NIVEL[nivel(p, l)] }}>{libres(p, l)} espacios libres en destino · actualizado en vivo</div>
            <div className="barra"><i style={{ width: `${avance * 100}%`, background: '#2d68d6' }} /></div>
            <button className="btn" onClick={() => setAvance(1)}>Simular llegada</button>
          </div>
        ) : !hecho ? (
          <div className="nav-card">
            <div className="ok-grande"><CheckCircle2 size={26} /> Llegaste a {p.nombre}</div>
            <p className="muted">¿Cómo fue tu experiencia encontrando parqueo?</p>
            <div className="estrellas">
              {[1, 2, 3, 4, 5].map((n) => <button key={n} onClick={() => setEstrellas(n)}><Star size={32} fill={n <= estrellas ? '#f59e0b' : 'none'} color="#f59e0b" /></button>)}
            </div>
            <button className="btn primario grande" disabled={!estrellas} onClick={() => { calificar(id, estrellas, ''); setHecho(true); }}>Enviar calificación</button>
          </div>
        ) : (
          <div className="nav-card"><div className="ok-grande"><CheckCircle2 size={26} /> ¡Gracias por calificar!</div><button className="btn primario" onClick={() => nav('/app')}>Volver al mapa</button></div>
        )}
      </div>
    </div>
  );
}
