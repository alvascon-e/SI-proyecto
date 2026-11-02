import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Camera, CheckCircle2, ImagePlus } from 'lucide-react';
import { PARQUEADEROS } from '../data/parqueaderos';
import { TIPOS_INCIDENCIA } from '../data/catalogos';
import { useParki } from '../store';
import type { TipoIncidencia } from '../types';

// Foto de ejemplo para la demo (ilustración de un auto ocupando dos plazas).
const FOTO_EJEMPLO = 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260"><rect width="400" height="260" fill="#4b5563"/><g stroke="#f8fafc" stroke-width="5"><line x1="60" y1="20" x2="60" y2="240"/><line x1="200" y1="20" x2="200" y2="240"/><line x1="340" y1="20" x2="340" y2="240"/></g><g transform="rotate(-14 200 130)"><rect x="110" y="70" width="190" height="120" rx="26" fill="#dc2626"/><rect x="140" y="88" width="130" height="38" rx="8" fill="#1f2937" opacity=".8"/><rect x="140" y="140" width="130" height="34" rx="8" fill="#1f2937" opacity=".6"/></g><text x="200" y="250" font-family="sans-serif" font-size="14" fill="#fde68a" text-anchor="middle">Foto adjunta · ocupa dos plazas</text></svg>`);

export default function Reportar() {
  const [sp] = useSearchParams();
  const reportar = useParki((s) => s.reportar);
  const nav = useNavigate();
  const [lote, setLote] = useState(sp.get('lote') ?? 'fiec-fimcp');
  const [tipo, setTipo] = useState<TipoIncidencia>('mal_estacionado');
  const [desc, setDesc] = useState('');
  const [foto, setFoto] = useState<string | undefined>();
  const [enviado, setEnviado] = useState(false);

  const subir = (f?: File) => {
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      // se reduce para que quepa en el estado compartido
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas'); const k = Math.min(1, 480 / img.width);
        c.width = img.width * k; c.height = img.height * k;
        c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
        setFoto(c.toDataURL('image/jpeg', 0.7));
      };
      img.src = r.result as string;
    };
    r.readAsDataURL(f);
  };

  if (enviado)
    return (
      <div className="pad centro" style={{ paddingTop: 80 }}>
        <CheckCircle2 size={64} color="#16a34a" />
        <h2>Reporte enviado</h2>
        <p className="muted">El personal de seguridad de Planta Física ya fue notificado y te avisaremos cuando se resuelva.</p>
        <button className="btn primario" onClick={() => nav('/app')}>Volver al mapa</button>
      </div>
    );

  return (
    <div>
      <header className="m-header"><div><div className="eyebrow">Reporte de incidencias</div><h1>¿Qué pasó?</h1></div></header>
      <form className="form pad" onSubmit={(e) => { e.preventDefault(); reportar({ parqueaderoId: lote, tipo, descripcion: desc || TIPOS_INCIDENCIA[tipo], foto }); setEnviado(true); }}>
        <label>Parqueadero</label>
        <select value={lote} onChange={(e) => setLote(e.target.value)}>{PARQUEADEROS.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}</select>
        <label>Tipo</label>
        <div className="chips wrap">
          {(Object.keys(TIPOS_INCIDENCIA) as TipoIncidencia[]).map((t) => <button type="button" key={t} className={`chip${tipo === t ? ' on' : ''}`} onClick={() => setTipo(t)}>{TIPOS_INCIDENCIA[t]}</button>)}
        </div>
        <label>Descripción</label>
        <textarea rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Ej.: Auto blanco ocupando dos plazas en la fila B" />
        <label>Foto</label>
        {foto ? (
          <div className="foto-prev"><img src={foto} alt="Foto del reporte" /><button type="button" className="btn" onClick={() => setFoto(undefined)}>Quitar</button></div>
        ) : (
          <div className="demo-row">
            <label className="btn"><Camera size={16} /> Tomar / subir foto<input type="file" accept="image/*" capture="environment" hidden onChange={(e) => subir(e.target.files?.[0])} /></label>
            <button type="button" className="btn" onClick={() => setFoto(FOTO_EJEMPLO)}><ImagePlus size={16} /> Foto de ejemplo</button>
          </div>
        )}
        <button className="btn primario grande">Enviar reporte</button>
      </form>
    </div>
  );
}
