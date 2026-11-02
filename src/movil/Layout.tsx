import { NavLink, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Map, Navigation, TriangleAlert, User } from 'lucide-react';
import { useParki } from '../store';
import Avisos from '../components/Avisos';

export default function MovilLayout() {
  const usuario = useParki((s) => s.usuario);
  const loc = useLocation();
  if (!usuario) return <Navigate to="/app/login" replace state={{ desde: loc.pathname }} />;
  return (
    <div className="movil-marco">
      <div className="movil">
        <Avisos />
        <main className="movil-contenido"><Outlet /></main>
        <nav className="tabbar">
          <NavLink to="/app" end><Map size={22} strokeWidth={2.4} /><span>Mapa</span></NavLink>
          <NavLink to="/app/buscar"><Navigation size={22} strokeWidth={2.4} /><span>Buscar</span></NavLink>
          <NavLink to="/app/reportar"><TriangleAlert size={22} strokeWidth={2.4} /><span>Reportar</span></NavLink>
          <NavLink to="/app/perfil"><User size={22} strokeWidth={2.4} /><span>Perfil</span></NavLink>
        </nav>
      </div>
    </div>
  );
}
