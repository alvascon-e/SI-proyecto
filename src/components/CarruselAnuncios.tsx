import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Coffee, Landmark, Printer, Wrench, type LucideIcon } from 'lucide-react';
import { useParki } from '../store';

const ICONOS: Record<string, LucideIcon> = { ad1: Coffee, ad2: Printer, ad3: Wrench, ad4: Landmark };

// Carrusel discreto: rota solo cada 6 s, sin ventanas emergentes (funcionalidad 9).
export default function CarruselAnuncios() {
  const todos = useParki((s) => s.anuncios);
  const anuncios = todos.filter((a) => a.activo);
  const clic = useParki((s) => s.clicAnuncio);
  const impresion = useParki((s) => s.impresionAnuncio);
  const [i, setI] = useState(0);
  const n = anuncios.length;
  useEffect(() => {
    if (!n) return;
    const id = setInterval(() => setI((x) => (x + 1) % n), 6000);
    return () => clearInterval(id);
  }, [n]);
  const a = n ? anuncios[i % n] : null;
  useEffect(() => { if (a) impresion(a.id); }, [a?.id]);
  if (!a) return null;
  const Icono = ICONOS[a.id] ?? Coffee;
  return (
    <div className="carrusel">
      <div className="carrusel-cuerpo" onClick={() => clic(a.id)}>
        <span className="carrusel-icono" style={{ background: a.color }}><Icono size={18} /></span>
        <div className="carrusel-txt">
          <div className="carrusel-titulo">{a.titulo}</div>
          <div className="carrusel-texto">{a.cliente} · {a.texto}</div>
        </div>
      </div>
      <div className="carrusel-pie">
        <span className="carrusel-tag">Patrocinado</span>
        <div className="carrusel-nav">
          <button className="flecha" onClick={() => setI((i - 1 + n) % n)} aria-label="Anterior"><ChevronLeft size={14} /></button>
          <div className="carrusel-puntos">{anuncios.map((x, k) => <button key={x.id} className={k === i % n ? 'on' : ''} onClick={() => setI(k)} aria-label={`Anuncio ${k + 1}`} />)}</div>
          <button className="flecha" onClick={() => setI((i + 1) % n)} aria-label="Siguiente"><ChevronRight size={14} /></button>
        </div>
      </div>
    </div>
  );
}
