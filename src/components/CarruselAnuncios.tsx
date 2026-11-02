import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useParki } from '../store';

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
  return (
    <div className="carrusel" style={{ background: a.color }}>
      <button className="flecha" onClick={() => setI((i - 1 + n) % n)} aria-label="Anterior"><ChevronLeft size={16} /></button>
      <div className="carrusel-cuerpo" onClick={() => clic(a.id)}>
        <span className="carrusel-emoji">{a.emoji}</span>
        <div>
          <div className="carrusel-titulo">{a.titulo}</div>
          <div className="carrusel-texto">{a.cliente} · {a.texto}</div>
        </div>
      </div>
      <button className="flecha" onClick={() => setI((i + 1) % n)} aria-label="Siguiente"><ChevronRight size={16} /></button>
      <span className="carrusel-tag">Anuncio</span>
      <div className="carrusel-puntos">{anuncios.map((x, k) => <i key={x.id} className={k === i % n ? 'on' : ''} />)}</div>
    </div>
  );
}
