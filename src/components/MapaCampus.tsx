import { useEffect } from 'react';
import { CircleMarker, MapContainer, Marker, Polygon, Polyline, TileLayer, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CAMPUS_CENTRO, PARQUEADEROS } from '../data/parqueaderos';
import { useParki } from '../store';
import { COLOR_NIVEL, libres, nivel } from '../util';
import type { Categoria } from '../types';

function etiqueta(n: number | string, color: string, destacado: boolean) {
  return L.divIcon({
    className: '',
    iconSize: [34, 24],
    iconAnchor: [17, 12],
    html: `<div class="pin-lote${destacado ? ' pin-destacado' : ''}" style="--c:${color}"><b>${n}</b></div>`,
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
}

export default function MapaCampus({ alto = 360, categoria, seleccionado, onSelect, ruta, destino, yo, encuadre, zoom = 16, interactivo = true }: Props) {
  const lotes = useParki((s) => s.lotes);
  return (
    <MapContainer center={CAMPUS_CENTRO} zoom={zoom} style={{ height: alto, width: '100%' }} zoomControl={false}
      attributionControl={true} scrollWheelZoom={interactivo} dragging={interactivo}>
      <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© OpenStreetMap contributors' maxZoom={19} />
      <Encuadre puntos={encuadre} zoom={zoom} />
      {ruta && <Polyline positions={ruta} pathOptions={{ color: '#2d68d6', weight: 6, opacity: 0.9 }} />}
      {PARQUEADEROS.map((p) => {
        const l = lotes[p.id];
        const permitido = !categoria || p.categorias.includes(categoria);
        const c = permitido ? COLOR_NIVEL[nivel(p, l)] : '#94a3b8';
        const sel = seleccionado === p.id;
        return (
          <div key={p.id}>
            <Polygon positions={p.poligono} eventHandlers={{ click: () => onSelect?.(p.id) }}
              pathOptions={{ color: c, weight: sel ? 3.5 : 1.5, fillColor: c, fillOpacity: permitido ? (sel ? 0.55 : 0.35) : 0.12 }} />
            <Marker position={p.centro} icon={etiqueta(l.cerrado ? '×' : libres(p, l), c, sel)} eventHandlers={{ click: () => onSelect?.(p.id) }} opacity={permitido ? 1 : 0.55}>
              <Tooltip direction="top" offset={[0, -14]}>{p.nombre}</Tooltip>
            </Marker>
          </div>
        );
      })}
      {destino && <CircleMarker center={destino} radius={9} pathOptions={{ color: '#fff', weight: 3, fillColor: '#14213d', fillOpacity: 1 }}><Tooltip permanent direction="right" offset={[10, 0]}>Destino</Tooltip></CircleMarker>}
      {yo && <CircleMarker center={yo} radius={8} pathOptions={{ color: '#fff', weight: 3, fillColor: '#2d68d6', fillOpacity: 1 }} />}
    </MapContainer>
  );
}
