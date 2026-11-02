import { useNavigate } from 'react-router-dom';
import { useParki } from '../store';

/** Descuenta una consulta del plan; si se agotó, lleva a la pantalla de planes (funcionalidad 11). */
export function useConsulta() {
  const consumir = useParki((s) => s.consumirConsulta);
  const nav = useNavigate();
  return (seguir: () => void) => {
    if (consumir()) seguir();
    else nav('/app/planes', { state: { agotado: true } });
  };
}
