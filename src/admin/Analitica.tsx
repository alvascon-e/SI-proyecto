import { useMemo, useState } from 'react';
import { Area, Bar, BarChart, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Download } from 'lucide-react';
import { PARQUEADEROS } from '../data/parqueaderos';
import { DIAS, HORAS, heatmap, proyeccionSemestre, rotacion } from '../data/historico';
import { useParki } from '../store';

const colorCelda = (v: number) => {
  const t = Math.min(1, Math.max(0, (v - 10) / 90));
  const h = 140 - t * 140; // verde → rojo
  return `hsl(${h} 70% ${88 - t * 40}%)`;
};

function descargarCSV(id: string, hm: number[][], rot: ReturnType<typeof rotacion>) {
  const filas = [['Reporte ParkiPol', id === 'todos' ? 'Todo el campus' : id], [], ['Ocupación promedio (%) por día y hora'], ['Día', ...HORAS.map((h) => `${h}:00`)],
    ...hm.map((r, d) => [DIAS[d], ...r.map(String)]), [], ['Rotación y permanencia'], ['Parqueadero', 'Rotación (autos/plaza/día)', 'Permanencia media (min)', '% autos > 6 h'],
    ...rot.map((r) => [r.nombre, String(r.rotacion), String(r.permanencia), String(r.largaEstancia)])];
  const blob = new Blob(['﻿' + filas.map((f) => f.join(';')).join('\n')], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `parkipol-reporte-${id}.csv`; a.click();
}

export default function Analitica() {
  const [lote, setLote] = useState('todos');
  const calificaciones = useParki((s) => s.calificaciones);
  const hm = useMemo(() => heatmap(lote), [lote]);
  const rot = useMemo(() => rotacion(), []);
  const proy = useMemo(() => proyeccionSemestre(), []);
  const sat = PARQUEADEROS.map((p) => {
    const c = calificaciones.filter((x) => x.parqueaderoId === p.id);
    return { nombre: p.nombre.replace(/Parqueadero |Parqueo /, ''), promedio: c.length ? +(c.reduce((a, x) => a + x.estrellas, 0) / c.length).toFixed(2) : 0 };
  }).sort((a, b) => b.promedio - a.promedio);
  const picos = heatmap('todos').flat();

  return (
    <div>
      <div className="fila-sb">
        <div className="a-head"><h1 className="a-titulo">Analítica y reportes</h1><p className="muted">Histórico de ocupación del semestre en curso.</p></div>
        <div className="demo-row">
          <select value={lote} onChange={(e) => setLote(e.target.value)}>
            <option value="todos">Todo el campus</option>
            {PARQUEADEROS.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
          <button className="btn primario" onClick={() => descargarCSV(lote, hm, rot)}><Download size={16} /> Exportar reporte</button>
        </div>
      </div>
      <div className="kpis">
        <div className="kpi"><div><b>{Math.max(...picos)}%</b><span>Pico semanal (mar 10:00)</span></div></div>
        <div className="kpi"><div><b>{(rot.reduce((a, r) => a + r.rotacion, 0) / rot.length).toFixed(1)}</b><span>Rotación media (autos/plaza/día)</span></div></div>
        <div className="kpi"><div><b>{Math.round(rot.reduce((a, r) => a + r.permanencia, 0) / rot.length)} min</b><span>Permanencia media</span></div></div>
        <div className="kpi rojo"><div><b>{PARQUEADEROS.filter((p) => Math.max(...heatmap(p.id).flat()) >= 95).length}</b><span>Parqueaderos con saturación recurrente</span></div></div>
      </div>

      <div className="card">
        <div className="card-t">Ocupación promedio por día y franja horaria · {lote === 'todos' ? 'todo el campus' : PARQUEADEROS.find((p) => p.id === lote)!.nombre}</div>
        <div className="heatmap" style={{ gridTemplateColumns: `48px repeat(${HORAS.length}, 1fr)` }}>
          <span />
          {HORAS.map((h) => <span key={h} className="hm-h">{h}h</span>)}
          {hm.map((fila, d) => [
            <span key={`d${d}`} className="hm-d">{DIAS[d]}</span>,
            ...fila.map((v, k) => <span key={`${d}-${k}`} className="hm-c" style={{ background: colorCelda(v) }} title={`${DIAS[d]} ${HORAS[k]}:00 · ${v}%`}>{v}</span>),
          ])}
        </div>
      </div>

      <div className="grid-2b">
        <div className="card">
          <div className="card-t">Rotación y tiempo de permanencia</div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={rot} layout="vertical" margin={{ left: 40, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="nombre" tick={{ fontSize: 11 }} width={120} />
              <Tooltip />
              <Legend />
              <Bar dataKey="rotacion" name="Rotación (autos/plaza/día)" fill="#0066dc" radius={[0, 4, 4, 0]} />
              <Bar dataKey="permanenciaH" name="Permanencia media (horas)" fill="#f59e0b" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="card-t">Proyección de demanda del semestre (ocupación pico semanal)</div>
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={proy} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="semana" tick={{ fontSize: 11 }} />
              <YAxis domain={[60, 100]} unit="%" tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Area dataKey="max" name="Rango estimado" stroke="none" fill="#0066dc33" />
              <Area dataKey="min" name=" " stroke="none" fill="#fff" legendType="none" />
              <Line dataKey="real" name="Real" stroke="#0f2340" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line dataKey="proyeccion" name="Proyección" stroke="#0066dc" strokeWidth={2.5} strokeDasharray="6 4" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
          <p className="muted">Se esperan picos en semanas de evaluaciones (S9 y S16–S17): conviene habilitar el Parqueadero Coliseo Nuevo como apoyo.</p>
        </div>
      </div>

      <div className="card">
        <div className="card-t">Satisfacción de los usuarios por parqueadero</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={sat} margin={{ left: -10 }}>
            <XAxis dataKey="nombre" tick={{ fontSize: 10 }} interval={0} angle={-20} height={50} textAnchor="end" />
            <YAxis domain={[0, 5]} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="promedio" name="Calificación promedio" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
