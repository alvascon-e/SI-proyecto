# ParkiPol — prototipo

**ParkiPol** informa, mediante cámaras con reconocimiento por IA, qué espacios de parqueo
están libres u ocupados en instituciones educativas, y le da a la administración reportes
de ocupación, rotación y demanda. Caso de estudio: **campus Gustavo Galindo, ESPOL**.

Proyecto de **CCPG1054 – Sistemas de Información**.

> **Es un MVP con datos y eventos simulados.** No hay backend, base de datos ni cámaras
> reales: todo corre en el navegador, pero cada funcionalidad funciona de punta a punta
> para poder demostrarla y grabar el video.

Tiene dos vistas de usuario:

| Vista | Ruta | Para quién | Cómo verla |
|---|---|---|---|
| **App móvil** | `/app` | Conductores: estudiantes, docentes y administrativos | Modo móvil de DevTools (p. ej. iPhone 14) |
| **Panel web** | `/admin` | Administración de Planta Física | Navegador de escritorio |

---

## Levantarlo en local

### Requisitos

- **Node.js 20.19+ o 22.12+** (incluye `npm`). Comprobar con `node -v`.
- Un navegador moderno (Chrome, Edge o Firefox).
- **Conexión a internet** para el fondo del mapa (teselas de OpenStreetMap) y la fuente
  Inter. Los datos del prototipo (parqueaderos, rutas, histórico) vienen incluidos.

### Pasos

```bash
git clone https://github.com/alvascon-e/SI-proyecto.git
cd SI-proyecto
npm install
npm run dev
```

Abrir **http://localhost:5173**. La portada deja elegir la app móvil o el panel.

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga automática |
| `npm run build` | Compila (verifica tipos de TypeScript) en `dist/` |
| `npm run preview` | Sirve la versión compilada |
| `npm run lint` | Revisión de estilo con oxlint |

### Ver la app móvil

1. Abrir `http://localhost:5173/app`.
2. DevTools (F12 / Cmd+Opt+I) → botón de dispositivos (Ctrl+Shift+M / Cmd+Shift+M) → **iPhone 14**.
3. Ingresar: elegir el perfil (estudiante, docente o administrativo). Los datos de demo
   ya vienen llenos; cualquier correo `@espol.edu.ec` sirve.

### Entrar al panel

`/admin` pide iniciar sesión (rol: Coordinador de espacios). Los datos del Ing. Carlos
Hidalgo ya vienen llenos: solo pulsar **Ingresar al panel**.

### Ver las dos vistas conectadas

Abrir `/app` y `/admin` en **pestañas del mismo navegador**. Comparten el estado, así que
un reporte enviado desde el celular aparece al instante en el panel, y lo que haga el
administrador (cerrar un parqueadero, resolver una incidencia) le llega al usuario como
notificación.

---

## Panel de demo

Botón morado **Demo** (abajo a la derecha). **Shift + D** lo oculta, para grabar sin él.

| Control | Efecto |
|---|---|
| Reloj del campus, 07:00, Hora pico, ×1 / ×3 / ×10 | Mueve o acelera la hora simulada; la ocupación sigue la curva típica del día |
| Pausar / Reanudar | Congela la simulación |
| Llenar / Liberar 15 | Satura o vacía el parqueadero elegido (dispara alertas y avisos) |
| Cerrar por evento / Reabrir | Cierra un parqueadero (p. ej. graduación) y avisa a los usuarios |
| IA: auto mal estacionado | La cámara detecta un vehículo ocupando dos plazas → incidencia automática |
| Cámara sin señal / Restablecer | Simula una falla de cámara |
| Reiniciar datos | Vuelve al estado inicial de la demo |

---

## Funcionalidades cubiertas (Avance 2)

| # | Funcionalidad | Cómo se ve en el prototipo |
|---|---|---|
| 1 | Visualización de disponibilidad en tiempo real | App: mapa con espacios libres por parqueadero (verde/ámbar/rojo/cerrado). Panel: Monitoreo con KPIs, mapa, tabla y actividad en vivo |
| 2 | Recomendación de parqueo óptimo | App → Buscar: según destino, perfil y **espacio previsto al llegar**; avisa “se llena en ~X min” |
| 3 | Monitoreo con cámaras y visión por computadora | Panel → Cámaras IA: plazas libres/ocupadas detectadas, confianza, autos mal estacionados, cámaras sin señal. Permanencia y rotación en Analítica |
| 4 | Estimación y análisis de afluencia | Panel → Analítica: mapa de calor día × hora, proyección del semestre. App: probabilidad de encontrarlo lleno por hora |
| 5 | Navegación guiada al parqueadero | App → “Llévame ahí”: ruta por las vías internas del campus, tiempo y distancia, espacios en destino en vivo |
| 6 | Filtro por tipo de usuario y espacio | App: “Autorizados para mí” / “Todos”; detalle con categorías autorizadas y plazas preferenciales |
| 7 | Registro de usuarios | App: Ingresar / Crear cuenta con correo institucional y perfil |
| 8 | Reporte de incidencias | App → Reportar: tipo, descripción y foto; calificación al llegar. Panel → Incidencias: se notifica al grupo de guardias, el más cercano confirma y luego reporta la resolución; el usuario recibe el aviso |
| 9 | Carrusel de anuncios | App: carrusel discreto (rota cada 6 s, flechas, sin ventanas emergentes) en el plan Gratis. Panel → Gestión → Anuncios: activar, impresiones, clics y CTR |
| 10 | Pasarela de pago | App → Planes → Pago: resumen con IVA, tarjeta de prueba, comprobante. Panel → Gestión → Planes e ingresos |
| 11 | Planes y cuotas de consulta | App: contador de consultas (Gratis 10/día, Plus 40, Premium ilimitado); al agotarse lleva a Planes |

Detalle de los recorridos para la demo y el video: **[docs/FLUJOS.md](docs/FLUJOS.md)**.
Requerimientos funcionales y no funcionales: **[docs/REQUERIMIENTOS.md](docs/REQUERIMIENTOS.md)**.

---

## Estructura

```
src/
  movil/        pantallas de la app móvil
  admin/        pantallas del panel administrativo
  components/   mapa, cámara IA, carrusel, avisos, panel de demo, logo
  data/         parqueaderos y rutas (OSM), catálogos, histórico simulado
  store.ts      estado compartido, simulación y sincronización entre pestañas
scripts/        generan los datos del campus desde OpenStreetMap / OSRM
data-osm/       respuestas originales de OpenStreetMap
docs/           flujos de demo y requerimientos
```

## Datos y créditos

- Contornos y ubicación de los parqueaderos, edificios y rutas: **OpenStreetMap**
  (© OpenStreetMap contributors); rutas calculadas con OSRM (`scripts/`).
- **Supuestos para el prototipo:** capacidades, categorías, cámaras, histórico, usuarios,
  anuncios y pagos.
- Logo: `public/logo-original.jpg` (versiones recortadas en `public/logo-*.png`).
- Tipografía Montserrat (cuerpo 14 px, subtítulos 18 px, cabeceras 22 px).
- Stack: React 19 + TypeScript + Vite, Leaflet, Recharts, Zustand, lucide-react.
