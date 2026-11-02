# Flujos y actividades del prototipo

Recorridos que se pueden hacer en ParkiPol, en el orden sugerido para la demo o el video.
Entre corchetes, la funcionalidad del Avance 2 que cubre cada paso.

**Preparación:** `npm run dev`, abrir `/app` en modo móvil (iPhone 14) y `/admin` en otra
pestaña del mismo navegador. Si se quiere empezar de cero: Demo → *Reiniciar datos*.

---

## App móvil — conductor (Mateo, estudiante · Andrea, docente)

### 1. Ingresar con su perfil [7]
1. En `/app/login` elegir **Estudiante**, **Docente** o **Administrativo**.
2. *Ingresar* (o *Crear cuenta* para escribir el nombre). Se exige correo `@espol.edu.ec`.
3. El perfil define qué parqueaderos puede usar.

### 2. Ver la disponibilidad en tiempo real [1][6][9][11]
1. El **mapa del campus** muestra cada parqueadero con sus espacios libres y su color:
   verde disponible, ámbar llenándose, rojo casi lleno, gris cerrado.
2. *Autorizados para mí* / *Todos* filtra por perfil; los no autorizados aparecen atenuados.
3. La lista de abajo ordena por espacios libres y avisa “se llena en ~X min”.
4. Arriba a la derecha: plan actual y **consultas usadas hoy**.
5. Con plan Gratis aparece el **carrusel de anuncios** (rota solo, flechas para navegar).

### 3. Pedir una recomendación [2]
1. Pestaña **Buscar** → elegir destino (p. ej. *FIEC – Bloque 11A*). Gasta una consulta.
2. *Mejor opción para ti*: parqueadero autorizado más conveniente, con libres ahora,
   **espacios previstos al llegar** y minutos a pie hasta el destino.
3. Debajo, alternativas con su distancia y aviso si se están llenando.

### 4. Ver el detalle de un parqueadero [1][4][6]
1. Tocar un parqueadero en el mapa o la lista.
2. Espacios libres, % de ocupación, preferenciales, cámaras IA en línea y calificación.
3. Categorías autorizadas (la del usuario marcada).
4. Gráfico de **probabilidad de encontrarlo lleno** por hora (la hora actual en azul).
5. ♥ lo marca como **favorito**: llega un aviso cuando se llena o se liberan espacios.

### 5. Navegar hasta el parqueadero y calificar [5][8]
1. *Llévame ahí* / *Ir a este parqueadero*.
2. La ruta azul va desde la garita principal por las vías internas; el punto avanza,
   con tiempo, distancia y espacios en destino actualizados en vivo.
3. *Simular llegada* (o esperar ~24 s) → **calificar con estrellas** la experiencia.

### 6. Reportar una incidencia [8]
1. Pestaña **Reportar** (o *Reportar problema* desde el detalle).
2. Parqueadero, tipo (mal estacionado, daño, obstrucción, seguridad, otro) y descripción.
3. *Tomar / subir foto* o *Foto de ejemplo*.
4. *Enviar reporte* → aparece **al instante** en el panel, en Incidencias y en la actividad.

### 7. Mejorar el plan y pagar [10][11]
1. Al agotar las 10 consultas del plan Gratis, la app lleva a **Planes** (o desde el contador / Perfil).
2. Elegir **Plus** ($1.99) o **Premium** ($3.99).
3. Resumen con **IVA 15 %**, tarjeta de prueba ya llena → *Pagar* → comprobante.
4. El plan cambia, desaparecen los anuncios y el pago aparece en el panel (Gestión → ingresos).

### 8. Perfil
Datos, plan y consultas del día, parqueadero favorito, pagos realizados y cerrar sesión.

---

## Panel web — administración (Ing. Carlos Hidalgo, Planta Física)

### 9. Monitoreo en tiempo real [1][3]
0. `/admin` → **Iniciar sesión** (datos ya llenos) → *Ingresar al panel*.
1. Monitoreo: KPIs (ocupación del campus, espacios libres, flujo de autos/min,
   parqueaderos saturados, cámaras en línea e incidencias abiertas).
2. Mapa del campus con el estado de cada parqueadero.
3. **Actividad en vivo**: entradas y salidas detectadas por cámara, alertas, reportes y pagos.
4. Tabla por parqueadero (ocupación, libres, tendencia, “lleno en ~X min”) y gráfico de
   la ocupación del día.

### 10. Cámaras con visión por computadora [3]
1. **Cámaras IA**: una cámara por parqueadero, o todas las de uno con el selector.
2. Plazas ocupadas (caja roja + confianza) y libres (verde punteado), plazas preferenciales.
3. Clic para ampliar. Se ven las fallas (*SIN SEÑAL*) y los autos mal estacionados.

### 11. Analítica y reportes [3][4]
1. **Mapa de calor** de ocupación por día y franja horaria (todo el campus o un parqueadero).
2. **Rotación y permanencia** media por parqueadero.
3. **Proyección de demanda del semestre** con rango estimado (picos en evaluaciones).
4. Satisfacción de los usuarios por parqueadero.
5. **Exportar reporte** descarga un CSV con el mapa de calor y la rotación.

### 12. Atender incidencias con el equipo de seguridad [8]
1. **Incidencias**: reportes de usuarios (con foto) y detecciones automáticas de la IA.
2. Abrir una incidencia → panel lateral con la descripción, la foto y el **canal del grupo de seguridad**.
3. *Notificar al grupo de guardias*: el centro de control pide que el guardia más cercano se acerque.
4. A los ~4 s un guardia confirma que va en camino; a los ~13 s reporta la resolución
   y la incidencia pasa sola a **Resuelta**.
5. Si el reporte vino de un usuario, le llega el aviso “Incidencia resuelta” en la app.

### 13. Gestión [6][9][10][11]
- **Parqueaderos:** capacidad, preferenciales, categorías autorizadas, cámaras;
  *Cerrar por evento* / *Habilitar* (los usuarios reciben el aviso).
- **Anuncios:** activar o pausar, impresiones, clics y CTR.
- **Planes e ingresos:** ingresos por suscripciones, publicidad y licencia institucional; pagos con comprobante.

---

## Guion sugerido para el video (~2–3 min)

1. **Problema** (Mateo da vueltas buscando parqueo) → Demo: *Hora pico*.
2. App: ingresar como estudiante → mapa en vivo → *Buscar* → FIEC → *Llévame ahí* → llegar y calificar.
3. App: *Reportar* auto mal estacionado con foto.
4. Panel: Monitoreo (el reporte aparece en la actividad) → Cámaras IA (Demo: *IA: auto mal estacionado*).
5. Panel: Incidencias → abrir el reporte → *Notificar al grupo de guardias* → el guardia confirma y lo resuelve → en la app llega el aviso.
6. Demo: *Cerrar por evento* un parqueadero → aviso al usuario y la recomendación cambia.
7. Panel: Analítica (mapa de calor, proyección, exportar).
8. App: agotar consultas → Planes → pago Premium → comprobante; Panel: el ingreso aparece.

Antes de grabar: **Shift + D** oculta el botón de demo.
