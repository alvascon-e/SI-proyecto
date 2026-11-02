import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
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

  const dia = new Date().toLocaleDateString('es-EC', { weekday: 'long', day: 'numeric', month: 'long' });
  return (
    <div>
      <header className="m-header">
        <div>
          <div className="eyebrow">{dia} · {fmtHora(hora)}</div>
          <h1>Hola, {u.nombre.split(' ')[0]}</h1>
          <div className="m-sub">{CATEGORIAS[u.categoria]} · ESPOL</div>
        </div>
        <button className="cuota" onClick={() => nav('/app/planes')}>
          <span className={`plan-tag ${u.plan}`}>{PLANES[u.plan].nombre}</span>
          <small>{lim === null ? 'Consultas ilimitadas' : `${u.consultasHoy} de ${lim} consultas`}</small>
        </button>
      </header>
      <div className="pad">
        <div className="segmentado">
          <button className={soloMios ? 'on' : ''} onClick={() => setSoloMios(true)}>Autorizados para mí</button>
          <button className={!soloMios ? 'on' : ''} onClick={() => setSoloMios(false)}>Todos</button>
        </div>
      </div>
      <div className="m-mapa">
        <MapaCampus alto={300} categoria={soloMios ? u.categoria : null} seleccionado={sel} onSelect={(id) => { setSel(id); abrir(id); }} />
      </div>
      <div className="leyenda pad">
        {(['libre', 'medio', 'lleno', 'cerrado'] as const).map((n) => <span key={n}><i style={{ background: COLOR_NIVEL[n] }} />{TEXTO_NIVEL[n]}</span>)}
      </div>
      {u.plan === 'gratis' && <div className="pad"><CarruselAnuncios /></div>}
      <div className="pad">
        <div className="seccion-t"><h2>Parqueaderos</h2><span>{lista.length} en el campus</span></div>
        <div className="grupo">
          {lista.map((p) => {
            const l = lotes[p.id];
            const n = nivel(p, l);
            const lleno = seLlenaEn(p, l);
            const permitido = p.categorias.includes(u.categoria);
            return (
              <button key={p.id} className={`fila-lote${permitido ? '' : ' atenuado'}`} onClick={() => abrir(p.id)}>
                <div className="anillo" style={{ ['--p' as string]: `${pct(p, l)}%`, ['--c' as string]: COLOR_NIVEL[n] }}>
                  <b>{l.cerrado ? '—' : libres(p, l)}</b>
                </div>
                <div className="fila-cuerpo">
                  <b>{p.nombre.replace(/^Parqueadero |^Parqueo /, '')}</b>
                  <small>
                    <span style={{ color: COLOR_NIVEL[n] }}>{l.cerrado ? 'Cerrado' : TEXTO_NIVEL[n]}</span>
                    {' · '}{l.cerrado ? l.cerrado : `${libres(p, l)} libres de ${p.capacidad}`}
                  </small>
                  {lleno && lleno < 30 && <small className="alerta-txt">Se llena en ~{lleno} min</small>}
                  {!permitido && <small>No autorizado para tu perfil</small>}
                </div>
                <ChevronRight size={18} className="chev" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
