import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock3 } from 'lucide-react';
import MapaCampus from '../components/MapaCampus';
import CarruselAnuncios from '../components/CarruselAnuncios';
import { PARQUEADEROS } from '../data/parqueaderos';
import { CATEGORIAS, PLANES } from '../data/catalogos';
import { fmtHora, useParki } from '../store';
import { COLOR_NIVEL, TEXTO_NIVEL, libres, nivel, pct, seLlenaEn } from '../util';
import { useConsulta } from './cuota';

export default function Inicio() {
  const { usuario, lotes, hora } = useParki();
  const [soloMios, setSoloMios] = useState(true);
  const [sel, setSel] = useState<string | null>(null);
  const nav = useNavigate();
  const consultar = useConsulta();
  const u = usuario!;
  const lim = PLANES[u.plan].consultas;
  const lista = PARQUEADEROS.filter((p) => !soloMios || p.categorias.includes(u.categoria))
    .sort((a, b) => libres(b, lotes[b.id]) - libres(a, lotes[a.id]));
  const abrir = (id: string) => consultar(() => nav(`/app/p/${id}`));

  return (
    <div>
      <header className="m-header">
        <div>
          <div className="muted">Hola, {u.nombre.split(' ')[0]} · {CATEGORIAS[u.categoria]}</div>
          <h1>Parqueaderos ahora</h1>
        </div>
        <div className="cuota" onClick={() => nav('/app/planes')}>
          <Clock3 size={13} /> {fmtHora(hora)}
          <span className={`plan-tag ${u.plan}`}>{PLANES[u.plan].nombre}</span>
          <small>{lim === null ? 'consultas ilimitadas' : `${u.consultasHoy}/${lim} consultas`}</small>
        </div>
      </header>
      <div className="chips pad">
        <button className={`chip${soloMios ? ' on' : ''}`} onClick={() => setSoloMios(true)}>Autorizados para mí</button>
        <button className={`chip${!soloMios ? ' on' : ''}`} onClick={() => setSoloMios(false)}>Todos</button>
      </div>
      <div className="m-mapa">
        <MapaCampus alto={290} categoria={soloMios ? u.categoria : null} seleccionado={sel} onSelect={(id) => { setSel(id); abrir(id); }} />
        <div className="leyenda">
          {(['libre', 'medio', 'lleno', 'cerrado'] as const).map((n) => <span key={n}><i style={{ background: COLOR_NIVEL[n] }} />{TEXTO_NIVEL[n]}</span>)}
        </div>
      </div>
      {u.plan === 'gratis' && <div className="pad"><CarruselAnuncios /></div>}
      <div className="lista pad">
        {lista.map((p) => {
          const l = lotes[p.id];
          const n = nivel(p, l);
          const lleno = seLlenaEn(p, l);
          const permitido = p.categorias.includes(u.categoria);
          return (
            <button key={p.id} className="lote-card" onClick={() => abrir(p.id)} style={{ opacity: permitido ? 1 : 0.6 }}>
              <div className="lote-num" style={{ color: COLOR_NIVEL[n] }}>{l.cerrado ? '—' : libres(p, l)}<small>libres</small></div>
              <div className="lote-info">
                <b>{p.nombre}</b>
                <div className="barra"><i style={{ width: `${pct(p, l)}%`, background: COLOR_NIVEL[n] }} /></div>
                <small style={{ color: COLOR_NIVEL[n] }}>
                  {l.cerrado ? `Cerrado · ${l.cerrado}` : `${TEXTO_NIVEL[n]} · ${pct(p, l)}% ocupado`}
                  {lleno && lleno < 30 ? ` · se llena en ~${lleno} min` : ''}
                </small>
                {!permitido && <small className="muted"> · No autorizado para tu perfil</small>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
