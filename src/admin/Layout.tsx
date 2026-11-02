import { NavLink, Outlet } from 'react-router-dom';
import { BarChart3, Camera, LayoutDashboard, Settings2, TriangleAlert, Clock3 } from 'lucide-react';
import { Logo } from '../components/Logo';
import { fmtHora, useParki } from '../store';

export default function AdminLayout() {
  const hora = useParki((s) => s.hora);
  const nuevas = useParki((s) => s.incidencias.filter((i) => i.estado === 'nueva').length);
  return (
    <div className="admin">
      <aside className="sidebar">
        <div className="sb-logo"><Logo size={30} claro /></div>
        <nav>
          <NavLink to="/admin" end><LayoutDashboard size={18} /> Monitoreo</NavLink>
          <NavLink to="/admin/camaras"><Camera size={18} /> Cámaras IA</NavLink>
          <NavLink to="/admin/analitica"><BarChart3 size={18} /> Analítica y reportes</NavLink>
          <NavLink to="/admin/incidencias"><TriangleAlert size={18} /> Incidencias {nuevas > 0 && <span className="badge">{nuevas}</span>}</NavLink>
          <NavLink to="/admin/gestion"><Settings2 size={18} /> Gestión</NavLink>
        </nav>
        <div className="sb-pie">
          <div className="avatar chico">CH</div>
          <div><b>Ing. Carlos Hidalgo</b><small>Planta Física · ESPOL</small></div>
        </div>
      </aside>
      <div className="admin-main">
        <header className="admin-top">
          <div className="muted">Campus Gustavo Galindo · ESPOL</div>
          <div className="reloj"><span className="vivo" /> En vivo · <Clock3 size={14} /> {fmtHora(hora)}</div>
        </header>
        <div className="admin-contenido"><Outlet /></div>
      </div>
    </div>
  );
}
