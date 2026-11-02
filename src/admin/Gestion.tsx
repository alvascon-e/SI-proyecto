import { useState } from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CATEGORIAS } from '../data/catalogos';
import { PARQUEADEROS } from '../data/parqueaderos';
import { useParki } from '../store';
import { horaReloj } from '../util';

export default function Gestion() {
  const [tab, setTab] = useState<'parqueaderos' | 'anuncios' | 'ingresos'>('parqueaderos');
  const { lotes, cerrar, abrir, anuncios, toggleAnuncio, pagos } = useParki();
  const ingresosPlanes = pagos.filter((p) => p.concepto.startsWith('Plan')).reduce((a, p) => a + p.monto, 0);
  const ingresosAds = pagos.filter((p) => p.concepto.startsWith('Anuncio')).reduce((a, p) => a + p.monto, 0);
  return (
    <div>
      <div className="fila-sb">
        <h1 className="a-titulo">Gestión</h1>
        <div className="seg">
          <button className={tab === 'parqueaderos' ? 'on' : ''} onClick={() => setTab('parqueaderos')}>Parqueaderos</button>
          <button className={tab === 'anuncios' ? 'on' : ''} onClick={() => setTab('anuncios')}>Anuncios</button>
          <button className={tab === 'ingresos' ? 'on' : ''} onClick={() => setTab('ingresos')}>Planes e ingresos</button>
        </div>
      </div>

      {tab === 'parqueaderos' && (
        <div className="card sin-pad">
          <table className="tabla">
            <thead><tr><th>Parqueadero</th><th>Capacidad</th><th>Preferenciales</th><th>Autorizado para</th><th>Cámaras</th><th>Estado</th><th></th></tr></thead>
            <tbody>
              {PARQUEADEROS.map((p) => {
                const l = lotes[p.id];
                return (
                  <tr key={p.id}>
                    <td><b>{p.nombre}</b><small className="muted block">OSM #{p.osmId}</small></td>
                    <td>{p.capacidad}</td>
                    <td>{p.preferenciales}</td>
                    <td>{p.categorias.map((c) => <span key={c} className="tag">{CATEGORIAS[c]}</span>)}</td>
                    <td>{l.camarasOnline}/{p.camaras}</td>
                    <td>{l.cerrado ? <span className="est est-nueva">Cerrado · {l.cerrado}</span> : <span className="est est-resuelta">Habilitado</span>}</td>
                    <td>{l.cerrado ? <button className="btn chico" onClick={() => abrir(p.id)}>Habilitar</button> : <button className="btn chico" onClick={() => cerrar(p.id, 'Evento institucional')}>Cerrar por evento</button>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'anuncios' && (
        <div className="grid-ads">
          {anuncios.map((a) => (
            <div key={a.id} className="card">
              <div className="ad-prev" style={{ background: a.color }}><span>{a.emoji}</span><div><b>{a.titulo}</b><small>{a.texto}</small></div></div>
              <div className="fila-sb"><b>{a.cliente}</b><label className="switch"><input type="checkbox" checked={a.activo} onChange={() => toggleAnuncio(a.id)} /><i /></label></div>
              <div className="ad-stats">
                <div><b>{a.impresiones.toLocaleString('es-EC')}</b><small>Impresiones</small></div>
                <div><b>{a.clics.toLocaleString('es-EC')}</b><small>Clics</small></div>
                <div><b>{((a.clics / Math.max(1, a.impresiones)) * 100).toFixed(1)}%</b><small>CTR</small></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'ingresos' && (
        <>
          <div className="kpis">
            <div className="kpi"><div><b>${(ingresosPlanes + ingresosAds).toFixed(2)}</b><span>Ingresos del período</span></div></div>
            <div className="kpi"><div><b>${ingresosPlanes.toFixed(2)}</b><span>Suscripciones Plus / Premium</span></div></div>
            <div className="kpi"><div><b>${ingresosAds.toFixed(2)}</b><span>Publicidad</span></div></div>
            <div className="kpi"><div><b>$1,800</b><span>Licencia institucional ESPOL (anual)</span></div></div>
          </div>
          <div className="grid-2b">
            <div className="card sin-pad">
              <table className="tabla">
                <thead><tr><th>Comprobante</th><th>Concepto</th><th>Cliente</th><th>Método</th><th>Monto</th><th>Hora</th></tr></thead>
                <tbody>{pagos.map((p) => <tr key={p.id}><td>{p.comprobante}</td><td>{p.concepto}</td><td>{p.cliente}</td><td>{p.metodo}</td><td><b>${p.monto.toFixed(2)}</b></td><td>{horaReloj(p.ts)}</td></tr>)}</tbody>
              </table>
            </div>
            <div className="card">
              <div className="card-t">Ingresos por fuente</div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={[{ f: 'Suscripciones', v: +ingresosPlanes.toFixed(2) }, { f: 'Publicidad', v: ingresosAds }, { f: 'Licencia (mes)', v: 150 }]}>
                  <XAxis dataKey="f" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip formatter={(v) => [`$${v}`, 'Monto']} />
                  <Bar dataKey="v" fill="#2d68d6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
