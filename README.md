# MedPortal — DSW TFI Frontend

Frontend del sistema de turnos médicos, desarrollado con React y Vite.

## Estado actual

La base compartida de Axios, almacenamiento de sesión, errores y fechas está implementada. Los formularios de login validan localmente, pero todavía no llaman a la API. Especialidades usa datos de ejemplo: crear y editar no persisten cambios y la confirmación de eliminación está deshabilitada.

**Importante:** `ProtectedRoute` es provisorio y actualmente deja pasar a todas las rutas. Todavía no hay `AuthProvider` ni protección efectiva de navegación por rol. Esta versión es un prototipo en desarrollo, no una aplicación con autenticación terminada.

## Integrantes

| Integrante | Legajo |
| --- | --- |
| Fabrizzio Calliari | Pendiente de completar |
| Franco Germán Martínez Soria | Pendiente de completar |
| Gonzalo Ruiz | Pendiente de completar |
| Mateo Rusconi | Pendiente de completar |

## Requisitos y desarrollo local

- Node.js compatible con la versión instalada de Vite. Vite declara `^20.19.0 || >=22.12.0`; Node 24 cumple este requisito.
- npm y un navegador moderno.
- La API `dsw2026-tpi` solo es necesaria para probar solicitudes reales. Las pantallas actuales pueden abrirse sin iniciar el backend.

Desde la raíz de este repositorio, en PowerShell:

```powershell
npm.cmd install

if (-not (Test-Path -LiteralPath .env)) {
    Copy-Item -LiteralPath .env.example -Destination .env
}

npm.cmd run dev
```

Abrir la dirección indicada por Vite. Se usa `npm.cmd` para evitar el bloqueo de `npm.ps1` por la política de ejecución de PowerShell.

### Configuración de la API

El archivo `.env.example` contiene:

```dotenv
VITE_BACKEND_URL=http://localhost:5278
```

`vite.config.js` lee esa variable y configura el proxy de desarrollo:

```text
Navegador → /api/... → proxy de Vite → VITE_BACKEND_URL/api/...
```

La instancia de Axios usa `baseURL: '/api'`. Los servicios deben pedir `/specialties`, no `/api/specialties`, para no duplicar el prefijo. Reiniciar Vite después de cambiar `.env`.

`.env` está ignorado por Git; `.env.example` se comparte sin secretos. Las variables `VITE_*` no deben contener contraseñas, claves de firma ni otros secretos.

El proxy está configurado para `npm.cmd run dev`, no para producción. Antes de desplegar hay que definir cómo el servidor resolverá `/api` y cómo devolverá `index.html` al abrir directamente una ruta de React Router. `npm.cmd run preview` tampoco configura por sí solo ese despliegue ni levanta el backend.

## Arquitectura

Los módulos se organizan por funcionalidad (Screaming Architecture); los componentes compartidos se agrupan por nivel de composición (Atomic Design).

```text
src/
├─ main.jsx
├─ App.jsx
├─ index.css
├─ router/
│  ├─ index.jsx
│  └─ paths.js
└─ modules/
   ├─ auth/                 # Login, validaciones y futura sesión global
   ├─ specialties/          # Listado y formulario de especialidades
   ├─ doctors/              # Páginas provisorias de médicos
   ├─ availabilities/       # Página provisoria de disponibilidad
   ├─ appointments/         # Páginas provisorias de turnos
   ├─ home/                 # Panel provisorio del administrador
   └─ shared/
      ├─ api/
      │  ├─ axiosInstance.js
      │  └─ apiError.js
      ├─ helpers/
      │  ├─ tokenStorage.js
      │  ├─ getErrorMessage.js
      │  ├─ getValidationErrors.js
      │  ├─ applyFieldErrors.js
      │  └─ dates.js
      ├─ hooks/             # Reservado para hooks compartidos
      ├─ pages/
      └─ components/
         ├─ atoms/
         ├─ molecules/
         ├─ organisms/
         └─ templates/
```

### Responsabilidades

- **Página:** compone la pantalla y coordina sus acciones y navegación.
- **Formulario:** muestra campos y validaciones; recibe el envío por props.
- **Servicio de un módulo:** realiza solicitudes usando `instance` y devuelve los datos. Los servicios de negocio todavía están pendientes.
- **Axios compartido:** configura transporte, token, filtros y normalización de errores. No dibuja mensajes ni decide qué página mostrar.
- **Helpers:** transformaciones y utilidades reutilizables; no renderizan componentes.
- **Layout:** define el marco visual. `AdminLayout` y `PatientLayout` usan `Outlet`; `AuthLayout` admite `children` o `Outlet`.

Las páginas y componentes no deben llamar directamente a `axios` ni a `fetch`. Importan sus servicios. La dependencia directa de Axios queda en la capa compartida de transporte (`axiosInstance.js` y `apiError.js`). No importar componentes internos de otro módulo para reutilizar lógica.

Actualmente conviven Tailwind y CSS de componentes. Los estilos comunes de login están unificados y sus variantes separadas. La migración completa a Tailwind/tokens aún está pendiente; este README describe lo existente, no la da por realizada.

## Cómo llamar al backend

### Servicio de negocio

Ejemplo para el futuro archivo `src/modules/specialties/services/specialtiesService.js`. Este ejemplo documenta el patrón; ese servicio aún no está implementado en la aplicación.

```js
import { instance } from '../../shared/api/axiosInstance.js';

export async function getSpecialties({ pageIndex = 1, pageSize = 10, name } = {}) {
  const response = await instance.get('/specialties', {
    params: { pageIndex, pageSize, name },
  });

  return response.data;
}
```

El formato paginado esperado es `{ pageSize, pageIndex, data, total }`, con `pageIndex` desde 1. Las respuestas exitosas de Axios se mantienen intactas; el servicio extrae `response.data`. Si la solicitud falla, el error se propaga al `catch` del consumidor: no devolver silenciosamente una lista vacía ni ocultar el fallo.

### Contrato de los interceptores

- Base URL: `/api`. Tiempo máximo configurado: 10 segundos.
- El interceptor de request consulta el token de la sesión en cada solicitud y agrega `Authorization: Bearer ...` cuando corresponde.
- `params` debe ser un objeto común. Se eliminan propiedades con `''`, `null` o `undefined`, pero se conservan `0` y `false`.
- El interceptor de response transforma los errores en `ApiError`. Las cancelaciones conservan su identidad; no se muestran como fallos mediante `getErrorMessage`.
- Un 401 del token de la sesión actual limpia esa sesión y emite `auth:expired`. Un 403 no cierra la sesión. Un 401 atrasado de otro token no borra una sesión nueva.
- El interceptor no redirige. Falta integrar el listener de `auth:expired` en el futuro `AuthProvider`.

### Login sin adjuntar una sesión anterior

Los futuros servicios de login deben usar `skipAuth: true`. Es una opción propia de este proyecto, interpretada por el interceptor, no una opción de autenticación incorporada de Axios.

Ejemplo de funciones para `src/modules/auth/services/authService.js` (todavía no conectadas a los formularios):

```js
import { instance } from '../../shared/api/axiosInstance.js';

export async function loginAdmin(credentials) {
  const { data } = await instance.post('/auth/admin/login', credentials, {
    skipAuth: true,
  });
  return data;
}

export async function loginPatient({ email, dni }) {
  const { data } = await instance.post(
    '/auth/patient/login',
    { email, dni: Number(dni) },
    { skipAuth: true },
  );
  return data;
}
```

Admin envía `{ email, password }`; paciente envía `{ email, dni }`, con DNI numérico y previamente validado. Ambos esperan `{ token, role }`. `skipAuth` elimina el header de autorización, de modo que un login rechazado no se trata como expiración de la sesión anterior.

**Atención:** el primer login de un paciente puede crear registros en el backend. Acordar los datos de prueba antes de ejecutar solicitudes reales. Los ejemplos anteriores no deben confundirse con un login ya funcional.

## Sesión

`src/modules/shared/helpers/tokenStorage.js` expone:

| Función | Responsabilidad |
| --- | --- |
| `saveSession({ token, role, email, dni })` | Guarda los campos permitidos como JSON en la clave `session` de localStorage. |
| `getSession()` | Devuelve la sesión o `null` si falta, no tiene token/rol válidos o no puede leerse. |
| `getToken()` | Extrae el token o devuelve `null`. |
| `clearSession()` | Borra únicamente la clave `session`. |

Los roles reconocidos son `ADMINISTRADOR` y `PACIENTE`. El DNI es opcional para admin. El token antiguo de `medportal.token` ya no se utiliza.

Guardar la sesión no autentica por sí solo al usuario ni valida la firma o el vencimiento del JWT. La autorización real corresponde al backend. Tampoco actualiza automáticamente el estado de React: falta `AuthProvider` para coordinar almacenamiento, estado y navegación.

No guardar contraseñas ni registrar JWT en consola. localStorage persiste entre recargas y es accesible desde JavaScript del mismo origen; requiere cuidado frente a XSS. No usar `localStorage.clear()`, porque borraría información ajena a la sesión.

## Errores y validaciones

`ApiError` contiene `status`, `errorCode`, `message` y `details`, con el formato de detalles `[{ field, issue }]`.

- `toApiError(error)` normaliza errores de Axios y conserva los que ya son `ApiError`.
- Sin respuesta HTTP, produce `status: 0` y `NETWORK_ERROR`; el 0 es una convención del frontend, no un código HTTP. Los timeouts sin respuesta también entran en este caso actualmente.
- Si hay una respuesta no esperada, por ejemplo HTML de un proxy, conserva su estado HTTP y usa campos alternativos. No convierte un 502 recibido en un estado 0.

### Mensaje general

`getErrorMessage(error, fallback?)`, desde `shared/helpers/getErrorMessage.js`, devuelve un texto por código de error, luego por estado HTTP y finalmente el texto alternativo. Para estados desde 500 usa un mensaje genérico y no muestra detalles internos. Una cancelación devuelve `''`.

### Errores por campo

- `getValidationErrors(error)` solo extrae detalles de errores 400, descarta entradas incompletas y devuelve `{ campo: mensaje }`.
- Normaliza la primera letra del campo: `Name` pasa a `name`; no convierte automáticamente todos los segmentos de una ruta anidada.
- Traduce `required` a `Este campo es obligatorio.`. Otros valores de `issue` se conservan; no hay una traducción completa de códigos de validación todavía.
- `applyFieldErrors(error, setError, allowedFields?)` usa ese resultado para llamar a `setError(field, { type: 'server', message })` de React Hook Form. Devuelve `true` si aplicó alguno.

Ejemplo para un futuro `catch` del formulario de especialidades:

```js
const applied = applyFieldErrors(error, setError, ['name', 'description']);

if (!applied) {
  setErrorMessage(getErrorMessage(error));
}
```

`setError` debe provenir de `useForm` y `setErrorMessage` del estado de la pantalla/formulario. Pasar `allowedFields` evita asignar errores a campos ajenos. Los conflictos 409, como un nombre repetido, requieren tratamiento específico si se quieren mostrar debajo de un campo: `applyFieldErrors` no los convierte automáticamente en validaciones 400.

## Fechas y horas

Las funciones de `src/modules/shared/helpers/dates.js` no llaman a la API ni modifican las reglas del backend.

| Función | Resultado |
| --- | --- |
| `toLocalISODate(value)` | Fecha local `YYYY-MM-DD`; `''` si no puede interpretarla. |
| `startOfWeek(value)` | Un nuevo `Date` para el lunes de esa semana a medianoche; `null` si no puede interpretarlo. No modifica el original. |
| `formatLongDate(value)` | Texto en `es-AR`, por ejemplo `domingo, 1 de noviembre`; `—` si no puede interpretarlo. La puntuación puede variar según el entorno. |
| `formatTime(value)` | Primeros cinco caracteres de una cadena que comienza con `HH:mm`; `—` si no tiene ese formato inicial. |

Aceptan fechas `Date` o cadenas interpretables por JavaScript. Una cadena `YYYY-MM-DD` se trata como medianoche local para evitar el desplazamiento de UTC. Se recomienda usar fechas ISO, no cadenas ambiguas como `01/11/2026`.

```js
toLocalISODate(new Date(2026, 9, 21, 23, 30)); // '2026-10-21'
formatTime('09:30:00'); // '09:30'
```

Trabajan con la zona local del dispositivo; `es-AR` no fija la zona de Argentina. Una cadena con `Z` o un offset representa un instante que se mostrará en la zona local. Son helpers de formato, no validadores estrictos de calendario ni de rangos horarios. Para filtros de fecha local no usar indiscriminadamente `toISOString().slice(0, 10)`.

## Componentes compartidos

- **Átomos:** `Input` recibe `id`, `label`, `type`, `error` y props del input; admite las props de `register`. `Card` recibe `children` y `className`.
- **Moléculas:** `PageHeader`, `SidebarItem` y el `ConfirmDialog` actual.
- **Organismos:** `DataTable`, `Sidebar`, `AdminHeader` y `PatientNavbar`.
- **Templates:** `AdminLayout`, `PatientLayout` y `AuthLayout`.

### DataTable

Ejemplo dentro de un componente que haya importado `DataTable`:

```jsx
const columns = [
  { key: 'name', header: 'Especialidad' },
  { key: 'description', header: 'Descripción' },
  { key: 'actions', header: 'Acciones', render: (row) => <span>{row.id}</span> },
];

const rows = [{ id: 'demo-1', name: 'Cardiología', description: 'Dato de ejemplo' }];

return <DataTable columns={columns} rows={rows} />;
```

Cada fila necesita un `id` estable y cada columna una `key` única. Sin `render`, se muestra `row[column.key]`; con `render(row)`, la página define el contenido de la celda. La tabla no conoce médicos ni especialidades y su contenedor permite desplazamiento horizontal.

La implementación actual aún no incluye `rowKey`, carga, mensaje vacío, `Pagination`, `SearchBar` ni `usePaginatedList`. Tampoco está terminada la demo de componentes; son parte del trabajo pendiente de SCRUM-25.

### ConfirmDialog

El diálogo actual se monta condicionalmente para abrirse y usa `dialog` nativo. Recibe `title`, `message`, `onCancel`, `onConfirm`, `confirmLabel` y `confirmDisabled`. Cancelar y Escape notifican `onCancel`; la confirmación queda deshabilitada si se indica o no hay `onConfirm`. Su integración con Button compartido, carga y el contrato final de SCRUM-26 está pendiente. `Alert` y `StatusBadge` todavía no están implementados.

## Navegación y endpoints

Las rutas se declaran en `src/router/index.jsx` y sus destinos reutilizables en `src/router/paths.js` (`PATHS`).

| Ruta frontend | Estado |
| --- | --- |
| `/` | Redirige al login del paciente. |
| `/paciente/login` y `/admin/login` | Formularios con validación local, sin login real. |
| `/admin/especialidades` | Listado con datos de ejemplo y diálogo de eliminación. |
| `/admin/especialidades/nueva` y `/admin/especialidades/:id/editar` | Formulario reutilizado; edición precargada desde mocks, sin persistencia. |
| Otras rutas de admin/paciente y `/componentes` | Páginas provisorias según el router actual. |

Endpoints previstos para integrar los flujos anteriores; no son llamadas ya realizadas por las pantallas:

| Método | Endpoint | Uso |
| --- | --- | --- |
| POST | `/api/auth/admin/login` | Login con email y contraseña. |
| POST | `/api/auth/patient/login` | Login con email y DNI. |
| GET | `/api/specialties?pageIndex=1&pageSize=10&name=car` | Listado paginado y búsqueda. |
| POST | `/api/specialties` | Crear con `{ name, description }`. |
| PUT | `/api/specialties/{id}` | Editar con `{ name, description }`. |
| DELETE | `/api/specialties/{id}` | Baja lógica. |

Los endpoints de especialidades requieren la autorización correspondiente del backend. No se presupone un `GET /api/specialties/{id}`: antes de conectar edición debe acordarse cómo recuperar la fila y qué hacer al abrir directamente su URL. El frontend no debe inferir autorización a partir de que una ruta sea accesible en este prototipo.

## Verificaciones y pendientes

```powershell
npm.cmd run lint
npm.cmd run build
npm.cmd run preview
```

`build` genera `dist/` y `preview` permite inspeccionar ese resultado local. Ninguno inicia la API. El proyecto todavía no tiene un script `npm test` ni una suite de pruebas automatizadas persistente.

Se realizaron comprobaciones locales puntuales de sesión, normalización de errores, helpers e interceptores con almacenamiento/adaptadores simulados. No sustituyen pruebas reales contra el backend ni constituyen una suite incluida en el repositorio. La integración HTTP completa aún debe verificarse con datos de prueba acordados, revisando Network, validaciones y permisos.

Pendientes principales:

- Conectar servicios de login, `AuthProvider`, `useAuth`, logout y rutas por rol.
- Completar los átomos, avisos, estados y componentes de listas compartidos.
- Conectar el CRUD de especialidades y retirar los mocks/estadísticas de ejemplo cuando corresponda.
- Implementar las pantallas provisorias del resto de módulos y realizar pruebas integrales.
- Unificar la estrategia de estilos, completar los legajos y mantener este README actualizado al integrar cada tarea.
