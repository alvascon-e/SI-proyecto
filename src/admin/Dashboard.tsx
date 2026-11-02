import { useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Camera, Car, ParkingSquare, Siren, TrendingUp } from 'lucide-react';
import MapaCampus from '../components/MapaCampus';
import { PARQUEADEROS } from '../data/parqueaderos';
import { fmtHora, useParki } from '../store';
import { COLOR_NIVEL, TEXTO_NIVEL, hace, libres, nivel, pct, seLlenaEn } from '../util';
import type { TipoEvento } from '../types';

const ICONO_EVENTO: Record<TipoEvento, string> = { entrada: '🚗', salida: '↩️', incidencia: '⚠️', cierre: '⛔', apertura: '✅', camara: '📷', pago: '💳', alerta: '🔴', calificacion: '⭐' };

export default function Dashboard() {
  const { lotes, eventos, incidencias, serie } = useParki();
  const [sel, setSel] = useState<string | null>(null);
  const cap = PARQUEADEROS.reduce((a, p) => a + p.capacidad, 0);
  const ocup = PARQUEADEROS.reduce((a, p) => a + lotes[p.id].ocupados, 0);
  const libresTot = PARQUEADEROS.reduce((a, p) => a + libres(p, lotes[p.id]), 0);
  const saturados = PARQUEADEROS.filter((p) => nivel(p, lotes[p.id]) === 'lleno').length;
  const camOn = PARQUEADEROS.reduce((a, p) => a + lotes[p.id].camarasOnline, 0);
  const camTot = PARQUEADEROS.reduce((a, p) => a + p.camaras, 0);
  const abiertas = incidencias.filter((i) => i.estado !== 'resuelta').length;
  const flujo = PARQUEADEROS.reduce((a, p) => a + lotes[p.id].tendencia, 0);

  return (
    <div>
      <h1 className="a-titulo">Monitoreo en tiempo real</h1>
      <div className="kpis">
        <div className="kpi"><ParkingSquare /><div><b>{Math.round((ocup / cap) * 100)}%</b><span>Ocupación del campus</span></div></div>
        <div className="kpi"><Car /><div><b>{libresTot}</b><span>Espacios libres de {cap}</span></div></div>
        <div className="kpi"><TrendingUp /><div><b>{flujo >= 0 ? '+' : ''}{flujo.toFixed(1)}</b><span>Autos/min (flujo neto)</span></div></div>
        <div className={`kpi${saturados ? ' rojo' : ''}`}><Siren /><div><b>{saturados}</b><span>Parqueaderos saturados</span></div></div>
        <div className={`kpi${camOn < camTot ? ' ambar' : ''}`}><Camera /><div><b>{camOn}/{camTot}</b><span>Cámaras IA en línea · {abiertas} incidencias abiertas</span></div></div>
      </div>

      <div className="grid-2">
        <div className="card sin-pad">
          <MapaCampus alto={430} seleccionado={sel} onSelect={setSel} zoom={16} />
        </div>
        <div className="card">
          <div className="card-t">Actividad en vivo</div>
          <div className="feed">
            {eventos.slice(0, 14).map((e) => (
              <div key={e.id} className={`feed-item ev-${e.tipo}`}><span>{ICONO_EVENTO[e.tipo]}</span><div>{e.texto}<small>{hace(e.ts)}</small></div></div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-2b">
        <div className="card">
          <div className="card-t">Estado por parqueadero</div>
          <table className="tabla">
            <thead><tr><th>Parqueadero</th><th>Ocupación</th><th>Libres</th><th>Tendencia</th><th>Estado</th></tr></thead>
            <tbody>
              {[...PARQUEADEROS].sort((a, b) => pct(b, lotes[b.id]) - pct(a, lotes[a.id])).map((p) => {
                const l = lotes[p.id]; const n = nivel(p, l); const ll = seLlenaEn(p, l);
                return (
                  <tr key={p.id} className={sel === p.id ? 'sel' : ''} onClick={() => setSel(p.id)}>
                    <td>{p.nombre}</td>
                    <td><div className="barra mini"><i style={{ width: `${pct(p, l)}%`, background: COLOR_NIVEL[n] }} /></div> {pct(p, l)}%</td>
                    <td><b>{libres(p, l)}</b>/{p.capacidad}</td>
                    <td>{l.tendencia > 0.3 ? `▲ ${l.tendencia.toFixed(1)}/min${ll && ll < 30 ? ` · lleno en ~${ll}m` : ''}` : l.tendencia < -0.3 ? `▼ ${Math.abs(l.tendencia).toFixed(1)}/min` : 'estable'}</td>
                    <td><span className="estado" style={{ background: COLOR_NIVEL[n] }}>{TEXTO_NIVEL[n]}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="card">
          <div className="card-t">Ocupación del campus hoy</div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={serie} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2d68d6" stopOpacity={0.5} /><stop offset="1" stopColor="#2d68d6" stopOpacity={0.02} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="hora" tickFormatter={fmtHora} tick={{ fontSize: 11 }} minTickGap={40} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
              <Tooltip labelFormatter={(v) => fmtHora(Number(v))} formatter={(v) => [`${v}%`, 'Ocupación']} />
              <Area type="monotone" dataKey="ocupacion" stroke="#2d68d6" strokeWidth={2} fill="url(#g1)" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
