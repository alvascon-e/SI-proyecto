"""Genera src/data/parqueaderos.ts a partir de los contornos reales de OpenStreetMap
(data-osm/parqueaderos-osm.json, consulta Overpass del campus Gustavo Galindo).
Capacidades y categorías son supuestas para el prototipo."""
import json, pathlib
R = pathlib.Path(__file__).resolve().parents[1]
osm = {e["id"]: e for e in json.load(open(R / "data-osm/parqueaderos-osm.json"))["elements"]}
LOTES = [
    # osm id, id, nombre, capacidad, categorías, preferenciales, cámaras
    (126173977, "fiec-fimcp", "Parqueadero Alumnos FIEC–FIMCP", 150, ["estudiante"], 6, 4),
    (317804757, "fiec-docentes", "Parqueadero Docentes FIEC", 70, ["docente", "administrativo"], 4, 2),
    (46485327, "rectorado", "Parqueo Rectorado", 90, ["administrativo", "docente"], 5, 3),
    (323159491, "biblioteca", "Parqueadero Biblioteca Central", 100, ["estudiante", "docente", "administrativo"], 6, 3),
    (584780235, "bloque9", "Parqueadero Central Bloque 9", 40, ["docente", "administrativo"], 3, 2),
    (586409364, "fcsh", "Parqueadero FCSH", 75, ["estudiante"], 4, 2),
    (46485319, "celex", "Parqueadero CELEX", 90, ["estudiante", "docente"], 4, 3),
    (126170294, "fcnm", "Parqueadero FCNM", 100, ["docente", "administrativo"], 5, 3),
    (46485329, "fict", "Parqueadero FICT – Coliseo Viejo", 85, ["estudiante"], 4, 2),
    (46485324, "fimcm", "Parqueadero FIMCM", 110, ["estudiante", "docente"], 5, 3),
    (1396290770, "coliseo", "Parqueadero Coliseo Nuevo", 85, ["estudiante", "docente", "administrativo"], 4, 2),
    (586372937, "fadcom", "Parqueadero FADCOM", 65, ["estudiante", "docente"], 3, 2),
    (330300954, "tesoreria", "Parqueo Tesorería", 27, ["administrativo"], 2, 1),
]
DESTINOS = [
    ("fiec", "FIEC – Bloque 11A", -2.14463, -79.96772),
    ("fimcp", "FIMCP – Bloque 12C", -2.14499, -79.96581),
    ("fcnm", "FCNM – Decanato 9A", -2.14691, -79.96713),
    ("fcsh", "FCSH – Decanato 8A", -2.14777, -79.96880),
    ("biblioteca", "Biblioteca Central", -2.14727, -79.96611),
    ("rectorado", "Rectorado", -2.14765, -79.96446),
    ("fict", "FICT – Edificio Administrativo", -2.14551, -79.96536),
    ("fimcm", "FIMCM – Decanato", -2.14691, -79.96284),
    ("fadcom", "FADCOM", -2.14358, -79.96210),
    ("coliseo", "Coliseo Nuevo", -2.14206, -79.96717),
]
out = []
for oid, pid, nombre, cap, cats, pref, cams in LOTES:
    g = osm[oid]["geometry"]
    lat = sum(p["lat"] for p in g) / len(g); lon = sum(p["lon"] for p in g) / len(g)
    poly = [[round(p["lat"], 6), round(p["lon"], 6)] for p in g]
    out.append(dict(id=pid, osmId=oid, nombre=nombre, capacidad=cap, categorias=cats,
                    preferenciales=pref, camaras=cams, centro=[round(lat, 6), round(lon, 6)], poligono=poly))
ts = ["// Generado por scripts/generar_parqueaderos.py — contornos reales de OpenStreetMap (© OSM contributors).",
      "// Capacidades, categorías y cámaras son datos supuestos para el prototipo.",
      "import type { Destino, Parqueadero } from '../types';", "",
      f"export const PARQUEADEROS: Parqueadero[] = {json.dumps(out, ensure_ascii=False, indent=1)};", "",
      "export const DESTINOS: Destino[] = " + json.dumps([dict(id=a, nombre=b, pos=[c, d]) for a, b, c, d in DESTINOS], ensure_ascii=False, indent=1) + ";", "",
      "export const CAMPUS_CENTRO: [number, number] = [-2.1462, -79.9655];", ""]
(R / "src/data/parqueaderos.ts").write_text("\n".join(ts))
print(len(out), "parqueaderos ·", sum(x["capacidad"] for x in out), "plazas")
