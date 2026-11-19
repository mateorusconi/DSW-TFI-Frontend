# MedPortal — DSW TFI Frontend

Frontend del sistema de turnos médicos, desarrollado con React y Vite.

## Estado actual

La base compartida de Axios, almacenamiento de sesión, errores y fechas está implementada. Los formularios de login validan localmente, pero todavía no llaman a la API. Especialidades usa datos de ejemplo: crear y editar no persisten cambios y la confirmación de eliminación está deshabilitada.

`AuthProvider` comparte la sesión con toda la app y `ProtectedRoute` controla el acceso por rol.

## Integrantes

| Integrante | Legajo |
| --- | --- |
| Fabrizzio Calliari |  |
| Franco Germán Martínez Soria |  |
| Gonzalo Ruiz |  |
| Mateo Rusconi |  |

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
├─ App.jsx                → AuthProvider + RouterProvider
├─ index.css              → Tailwind + @theme (tokens primary-*)
├─ router/
│  ├─ index.jsx           → rutas, protegidas por rol
│  └─ paths.js            → todas las URLs en un solo lugar
└─ modules/
   ├─ auth/               # Login de admin y paciente, sesión global (AuthProvider, useAuth) y rutas protegidas por rol
   ├─ home/               # Tablero del administrador: resumen y turnos de hoy
   ├─ specialties/        # Especialidades: listado con búsqueda y paginado, alta, edición y baja lógica
   ├─ doctors/            # Médicos: listado con búsqueda y paginado, alta, edición y baja lógica
   ├─ availabilities/     # Disponibilidad horaria semanal de cada médico
   ├─ appointments/       # Turnos: búsqueda avanzada (admin), reserva y "Mis turnos" (paciente)
   └─ shared/             # Lo que reutilizan todos los módulos
      ├─ api/             → instancia de Axios e interceptores (único lugar con axios)
      ├─ helpers/         → sesión, mensajes de error, fechas y estados de turno
      ├─ hooks/           → usePaginatedList
      ├─ constants/       → tamaño de página
      ├─ pages/           → 404 y demo de componentes (solo en desarrollo)
      └─ components/      → Atomic Design
         ├─ atoms/        → Button, Input, Select, Textarea, Spinner, Card, StatusBadge
         ├─ molecules/    → Alert, ConfirmDialog, PageHeader, Pagination, SearchBar, SidebarItem
         ├─ organisms/    → DataTable, Sidebar, AdminHeader, PatientNavbar
         └─ templates/    → AdminLayout, PatientLayout, AuthLayout
```

### Responsabilidades

- **Página:** compone la pantalla y coordina sus acciones y navegación.
- **Formulario:** muestra campos y validaciones; recibe el envío por props.
- **Servicio de un módulo:** realiza solicitudes usando `instance` y devuelve los datos.
- **Axios compartido:** configura transporte, token, filtros y normalización de errores. No dibuja mensajes ni decide qué página mostrar.
- **Helpers:** transformaciones y utilidades reutilizables; no renderizan componentes.
- **Layout:** define el marco visual. `AdminLayout` y `PatientLayout` usan `Outlet`; `AuthLayout` admite `children` o `Outlet`.

Las páginas y componentes no deben llamar directamente a `axios` ni a `fetch`. Importan sus servicios. La dependencia directa de Axios queda en la capa compartida de transporte (`axiosInstance.js` y `apiError.js`). No importar componentes internos de otro módulo para reutilizar lógica.

Los estilos se escriben con Tailwind y los tokens de `@theme` (`index.css`). Quedan por migrar los `.css` de los logins, `AuthLayout`, `Card`, `DataTable` y el listado de especialidades.  

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
- El interceptor no redirige: `AuthProvider` escucha `auth:expired`, pone la sesión en `null` y `ProtectedRoute` lleva al login.

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

Guardar la sesión no autentica por sí solo al usuario ni valida la firma o el vencimiento del JWT. La autorización real corresponde al backend.

No guardar contraseñas ni registrar JWT en consola. localStorage persiste entre recargas y es accesible desde JavaScript del mismo origen; requiere cuidado frente a XSS. No usar `localStorage.clear()`, porque borraría información ajena a la sesión.

### Usar la sesión en un componente: `useAuth()`

`AuthProvider` (en `App.jsx`) guarda la sesión en estado y la comparte con todo el árbol. Al recargar la página la lee de localStorage, y si el token está vencido arranca sin sesión.

```jsx
import { useAuth } from '../../auth/hooks/useAuth';

const { user, isAuthenticated, role, login, logout } = useAuth();
user?.dni;   // DNI del paciente
user?.email;
```

- `login({ token, role, email, dni })`: guarda la sesión. El back devuelve `{ token, role }`; el email y el DNI salen del formulario.
- `logout()`: borra la sesión. A dónde navegar lo decide quien lo llama.
- Si la API responde 401, la sesión se cierra sola.
- Usar `useAuth()` fuera de `AuthProvider` tira un error.

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

- **Átomos** (`shared/components/atoms/`): todos reciben `id`, `label` y `error`, y pasan el resto de las props al elemento HTML, así que funcionan con `{...register("campo")}` de react-hook-form.
  - `Input`: `type` y un `icon` opcional de lucide-react.
  - `Select`: `options` (`[{ value, label }]`) y `placeholder` (por defecto "Seleccione...").
  - `Textarea`: `maxLength` y `currentLength` para mostrar el contador `45/100`.
  - `Button`: `variant` (`primary`, `secondary`, `danger`, `ghost`), `loading`, `icon` y `type` (por defecto `button`).
  - `Spinner`: `size`. `Card`: `children` y `className`.

```jsx
<Input id="email" label="Email" type="email" icon={Mail}
  error={errors.email?.message ?? ""}
  {...register("email", { required: "El email es obligatorio." })} />

<Button type="submit" icon={Save} loading={isSubmitting}>Guardar</Button>
```

La demo de todos los átomos está en `/componentes`.
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

Cada fila necesita un identificador estable (`id` por defecto, configurable con `rowKey`) y cada columna una `key` única. Sin `render`, se muestra `row[column.key]`; con `render(row)`, el módulo define el contenido de la celda. La tabla no conoce médicos ni especialidades y su contenedor permite desplazamiento horizontal.

Las pantallas de listado combinan `DataTable` con `Pagination` y `usePaginatedList`. El tamaño de página por defecto es `DEFAULT_PAGE_SIZE` (10); una pantalla puede pasar un valor distinto. Mantené las columnas junto a la página si son cortas o en un archivo del propio módulo si tienen varios renderizados de celda.

La demo `/componentes` usa datos ficticios y solo está disponible con `npm run dev`. No se incluye en el build de producción.

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
| `/admin/turnos` | Búsqueda avanzada con filtros y paginación; pendiente de prueba con sesión admin y API real. |
| Otras rutas de admin/paciente | Páginas provisorias según el router actual. |

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

- Conectar servicios de login.
- Completar los átomos, avisos, estados y componentes de listas compartidos.
- Conectar el CRUD de especialidades y retirar los mocks/estadísticas de ejemplo cuando corresponda.
- Implementar las pantallas provisorias del resto de módulos y realizar pruebas integrales.
- Unificar la estrategia de estilos, completar los legajos y mantener este README actualizado al integrar cada tarea.
