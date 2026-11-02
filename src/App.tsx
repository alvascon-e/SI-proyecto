import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { MonitorSmartphone, LayoutDashboard } from 'lucide-react';
import { Logo } from './components/Logo';
import PanelDemo from './components/PanelDemo';
import MovilLayout from './movil/Layout';
import Login from './movil/Login';
import Inicio from './movil/Inicio';
import Buscar from './movil/Buscar';
import Detalle from './movil/Detalle';
import Ruta from './movil/Ruta';
import Reportar from './movil/Reportar';
import Planes from './movil/Planes';
import Pago from './movil/Pago';
import Perfil from './movil/Perfil';
import AdminLayout from './admin/Layout';
import AdminLogin from './admin/Login';
import Dashboard from './admin/Dashboard';
import Camaras from './admin/Camaras';
import Analitica from './admin/Analitica';
import Incidencias from './admin/Incidencias';
import Gestion from './admin/Gestion';

function Portada() {
  return (
    <div className="portada">
      <Logo size={56} vertical />
      <p>Prototipo · Sistemas de Información (CCPG1054) · ESPOL</p>
      <div className="portada-opciones">
        <Link to="/app" className="portada-op"><MonitorSmartphone size={34} /><b>App móvil</b><span>Conductores: estudiantes, docentes y administrativos</span></Link>
        <Link to="/admin" className="portada-op"><LayoutDashboard size={34} /><b>Panel administrativo</b><span>Planta Física: monitoreo, cámaras IA y reportes</span></Link>
      </div>
      <p className="muted">Abre ambas en pestañas distintas: lo que pase en una se refleja en la otra al instante. El botón “Demo” dispara eventos simulados.</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portada />} />
        <Route path="/app/login" element={<Login />} />
        <Route path="/app" element={<MovilLayout />}>
          <Route index element={<Inicio />} />
          <Route path="buscar" element={<Buscar />} />
          <Route path="p/:id" element={<Detalle />} />
          <Route path="ruta/:id" element={<Ruta />} />
          <Route path="reportar" element={<Reportar />} />
          <Route path="planes" element={<Planes />} />
          <Route path="pago/:plan" element={<Pago />} />
          <Route path="perfil" element={<Perfil />} />
        </Route>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="camaras" element={<Camaras />} />
          <Route path="analitica" element={<Analitica />} />
          <Route path="incidencias" element={<Incidencias />} />
          <Route path="gestion" element={<Gestion />} />
        </Route>
      </Routes>
      <PanelDemo />
    </BrowserRouter>
  );
}
