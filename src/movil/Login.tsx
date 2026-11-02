import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { CATEGORIAS } from '../data/catalogos';
import { MODO_GUION, useParki } from '../store';
import type { Categoria } from '../types';

const DEMO: Record<Categoria, { nombre: string; correo: string }> = {
  estudiante: { nombre: 'Mateo Morales', correo: 'mmorales@espol.edu.ec' },
  docente: { nombre: 'Andrea Castillo', correo: 'acastill@espol.edu.ec' },
  administrativo: { nombre: 'Jorge Peña', correo: 'jpena@espol.edu.ec' },
};

export default function Login() {
  const login = useParki((s) => s.login);
  const nav = useNavigate();
  const loc = useLocation() as { state?: { desde?: string } };
  const [modo, setModo] = useState<'ingresar' | 'registro'>('ingresar');
  const [cat, setCat] = useState<Categoria>('estudiante');
  const [nombre, setNombre] = useState(DEMO.estudiante.nombre);
  const [correo, setCorreo] = useState(DEMO.estudiante.correo);
  const [clave, setClave] = useState('••••••••');
  const elegir = (c: Categoria) => { setCat(c); setNombre(DEMO[c].nombre); setCorreo(DEMO[c].correo); };
  const valido = /@espol\.edu\.ec$/i.test(correo) && clave.length >= 4 && nombre.trim().length > 2;

  return (
    <div className="movil-marco">
      <div className="movil login">
        {MODO_GUION && <div className="status-ios"><span>9:41</span><span className="status-ic"><svg width="18" height="12" viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5.5" width="3" height="6.5" rx="1" /><rect x="10" y="3" width="3" height="9" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" /></svg><svg width="16" height="12" viewBox="0 0 16 12"><path d="M8 11.5 5.6 9a3.4 3.4 0 0 1 4.8 0zM2.9 6.3a7.2 7.2 0 0 1 10.2 0l-1.5 1.5a5.1 5.1 0 0 0-7.2 0zM.2 3.6a11 11 0 0 1 15.6 0l-1.5 1.5a8.9 8.9 0 0 0-12.6 0z" /></svg><svg width="27" height="13" viewBox="0 0 27 13"><rect x="0.75" y="0.75" width="22.5" height="11.5" rx="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.45" /><rect x="2.5" y="2.5" width="17" height="8" rx="2" /><rect x="24.5" y="4.5" width="2" height="4" rx="1" opacity="0.5" /></svg></span></div>}
        <div className="login-hero">
          <Logo size={46} vertical />
          <p>Encuentra tu espacio de parqueo libre en tiempo real.</p>
        </div>
        <div className="seg">
          <button className={modo === 'ingresar' ? 'on' : ''} onClick={() => setModo('ingresar')}>Ingresar</button>
          <button className={modo === 'registro' ? 'on' : ''} onClick={() => setModo('registro')}>Crear cuenta</button>
        </div>
        <form className="form" onSubmit={(e) => { e.preventDefault(); if (!valido) return; login(nombre.trim(), correo.trim(), cat); nav(loc.state?.desde && loc.state.desde !== '/app/login' ? loc.state.desde : '/app'); }}>
          <label>Soy</label>
          <div className="chips">
            {(Object.keys(CATEGORIAS) as Categoria[]).map((c) => (
              <button type="button" key={c} className={`chip${cat === c ? ' on' : ''}`} onClick={() => elegir(c)}>{CATEGORIAS[c]}</button>
            ))}
          </div>
          {modo === 'registro' && (<><label>Nombre completo</label><input value={nombre} onChange={(e) => setNombre(e.target.value)} /></>)}
          <label>Correo institucional</label>
          <input value={correo} onChange={(e) => setCorreo(e.target.value)} inputMode="email" />
          {!/@espol\.edu\.ec$/i.test(correo) && <small className="error">Usa tu correo @espol.edu.ec</small>}
          <label>Contraseña</label>
          <input type="password" value={clave} onChange={(e) => setClave(e.target.value)} />
          <button className="btn primario grande" disabled={!valido}>{modo === 'ingresar' ? 'Ingresar' : 'Crear cuenta'}</button>
          <p className="muted centro">Tu perfil define qué parqueaderos puedes usar.</p>
        </form>
      </div>
    </div>
  );
}
