import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Camera, CheckCircle2, ImagePlus } from 'lucide-react';
import { PARQUEADEROS } from '../data/parqueaderos';
import { TIPOS_INCIDENCIA } from '../data/catalogos';
import { useParki } from '../store';
import type { TipoIncidencia } from '../types';

// Foto de ejemplo para la demo (ilustración de un auto ocupando dos plazas).
const FOTO_EJEMPLO = 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260"><defs><linearGradient id="a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5b6472"/><stop offset="1" stop-color="#454c57"/></linearGradient></defs><rect width="400" height="260" fill="url(#a)"/><g stroke="#f4f4f0" stroke-width="5" stroke-linecap="round"><line x1="60" y1="18" x2="60" y2="242"/><line x1="200" y1="18" x2="200" y2="242"/><line x1="340" y1="18" x2="340" y2="242"/></g><text x="130" y="40" font-family="sans-serif" font-size="18" font-weight="700" fill="#cfd3da">B3</text><text x="270" y="40" font-family="sans-serif" font-size="18" font-weight="700" fill="#cfd3da">B4</text><g transform="translate(200 138) rotate(-72)"><ellipse cx="0" cy="6" rx="62" ry="104" fill="#000" opacity=".22"/><rect x="-14" y="-104" width="10" height="16" rx="3" fill="#1f2937"/><rect x="-58" y="-96" width="116" height="192" rx="34" fill="#c81e1e"/><rect x="-58" y="-96" width="116" height="192" rx="34" fill="none" stroke="#8f1414" stroke-width="3"/><rect x="-46" y="-62" width="92" height="40" rx="12" fill="#1f2937" opacity=".85"/><rect x="-42" y="44" width="84" height="28" rx="10" fill="#1f2937" opacity=".75"/><rect x="-40" y="-18" width="80" height="58" rx="12" fill="#e23b3b"/><rect x="-66" y="-52" width="12" height="18" rx="4" fill="#c81e1e"/><rect x="54" y="-52" width="12" height="18" rx="4" fill="#c81e1e"/><rect x="-48" y="-94" width="22" height="10" rx="4" fill="#fde68a"/><rect x="26" y="-94" width="22" height="10" rx="4" fill="#fde68a"/><rect x="-48" y="86" width="22" height="8" rx="3" fill="#7f1d1d"/><rect x="26" y="86" width="22" height="8" rx="3" fill="#7f1d1d"/></g></svg>`);

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
        <textarea rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Ej.: Auto rojo ocupando dos plazas en la fila B" />
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
