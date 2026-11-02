import { useEffect } from 'react';
import { CircleMarker, MapContainer, Marker, Polygon, Polyline, TileLayer, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CAMPUS_CENTRO, PARQUEADEROS } from '../data/parqueaderos';
import { useParki } from '../store';
import { COLOR_NIVEL, libres, nivel } from '../util';
import type { Categoria } from '../types';

function etiqueta(n: number | string, color: string, destacado: boolean, atenuado: boolean) {
  return L.divIcon({
    className: '',
    iconSize: [40, 24],
    iconAnchor: [20, 12],
    html: `<div class="pin-lote${destacado ? ' pin-destacado' : ''}${atenuado ? ' pin-atenuado' : ''}" style="--c:${color}"><i></i><b>${n}</b></div>`,
  });
}

function Encuadre({ puntos, zoom }: { puntos?: [number, number][]; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    const pts = puntos && puntos.length > 1 ? puntos : PARQUEADEROS.map((p) => p.centro);
    map.fitBounds(L.latLngBounds(pts), { padding: [28, 28], maxZoom: zoom ?? 18 });
  }, [map, JSON.stringify(puntos), zoom]);
  return null;
}

interface Props {
  alto?: number | string;
  categoria?: Categoria | null;
  seleccionado?: string | null;
  onSelect?: (id: string) => void;
  ruta?: [number, number][];
  destino?: [number, number] | null;
  yo?: [number, number] | null;
  encuadre?: [number, number][];
  zoom?: number;
  interactivo?: boolean;
  /** colores y etiquetas fijas por parqueadero (reportes); si no, se usa la ocupación en vivo */
  colores?: Record<string, string>;
  etiquetas?: Record<string, string | number>;
}

export default function MapaCampus({ alto = 360, categoria, seleccionado, onSelect, ruta, destino, yo, encuadre, zoom = 16, interactivo = true, colores, etiquetas }: Props) {
  const lotes = useParki((s) => s.lotes);
  return (
    <MapContainer center={CAMPUS_CENTRO} zoom={zoom} style={{ height: alto, width: '100%' }} zoomControl={false}
      attributionControl={true} scrollWheelZoom={interactivo} dragging={interactivo}>
      <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© OpenStreetMap contributors' maxZoom={19} />
      <Encuadre puntos={encuadre} zoom={zoom} />
      {ruta && <Polyline positions={ruta} pathOptions={{ color: '#0066dc', weight: 5, opacity: 0.95, lineCap: 'round' }} />}
      {PARQUEADEROS.map((p) => {
        const l = lotes[p.id];
        const permitido = !categoria || p.categorias.includes(categoria);
        const c = colores?.[p.id] ?? (permitido ? COLOR_NIVEL[nivel(p, l)] : '#94a3b8');
        const sel = seleccionado === p.id;
        return (
          <div key={p.id}>
            <Polygon positions={p.poligono} eventHandlers={{ click: () => onSelect?.(p.id) }}
              pathOptions={{ color: c, weight: sel ? 2.5 : 1, fillColor: c, fillOpacity: permitido ? (sel ? 0.45 : 0.22) : 0.08 }} />
            <Marker position={p.centro} icon={etiqueta(etiquetas ? (etiquetas[p.id] ?? '') : l.cerrado ? '—' : libres(p, l), c, sel, !permitido)} eventHandlers={{ click: () => onSelect?.(p.id) }}>
              <Tooltip direction="top" offset={[0, -14]}>{p.nombre}</Tooltip>
            </Marker>
          </div>
        );
      })}
      {destino && <CircleMarker center={destino} radius={9} pathOptions={{ color: '#fff', weight: 3, fillColor: '#0f2340', fillOpacity: 1 }}><Tooltip permanent direction="right" offset={[10, 0]} className="tip-destino">Destino</Tooltip></CircleMarker>}
      {yo && <CircleMarker center={yo} radius={8} pathOptions={{ color: '#fff', weight: 3, fillColor: '#0066dc', fillOpacity: 1 }} />}
    </MapContainer>
  );
}
