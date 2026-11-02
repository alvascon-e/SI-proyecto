import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, LineChart, ShieldCheck } from 'lucide-react';
import { Logo } from '../components/Logo';
import { PARQUEADEROS } from '../data/parqueaderos';
import { useParki } from '../store';

export default function AdminLogin() {
  const loginAdmin = useParki((s) => s.loginAdmin);
  const nav = useNavigate();
  const [correo, setCorreo] = useState('chidalgo@espol.edu.ec');
  const [clave, setClave] = useState('••••••••••');
  const [cargando, setCargando] = useState(false);
  const valido = /@espol\.edu\.ec$/i.test(correo) && clave.length >= 4;
  const camaras = PARQUEADEROS.reduce((a, p) => a + p.camaras, 0);
  return (
    <div className="admin-login">
      <section className="al-marca">
        <div className="al-marca-top"><img src="/logo-mark.png" alt="" className="al-mark" /><span>Panel institucional</span></div>
        <div>
          <h1>La ocupación de tu campus, en tiempo real.</h1>
          <p>Monitorea {PARQUEADEROS.length} parqueaderos con {camaras} cámaras de visión por computadora, atiende incidencias y respalda tus decisiones con datos.</p>
        </div>
        <ul>
          <li><Camera size={18} /> Detección de vehículos por plaza</li>
          <li><LineChart size={18} /> Reportes de ocupación, rotación y demanda</li>
          <li><ShieldCheck size={18} /> Coordinación con el equipo de seguridad</li>
        </ul>
        <small>ESPOL · Administración de Planta Física</small>
      </section>
      <section className="al-form">
        <form onSubmit={(e) => { e.preventDefault(); if (!valido) return; setCargando(true); setTimeout(() => { loginAdmin(correo); nav('/admin'); }, 700); }}>
          <Logo size={40} />
          <h2>Iniciar sesión</h2>
          <p className="muted">Acceso para el personal autorizado de la institución.</p>
          <label>Correo institucional</label>
          <input value={correo} onChange={(e) => setCorreo(e.target.value)} />
          <label>Contraseña</label>
          <input type="password" value={clave} onChange={(e) => setClave(e.target.value)} />
          <button className="btn primario grande" disabled={!valido || cargando}>{cargando ? 'Verificando…' : 'Ingresar al panel'}</button>
          <p className="muted centro">Sesión protegida · rol: Coordinador de espacios</p>
        </form>
      </section>
    </div>
  );
}
