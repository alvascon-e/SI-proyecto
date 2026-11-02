import { useMemo, useState } from 'react';
import { Area, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CheckCircle2, Clock4, Download, FileText, ShieldCheck, Sparkles, TrendingDown, X } from 'lucide-react';
import MapaCampus from '../components/MapaCampus';
import { PARQUEADEROS } from '../data/parqueaderos';
import { DIAS, HORAS, deficit, escenario, heatmap, impacto, rotacion, seguridad } from '../data/historico';

type Tab = 'cuando' | 'donde' | 'quien' | 'impacto' | 'simulador';
const TABS: { id: Tab; t: string }[] = [
  { id: 'cuando', t: '¿Cuándo se satura?' },
  { id: 'donde', t: '¿Dónde falta espacio?' },
  { id: 'quien', t: '¿Quién ocupa?' },
  { id: 'impacto', t: 'Impacto y seguridad' },
  { id: 'simulador', t: '¿Y si…?' },
];

const colorCelda = (v: number) => {
  const t = Math.min(1, Math.max(0, (v - 10) / 90));
  return `hsl(${140 - t * 140} 70% ${88 - t * 40}%)`;
};

function descargarCSV(id: string, hm: number[][]) {
  const filas = [['Reporte ParkiPol', id], [], ['Día', ...HORAS.map((h) => `${h}:00`)], ...hm.map((r, d) => [DIAS[d], ...r.map(String)])];
  const blob = new Blob(['﻿' + filas.map((f) => f.join(';')).join('\n')], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `parkipol-ocupacion-${id}.csv`; a.click();
}

function Hallazgo({ children, tono = 'azul' }: { children: React.ReactNode; tono?: 'azul' | 'rojo' | 'verde' | 'ambar' }) {
  return <div className={`hallazgo h-${tono}`}><Sparkles size={16} /><div>{children}</div></div>;
}

function ReporteEjecutivo({ cerrar, faltan, respuesta, picoBase, picoEsc }: { cerrar: () => void; faltan: number; respuesta: number; picoBase: number; picoEsc: number }) {
  const [listo, setListo] = useState(false);
  return (
    <div className="modal" onClick={cerrar}>
      <div className="reporte" onClick={(e) => e.stopPropagation()}>
        <div className="rep-top">
          <div><div className="eyebrow">Reporte ejecutivo · Semestre 2026-2 · semana 9</div><h2>Parqueaderos del campus Gustavo Galindo</h2><div className="muted">Para: Rectorado y Administración de Planta Física</div></div>
          <button className="icon-btn" onClick={cerrar}><X size={18} /></button>
        </div>
        <div className="rep-kpis">
          <div><b>80 %</b><span>ocupación pico (mar 10:00)</span></div>
          <div><b>{faltan}</b><span>plazas faltantes en hora pico</span></div>
          <div><b>−66 %</b><span>tiempo de búsqueda con ParkiPol</span></div>
          <div><b>{respuesta} min</b><span>respuesta media de seguridad</span></div>
        </div>
        <h3>Hallazgos</h3>
        <ol className="rep-lista">
          <li><b>El déficit se concentra en el centro del campus:</b> Alumnos FIEC–FIMCP, Biblioteca Central y FCNM se saturan casi todos los días hábiles entre 9:00 y 11:00.</li>
          <li><b>1 de cada 5 autos</b> en los parqueaderos de docentes ocupa su plaza más de 6 horas, lo que reduce la rotación.</li>
          <li><b>Coliseo Nuevo tiene capacidad ociosa</b> (55 % de ocupación media) a 6 minutos a pie de la FIEC.</li>
        </ol>
        <h3>Recomendaciones</h3>
        <table className="tabla rep-tabla">
          <thead><tr><th>Acción</th><th>Impacto estimado</th><th>Costo</th><th>Prioridad</th></tr></thead>
          <tbody>
            <tr><td>Habilitar Coliseo Nuevo como apoyo en semanas de evaluaciones</td><td>pico {picoBase} % → {picoEsc} %</td><td>Bajo · señalización</td><td><span className="est est-nueva">Alta</span></td></tr>
            <tr><td>Límite de 6 h en Alumnos FIEC–FIMCP</td><td>+18 % de rotación</td><td>Sin costo</td><td><span className="est est-en_atencion">Media</span></td></tr>
            <tr><td>Ampliar 60 plazas junto a la FIEC</td><td>cubre más de la mitad del déficit</td><td>~ $48 000</td><td><span className="est est-en_atencion">Media</span></td></tr>
          </tbody>
        </table>
        <div className="rep-pie">
          <span className="muted">Generado por ParkiPol a partir de 186 420 registros de las cámaras.</span>
          <button className="btn primario" onClick={() => setListo(true)}>{listo ? <><CheckCircle2 size={16} /> Reporte_ejecutivo.pdf listo</> : <><Download size={16} /> Descargar PDF</>}</button>
        </div>
      </div>
    </div>
  );
}

export default function Analitica() {
  const [tab, setTab] = useState<Tab>('cuando');
  const [lote, setLote] = useState('todos');
  const [coliseo, setColiseo] = useState(false);
  const [limite, setLimite] = useState(false);
  const [reporte, setReporte] = useState(false);
  const hm = useMemo(() => heatmap(lote), [lote]);
  const def = useMemo(() => deficit(), []);
  const rot = useMemo(() => rotacion().sort((a, b) => b.largaEstancia - a.largaEstancia), []);
  const imp = useMemo(() => impacto(), []);
  const seg = useMemo(() => seguridad(), []);
  const esc = useMemo(() => escenario(coliseo, limite), [coliseo, limite]);
  const faltanTotal = def.reduce((a, d) => a + d.faltan, 0);
  const picoEsc = Math.max(...esc.filter((d) => d.escenario !== null).map((d) => d.escenario as number), 0);
  const picoBase = Math.max(...esc.filter((d) => d.proyeccion !== null).map((d) => d.proyeccion as number));
  const picoColiseo = Math.max(...escenario(true, false).filter((d) => d.escenario !== null).map((d) => d.escenario as number));
  const colorDef: Record<string, string> = {}; const etqDef: Record<string, string> = {};
  def.forEach((d) => { colorDef[d.id] = d.faltan > 0 ? '#d93a3a' : d.diasSaturado > 40 ? '#e08a00' : '#1f9d55'; etqDef[d.id] = d.faltan > 0 ? `−${d.faltan}` : `${d.diasSaturado}%`; });

  return (
    <div>
      <div className="fila-sb">
        <div className="a-head"><h1 className="a-titulo">Analítica y reportes</h1><p className="muted">Del dato a la decisión · semestre en curso, semana 9.</p></div>
        <button className="btn primario" onClick={() => setReporte(true)}><FileText size={16} /> Reporte ejecutivo</button>
      </div>
      {reporte && <ReporteEjecutivo cerrar={() => setReporte(false)} faltan={faltanTotal} respuesta={seg.semanas[seg.semanas.length - 1].respuesta} picoBase={picoBase} picoEsc={picoColiseo} />}
      <div className="seg seg-preguntas">{TABS.map((t) => <button key={t.id} className={tab === t.id ? 'on' : ''} onClick={() => setTab(t.id)}>{t.t}</button>)}</div>

      {tab === 'cuando' && (
        <>
          <div className="card">
            <div className="fila-sb"><div className="card-t">Ocupación promedio por día y franja horaria</div>
              <div className="demo-row">
                <select value={lote} onChange={(e) => setLote(e.target.value)}><option value="todos">Todo el campus</option>{PARQUEADEROS.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}</select>
                <button className="btn" onClick={() => descargarCSV(lote, hm)}><Download size={16} /> CSV</button>
              </div></div>
            <div className="heatmap" style={{ gridTemplateColumns: `48px repeat(${HORAS.length}, 1fr)` }}>
              <span />{HORAS.map((h) => <span key={h} className="hm-h">{h}h</span>)}
              {hm.map((fila, d) => [<span key={`d${d}`} className="hm-d">{DIAS[d]}</span>, ...fila.map((v, k) => <span key={`${d}-${k}`} className={`hm-c${d === 1 && HORAS[k] === 10 ? ' hm-pico' : ''}`} style={{ background: colorCelda(v) }}>{v}</span>)])}
            </div>
          </div>
          <Hallazgo tono="rojo"><b>El pico es los martes a las 10:00.</b> De lunes a jueves, entre 9:00 y 11:00 el campus supera el 75 %; los sábados casi no hay demanda.</Hallazgo>
        </>
      )}

      {tab === 'donde' && (
        <>
          <div className="grid-2">
            <div className="card sin-pad"><MapaCampus alto={430} colores={colorDef} etiquetas={etqDef} zoom={16} /></div>
            <div className="card">
              <div className="card-t">Plazas que faltan a las 10:00</div>
              <ResponsiveContainer width="100%" height={330}>
                <BarChart data={def.slice(0, 7)} layout="vertical" margin={{ left: 30, right: 20 }}>
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="nombre" tick={{ fontSize: 11 }} width={130} />
                  <Tooltip />
                  <Bar dataKey="faltan" name="Plazas faltantes" radius={[0, 6, 6, 0]} isAnimationActive={false}>{def.slice(0, 7).map((d) => <Cell key={d.id} fill={d.faltan > 0 ? '#d93a3a' : '#cbd5e1'} />)}</Bar>
                </BarChart>
              </ResponsiveContainer>
              <p className="muted">Demanda en hora pico: autos detectados + búsquedas en la app que no encontraron lugar.</p>
            </div>
          </div>
          <Hallazgo tono="rojo"><b>Faltan {faltanTotal} plazas en la hora pico</b>, concentradas en el centro del campus: FIEC, Biblioteca y FCNM. En el mapa, el número indica cuántas plazas faltan (rojo) o el % de días con saturación.</Hallazgo>
        </>
      )}

      {tab === 'quien' && (
        <>
          <div className="grid-2b">
            <div className="card">
              <div className="card-t">Autos que se quedan más de 6 horas</div>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={rot.slice(0, 8)} layout="vertical" margin={{ left: 30, right: 20 }}>
                  <XAxis type="number" unit="%" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="nombre" tick={{ fontSize: 11 }} width={130} />
                  <Tooltip />
                  <Bar dataKey="largaEstancia" name="% autos > 6 h" radius={[0, 6, 6, 0]} isAnimationActive={false}>{rot.slice(0, 8).map((d) => <Cell key={d.id} fill={d.largaEstancia >= 20 ? '#e08a00' : '#94a3b8'} />)}</Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <div className="card-t">Rotación: autos distintos por plaza al día</div>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={[...rot].sort((a, b) => b.rotacion - a.rotacion).slice(0, 8)} layout="vertical" margin={{ left: 30, right: 20 }}>
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="nombre" tick={{ fontSize: 11 }} width={130} />
                  <Tooltip />
                  <Bar dataKey="rotacion" name="Rotación" fill="#0066dc" radius={[0, 6, 6, 0]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <Hallazgo tono="ambar"><b>En los parqueaderos de docentes, más del 20 % de los autos ocupa la plaza todo el día.</b> Un límite de 6 h en las zonas de alta demanda aumentaría la rotación.</Hallazgo>
        </>
      )}

      {tab === 'impacto' && (
        <>
          <div className="kpis">
            <div className="kpi k-verde"><TrendingDown /><div><b>12 → 4 min</b><span>tiempo medio buscando parqueo</span></div></div>
            <div className="kpi k-azul"><Sparkles /><div><b>{imp[imp.length - 1].acumulado.toLocaleString('es-EC')}</b><span>conductores redirigidos a tiempo</span></div></div>
            <div className="kpi k-violeta"><ShieldCheck /><div><b>{seg.semanas[seg.semanas.length - 1].respuesta} min</b><span>respuesta media de seguridad</span></div></div>
            <div className="kpi k-indigo"><Clock4 /><div><b>−71 %</b><span>en tiempo de respuesta desde S1</span></div></div>
          </div>
          <div className="grid-2b">
            <div className="card">
              <div className="card-t">Minutos buscando parqueo · ParkiPol desde S3</div>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={imp} margin={{ top: 8, right: 12, left: -14 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="semana" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} unit=" min" />
                  <Tooltip /><Line dataKey="busqueda" name="Minutos" stroke="#1f9d55" strokeWidth={3} dot={{ r: 3 }} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <div className="card-t">Seguridad: minutos hasta atender una incidencia</div>
              <ResponsiveContainer width="100%" height={280}>
                <ComposedChart data={seg.semanas} margin={{ top: 8, right: 12, left: -14 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="semana" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} unit=" min" />
                  <Tooltip /><Area dataKey="respuesta" name="Minutos" stroke="#7a3fd4" fill="#7a3fd422" strokeWidth={3} isAnimationActive={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
          <Hallazgo tono="verde"><b>Con ParkiPol, encontrar parqueo toma 4 minutos en vez de 12</b>, y seguridad atiende las incidencias en {seg.semanas[seg.semanas.length - 1].respuesta} minutos gracias a los avisos al grupo de guardias.</Hallazgo>
        </>
      )}

      {tab === 'simulador' && (
        <>
          <div className="grid-sim">
            <div className="card">
              <div className="card-t">Escenarios</div>
              <label className="opcion"><input type="checkbox" checked={coliseo} onChange={(e) => setColiseo(e.target.checked)} /><span className="switch-ui" /><div><b>Habilitar Coliseo Nuevo como apoyo</b><small>en semanas de evaluaciones (S16–S17), con señalización y aviso en la app</small></div></label>
              <label className="opcion"><input type="checkbox" checked={limite} onChange={(e) => setLimite(e.target.checked)} /><span className="switch-ui" /><div><b>Límite de 6 h en Alumnos FIEC–FIMCP</b><small>aumenta la rotación en la zona de mayor demanda</small></div></label>
              <div className="sim-res">
                <div><span>Pico proyectado</span><b>{picoBase} %</b></div>
                <div className={coliseo || limite ? 'mejor' : ''}><span>Con los cambios</span><b>{coliseo || limite ? `${picoEsc} %` : '—'}</b></div>
              </div>
            </div>
            <div className="card">
              <div className="card-t">Proyección de ocupación pico del semestre</div>
              <ResponsiveContainer width="100%" height={340}>
                <ComposedChart data={esc} margin={{ top: 8, right: 12, left: -14 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="semana" tick={{ fontSize: 11 }} /><YAxis domain={[60, 100]} unit="%" tick={{ fontSize: 11 }} />
                  <Tooltip /><Legend />
                  <Line dataKey="real" name="Real" stroke="#0f2340" strokeWidth={2.5} dot={{ r: 3 }} isAnimationActive={false} />
                  <Line dataKey="proyeccion" name="Proyección actual" stroke="#d93a3a" strokeWidth={2.5} strokeDasharray="6 4" dot={false} isAnimationActive={false} />
                  <Line dataKey="escenario" name="Con los cambios" stroke="#1f9d55" strokeWidth={3} dot={false} isAnimationActive={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
          <Hallazgo tono="verde"><b>Decidir antes de invertir:</b> habilitar Coliseo Nuevo en evaluaciones baja el pico sin construir nada; la ampliación queda para el reporte de inversión.</Hallazgo>
        </>
      )}
    </div>
  );
}
