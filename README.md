# Chat Corporativo en Tiempo Real

Plataforma de mensajería interna con arquitectura Monorepo gestionada por **NPM Workspaces**.

## Estructura del Monorepo

* **`server/`**: Backend en Node.js, Express y Socket.IO. Sigue una arquitectura en capas (`controllers`, `services`, `models`, `sockets`) para separar la lógica de negocio del transporte de datos. PostgreSQL como base de datos y JWT para seguridad.
* **`client/`**: Frontend Single Page Application (SPA) en React compilado con Vite. Utiliza Context API para la gestión global de Sockets y Autenticación de sesiones.

## Requisitos Previos
Asegúrate de tener instalados en tu sistema:
- **Node.js** (v20.x o superior)
- **PostgreSQL** (v14 o superior)

## Variables de Entorno (`.env`)
El servidor requiere un archivo `.env` en la ruta `server/.env`. Puedes guiarte del archivo `.env.example` si existe, o crear uno nuevo con las siguientes variables obligatorias:
```env
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
DB_USER=postgres
DB_PASSWORD=tu_contraseña
DB_HOST=localhost
DB_PORT=5432
DB_NAME=corp_chat_app
JWT_SECRET=super_secret_jwt_key
JWT_EXPIRES_IN=24h
```

## Configuración y Arranque Inicial

1. **Instalar dependencias globales** (desde la raíz del proyecto):
   ```bash
   npm install
   ```
2. **Configurar el entorno del Servidor**:
   - Crea un archivo `.env` en la ruta `server/.env` basándote en las variables descritas arriba y ajusta credenciales de PostgreSQL.
3. **Iniciar en modo desarrollo**:
   ```bash
   npm run dev
   ```
   *Este comando inicia simultáneamente el backend en el puerto 3000 y el cliente en el puerto 5173.*

## Scripts Disponibles (Raíz)
- `npm run dev`: Inicia ambos proyectos en desarrollo.
- `npm run test:server`: Ejecuta los tests unitarios e integrados del backend.
- `npm run lint`: Ejecuta el linter en todos los sub-paquetes.

## Base de Datos (Primeros Pasos)
Si clonas este proyecto en un equipo nuevo, debes inicializar la base de datos PostgreSQL para que el login y el chat funcionen sin errores.

Para hacerlo automáticamente en Windows, solo **dale doble clic** al archivo `setup_db.bat` ubicado en la raíz del proyecto, o ejecútalo desde tu terminal:
```cmd
setup_db.bat
```
*(Este script creará la base de datos `corp_chat_app` y ejecutará las consultas necesarias desde `server/init_db.sql` para crear las tablas y los usuarios).*

*Usuarios de prueba generados por el script:*
- `admin` (Contraseña: `admin123`)
- `johndoe` (Contraseña: `password123`)
- `janesmith` (Contraseña: `password123`)
- `bob` (Contraseña: `password123`)

## ¿Cómo probar el Chat en Local?
Para probar la comunicación en tiempo real entre múltiples personas en tu misma computadora:

1. **Usuario A**: Abre tu navegador habitual (ej. Chrome) y ve a `http://localhost:5173`. Inicia sesión con `admin`.
2. **Usuario B**: Abre una nueva **Ventana de Incógnito** (o un navegador distinto) y ve a `http://localhost:5173`. Inicia sesión con `johndoe`.
3. Al tener ventanas separadas, la aplicación registrará dos conexiones Socket.IO diferentes. Podrás ver en tiempo real cómo los usuarios aparecen "En línea" en la barra lateral y los mensajes se transmiten instantáneamente entre ambos clientes.


