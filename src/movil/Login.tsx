import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { CATEGORIAS } from '../data/catalogos';
import { useParki } from '../store';
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
