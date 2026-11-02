# ParkiPol — prototipo

Sistema que, mediante cámaras con reconocimiento por IA, informa qué espacios de parqueo
están libres u ocupados en instituciones educativas (caso: campus Gustavo Galindo, ESPOL).
Proyecto de **CCPG1054 – Sistemas de Información**.

Es un **MVP con datos y eventos simulados**: no hay backend ni cámaras reales, pero todo
funciona de punta a punta para demostrar las funcionalidades.

## Correrlo

```bash
npm install
npm run dev        # http://localhost:5173
```

- `/app` — **app móvil** del conductor (abrir en modo móvil de DevTools, p. ej. iPhone 14).
  Usuarios de demo: estudiante, docente o administrativo (se elige al ingresar; correo `@espol.edu.ec`).
- `/admin` — **panel web** de Planta Física.

Abre ambas en pestañas del mismo navegador: comparten el estado, así que un reporte enviado
desde el celular aparece al instante en el panel, y lo que haga el admin (cerrar un
parqueadero, resolver una incidencia) le llega al usuario como notificación.

## Panel de demo

Botón morado **Demo** (Shift+D lo oculta para grabar):

- reloj del campus (07:00, hora pico, ×1/×3/×10) — la ocupación sigue la curva típica del día;
- llenar / liberar / cerrar por evento un parqueadero;
- simular que la IA detecta un auto mal estacionado o que una cámara pierde señal;
- reiniciar los datos.

## Funcionalidades (Avance 2)

| # | Funcionalidad | Dónde |
|---|---|---|
| 1 | Disponibilidad en tiempo real en mapa | App: Mapa · Admin: Monitoreo |
| 2 | Recomendación de parqueo óptimo (perfil, cercanía, espacio previsto al llegar) | App: Buscar |
| 3 | Cámaras con visión por computadora, permanencia y rotación | Admin: Cámaras IA, Analítica |
| 4 | Estimación de afluencia y proyección de demanda | Admin: Analítica · App: detalle |
| 5 | Navegación guiada al parqueadero | App: “Llévame ahí” |
| 6 | Filtro por categoría de usuario | App: Mapa |
| 7 | Registro e inicio de sesión con perfil | App: Ingresar / Crear cuenta |
| 8 | Reporte de incidencias con foto y calificación | App: Reportar, al llegar · Admin: Incidencias |
| 9 | Carrusel de anuncios | App: Mapa (plan Gratis) · Admin: Gestión → Anuncios |
| 10 | Pasarela de pago (modo prueba) | App: Planes → Pago |
| 11 | Planes y cuotas de consultas | App: contador de consultas, Planes · Admin: ingresos |

## Datos

- Contornos y ubicación de los parqueaderos y rutas: **OpenStreetMap** (© OSM contributors),
  rutas calculadas con OSRM (`scripts/`). Capacidades, categorías, cámaras, histórico y
  usuarios son **supuestos para el prototipo**.
- Stack: React + TypeScript + Vite, Leaflet, Recharts, Zustand.
