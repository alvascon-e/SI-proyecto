# Requerimientos — ParkiPol

Requerimientos derivados del Avance 2 (necesidades y funcionalidades) y del Avance 3a
(modelo Canvas). La columna **Prototipo** indica qué cubre este MVP y cómo.

Leyenda: ✅ implementado · 🟡 simulado (funciona con datos o servicios de prueba) · ⏳ fuera del alcance del prototipo.

## 1. Actores

| Actor | Descripción | Vista |
|---|---|---|
| Conductor estudiante | Busca espacio autorizado cerca de su clase | App móvil |
| Conductor docente / administrativo | Busca espacio autorizado para su categoría | App móvil |
| Administrador de espacios (Planta Física) | Monitorea, atiende incidencias, analiza y gestiona | Panel web |
| Personal de seguridad | Recibe y atiende incidencias | Panel web (asignación) |
| Cliente externo (anunciante) | Contrata espacios de publicidad | Gestión de anuncios |
| Sistema de cámaras IA | Detecta ocupación y anomalías por plaza | Simulado |

## 2. Requerimientos funcionales

| ID | Requerimiento | Func. | Prototipo |
|---|---|---|---|
| RF-01 | Mostrar en un mapa interactivo las plazas libres y ocupadas de cada parqueadero, actualizadas en tiempo real | 1 | ✅ datos 🟡 simulados |
| RF-02 | Indicar el estado de cada parqueadero (disponible, llenándose, casi lleno, cerrado) | 1 | ✅ |
| RF-03 | Recomendar el parqueadero más conveniente según destino, categoría del usuario y espacio previsto al llegar | 2 | ✅ |
| RF-04 | Avisar cuando un parqueadero está por llenarse o se liberan espacios (favorito) | 2 | ✅ notificaciones dentro de la app |
| RF-05 | Detectar con visión por computadora la ocupación de cada plaza y registrar hora de entrada y salida | 3 | 🟡 cámaras simuladas |
| RF-06 | Calcular el tiempo de permanencia y la rotación por parqueadero y franja horaria | 3 | 🟡 histórico simulado |
| RF-07 | Detectar automáticamente vehículos mal estacionados y generar una incidencia | 3, 8 | 🟡 |
| RF-08 | Mostrar la ocupación por día y franja horaria (mapa de calor) | 4 | ✅ histórico 🟡 |
| RF-09 | Proyectar la demanda del semestre y la probabilidad de ocupación por hora | 4 | ✅ modelo 🟡 simple |
| RF-10 | Exportar reportes de ocupación y rotación | 4 | ✅ CSV |
| RF-11 | Guiar al usuario por la ruta interna hasta el parqueadero elegido | 5 | ✅ rutas reales (OSM) |
| RF-12 | Filtrar la disponibilidad por categoría de usuario y tipo de espacio | 6 | ✅ |
| RF-13 | Registrar e iniciar sesión con correo institucional, asignando un perfil | 7 | ✅ 🟡 sin autenticación real |
| RF-14 | Permitir al usuario reportar incidencias con foto y descripción | 8 | ✅ |
| RF-15 | Notificar al personal en tiempo real y gestionar el estado de la incidencia (nueva, en atención, resuelta) | 8 | ✅ |
| RF-16 | Permitir calificar la experiencia en el parqueadero | 8 | ✅ |
| RF-17 | Mostrar anuncios en un carrusel fijo y discreto, con rotación automática y navegación manual, sin ventanas emergentes | 9 | ✅ |
| RF-18 | Administrar anuncios y medir impresiones, clics y CTR | 9 | ✅ |
| RF-19 | Procesar pagos de planes con resumen, confirmación y comprobante | 10 | 🟡 pasarela de prueba |
| RF-20 | Gestionar planes (Gratis, Plus, Premium) con límite diario de consultas y contador en tiempo real | 11 | ✅ |
| RF-21 | Cerrar o habilitar parqueaderos por eventos y notificar a los usuarios | Canvas | ✅ |
| RF-22 | Mostrar ingresos por suscripciones, publicidad y licencia institucional | Canvas | ✅ datos 🟡 |

## 3. Requerimientos no funcionales

| ID | Requerimiento | Prototipo |
|---|---|---|
| RNF-01 | **Tiempo real:** la disponibilidad se actualiza en pocos segundos | ✅ cada ~1,2 s (simulado) |
| RNF-02 | **Usabilidad móvil:** uso con una mano, diseño para pantallas de 360–430 px | ✅ |
| RNF-03 | **Bajo consumo de datos** en la app (objeción de los usuarios) | ⏳ por medir con backend real |
| RNF-04 | **Precisión** de la detección por cámara y de las estimaciones | ⏳ se muestra la confianza de cada detección (simulada) |
| RNF-05 | **Seguridad y privacidad:** correo institucional, datos personales protegidos, sin almacenar imágenes con rostros o placas más allá de lo necesario | ⏳ |
| RNF-06 | **Pagos seguros** (PCI-DSS vía pasarela certificada) | ⏳ modo prueba |
| RNF-07 | **Disponibilidad** del servicio en horario académico | ⏳ |
| RNF-08 | **Escalabilidad** a otras instituciones (multi-institución) | ⏳ |
| RNF-09 | **Mantenibilidad:** código tipado (TypeScript) y datos del campus regenerables por script | ✅ |

## 4. Fuera del alcance del prototipo

- Backend, base de datos y API reales; autenticación con la cuenta institucional (SSO).
- Integración con cámaras IP y un modelo de detección real.
- Pasarela de pago real y facturación electrónica.
- Notificaciones push del sistema operativo (aquí son avisos dentro de la app).
- App nativa (iOS/Android): la vista móvil es una web adaptada al celular.
