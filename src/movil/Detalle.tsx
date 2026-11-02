import { useNavigate, useParams } from 'react-router-dom';
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { Accessibility, ArrowLeft, Camera, Check, Heart, Navigation, Star, TriangleAlert } from 'lucide-react';
import { CATEGORIAS } from '../data/catalogos';
import { probabilidadLleno } from '../data/historico';
import { lotePorId, useParki } from '../store';
import { COLOR_NIVEL, TEXTO_NIVEL, libres, nivel, pct, seLlenaEn } from '../util';
import type { Categoria } from '../types';

export default function Detalle() {
  const { id = '' } = useParams();
  const nav = useNavigate();
  const p = lotePorId(id);
  const { lotes, usuario, favorito, setFavorito, calificaciones, hora } = useParki();
  const l = lotes[id];
  const n = nivel(p, l);
  const lib = libres(p, l);
  const prefLibres = Math.max(0, Math.min(p.preferenciales, Math.round(lib * 0.08) + (lib > 0 ? 1 : 0)));
  const cal = calificaciones.filter((c) => c.parqueaderoId === id);
  const prom = cal.length ? cal.reduce((a, c) => a + c.estrellas, 0) / cal.length : 0;
  const prob = probabilidadLleno(id);
  const hActual = `${Math.floor(hora / 60)}h`;
  const lleno = seLlenaEn(p, l);
  const fav = favorito === id;

  return (
    <div>
      <header className="m-header con-volver">
        <button className="icon-btn" onClick={() => nav(-1)}><ArrowLeft size={20} /></button>
        <h1 className="h-chico">{p.nombre}</h1>
        <button className={`icon-btn${fav ? ' fav' : ''}`} onClick={() => setFavorito(fav ? null : id)} title="Favorito"><Heart size={20} fill={fav ? 'currentColor' : 'none'} /></button>
      </header>
      <div className="pad">
        <div className="gran-cifra" style={{ color: COLOR_NIVEL[n] }}>
          <div className="cifra" style={{ color: COLOR_NIVEL[n] }}>{l.cerrado ? '—' : lib}</div>
          <div>
            <b>{l.cerrado ? `Cerrado · ${l.cerrado}` : 'espacios libres'}</b>
            <div className="muted">de {p.capacidad} · {pct(p, l)}% ocupado · {TEXTO_NIVEL[n]}</div>
            {lleno && <div className="alerta-txt">Al ritmo actual se llena en ~{lleno} min</div>}
          </div>
        </div>
        <div className="fila-datos">
          <div><Accessibility size={16} /> {prefLibres}/{p.preferenciales} preferenciales</div>
          <div><Camera size={16} /> {l.camarasOnline}/{p.camaras} cámaras IA</div>
          <div><Star size={16} /> {prom.toFixed(1)} ({cal.length})</div>
        </div>
        <h3 className="sub">Autorizado para</h3>
        <div className="chips">
          {(Object.keys(CATEGORIAS) as Categoria[]).map((c) => {
            const ok = p.categorias.includes(c);
            return <span key={c} className={`chip estatico${ok ? ' ok' : ' no'}`}>{ok && <Check size={13} />} {CATEGORIAS[c]}{c === usuario?.categoria ? ' (tú)' : ''}</span>;
          })}
        </div>
        <h3 className="sub">Probabilidad de encontrarlo lleno</h3>
        <div className="grafico">
          <ResponsiveContainer width="100%" height={130}>
            <BarChart data={prob} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <XAxis dataKey="hora" tick={{ fontSize: 10 }} interval={1} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => [`${v}%`, 'Prob. lleno']} />
              <Bar dataKey="prob" radius={[4, 4, 0, 0]}>
                {prob.map((d) => <Cell key={d.hora} fill={d.hora === hActual ? '#0066dc' : d.prob > 70 ? '#fca5a5' : '#cbd5e1'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="acciones">
          <button className="btn primario grande" disabled={!!l.cerrado} onClick={() => nav(`/app/ruta/${id}`)}><Navigation size={18} /> Ir a este parqueadero</button>
          <button className="btn" onClick={() => nav(`/app/reportar?lote=${id}`)}><TriangleAlert size={16} /> Reportar problema</button>
        </div>
      </div>
    </div>
  );
}
