import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { BarChart3, Camera, LayoutDashboard, LogOut, Settings2, TriangleAlert } from 'lucide-react';
import { Logo } from '../components/Logo';
import { fmtHora, useParki } from '../store';

export default function AdminLayout() {
  const hora = useParki((s) => s.hora);
  const admin = useParki((s) => s.admin);
  const salir = useParki((s) => s.logoutAdmin);
  const nuevas = useParki((s) => s.incidencias.filter((i) => i.estado === 'nueva').length);
  const nav = useNavigate();
  if (!admin) return <Navigate to="/admin/login" replace />;
  const dia = new Date().toLocaleDateString('es-EC', { weekday: 'long', day: 'numeric', month: 'long' });
  return (
    <div className="admin">
      <aside className="sidebar">
        <div className="sb-logo"><Logo size={30} /></div>
        <div className="sb-grupo">General</div>
        <nav>
          <NavLink to="/admin" end><LayoutDashboard size={18} /> Monitoreo</NavLink>
          <NavLink to="/admin/camaras"><Camera size={18} /> Cámaras IA</NavLink>
          <NavLink to="/admin/analitica"><BarChart3 size={18} /> Analítica y reportes</NavLink>
          <NavLink to="/admin/incidencias"><TriangleAlert size={18} /> Incidencias {nuevas > 0 && <span className="badge">{nuevas}</span>}</NavLink>
          <div className="sb-grupo">Administración</div>
          <NavLink to="/admin/gestion"><Settings2 size={18} /> Gestión</NavLink>
        </nav>
        <div className="sb-pie">
          <div className="avatar chico">CH</div>
          <div className="sb-user"><b>{admin.nombre}</b><small>Planta Física · ESPOL</small></div>
          <button className="icon-btn" title="Cerrar sesión" onClick={() => { salir(); nav('/admin/login'); }}><LogOut size={16} /></button>
        </div>
      </aside>
      <div className="admin-main">
        <header className="admin-top">
          <div><div className="eyebrow">{dia}</div><div className="top-campus">Campus Gustavo Galindo</div></div>
          <div className="reloj"><span className="vivo" /> En vivo · {fmtHora(hora)}</div>
        </header>
        <div className="admin-contenido"><Outlet /></div>
      </div>
    </div>
  );
}
