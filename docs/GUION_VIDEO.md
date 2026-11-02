# Guion — Parte 2: presentación del prototipo (≈ 5 min)

Solo la demostración del sistema. La portada, la presentación, los antecedentes, las
historias de usuario y el contexto van en la primera parte del video.

- **Voz:** una persona narra (o se reparte por bloques entre integrantes; ver al final).
- **Ritmo:** como los videos de Census Alert y La Corte Dice: un cambio de pantalla cada
  5–8 s, frases cortas, sin silencios largos. ~150 palabras por minuto.
- **Recorrido por roles** (rúbrica P1): Mateo (estudiante) → Andrea (docente) → Ing. Carlos
  Hidalgo (administrador de Planta Física).
- **Columna "En pantalla":** lo que se graba mientras se dice el texto. `[Demo: …]` = acción
  del panel de demo, que se hace **antes** de la toma o fuera de cuadro (Shift+D lo oculta).

---

## 0. Enlace con la primera parte · 0:00–0:12

| Voz | En pantalla |
|---|---|
| Ya conocen el problema y a quiénes afecta. Ahora les mostramos ParkiPol funcionando: una app móvil para los conductores y un panel web para la institución, conectados en tiempo real. | Portada del prototipo (`/`) con el logo y las dos opciones: App móvil y Panel administrativo. |

## 1. Mateo · ingreso y mapa en tiempo real · 0:12–0:50

| Voz | En pantalla |
|---|---|
| Empecemos con Mateo, estudiante de quinto semestre. Ingresa con su correo institucional y elige su perfil. Ese perfil define qué parqueaderos puede usar. | `/app/login` · toca **Estudiante** → **Ingresar**. |
| Lo primero que ve es el mapa real del campus Gustavo Galindo. Cada parqueadero muestra cuántos espacios libres tiene en este momento, detectados por las cámaras con inteligencia artificial. | Mapa del inicio; acercar a los pines. `[Demo: Hora pico]` |
| Los colores le dicen todo de un vistazo: verde, disponible; naranja, se está llenando; rojo, casi lleno. Y con este filtro ve solo los parqueaderos autorizados para estudiantes. | Leyenda · alternar **Autorizados para mí / Todos**. |
| Abajo tiene la lista ordenada por espacios libres, con un aviso cuando alguno está por llenarse. | Desplazar la lista; señalar “Se llena en ~X min”. |

## 2. Mateo · recomendación y navegación · 0:50–1:40

| Voz | En pantalla |
|---|---|
| Mateo tiene clase en la FIEC a las nueve. En vez de dar vueltas, le pregunta a ParkiPol a dónde ir. | Pestaña **Buscar** → elegir **FIEC – Bloque 11A**. |
| La app le recomienda el mejor parqueadero para su perfil. No solo mira cuántos espacios hay ahora: calcula cuántos quedarán cuando llegue y cuánto tendrá que caminar hasta su aula. | Tarjeta **Mejor opción para ti**: libres ahora, al llegar, minutos a pie. |
| Si prefiere otra opción, aquí están las alternativas, con su distancia y si se están llenando. | Desplazar a **Alternativas**. |
| Toca “Llévame ahí” y ParkiPol lo guía desde la garita por las vías internas del campus, mientras actualiza en vivo los espacios que lo esperan. | **Llévame ahí** → ruta azul avanzando. |
| Al llegar, puede calificar su experiencia. Esa valoración también llega a la administración. | **Simular llegada** → 5 estrellas → **Enviar calificación**. |

## 3. Andrea · docente: detalle, favorito y avisos · 1:40–2:20

| Voz | En pantalla |
|---|---|
| Ahora Andrea, docente. Su perfil le muestra otros parqueaderos, como el de docentes de la FIEC. | Cerrar sesión → ingresar como **Docente** → mapa. |
| Al abrir uno, ve los espacios libres, las plazas preferenciales, las cámaras activas y para quién está autorizado. | Abrir **Parqueadero Docentes FIEC** → detalle. |
| Este gráfico le dice la probabilidad de encontrarlo lleno a cada hora, para planificar su llegada. | Señalar el gráfico de probabilidad. |
| Lo marca como favorito, y ParkiPol le avisa cuando se llena o cuando se liberan espacios. | Tocar ♥ · `[Demo: Llenar ese parqueadero]` → aparece la notificación. |
| Y si la institución cierra un parqueadero por un evento, también recibe el aviso al instante. | `[Demo: Cerrar por evento]` → notificación “Cambio en los parqueaderos”. |

## 4. Reporte de incidencias desde la app · 2:20–2:45

| Voz | En pantalla |
|---|---|
| Si algo anda mal, Andrea lo reporta desde la app: elige el parqueadero, el tipo de problema, lo describe y adjunta una foto. | **Reportar** → Vehículo mal estacionado → descripción → **Foto de ejemplo**. |
| Al enviarlo, el reporte llega directo al panel de Planta Física. | **Enviar reporte** → pantalla de confirmación. |

## 5. Ing. Hidalgo · acceso y monitoreo en tiempo real · 2:45–3:20

| Voz | En pantalla |
|---|---|
| Del otro lado está el ingeniero Carlos Hidalgo, coordinador de espacios. Ingresa al panel con su cuenta institucional. | `/admin/login` → **Ingresar al panel**. |
| En el monitoreo ve todo el campus en vivo: la ocupación total, los espacios libres, el flujo de autos por minuto y los parqueaderos saturados. | KPIs del monitoreo. |
| En el mapa y en esta tabla sigue cada parqueadero y su tendencia, y en la actividad en vivo aparece cada entrada y salida que detectan las cámaras. Ahí está también el reporte que acaba de enviar Andrea. | Tabla por parqueadero → **Actividad en vivo** (el reporte de Andrea arriba). |

## 6. Cámaras con visión por computadora · 3:20–3:40

| Voz | En pantalla |
|---|---|
| Esta es la base del sistema. Cada cámara reconoce, plaza por plaza, si está libre u ocupada, y registra la hora de entrada y salida de cada vehículo. | **Cámaras IA** → ampliar una cámara. |
| También detecta por sí sola autos mal estacionados o una cámara sin señal. | `[Demo: IA: auto mal estacionado]` → caja naranja · `[Demo: Cámara sin señal]`. |

## 7. Atención de incidencias con seguridad · 3:40–4:10

| Voz | En pantalla |
|---|---|
| Todas las incidencias, de usuarios y de las cámaras, se concentran aquí. El ingeniero abre el reporte de Andrea, con su foto. | **Incidencias** → abrir el reporte de Andrea. |
| Con un clic notifica al grupo de guardias, pidiendo que el más cercano se acerque. | **Notificar al grupo de guardias**. |
| El guardia confirma que va en camino y, minutos después, reporta la solución. La incidencia se cierra y Andrea recibe el aviso en su celular. | Esperar las dos respuestas → estado **Resuelta** · (corte a la app con la notificación). |

## 8. Analítica para decidir con datos · 4:10–4:35

| Voz | En pantalla |
|---|---|
| Con los datos de las cámaras, la institución puede planificar. Este mapa de calor muestra la ocupación por día y por hora: los martes a las diez son el pico. | **Analítica** → mapa de calor. |
| Aquí ve la rotación y el tiempo que permanece cada vehículo, y la proyección de demanda del semestre, con picos en semanas de evaluaciones. Todo se exporta como reporte. | Gráficos de rotación y proyección → **Exportar reporte**. |

## 9. Modelo de negocio dentro del sistema · 4:35–4:55

| Voz | En pantalla |
|---|---|
| ParkiPol se sostiene con tres fuentes. Primero, planes: el gratuito permite diez consultas al día; Plus y Premium amplían el servicio y quitan los anuncios. | App: contador de consultas → **Planes**. |
| El pago se hace en la misma app, con su comprobante. | **Pago** → **Pagar** → comprobante. |
| Segundo, anuncios discretos de negocios cercanos, con sus métricas. Y tercero, la licencia institucional del panel. Todo se refleja en los ingresos. | Panel → **Gestión → Anuncios** → **Planes e ingresos** (aparece el pago recién hecho). |

## 10. Cierre · 4:55–5:05

| Voz | En pantalla |
|---|---|
| Así, ParkiPol conecta a los conductores con espacios libres en tiempo real y le da a la institución los datos para mejorar sus parqueaderos. | Toma final: app y panel lado a lado. |

---

## Duración

| | |
|---|---|
| Narración | **≈ 670 palabras ≈ 4:30** a 150 palabras/min |
| Pausas con acción en pantalla (ruta avanzando, respuestas del guardia, pago procesando) | ≈ 0:30 |
| **Total** | **≈ 5:00** |

Si al grabar se pasa de 5:10, los primeros candidatos a recortar son la frase de
alternativas (bloque 2) y la del cierre por evento (bloque 3). Si queda corto, se alargan
las pausas con acción (dejar ver la ruta o el chat del guardia unos segundos más).

## Cobertura de la rúbrica

| Criterio | Dónde |
|---|---|
| P1 Escenarios por rol | Bloques 1–2 (estudiante), 3–4 (docente), 5–8 (administrador) |
| P3 Realista con la propuesta y el modelo de negocio | Cámaras IA (6), planes, pago, anuncios y licencia (9) |
| P4 Navegación consistente, clara, organizada | Recorrido en orden; misma barra de pestañas y menú lateral |
| P5 Tareas comunes (menús, formularios) | Login, filtro, formulario de reporte, pago, filtros del panel |
| P6 Presentación agradable | Toda la interfaz |
| V8 Guion planificado | Este documento |
| V10 Transiciones entre intervenciones | Cambios de rol en 1 → 3 → 5 (ver reparto) |

## Reparto sugerido si hablan varios integrantes

| Bloques | Voz |
|---|---|
| 0–2 · Mateo | Integrante 1 |
| 3–4 · Andrea | Integrante 2 |
| 5–7 · Ing. Hidalgo | Integrante 3 |
| 8–10 · Analítica y modelo de negocio | Integrante 4 |

## Antes de grabar

1. `npm run dev`, Chrome, y en el panel de demo **Reiniciar datos**.
2. Pestaña 1: `/app` en modo móvil (iPhone 14). Pestaña 2: `/admin`.
3. Para el bloque 1, **Hora pico** (más colores en el mapa). Pausar la simulación si hace falta
   que un número no cambie durante una toma.
4. **Shift + D** oculta el botón de demo durante las tomas.
5. Grabar cada bloque por separado; se montan después con transiciones.
