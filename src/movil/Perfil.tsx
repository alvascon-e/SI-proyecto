import { useNavigate } from 'react-router-dom';
import { Heart, LogOut, Receipt } from 'lucide-react';
import { CATEGORIAS, PLANES } from '../data/catalogos';
import { lotePorId, useParki } from '../store';

export default function Perfil() {
  const { usuario, pagos, favorito, logout } = useParki();
  const nav = useNavigate();
  const u = usuario!;
  const lim = PLANES[u.plan].consultas;
  const mios = pagos.filter((p) => p.cliente === u.nombre);
  return (
    <div>
      <header className="m-header"><div><div className="eyebrow">Tu cuenta</div><h1>{u.nombre}</h1></div></header>
      <div className="pad">
        <div className="perfil-card">
          <div className="avatar">{u.nombre.split(' ').map((x) => x[0]).slice(0, 2).join('')}</div>
          <div><b>{CATEGORIAS[u.categoria]}</b><div className="muted">{u.correo}</div></div>
        </div>
        <div className="perfil-card col">
          <div className="fila-sb"><b>Plan {PLANES[u.plan].nombre}</b><button className="btn primario chico" onClick={() => nav('/app/planes')}>{u.plan === 'premium' ? 'Ver planes' : 'Mejorar plan'}</button></div>
          <div className="muted">{lim === null ? 'Consultas ilimitadas' : `${u.consultasHoy} de ${lim} consultas usadas hoy`}</div>
          {lim !== null && <div className="barra"><i style={{ width: `${Math.min(100, (u.consultasHoy / lim) * 100)}%`, background: '#0066dc' }} /></div>}
        </div>
        <div className="perfil-card col">
          <b><Heart size={15} /> Parqueadero favorito</b>
          <div className="muted">{favorito ? `${lotePorId(favorito).nombre} · te avisamos cuando se llene o se libere` : 'Marca uno con ♥ para recibir avisos'}</div>
        </div>
        <div className="perfil-card col">
          <b><Receipt size={15} /> Pagos</b>
          {mios.length ? mios.map((p) => <div key={p.id} className="fila-sb"><span>{p.concepto}</span><span>${p.monto.toFixed(2)} · {p.comprobante}</span></div>) : <div className="muted">Aún no tienes pagos</div>}
        </div>
        <button className="btn grande" onClick={() => { logout(); nav('/app/login'); }}><LogOut size={16} /> Cerrar sesión</button>
      </div>
    </div>
  );
}
