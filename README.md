# MedPortal - DSW TFI Frontend

Frontend del sistema de turnos médicos, desarrollado con React.

## Desarrollo local

Desde la raíz del proyecto, en PowerShell:

```powershell
npm.cmd install
npm.cmd run dev
```

Abrí la dirección que indique la terminal.

## Pantallas disponibles

- `/paciente/login`: acceso del paciente con email y DNI.
- `/admin/login`: acceso del administrador con email y contraseña.
- `/`: redirige al acceso del paciente.

Ambos formularios usan React Hook Form y el componente compartido Input.
Actualmente validan los datos de forma local; todavía no realizan el inicio de sesión contra la API.

## Organización

- `src/modules/auth`: páginas, formularios y servicios de autenticación.
- `src/modules/shared/components`: componentes reutilizables, como Card e Input.
- `src/index.css`: reglas globales básicas.
- `src/App.css`: base del contenedor de la aplicación.

## Verificaciones

```powershell
npm.cmd run lint
npm.cmd run build
```

Los estilos específicos de cada pantalla permanecen junto a sus componentes.
