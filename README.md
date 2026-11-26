# MedPortal — Sistema de Turnos Médicos (Frontend)

Frontend del Trabajo Práctico Integrador de **Desarrollo de Software 2026** (UTN — Facultad Regional Tucumán). Es una aplicación web en React que consume la API del backend [`dsw2026-tpi`](https://github.com/Franco704/dsw2026-tpi) y permite gestionar médicos, especialidades y disponibilidades horarias, y que los pacientes reserven y cancelen turnos de forma autónoma.

## Integrantes

| Integrante | Legajo |
| --- | --- |
| Fabrizzio Calliari | 60233 |
| Franco Germán Martínez Soria | 60224 |
| Gonzalo Ruiz | 60467 |
| Mateo Rusconi | 56559 |

## Funcionalidades

El enunciado (v1.4) pide para el frontend: página de acceso según roles, gestión de médicos, especialidades y disponibilidades, y registro y cancelación de turnos. Todas están implementadas y conectadas a la API real.

| Funcionalidad | Rol | Requisito del enunciado |
| --- | --- | --- |
| Login del administrador (email y contraseña) | Administrador | RF01 |
| Login del paciente (email y DNI); si es su primer ingreso, el backend lo registra solo | Paciente | RF02, RN06 |
| Rutas protegidas por rol: cada usuario solo ve sus pantallas | Ambos | RN05 |
| Panel principal: accesos rápidos y turnos del día | Administrador | — |
| Médicos: listado con búsqueda y paginado, alta, edición y baja lógica | Administrador | RF03 |
| Especialidades: listado con búsqueda y paginado, alta, edición y baja lógica | Administrador | RF04 |
| Disponibilidad horaria: días y horarios de atención de cada médico, en bloques de 30 minutos | Administrador | RF05, CU02, RN02 |
| Búsqueda avanzada de turnos por especialidad, médico, DNI y fecha | Administrador | RF09 |
| Reserva de turno: especialidad → médico → grilla semanal de horarios libres → confirmación con motivo | Paciente | RF06, RF07, CU01 |
| Mis turnos: turnos activos del paciente y cancelación | Paciente | RF08, CU03 |

Según la versión 1.4 del enunciado, la edición de médicos y de especialidades y el "Ver detalle" de la búsqueda avanzada no son obligatorios. Las dos ediciones se implementaron igual; el detalle de la búsqueda no.

## Tecnologías

| Librería | Para qué se usa |
| --- | --- |
| React 19 + Vite 8 | Interfaz y servidor de desarrollo con proxy hacia la API |
| React Router 7 | Navegación, rutas anidadas por rol y redirecciones |
| Axios | Llamadas a la API con interceptores para el token y el manejo de errores |
| React Hook Form | Formularios y validaciones |
| Tailwind CSS 4 | Estilos, diseño responsive (celular y computadora) |
| lucide-react | Íconos |
| ESLint | Reglas de calidad del código (`npm run lint`) |

## Requisitos

Para el frontend:

- **Node.js** `20.19` o superior (o `22.12` o superior). Se probó con Node 24.
- **npm** (viene con Node).

Para el backend, que se necesita para usar la aplicación:

- **.NET SDK 10**.
- **SQL Server LocalDB** (viene con Visual Studio o con SQL Server Express). La cadena de conexión por defecto usa `(localdb)\MSSQLLocalDB`.
- **Herramienta de Entity Framework** para crear la base de datos:

  ```bash
  dotnet tool install --global dotnet-ef
  ```

## Cómo correr el proyecto en local

### 1. Backend

```bash
git clone https://github.com/Franco704/dsw2026-tpi.git
cd dsw2026-tpi
git checkout development
```

**Contraseña del administrador inicial.** El backend crea el administrador la primera vez que arranca. El email está en `appsettings.json` (`admin@system.com`) y la contraseña se carga con *user-secrets*, para no subirla al repositorio. Tiene que tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo; si no, el backend no arranca:

```bash
dotnet user-secrets set "InitialAdmin:Password" "Admin2026!" --project Dsw2026Tpi.Api
```

**Base de datos.** El backend usa dos contextos de Entity Framework (el del dominio y el de usuarios). Hay que crear las tablas de los dos; el segundo comando también carga los roles `Administrador` y `Paciente`:

```bash
dotnet ef database update --project Dsw2026Tpi.Data --startup-project Dsw2026Tpi.Api --context Dsw2026TpiDbContext
dotnet ef database update --project Dsw2026Tpi.Data --startup-project Dsw2026Tpi.Api --context AuthenticationDbContext
```

**Levantar la API:**

```bash
dotnet run --project Dsw2026Tpi.Api --launch-profile http
```

La API queda en `http://localhost:5278` y la documentación de los endpoints en `http://localhost:5278/swagger`. La primera vez que arranca crea el administrador inicial. Ya acepta pedidos desde `http://localhost:5173`, que es donde corre el frontend.

### 2. Frontend

En otra terminal:

```bash
git clone https://github.com/mateorusconi/DSW-TFI-Frontend.git
cd DSW-TFI-Frontend
npm install
cp .env.example .env
npm run dev
```

Abrir `http://localhost:5173`.

En PowerShell de Windows, `cp` funciona igual; si la política de ejecución bloquea `npm`, usar `npm.cmd install` y `npm.cmd run dev`.

El archivo `.env` define a dónde apunta el proxy de desarrollo:

```dotenv
VITE_BACKEND_URL=http://localhost:5278
```

El navegador pide `/api/...` al servidor de Vite y Vite lo reenvía a `VITE_BACKEND_URL/api/...`. Si el backend corre en otro puerto, cambiar esa variable y reiniciar `npm run dev`. `.env` no se sube al repositorio y no debe tener contraseñas ni claves.

### 3. Usuarios para probar

| Rol | Dónde entra | Datos |
| --- | --- | --- |
| Administrador | `http://localhost:5173/admin/login` | `admin@system.com` y la contraseña cargada con user-secrets |
| Paciente | `http://localhost:5173/login` | Cualquier email y un DNI de 7 u 8 dígitos. Si no existe, se registra solo |

Con la base vacía, para probar una reserva de punta a punta:

1. Como administrador, crear una especialidad y un médico de esa especialidad.
2. En **Doctores**, ícono del reloj, cargar su disponibilidad horaria (por ejemplo, lunes a viernes de 09:00 a 12:00).
3. Como paciente, en **Reservar turno**, elegir la especialidad, el médico y un horario de la grilla, escribir el motivo y confirmar.
4. En **Mis turnos** aparece el turno y se puede cancelar.

## Pantallas y endpoints

| Ruta | Pantalla | Rol | Endpoints que usa |
| --- | --- | --- | --- |
| `/login` | Login del paciente | Público | `POST /api/auth/patient/login` |
| `/admin/login` | Login del administrador | Público | `POST /api/auth/admin/login` |
| `/admin` | Panel principal | Administrador | `GET /api/appointments?date=` |
| `/admin/doctors` | Listado de médicos | Administrador | `GET /api/doctors`, `DELETE /api/doctors/{id}` |
| `/admin/doctors/new`, `/admin/doctors/:id/edit` | Alta y edición de médico | Administrador | `GET /api/specialties`, `POST /api/doctors`, `PUT /api/doctors/{id}` |
| `/admin/doctors/availability`, `/admin/doctors/:id/availability` | Disponibilidad horaria | Administrador | `GET /api/doctors`, `GET /api/doctors/{id}/availabilities`, `POST` y `PUT /api/availabilities` |
| `/admin/specialties` | Listado de especialidades | Administrador | `GET /api/specialties`, `DELETE /api/specialties/{id}` |
| `/admin/specialties/new`, `/admin/specialties/:id/edit` | Alta y edición de especialidad | Administrador | `POST /api/specialties`, `PUT /api/specialties/{id}` |
| `/admin/patients` | Búsqueda avanzada de turnos | Administrador | `GET /api/appointments/search`, `GET /api/specialties`, `GET /api/doctors` |
| `/patient/book` | Reserva de turno | Paciente | `GET /api/specialties`, `GET /api/doctors?specialtyId=`, `GET /api/doctors/{id}/slots`, `POST /api/appointments` |
| `/patient/appointments` | Mis turnos | Paciente | `GET /api/appointments/patient?dni=`, `DELETE /api/appointments/{id}` |

`/` redirige al login del paciente. Cualquier otra ruta muestra la página 404. Los listados usan el formato paginado del backend: `{ pageSize, pageIndex, data, total }`, con `pageIndex` desde 1.

## Reglas del negocio que se ven en la interfaz

- **Acceso por rol:** sin sesión, cualquier pantalla privada redirige al login correspondiente; un paciente que intenta entrar al panel del administrador vuelve a su inicio, y viceversa. Después del login se vuelve a la pantalla que se quería ver.
- **Sesión:** el token JWT dura 60 minutos. Si vence o el backend responde 401, la sesión se cierra sola y se vuelve al login.
- **Disponibilidad:** el backend genera turnos de 30 minutos desde hoy hasta fin de mes, salteando feriados. Al modificar el horario se conservan los turnos ya reservados.
- **Reserva:** no se ofrecen horarios pasados ni ocupados. Si otro paciente toma el mismo horario antes de confirmar, se avisa y la grilla se actualiza para elegir otro. El motivo es obligatorio (5 a 300 caracteres).
- **Límites del backend:** 5 intentos de login de administrador, 10 de paciente y 5 reservas por minuto; al superarlos se muestra un aviso.
- **Errores:** cada error de la API se muestra con un mensaje claro en castellano; los errores de validación aparecen debajo del campo correspondiente.

## Arquitectura

Los módulos se organizan por funcionalidad (**Screaming Architecture**) y los componentes compartidos por nivel de composición (**Atomic Design**).

```text
src/
├─ main.jsx
├─ App.jsx                → AuthProvider + RouterProvider
├─ index.css              → Tailwind + @theme (colores primary-*)
├─ router/
│  ├─ index.jsx           → rutas, protegidas por rol
│  └─ paths.js            → todas las URLs en un solo lugar
└─ modules/
   ├─ auth/               # Logins, sesión global (AuthProvider, useAuth) y rutas protegidas por rol
   ├─ home/               # Panel del administrador y turnos de hoy
   ├─ specialties/        # Especialidades
   ├─ doctors/            # Médicos
   ├─ availabilities/     # Disponibilidad horaria de cada médico
   ├─ appointments/       # Búsqueda avanzada (admin), reserva y "Mis turnos" (paciente)
   └─ shared/             # Lo que reutilizan todos los módulos
      ├─ api/             → instancia de Axios e interceptores (único lugar que usa axios)
      ├─ helpers/         → sesión, mensajes de error, fechas y estados de turno
      ├─ hooks/           → usePaginatedList
      ├─ constants/       → tamaño de página
      ├─ pages/           → 404 y demo de componentes (solo en desarrollo)
      └─ components/
         ├─ atoms/        → Button, Input, Select, Textarea, Spinner, Card, StatusBadge
         ├─ molecules/    → Alert, ConfirmDialog, PageHeader, Pagination, SearchBar, SidebarItem
         ├─ organisms/    → DataTable, Sidebar, AdminHeader, PatientNavbar
         └─ templates/    → AdminLayout, PatientLayout, AuthLayout
```

Responsabilidades:

- **Página:** arma la pantalla y coordina las acciones y la navegación.
- **Componente de un módulo** (por ejemplo, un formulario): muestra y valida; recibe las acciones por props y no llama a la API.
- **Servicio de un módulo:** hace los pedidos con la instancia compartida de Axios y devuelve los datos.
- **Capa compartida de API:** agrega el token, quita filtros vacíos y convierte los errores en `ApiError`. No muestra mensajes ni decide navegación.
- **Helpers:** funciones reutilizables que no dibujan nada.

Las páginas y componentes no llaman directamente a `axios` ni a `fetch`: usan los servicios de su módulo. Un módulo puede usar el servicio de otro (por ejemplo, la reserva usa el de médicos), pero no sus componentes internos.

### Sesión: `useAuth()`

`AuthProvider` guarda la sesión en estado y en `localStorage` (clave `session`), así sobrevive a una recarga. Si el token está vencido, arranca sin sesión.

```jsx
import { useAuth } from '../../auth/hooks/useAuth';

const { user, isAuthenticated, role, login, logout } = useAuth();
user?.dni;   // DNI del paciente
```

- `login({ token, role, email, dni })`: guarda la sesión. El backend devuelve `{ token, role }`; el email y el DNI salen del formulario.
- `logout()`: borra la sesión.
- Los logins llaman a la API con `skipAuth: true` (opción propia del proyecto), para no mandar un token viejo.

### Errores

Todos los errores de la API llegan como `ApiError` con `status`, `errorCode`, `message` y `details` (`[{ field, issue }]`), el formato que define el enunciado.

- `getErrorMessage(error)` devuelve el mensaje para el usuario según el `errorCode` (por ejemplo, `APPOINTMENT_CONFLICT` → "Ese turno ya fue tomado. Elegí otro."), y si no, según el estado HTTP.
- `applyFieldErrors(error, setError, campos)` pone los errores de validación del backend debajo de cada campo de React Hook Form.
- Si no hay conexión con el servidor, el error es `NETWORK_ERROR` y se muestra "No se pudo conectar con el servidor."

### Componentes compartidos

- **Átomos:** `Input`, `Select`, `Textarea` reciben `id`, `label` y `error`, y pasan el resto de las props al elemento HTML, así funcionan con `{...register("campo")}`. `Button` tiene las variantes `primary`, `secondary`, `danger` y `ghost`, y un estado `loading` que muestra un spinner y evita el doble click. `StatusBadge` muestra el estado de un turno.
- **Moléculas:** `Alert` (avisos de éxito, error e información), `ConfirmDialog` (confirmaciones), `PageHeader`, `Pagination` y `SearchBar`.
- **Organismos:** `DataTable` (tabla genérica con columnas configurables), `Sidebar`, `AdminHeader` y `PatientNavbar`.
- **Templates:** `AdminLayout`, `PatientLayout` y `AuthLayout`.

Con `npm run dev`, la ruta `/componentes` muestra una demo de los componentes compartidos. No se incluye en el build de producción.

## Metodología de trabajo

### Organización con Jira

El trabajo se organizó con **Scrum** sobre un tablero de Jira. El backlog se dividió en diez épicas:

| Épica | Contenido |
| --- | --- |
| E1 | Setup del proyecto y base técnica |
| E2 | Autenticación por roles y rutas protegidas |
| E3 | Layout y componentes compartidos |
| E4 | Gestión de especialidades |
| E5 | Gestión de médicos |
| E6 | Disponibilidad horaria de médicos |
| E7 | Panel principal y búsqueda avanzada de turnos |
| E8 | Reserva y cancelación de turnos del paciente |
| E9 | Calidad, errores, arquitectura y entrega |
| E10 | Adaptaciones del backend que necesita el frontend |

Cada historia o tarea (`SCRUM-<número>`) se escribió con la misma estructura: objetivo, conceptos que aplica, dónde estudiarlos, qué hay que hacer en concreto, entregable, cómo se verifica que está terminada y de qué otras tareas depende. El tablero usa los estados *Por hacer*, *En proceso*, *Bloqueado*, *Control de calidad* y *Hecho*.

Primero se resolvieron las **tareas base** (estructura del proyecto, router, capa de API, sesión, componentes compartidos y layouts), para que después cada pantalla se pudiera desarrollar en paralelo sin bloquear a nadie. Las tareas se asignaron y reasignaron según la disponibilidad del equipo y el avance de cada una.

### Flujo con Git y GitHub

- `main`: versión de entrega.
- `Development`: rama de integración, donde se juntan las tareas terminadas.
- `feature/SCRUM-<número>-<descripción>`: una rama por tarea, creada desde `Development` actualizada.

Cada tarea se entrega con un **pull request a `Development`**. Antes de abrirlo se trae lo último de `Development`, se resuelven los conflictos y se corre `npm run lint`. Otro integrante revisa el PR antes de mergearlo. Al final, `Development` se mergea a `main` para la entrega.

### Coordinación con el backend

El backend está en un repositorio aparte. Antes de empezar el frontend se relevó qué hacía falta cambiar en la API para cumplir con los mockups (por ejemplo, permitir que el paciente liste especialidades y médicos, exponer los horarios libres de cada médico y agregar fecha y nombres a las respuestas de turnos). Esos cambios se registraron como tareas de la épica E10 y el frontend se probó contra la rama `development` del backend.

### Convenciones

- Screaming Architecture por módulos y Atomic Design para lo compartido.
- Las páginas no llaman a la API directamente: usan servicios.
- Estilos con Tailwind; textos de la interfaz en castellano.
- Código sin errores de ESLint antes de cada PR.

## Scripts

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo en `http://localhost:5173`, con proxy a la API |
| `npm run lint` | Revisa el código con ESLint |
| `npm run build` | Genera el build de producción en `dist/` |
| `npm run preview` | Sirve el build localmente para revisarlo (no levanta la API ni configura el proxy) |

## Limitaciones conocidas

- **Disponibilidad:** la pantalla admite un rango horario por día. El backend genera turnos solo para el mes en curso, por lo que la disponibilidad del mes siguiente se carga a principio de ese mes.
- **Búsqueda avanzada:** no incluye el "Ver detalle" de cada turno, que según el enunciado no es obligatorio.
- **Estilos:** algunos componentes todavía usan archivos `.css` propios (`AuthLayout`, `Card`, `DataTable` y el listado de especialidades) en lugar de clases de Tailwind.
- **Pruebas:** el frontend no tiene pruebas automatizadas; las funcionalidades se verificaron manualmente contra la API.
- **Despliegue:** el proxy de `/api` es solo de desarrollo. Para publicar el build hay que configurar el servidor para que reenvíe `/api` al backend y devuelva `index.html` en las rutas de React Router.
