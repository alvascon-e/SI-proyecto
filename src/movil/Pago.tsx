import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Lock } from 'lucide-react';
import { PLANES } from '../data/catalogos';
import { useParki } from '../store';
import type { Pago as TPago, Plan } from '../types';

// Pasarela de pago simulada (funcionalidad 10): resumen → tarjeta de prueba → comprobante.
export default function Pago() {
  const { plan = 'plus' } = useParams() as { plan: Plan };
  const nav = useNavigate();
  const pagar = useParki((s) => s.pagarPlan);
  const u = useParki((s) => s.usuario)!;
  const pl = PLANES[plan];
  const subtotal = pl.precio, iva = +(subtotal * 0.15).toFixed(2), total = +(subtotal + iva).toFixed(2);
  const [tarjeta, setTarjeta] = useState('4242 4242 4242 4242');
  const [venc, setVenc] = useState('12/28');
  const [cvv, setCvv] = useState('123');
  const [fase, setFase] = useState<'form' | 'procesando' | 'ok'>('form');
  const [pago, setPago] = useState<TPago | null>(null);

  if (fase === 'ok' && pago)
    return (
      <div className="pad centro" style={{ paddingTop: 40 }}>
        <CheckCircle2 size={64} color="#16a34a" />
        <h2>¡Pago aprobado!</h2>
        <p className="muted">Ya tienes el plan {pl.nombre}. Enviamos el comprobante a {u.correo}.</p>
        <div className="comprobante">
          <div><span>Comprobante</span><b>{pago.comprobante}</b></div>
          <div><span>Concepto</span><b>{pago.concepto}</b></div>
          <div><span>Subtotal</span><b>${subtotal.toFixed(2)}</b></div>
          <div><span>IVA 15%</span><b>${iva.toFixed(2)}</b></div>
          <div><span>Total pagado</span><b>${total.toFixed(2)}</b></div>
          <div><span>Método</span><b>{pago.metodo}</b></div>
          <div><span>Fecha</span><b>{new Date(pago.ts).toLocaleString('es-EC')}</b></div>
        </div>
        <button className="btn primario grande" onClick={() => nav('/app')}>Listo</button>
      </div>
    );

  return (
    <div>
      <header className="m-header con-volver">
        <button className="icon-btn" onClick={() => nav(-1)}><ArrowLeft size={20} /></button>
        <h1 className="h-chico">Pago seguro</h1><span />
      </header>
      <div className="pad">
        <div className="comprobante">
          <div><span>Plan {pl.nombre} · mensual</span><b>${subtotal.toFixed(2)}</b></div>
          <div><span>IVA 15%</span><b>${iva.toFixed(2)}</b></div>
          <div className="total"><span>Total a pagar</span><b>${total.toFixed(2)}</b></div>
        </div>
        <form className="form" onSubmit={(e) => {
          e.preventDefault(); setFase('procesando');
          setTimeout(() => { setPago(pagar(plan, `Visa •••• ${tarjeta.replace(/\s/g, '').slice(-4)}`)); setFase('ok'); }, 1600);
        }}>
          <label>Número de tarjeta</label>
          <input value={tarjeta} onChange={(e) => setTarjeta(e.target.value)} inputMode="numeric" />
          <div className="dos">
            <div><label>Vence</label><input value={venc} onChange={(e) => setVenc(e.target.value)} /></div>
            <div><label>CVV</label><input value={cvv} onChange={(e) => setCvv(e.target.value)} /></div>
          </div>
          <button className="btn primario grande" disabled={fase === 'procesando'}>
            {fase === 'procesando' ? 'Procesando…' : <><Lock size={16} /> Pagar ${total.toFixed(2)}</>}
          </button>
          <p className="muted centro">Modo prueba · no se realiza ningún cobro real</p>
        </form>
      </div>
    </div>
  );
}
