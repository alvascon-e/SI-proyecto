import { useEffect, useState } from 'react';
import { lotePorId, useParki, fmtHora } from '../store';

// Vista simulada de una cámara cenital con detección por visión por computadora:
// cada plaza se marca libre/ocupada según la ocupación real del parqueadero.
const COLS = 8, FILAS = 2;
const hash = (n: number) => { let x = Math.sin(n * 9301 + 49297) * 233280; return x - Math.floor(x); };
const COLORES = ['#e2e8f0', '#1e293b', '#991b1b', '#1d4ed8', '#9ca3af', '#f8fafc', '#475569', '#7c2d12'];

export default function CamaraIA({ loteId, indice, compacta = false }: { loteId: string; indice: number; compacta?: boolean }) {
  const p = lotePorId(loteId);
  const l = useParki((s) => s.lotes[loteId]);
  const hora = useParki((s) => s.hora);
  const malEst = useParki((s) => s.incidencias.some((i) => i.parqueaderoId === loteId && i.origen === 'camara' && i.estado !== 'resuelta'));
  const [t, setT] = useState(0);
  useEffect(() => { const id = setInterval(() => setT((x) => x + 1), 1000); return () => clearInterval(id); }, []);

  const online = indice < l.camarasOnline;
  const ratio = l.ocupados / p.capacidad;
  const slots = Array.from({ length: COLS * FILAS }, (_, i) => i);
  const W = 640, H = 360, sw = 64, sh = 104, x0 = 64, y0s = [40, 216];
  const cam = `CAM-${loteId.toUpperCase().slice(0, 6)}-0${indice + 1}`;
  const libresCam = slots.filter((i) => !(hash(i + indice * 50 + loteId.length) < ratio)).length;

  return (
    <div className={`camara${compacta ? ' compacta' : ''}`}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', background: '#2b2f36' }}>
        {online ? (
          <>
            <rect x="0" y="0" width={W} height={H} fill="#30343b" />
            <rect x="0" y="148" width={W} height="64" fill="#3a3f47" />
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => <rect key={k} x={k * 72 - (t * 6) % 72} y="178" width="36" height="4" fill="#d4d4d4" opacity="0.5" />)}
            {slots.map((i) => {
              const fila = Math.floor(i / COLS), col = i % COLS;
              const x = x0 + col * sw, y = y0s[fila];
              const ocupado = hash(i + indice * 50 + loteId.length) < ratio;
              const pref = indice === 0 && fila === 0 && col === 0;
              // el auto mal estacionado ocupa las plazas 3 y 4 de la fila inferior: se dibuja una sola vez, cruzado sobre la línea
              const malZona = malEst && indice === 0 && fila === 1 && (col === 3 || col === 4);
              const malAqui = malEst && indice === 0 && fila === 1 && col === 3;
              const conf = (0.88 + hash(i * 3 + indice) * 0.11).toFixed(2);
              return (
                <g key={i}>
                  <rect x={x} y={y} width={sw} height={sh} fill={pref ? '#1e3a8a33' : 'none'} stroke="#e5e7eb" strokeWidth="2" opacity="0.8" />
                  {pref && <text x={x + sw / 2} y={y + sh / 2 + 8} textAnchor="middle" fontSize="26" fill="#93c5fd">♿</text>}
                  {ocupado && !malZona && (
                    <>
                      <rect x={x + 10} y={y + 12} width={sw - 20} height={sh - 24} rx="9" fill={COLORES[Math.floor(hash(i + 7 * indice) * COLORES.length)]} />
                      <rect x={x + 15} y={y + 30} width={sw - 30} height="22" rx="4" fill="#0f172a" opacity="0.55" />
                      <rect x={x + 6} y={y + 8} width={sw - 12} height={sh - 16} fill="none" stroke="#ef4444" strokeWidth="2" />
                      {!compacta && <text x={x + 8} y={y + 6} fontSize="10" fill="#fecaca" fontFamily="monospace">auto {conf}</text>}
                    </>
                  )}
                  {!ocupado && !malZona && <rect x={x + 6} y={y + 8} width={sw - 12} height={sh - 16} fill="#22c55e22" stroke="#22c55e" strokeWidth="2" strokeDasharray="6 4" />}
                  {malAqui && (
                    <>
                      <g transform={`rotate(-16 ${x + sw} ${y + sh / 2})`}>
                        <rect x={x + sw - 30} y={y + 10} width="60" height={sh - 20} rx="12" fill="#c81e1e" />
                        <rect x={x + sw - 22} y={y + 22} width="44" height="20" rx="6" fill="#0f172a" opacity="0.7" />
                        <rect x={x + sw - 21} y={y + sh - 38} width="42" height="16" rx="6" fill="#0f172a" opacity="0.55" />
                      </g>
                      <rect x={x + 4} y={y + 4} width={sw * 2 - 8} height={sh - 8} fill="#f59e0b22" stroke="#f59e0b" strokeWidth="3" />
                      <text x={x + 6} y={y - 4} fontSize="11" fill="#fde68a" fontFamily="monospace">mal estacionado 0.91 · ocupa 2 plazas</text>
                    </>
                  )}
                </g>
              );
            })}
            <rect x="0" y={((t * 37) % (H + 40)) - 20} width={W} height="2" fill="#38bdf8" opacity="0.25" />
          </>
        ) : (
          <>
            {Array.from({ length: 140 }, (_, k) => <rect key={k} x={hash(k + t) * W} y={hash(k * 7 + t) * H} width={30 + hash(k) * 80} height="3" fill="#94a3b8" opacity={0.15 + hash(k + 3 * t) * 0.3} />)}
            <text x={W / 2} y={H / 2} textAnchor="middle" fontSize="30" fill="#f87171" fontFamily="monospace">SIN SEÑAL</text>
          </>
        )}
        <rect x="0" y="0" width={W} height="28" fill="#000" opacity="0.55" />
        <circle cx="16" cy="14" r="5" fill={online ? (t % 2 ? '#ef4444' : '#7f1d1d') : '#475569'} />
        <text x="28" y="19" fontSize="13" fill="#fff" fontFamily="monospace">{cam} · {online ? 'REC' : 'OFFLINE'}</text>
        <text x={W - 10} y="19" fontSize="13" fill="#fff" fontFamily="monospace" textAnchor="end">{fmtHora(hora)}:{String(t % 60).padStart(2, '0')}</text>
        {online && !compacta && (
          <>
            <rect x="0" y={H - 26} width={W} height="26" fill="#000" opacity="0.55" />
            <text x="10" y={H - 9} fontSize="12" fill="#86efac" fontFamily="monospace">Visión IA · detección de vehículos · {libresCam} libres / {COLS * FILAS} plazas en cuadro</text>
          </>
        )}
      </svg>
    </div>
  );
}
