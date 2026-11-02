"""Rutas en auto (OSRM sobre OpenStreetMap) desde la garita principal hasta cada parqueadero.
Se calculan una vez y se guardan en src/data/rutas.ts para que la demo funcione sin internet."""
import json, pathlib, re, time, urllib.request
R = pathlib.Path(__file__).resolve().parents[1]
GARITA = (-2.15340, -79.95260)
src = (R / "src/data/parqueaderos.ts").read_text()
lotes = json.loads(re.search(r"PARQUEADEROS: Parqueadero\[\] = (\[.*?\]);\n", src, re.S).group(1))
rutas = {}
for p in lotes:
    lat, lon = p["centro"]
    url = f"https://router.project-osrm.org/route/v1/driving/{GARITA[1]},{GARITA[0]};{lon},{lat}?overview=full&geometries=geojson"
    for intento in range(4):
        try:
            d = json.load(urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "parkipol-prototipo"}), timeout=30))
            r = d["routes"][0]
            rutas[p["id"]] = dict(metros=round(r["distance"]), segundos=round(r["duration"]),
                                  puntos=[[round(c[1], 6), round(c[0], 6)] for c in r["geometry"]["coordinates"]])
            break
        except Exception as e:
            time.sleep(2 * (intento + 1))
    print(p["id"], rutas.get(p["id"], {}).get("metros"), "m")
    time.sleep(1.1)
(R / "src/data/rutas.ts").write_text(
    "// Generado por scripts/generar_rutas.py — rutas OSRM sobre OpenStreetMap desde la garita principal.\n"
    f"export const GARITA: [number, number] = [{GARITA[0]}, {GARITA[1]}];\n"
    f"export const RUTAS: Record<string, {{ metros: number; segundos: number; puntos: [number, number][] }}> = {json.dumps(rutas)};\n")
