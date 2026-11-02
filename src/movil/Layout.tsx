import { NavLink, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Map, Navigation, TriangleAlert, User } from 'lucide-react';
import { MODO_GUION, useParki } from '../store';
import Avisos from '../components/Avisos';

export default function MovilLayout() {
  const usuario = useParki((s) => s.usuario);
  const loc = useLocation();
  if (!usuario) return <Navigate to="/app/login" replace state={{ desde: loc.pathname }} />;
  return (
    <div className="movil-marco">
      <div className="movil">
        {MODO_GUION && <div className="status-ios"><span>9:41</span><span className="status-ic"><svg width="18" height="12" viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5.5" width="3" height="6.5" rx="1" /><rect x="10" y="3" width="3" height="9" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" /></svg><svg width="16" height="12" viewBox="0 0 16 12"><path d="M8 11.5 5.6 9a3.4 3.4 0 0 1 4.8 0zM2.9 6.3a7.2 7.2 0 0 1 10.2 0l-1.5 1.5a5.1 5.1 0 0 0-7.2 0zM.2 3.6a11 11 0 0 1 15.6 0l-1.5 1.5a8.9 8.9 0 0 0-12.6 0z" /></svg><svg width="27" height="13" viewBox="0 0 27 13"><rect x="0.75" y="0.75" width="22.5" height="11.5" rx="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.45" /><rect x="2.5" y="2.5" width="17" height="8" rx="2" /><rect x="24.5" y="4.5" width="2" height="4" rx="1" opacity="0.5" /></svg></span></div>}
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
