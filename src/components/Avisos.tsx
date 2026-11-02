import { useEffect } from 'react';
import { Bell, CheckCircle2, TriangleAlert } from 'lucide-react';
import { useParki } from '../store';

// Notificaciones push simuladas dentro de la app móvil.
export default function Avisos() {
  const notifs = useParki((s) => s.notificaciones);
  const quitar = useParki((s) => s.descartarNotificacion);
  useEffect(() => {
    if (!notifs.length) return;
    const n = notifs[0];
    const id = setTimeout(() => quitar(n.id), 7000);
    return () => clearTimeout(id);
  }, [notifs[0]?.id]);
  const n = notifs[0];
  if (!n) return null;
  const Icono = n.tono === 'alerta' ? TriangleAlert : n.tono === 'ok' ? CheckCircle2 : Bell;
  return (
    <div className={`aviso aviso-${n.tono}`} onClick={() => quitar(n.id)}>
      <Icono size={20} />
      <div><b>{n.titulo}</b><div>{n.texto}</div></div>
    </div>
  );
}
