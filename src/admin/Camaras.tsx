import { useState } from 'react';
import CamaraIA from '../components/CamaraIA';
import { PARQUEADEROS } from '../data/parqueaderos';
import { useParki } from '../store';
import { libres } from '../util';

export default function Camaras() {
  const [lote, setLote] = useState<string>('todos');
  const lotes = useParki((s) => s.lotes);
  const [grande, setGrande] = useState<{ l: string; i: number } | null>(null);
  const lista = lote === 'todos' ? PARQUEADEROS.map((p) => ({ l: p.id, i: 0 })) : Array.from({ length: PARQUEADEROS.find((p) => p.id === lote)!.camaras }, (_, i) => ({ l: lote, i }));
  return (
    <div>
      <div className="fila-sb">
        <div className="a-head"><h1 className="a-titulo">Cámaras con visión por computadora</h1></div>
        <select value={lote} onChange={(e) => setLote(e.target.value)}>
          <option value="todos">Todos los parqueaderos (cámara principal)</option>
          {PARQUEADEROS.map((p) => <option key={p.id} value={p.id}>{p.nombre} · {p.camaras} cámaras</option>)}
        </select>
      </div>
      <p className="muted">Cada cámara detecta vehículos por plaza y registra la hora en que se ocupa y se libera, para calcular permanencia y rotación.</p>
      {grande && (
        <div className="modal" onClick={() => setGrande(null)}>
          <div className="modal-cuerpo" onClick={(e) => e.stopPropagation()}>
            <div className="fila-sb"><b>{PARQUEADEROS.find((p) => p.id === grande.l)!.nombre}</b><button className="btn" onClick={() => setGrande(null)}>Cerrar</button></div>
            <CamaraIA loteId={grande.l} indice={grande.i} />
          </div>
        </div>
      )}
      <div className="grid-cams">
        {lista.map(({ l, i }) => {
          const p = PARQUEADEROS.find((x) => x.id === l)!;
          return (
            <div key={`${l}-${i}`} className="cam-card" onClick={() => setGrande({ l, i })}>
              <CamaraIA loteId={l} indice={i} compacta />
              <div className="cam-pie"><b>{p.nombre}</b><span>{libres(p, lotes[l])} libres · {lotes[l].camarasOnline}/{p.camaras} en línea</span></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
