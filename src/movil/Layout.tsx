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
        {/* filtro de refracción para el efecto de vidrio mojado de la barra */}
        <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
          <filter id="vidrio" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.035" numOctaves="2" seed="7" result="ruido" />
            <feGaussianBlur in="ruido" stdDeviation="1.5" result="suave" />
            <feDisplacementMap in="SourceGraphic" in2="suave" scale="14" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
        <div className="tabbar-velo" aria-hidden="true" />
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
