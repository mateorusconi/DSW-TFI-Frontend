# Pruebas integrales — SCRUM-46

Prueba de punta a punta de todos los flujos del sistema contra la API real, más responsive y consola, antes de la entrega.

## Entorno

| Dato | Valor |
| --- | --- |
| Fecha | 19/11/2026 |
| Frontend | `DSW-TFI-Frontend`, rama `Development`, commit `13ddec8` |
| Backend | `dsw2026-tpi`, rama `development`, commit `0a48e20` |
| Base de datos | Base nueva y vacía (`Dsw2026Tpi_Pruebas` en LocalDB), creada con las migraciones del README |
| Administrador | `admin@system.com`, creado por el backend al arrancar |
| Navegador | Chromium, con tamaños de pantalla de 360, 768, 1280 y 1366 px |

Las pruebas se hicieron en tres partes:

1. **API:** cada endpoint con datos válidos e inválidos, y con cada rol, revisando el código HTTP y el `errorCode`.
2. **Flujos en la interfaz:** recorriendo las pantallas como lo haría cada usuario.
3. **Responsive y consola:** cada pantalla en tres anchos, buscando desbordes horizontales y errores o warnings en la consola.

## Resumen

| Parte | Casos | OK | Falla |
| --- | --- | --- | --- |
| API | 49 | 49 | 0 |
| Flujos en la interfaz | 35 | 35 | 0 |
| Responsive (12 pantallas × 3 anchos) | 36 | 36 | 0 |
| Consola | 1 | 1 | 0 |

No se encontraron fallas, así que no hizo falta crear Bugs en Jira. Al final hay observaciones menores que no impiden la entrega.

## 1. API

#### Auth

| Caso | Prueba | Esperado | Real | Resultado |
| --- | --- | --- | --- | --- |
| A1 | Login admin con datos correctos | 200 + role ADMINISTRADOR | 200 ADMINISTRADOR | OK |
| A2 | Login admin con contraseña incorrecta | 401 AUTHENTICATION_FAILED | 401 AUTHENTICATION_FAILED | OK |
| A3 | Login admin con email inválido y contraseña corta | 400 VALIDATION_ERROR | 400 VALIDATION_ERROR | OK |
| A4 | Login de paciente nuevo (se registra solo) | 200 + role PACIENTE | 200 PACIENTE | OK |
| A5 | Login del mismo paciente otra vez | 200 (mismo paciente) | 200 | OK |
| A6 | Login de paciente con DNI inválido | 400 VALIDATION_ERROR | 400 VALIDATION_ERROR | OK |
| A7 | Login de un segundo paciente | 200 | 200 | OK |

#### Seguridad

| Caso | Prueba | Esperado | Real | Resultado |
| --- | --- | --- | --- | --- |
| S1 | Listar especialidades sin token | 401 | 401 | OK |
| S2 | Crear especialidad con token de paciente | 403 | 403 AUTHORIZATION_FAILED | OK |
| S3 | Cargar disponibilidad con token de paciente | 403 | 403 AUTHORIZATION_FAILED | OK |
| S4 | Turnos del día (solo admin) con token de paciente | 403 | 403 AUTHORIZATION_FAILED | OK |
| S5 | Paciente pide los turnos de otro DNI | 403 o 400 (no debe devolver datos ajenos) | 403 AUTHORIZATION_FAILED | OK |
| S6 | Token inventado | 401 | 401 | OK |

#### Especialidades

| Caso | Prueba | Esperado | Real | Resultado |
| --- | --- | --- | --- | --- |
| E1 | Crear especialidad | 201 | 201 | OK |
| E2 | Crear especialidad con nombre repetido | 409 SPECIALITY_NAME_CONFLICT | 409 SPECIALITY_NAME_CONFLICT | OK |
| E3 | Crear especialidad con nombre de 2 letras | 400 VALIDATION_ERROR | 400 VALIDATION_ERROR | OK |
| E4 | Crear segunda especialidad | 201 | 201 | OK |
| E5 | Listar con filtro por nombre ("card") | 200 con 1 resultado paginado | 200 total=1 | OK |
| E6 | Editar especialidad | 200 | 200 | OK |
| E7 | Paciente puede listar especialidades (para reservar) | 200 | 200 | OK |

#### Médicos

| Caso | Prueba | Esperado | Real | Resultado |
| --- | --- | --- | --- | --- |
| D1 | Crear médico | 201 | 201 | OK |
| D2 | Crear médico con matrícula repetida | 409 DOCTOR_LICENSE_CONFLICT | 409 DOCTOR_LICENSE_CONFLICT | OK |
| D3 | Crear médico sin nombre | 400 VALIDATION_ERROR | 400 VALIDATION_ERROR | OK |
| D4 | Crear segundo médico (para baja) | 201 | 201 | OK |
| D5 | Filtrar médicos por especialidad | 200 solo médicos de esa especialidad | 200 1 resultado(s) | OK |
| D6 | Editar médico | 200 | 200 | OK |
| D7 | Baja lógica de médico | 200 y deja de listarse | 200, sigue listado=false | OK |

#### Especialidades

| Caso | Prueba | Esperado | Real | Resultado |
| --- | --- | --- | --- | --- |
| E8 | Baja lógica de especialidad | 200 y deja de listarse | 200, sigue listada=false | OK |

#### Disponibilidad

| Caso | Prueba | Esperado | Real | Resultado |
| --- | --- | --- | --- | --- |
| V1 | Rango con salida antes de la entrada | 400 VALIDATION_ERROR | 400 VALIDATION_ERROR | OK |
| V2 | Rango no divisible en 30 minutos (09:00 a 09:45) | 400 VALIDATION_ERROR | 400 VALIDATION_ERROR | OK |
| V3 | Cargar lunes, miércoles y viernes de 09 a 12 | 201 con turnos de 30 min generados | 201, 24 turnos generados | OK |
| V4 | Volver a cargar con POST el mismo mes | 409 AVAILABILITY_CONFLICT | 409 AVAILABILITY_CONFLICT | OK |
| V5 | Consultar el horario cargado | 200 con LUNES, MIÉRCOLES y VIERNES | 200 LUNES,MIÉRCOLES,VIERNES | OK |
| V6 | No genera turnos el feriado del 23/11 | 0 turnos el 23/11 | 200, 0 turno(s) | OK |

#### Turnos

| Caso | Prueba | Esperado | Real | Resultado |
| --- | --- | --- | --- | --- |
| T0 | Paciente ve los horarios libres del médico | 200 con horarios | 200, 18 horarios | OK |
| T1 | Reservar con motivo de 3 caracteres | 400 VALIDATION_ERROR | 400 VALIDATION_ERROR | OK |
| T2 | Reservar un turno | 201 BOOKED | 201 BOOKED | OK |
| T3 | Otro paciente reserva el mismo horario | 409 APPOINTMENT_CONFLICT | 409 APPOINTMENT_CONFLICT | OK |
| T4 | El horario reservado deja de ofrecerse | no aparece en los horarios libres | sigue libre=false | OK |
| T5 | Mis turnos del paciente | 200 con el turno, médico y especialidad | 200, 1 turno(s), médico=Dra. Laura Gómez | OK |
| T6 | Búsqueda avanzada por DNI | 200 con el turno | 200 total=1 | OK |
| T7 | Búsqueda avanzada por médico y especialidad | 200 con el turno | 200 total=1 | OK |
| T8 | Búsqueda avanzada por fecha del turno | 200 con el turno | 200 total=1 | OK |
| T9 | Turnos del día (panel admin) | 200 paginado | 200 total=0 | OK |
| T10 | Otro paciente intenta cancelar un turno ajeno | 403 o 404 | 403 AUTHORIZATION_FAILED | OK |
| T11 | Cancelar el turno propio | 200 y desaparece de Mis turnos | 200, sigue en la lista=false | OK |
| T12 | El horario cancelado vuelve a estar libre | aparece otra vez en los horarios libres | vuelve a estar libre=true | OK |
| T13 | Cancelar dos veces el mismo turno | 409 APPOINTMENT_INVALID_STATE | 409 APPOINTMENT_INVALID_STATE | OK |

#### Rate limit

| Caso | Prueba | Esperado | Real | Resultado |
| --- | --- | --- | --- | --- |
| R1 | 6 logins de admin seguidos | el 6.º responde 429 RATE_LIMIT_EXCEEDED | 401,401,401,401,401,429 | OK |

## 2. Flujos en la interfaz

### Paciente

| Caso | Pasos | Esperado | Real | Resultado |
| --- | --- | --- | --- | --- |
| P1 | Sin sesión, entrar a `/patient/appointments` | Redirige al login del paciente | Redirige a `/login` | OK |
| P2 | Enviar el login vacío | Mensajes debajo de cada campo | "El email es obligatorio." y "El DNI es obligatorio." | OK |
| P3 | DNI con puntos (`12.345.678`) | Mensaje de formato | "Ingresá un DNI de 7 u 8 dígitos, sin puntos ni espacios y sin cero inicial." | OK |
| P4 | Login con email y DNI nuevos | Se registra, entra y vuelve a la pantalla pedida | Vuelve a `/patient/appointments`; la sesión guarda el DNI | OK |
| P5 | Mis turnos sin turnos | Mensaje y botón para reservar | "No tenés turnos activos" y "Reservar un turno", que lleva a `/patient/book` | OK |
| P6 | Reservar: especialidad → médico → "Buscar disponibilidad" | Grilla con los horarios libres de la semana | Viernes 20/11 de 09:00 a 11:30 | OK |
| P7 | Elegir un horario y confirmar sin motivo | Barra con el turno elegido; error de motivo obligatorio | "Viernes, 20 de noviembre, 10:00 hs"; "Contanos el motivo de la consulta." | OK |
| P8 | Confirmar con motivo | Aviso de éxito y el horario deja de ofrecerse | "¡Turno confirmado para el viernes 20/11 a las 10:00!"; 10:00 desaparece de la grilla | OK |
| P9 | "Ver mis turnos" | El turno aparece con fecha, médico, especialidad y estado | Viernes 20/11 10:00, Dra. Laura Gómez, Cardiología, Confirmado | OK |
| P10 | Cancelar el turno | Confirmación con el detalle; el turno desaparece | "¿Cancelar el turno del viernes 20/11 a las 10:00 con Dra. Laura Gómez?" → "Turno cancelado." | OK |
| P11 | Volver a la grilla | El horario cancelado vuelve a estar libre | 10:00 aparece otra vez | OK |
| P12 | Conflicto: otro paciente reserva el horario elegido antes de confirmar | Aviso de turno tomado y grilla actualizada | "Ese turno ya fue tomado. Elegí otro."; la grilla se recarga sin ese horario | OK |

### Seguridad

| Caso | Pasos | Esperado | Real | Resultado |
| --- | --- | --- | --- | --- |
| X1 | Con sesión de paciente, entrar a `/admin/doctors` | Vuelve al inicio del paciente | Redirige a `/patient/book` | OK |
| X2 | Sin sesión, entrar a una pantalla de admin | Redirige al login del admin | `/admin/specialties` → `/admin/login` | OK |
| X3 | Token con la firma alterada a mano | El backend responde 401 y la app vuelve sola al login | Vuelve a `/login` y la sesión queda vacía | OK |
| X4 | Cerrar sesión del admin y apretar "atrás" | Vuelve al login y no a la pantalla privada | `/admin/login`, sesión vacía; "atrás" se queda en el login | OK |

### Administrador

| Caso | Pasos | Esperado | Real | Resultado |
| --- | --- | --- | --- | --- |
| U1 | Enviar el login vacío | Mensajes debajo de cada campo | "El email es obligatorio." y "La contraseña es obligatoria." | OK |
| U2 | Contraseña incorrecta | Mensaje claro y sin sesión | "Email o contraseña incorrectos." | OK |
| U3 | Login correcto | Entra y vuelve a la pantalla pedida | Vuelve a `/admin/specialties` | OK |
| U4 | Nueva especialidad, enviar vacío | Mensajes debajo de cada campo | "El nombre es obligatorio." y "La descripción es obligatoria." | OK |
| U5 | Nueva especialidad con nombre repetido | Error del backend debajo del nombre | "Ya existe una especialidad con ese nombre." | OK |
| U6 | Crear especialidad | Vuelve al listado con aviso y aparece | "Especialidad creada correctamente."; aparece Dermatología | OK |
| U7 | Editar especialidad | Formulario precargado; aviso al guardar | Precarga "Dermatología"; "Especialidad actualizada correctamente." | OK |
| U8 | Eliminar especialidad | Confirmación; deja de listarse | "¿Querés eliminar la especialidad "Temporal"?" → "Especialidad eliminada correctamente." | OK |
| U9 | Nuevo médico, enviar vacío | Mensajes debajo de cada campo | Nombre, especialidad y matrícula obligatorios | OK |
| U10 | Nuevo médico con matrícula repetida | Error del backend | "Ya existe un médico con esa matrícula." | OK |
| U11 | Crear médico | Vuelve al listado con aviso y aparece con su especialidad | "Médico registrado correctamente."; Dr. Martín Sosa, Dermatología | OK |
| U12 | Editar médico | Formulario precargado; aviso al guardar | Precarga nombre y matrícula; "Médico actualizado correctamente." | OK |
| U13 | Dar de baja un médico | Confirmación; deja de listarse | "Médico dado de baja correctamente."; ya no aparece | OK |
| U14 | Buscar médico por nombre ("sosa") | Filtra el listado | Solo Dr. Martín A. Sosa | OK |
| U15 | Disponibilidad desde el listado (reloj): activar lunes, miércoles y viernes de 09:00 a 12:00 y guardar | Aviso de guardado; al recargar se mantiene | Se guarda y al recargar muestra los tres días con 09:00 a 12:00 | OK |
| U16 | Panel principal | Accesos rápidos y turnos de hoy | Muestra la fecha de hoy y "No hay turnos para hoy"; los accesos llevan a alta de médico, alta de especialidad y búsqueda | OK |
| U17 | Búsqueda avanzada sin filtros | Lista los turnos con fecha, especialidad, médico, paciente y estado | 3 turnos (1 confirmado y 2 cancelados) | OK |
| U18 | Búsqueda por DNI, especialidad, médico y fecha | Cada filtro reduce los resultados | DNI: 2; especialidad sin turnos: "No hay resultados"; médico: 3; fecha 25/11: 1 | OK |
| U19 | Búsqueda con DNI inválido (`12`) | Mensaje de validación sin buscar | "Ingresá un DNI de 7 u 8 dígitos." | OK |

El aviso de "Demasiados intentos" en la pantalla de login también se verificó durante el desarrollo de SCRUM-20. En esta prueba, el límite se comprobó por la API (caso R1).

## 3. Responsive

Se midió si la página tiene desplazamiento horizontal (`scrollWidth` mayor que el ancho de la ventana). Las tablas pueden desplazarse dentro de su propio contenedor, que es lo esperado.

| Pantalla | 360 px | 768 px | 1366 px |
| --- | --- | --- | --- |
| `/login` | OK | OK (1280 px) | OK (1280 px) |
| `/admin/login` | OK | OK (1280 px) | OK (1280 px) |
| Página 404 | OK | OK | OK |
| `/admin` (panel) | OK | OK | OK |
| `/admin/doctors` | OK | OK | OK |
| `/admin/doctors/new` | OK | OK | OK |
| `/admin/doctors/:id/availability` | OK | OK | OK |
| `/admin/specialties` | OK | OK | OK |
| `/admin/specialties/new` | OK | OK | OK |
| `/admin/patients` (búsqueda) | OK | OK | OK |
| `/patient/book` (con grilla y barra de confirmación) | OK | OK | OK |
| `/patient/appointments` | OK | OK | OK |

En celular, el menú del administrador y el del paciente se ocultan detrás del botón ☰; desde 768 px el menú lateral del administrador queda fijo.

## 4. Consola

Sin errores de JavaScript ni warnings de React (incluidos los de `key`) en todo el recorrido. Los únicos mensajes en rojo son los registros del navegador de las respuestas 401, 403 y 409 que se provocaron a propósito en las pruebas de seguridad y de conflicto.

## Observaciones (no bloquean la entrega)

1. **Pacientes "Sin nombre" en la búsqueda avanzada.** El paciente se registra solo con email y DNI, así que el backend no tiene su nombre y la tabla muestra "Sin nombre". Se podría mostrar el email en su lugar.
2. **Dos primeros logins simultáneos del mismo paciente.** Si llegan al mismo tiempo dos pedidos de login de un paciente que todavía no existe, uno responde 500 porque los dos intentan crearlo. Uno por vez funciona siempre. Es un caso borde del backend.
3. **El feriado del 23/11 no genera turnos**, como corresponde (caso V6). Conviene tenerlo en cuenta si en la demo se busca disponibilidad ese día.
