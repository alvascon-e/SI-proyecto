# Guion y storyboard — Parte 2: presentación del sistema (≈ 5 min)

Solo el sistema. La portada, la presentación, los antecedentes, las historias de usuario y
el contexto van en la primera parte del video.

## Decisiones de producción

| Tema | Decisión |
|---|---|
| Estilo | Video de producto: los dispositivos son protagonistas; la cámara se mueve alrededor de ellos y los gráficos explican |
| Fondo | Casi blanco con tinte azul `#F7F9FC`, halo azul muy suave detrás de los dispositivos, sombras reales |
| Dispositivos | iPhone tipo 15 Pro (marco de titanio, isla dinámica, botones, brillo en el vidrio) · panel dentro de una ventana de navegador |
| Gráficos | Etiquetas con línea, cuadros de diálogo, popups, pasos numerados, ejemplos, íconos y diagramas animados; varios celulares cuando haga falta |
| Paleta | Navy `#0F2340`, azul `#0066DC`, y verde, ámbar y rojo de los estados; tipografía Montserrat |
| Voz | Grabada por los integrantes, mejorada después (limpieza, ecualización, volumen parejo) |
| Música | *Future Tech Trap* (1:46, ~115 BPM), armada por partes: intro suave → energía → tramo calmado → final |
| Montaje | HyperFrames; las tomas de la app y el panel se graban automatizadas, en alta resolución y sin azar |
| Ritmo | Como Census Alert / La Corte Dice: un cambio visual cada 3–6 s, ~150 palabras por minuto |

## Vocabulario de planos (se combinan a lo largo del video)

| Código | Plano |
|---|---|
| **CEN** | Celular centrado, completo, flotando levemente |
| **ZOOM** | La cámara se acerca a una zona de la pantalla |
| **LADO** | Celular a la izquierda (o derecha), inclinado en 3D; gráficos del otro lado |
| **ETQ** | Etiquetas con línea que salen de un elemento de la pantalla |
| **TOQUE** | Círculo que marca el toque y transición de página real |
| **SALE** | Un elemento se despega de la pantalla y crece como tarjeta flotante |
| **DUO** | Dos celulares (o celular + panel) lado a lado |
| **WEB** | Panel en ventana de navegador; zooms a KPIs, tablas y gráficos |
| **ANIM** | Animación explicativa dibujada (sin capturas) |

Cada bloque indica: **voz**, **plano y movimiento**, **gráficos en pantalla**.

---

## Capítulo 1 · Cómo funciona: cámaras con IA · 0:00–0:38

**Voz:** Integrante 1 · **Música:** intro suave

| Voz | Plano y movimiento | Gráficos en pantalla |
|---|---|---|
| ParkiPol empieza en el parqueadero. Instalamos cámaras sobre cada zona de estacionamiento. | ANIM: vista lateral de un parqueadero dibujado; sube un poste con una cámara | Título: **Cómo funciona** · ícono de cámara |
| Cada cámara vigila varias plazas a la vez, y un modelo de visión por computadora reconoce, plaza por plaza, si está libre u ocupada. | ANIM: se abre el cono de visión; la vista pasa a cenital y aparecen las plazas; entra un auto y se marca | Recuadros de detección: rojo “Ocupado · 0.97”, verde “Libre” |
| Registra la hora en que cada vehículo entra y sale. | ANIM: un auto sale; se dibuja una mini línea de tiempo | Popup: “Entrada 08:12 · Salida 10:47 · 2 h 35 min” |
| Esos datos viajan a la nube y, en segundos, se reflejan en la app de los conductores y en el panel de la institución. | ANIM: puntos de datos viajan de la cámara a una nube y se separan hacia un celular y una ventana de navegador | Rótulos: **App móvil** · **Panel institucional** · “Actualización cada pocos segundos” |

## Capítulo 2 · El campus y los tipos de parqueo · 0:38–1:02

**Voz:** Integrante 1 · **Música:** entra la energía

| Voz | Plano y movimiento | Gráficos en pantalla |
|---|---|---|
| Este es el mapa real del campus Gustavo Galindo, con trece parqueaderos monitoreados. | Mapa del campus a pantalla completa; los 13 parqueaderos se iluminan uno tras otro | Contador “13 parqueaderos · 1 087 plazas · 32 cámaras” |
| No todos son para todos. | El mapa se aleja y entra el celular por la derecha mostrando el mapa (CEN) | — |
| Cada perfil ve los parqueaderos que tiene autorizados: estudiantes, docentes y personal administrativo, además de las plazas preferenciales. | LADO: el celular gira a la izquierda inclinado; a la derecha tres tarjetas; al nombrar cada una, se resaltan sus parqueaderos en el celular | Tarjetas con ícono: **Estudiantes** · **Docentes** · **Administrativos** · **♿ Preferenciales** |

## Capítulo 3 · La app del conductor · 1:02–2:52

### 3a. Mateo entra y ve el campus en vivo · 1:02–1:28

**Voz:** Integrante 2

| Voz | Plano y movimiento | Gráficos en pantalla |
|---|---|---|
| Mateo es estudiante. Ingresa con su correo institucional y elige su perfil. | CEN · TOQUE en “Estudiante” y “Ingresar” | Ficha de personaje: “Mateo · Estudiante · clase en la FIEC a las 9:00” |
| Al instante ve cuántos espacios libres tiene cada parqueadero. | ZOOM al mapa; los pines suben | ETQ en un pin: “Espacios libres ahora” |
| Verde, disponible. Naranja, se está llenando. Rojo, casi lleno. | ZOOM se mantiene; los pines laten por color | Leyenda animada con los tres colores |
| Y si un parqueadero se va a llenar pronto, la app se lo advierte. | Se desplaza a la lista; SALE la fila con el aviso | Popup ámbar: “Se llena en ~12 min” |

### 3b. Recomendación y ruta · 1:28–2:05

| Voz | Plano y movimiento | Gráficos en pantalla |
|---|---|---|
| Mateo no quiere dar vueltas. Le dice a ParkiPol a dónde va. | CEN · TOQUE en Buscar → “FIEC – Bloque 11A” | Pasos: **1 · Elige tu destino** |
| La app le recomienda el mejor parqueadero para su perfil. | SALE la tarjeta “Mejor opción para ti” y queda flotando al lado del celular | Pasos: **2 · Mira la mejor opción** |
| No solo cuenta los espacios de ahora: calcula cuántos quedarán cuando llegue, según el ritmo de entrada de autos, y cuánto tendrá que caminar. | LADO: celular a la izquierda; a la derecha un mini gráfico | Diagrama: “34 libres ahora” → flecha “−6 en 4 min” → “~28 al llegar” · “2 min a pie” |
| Con un toque, lo guía desde la garita por las vías internas del campus. | CEN · TOQUE “Llévame ahí” → la ruta se dibuja | Pasos: **3 · Llévame ahí** · ETQ: “Ruta interna · 2.9 km · 6 min” |
| Al llegar, califica su experiencia. | ZOOM a las estrellas; se llenan | Popup: “⭐⭐⭐⭐⭐ ¡Gracias!” |

### 3c. ¿Y si dos personas buscan el mismo parqueadero? · 2:05–2:25

| Voz | Plano y movimiento | Gráficos en pantalla |
|---|---|---|
| ¿Qué pasa si dos personas buscan el mismo parqueadero, y casi no quedan espacios? | DUO: dos celulares lado a lado, Mateo y Valeria, ambos buscando la FIEC; un contador “3 libres” que baja | Rótulos: “Mateo · 8:52” · “Valeria · 8:53” |
| ParkiPol ve que el parqueadero se está llenando y prevé que, al llegar, ya no habrá lugar. Así que a quien llega después le sugiere una alternativa cercana, antes de que pierda tiempo. | El celular de Valeria cambia a la alternativa; flechas separan las dos rutas en un mini mapa al centro | Popup en el celular de Valeria: “Alternativa: Docentes… → FCNM · 4 min a pie” · ETQ: “Predicción al llegar: 0 libres” |

> Escena ilustrativa: se arma con dos tomas de la app y gráficos encima. La lógica es la de la
> app (espacios previstos al llegar según el ritmo de entrada); no hay reservas.

### 3d. Andrea: favoritos, avisos y reportes · 2:25–2:52

**Voz:** Integrante 3

| Voz | Plano y movimiento | Gráficos en pantalla |
|---|---|---|
| Andrea es docente. Marca su parqueadero habitual como favorito. | CEN · TOQUE en el corazón | Ficha: “Andrea · Docente” · ETQ: “Favorito” |
| ParkiPol le avisa cuando se llena, cuando se liberan espacios o si se cierra por un evento. | La notificación cae desde arriba en el celular; luego otra | Notificaciones: “Se está llenando” · “¡Hay espacio!” · “Cerrado por evento de graduación” |
| Y si ve un auto ocupando dos plazas, lo reporta en segundos, con foto. | CEN · TOQUE Reportar → tipo → foto → Enviar | Pasos: **1 Tipo · 2 Foto · 3 Enviar** |

## Capítulo 4 · El panel institucional · 2:52–3:52

**Voz:** Integrante 4 · **Música:** energía

### 4a. Monitoreo en vivo · 2:52–3:15

| Voz | Plano y movimiento | Gráficos en pantalla |
|---|---|---|
| Del otro lado, el ingeniero Carlos Hidalgo, de Planta Física, ingresa al panel institucional. | WEB: la ventana entra con perspectiva; login → panel | Ficha: “Ing. Carlos Hidalgo · Coordinador de espacios” |
| Ve todo el campus en tiempo real: ocupación, espacios libres, flujo de autos y parqueaderos saturados. | ZOOM recorre los KPIs uno por uno | ETQ en cada KPI |
| En la actividad en vivo aparece cada movimiento que detectan las cámaras… y el reporte que acaba de enviar Andrea. | DUO: el celular de Andrea a la izquierda y la ventana a la derecha; una línea viaja del celular al panel | Popup en el panel: “Nuevo reporte · Alumnos FIEC–FIMCP” |

### 4b. Cámaras IA · 3:15–3:28

| Voz | Plano y movimiento | Gráficos en pantalla |
|---|---|---|
| Desde aquí puede ver cada cámara, con las plazas detectadas, y la IA marca sola los autos mal estacionados o las cámaras sin señal. | WEB · ZOOM a una cámara; aparece el recuadro naranja | ETQ: “Detección automática · 0.91” |

### 4c. De la incidencia a la solución · 3:28–3:52

| Voz | Plano y movimiento | Gráficos en pantalla |
|---|---|---|
| Abre el reporte de Andrea y, con un clic, avisa al grupo de guardias para que el más cercano se acerque. | WEB · ZOOM al panel lateral; TOQUE “Notificar al grupo de guardias” | ETQ: “Grupo de seguridad · 14 guardias” |
| El guardia confirma que va en camino y, minutos después, reporta la solución. | Las burbujas del chat aparecen; ANIM: mini mapa con un punto (guardia) que llega al parqueadero | Reloj animado “+2 min” |
| La incidencia se cierra, y Andrea recibe el aviso en su celular. | DUO: el estado cambia a “Resuelta” y la notificación cae en el celular de Andrea | Check verde animado |

## Capítulo 5 · La historia de la reportería · 3:52–4:37

**Voz:** Integrante 4 · **Música:** tramo calmado

| Voz | Plano y movimiento | Gráficos en pantalla |
|---|---|---|
| Cada detección se guarda. Día tras día, semana tras semana, las cámaras construyen la historia de cada parqueadero. | ANIM: puntos de datos caen en columnas que forman semanas | Contador “Semana 1 … Semana 9” |
| Con esa historia, el panel muestra cuándo se satura el campus: los martes a las diez es el pico. | WEB · el mapa de calor se pinta celda por celda; ZOOM a “Mar 10:00” | ETQ: “Pico semanal · 80 %” |
| También ve cuánto rota cada plaza y cuánto tiempo se queda cada vehículo. | WEB · las barras crecen | ETQ: “Rotación media 3,3 autos por plaza al día” |
| Y proyecta la demanda del semestre: en semanas de evaluaciones, la ocupación sube. | WEB · la línea real se dibuja y la proyección sigue punteada | ETQ en S16–S17: “Evaluaciones” |
| Con eso, el ingeniero puede decidir con datos: por ejemplo, habilitar el Coliseo Nuevo como apoyo en esas semanas, y exportar el reporte para presentarlo a las autoridades. | ANIM: tarjeta de decisión con un check; el reporte sale de la ventana como un documento | Tarjeta: “Decisión: habilitar Coliseo Nuevo · S16–S17” · ícono de documento “Reporte.csv” |

## Capítulo 6 · Un modelo sostenible · 4:37–5:00

**Voz:** Integrante 4 · **Música:** final

| Voz | Plano y movimiento | Gráficos en pantalla |
|---|---|---|
| ParkiPol se sostiene de tres formas. Planes para los conductores: gratis con diez consultas al día, o Plus y Premium, con pago seguro desde la app. | CEN · Planes → TOQUE Premium → pago → comprobante | Tres tarjetas: **Gratis · Plus $1.99 · Premium $3.99** |
| Anuncios discretos de negocios cercanos. Y la licencia institucional del panel. | DUO: carrusel del celular + panel de Gestión e ingresos | Íconos: suscripciones · publicidad · licencia |
| ParkiPol: tu espacio, antes de llegar. | Los dispositivos se alejan; queda el logo al centro | Logo de ParkiPol |

---

## Duración y reparto

| Capítulo | Voz | Palabras | Voz | Con pausas visuales |
|---|---|---|---|---|
| 1 · Cómo funciona | Integrante 1 | 70 | 0:28 | 0:38 |
| 2 · Campus y tipos de parqueo | Integrante 1 | 36 | 0:14 | 0:24 |
| 3a–3c · Mateo (y Valeria) | Integrante 2 | ~145 | 0:58 | 1:23 |
| 3d · Andrea | Integrante 3 | ~50 | 0:20 | 0:27 |
| 4 · Panel institucional | Integrante 4 | 120 | 0:48 | 1:00 |
| 5 · Reportería | Integrante 4 | 91 | 0:36 | 0:45 |
| 6 · Modelo de negocio | Integrante 4 | 76 | 0:30 | 0:23–0:30 |
| **Total** | | **≈ 590** | **≈ 3:55** | **≈ 5:00** |

La voz ocupa ~3:55; el resto son **momentos visuales sin narración** (animación de la
cámara, toques y cambios de página, la escena de los dos celulares, las transiciones entre
capítulos con la música arriba). Es el respiro que necesita un video de producto. Si al
montar queda corto, se alarga una animación; si queda largo, se recortan pausas, no frases.

Los cambios de voz caen en los cambios de rol, con una transición visual en cada uno
(criterio V10). Si son menos integrantes, se juntan bloques vecinos.

## Cómo grabar la voz

- Cada integrante graba **solo sus bloques**, un archivo por capítulo, en un lugar silencioso
  y con el celular a un palmo de la boca. Las notas de voz de WhatsApp sirven.
- Leer con calma y naturalidad, dejando un respiro entre frases (la edición ajusta el ritmo).
- Si se equivoca, repetir la frase completa; se corta en la edición.
- Nombrar los archivos: `cap1-integrante1.m4a`, `cap3-integrante2.m4a`, etc.

## Cobertura de la rúbrica

| Criterio | Dónde |
|---|---|
| P1 Escenarios por rol | Mateo (3a–3c), Andrea (3d), Ing. Hidalgo (4–5), y la escena de dos usuarios (3c) |
| P3 Realista con la propuesta y el modelo de negocio | Cámaras IA (1, 4b), reportería para decidir (5), planes, anuncios y licencia (6) |
| P4 Navegación consistente, clara, organizada | Toques visibles y pasos numerados en cada flujo |
| P5 Tareas comunes | Login, filtros, formulario de reporte, pago, panel lateral de incidencias |
| P6 Presentación agradable | Diseño de la interfaz y del video |
| V8 Guion planificado | Este documento |
| V10 Transiciones entre intervenciones | Cambios de voz en 2→3a, 3c→3d, 3d→4 |
