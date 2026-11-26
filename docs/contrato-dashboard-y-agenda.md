# Contrato propuesto: estadísticas y agenda de reservas

## Indicadores del tablero

`GET /api/dashboard/stats?date=YYYY-MM-DD` — requiere sesión de administrador.
El front manda la misma fecha que usa para «Turnos de hoy».

Respuesta 200:

```json
{
  "activeDoctors": 0,
  "activeSpecialties": 0,
  "confirmedAppointmentsToday": 0
}
```

- `activeDoctors` y `activeSpecialties`: conteos de registros activos, sin paginar.
- `confirmedAppointmentsToday`: turnos en estado `BOOKED` cuya fecha es la solicitada; no incluye cancelados, atendidos ni ausentes.
- Los tres campos son enteros no negativos. Un cero real se muestra como `0`; mientras no hay datos se ve `—`.
- Cuando la API esté desplegada, poner `VITE_DASHBOARD_STATS_ENABLED=true` en `.env.development.local` y reiniciar Vite. En producción, configurar la misma variable antes de compilar. Con la variable deshabilitada no se hace la petición.

## Ocupación en la grilla del paciente

Extender `GET /api/doctors/{id}/slots?from=YYYY-MM-DD&to=YYYY-MM-DD&includeOccupied=true`.
Sin el parámetro, conservar la respuesta actual de solo horarios libres.
Con el parámetro activo, conservar los límites de fecha, permisos y duración vigentes e identificar explícitamente el estado de cada bloque:

```json
[
  {
    "id": "id-de-disponibilidad",
    "date": "2026-11-24",
    "startTime": "09:00:00",
    "endTime": "09:30:00",
    "status": "AVAILABLE"
  },
  {
    "date": "2026-11-24",
    "startTime": "09:30:00",
    "endTime": "10:00:00",
    "status": "OCCUPIED"
  }
]
```

- `AVAILABLE`: bloque libre con su identificador de disponibilidad; se puede seleccionar.
- `OCCUPIED`: bloque con una reserva vigente; se muestra gris y no se puede seleccionar. No incluir datos del paciente ni de la reserva.
- No devolver como `OCCUPIED` horarios pasados, fuera de agenda ni bloques que no tengan reserva. Si se cancela un turno y se libera el bloque, vuelve a `AVAILABLE`.
- Mientras se use la API anterior, sus horarios sin `status` se siguen mostrando como disponibles. No se inventa ocupación para los bloques ausentes.
