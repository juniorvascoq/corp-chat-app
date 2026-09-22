# Chat Corporativo en Tiempo Real

Plataforma de mensajería interna con arquitectura Monorepo gestionada por **NPM Workspaces** y una aplicación móvil en **Flutter**.

## Estructura del Monorepo

* **`server/`**: Backend en Node.js, Express y Socket.IO. Sigue una arquitectura en capas (`controllers`, `services`, `models`, `sockets`) para separar la lógica de negocio del transporte de datos. PostgreSQL como base de datos y JWT para seguridad.
* **`client/`**: Frontend Single Page Application (SPA) en React compilado con Vite. Utiliza Context API para la gestión global de Sockets y Autenticación de sesiones.
* **`mobile/`**: Aplicación móvil multiplataforma desarrollada en Flutter. Se conecta al mismo backend para chat en tiempo real y catálogo.

## Requisitos Previos
Asegúrate de tener instalados en tu sistema:
- **Node.js** (v20.x o superior)
- **PostgreSQL** (v14 o superior)
- **Flutter SDK** (Para ejecutar la app móvil, preferiblemente v3.4+ con Android Studio)

## 1. Configuración del Servidor y Base de Datos

1. **Instalar dependencias globales** (desde la raíz del proyecto):
   ```bash
   npm install
   ```

2. **Base de Datos**:
   Si clonas este proyecto en un equipo nuevo, debes inicializar la base de datos PostgreSQL.
   - En **Windows**: Dale doble clic al archivo `setup_db.bat` o ejecútalo desde tu terminal.
   - En **macOS/Linux**: Ejecuta el script `./setup_db.sh` en tu terminal.
   *(Estos scripts crearán la DB `corp_chat_app` y las tablas necesarias).*

3. **Variables de Entorno (`.env`)**:
   En la carpeta `server/`, renombra o copia el archivo `server/.env.example` a `server/.env` y ajusta las credenciales de PostgreSQL si tienes una contraseña distinta.

4. **Iniciar en modo desarrollo**:
   Desde la raíz del proyecto ejecuta:
   ```bash
   npm run dev
   ```
   *Este comando inicia simultáneamente el backend en el puerto 3000 y el cliente React en el puerto 5173.*

## 2. Aplicación Móvil (Flutter)

La aplicación móvil está lista para compilar en emuladores o dispositivos físicos.

1. Navega a la carpeta `mobile`:
   ```bash
   cd mobile
   flutter pub get
   ```
2. **Configuración de Red (IMPORTANTE)**:
   Abre el archivo `mobile/lib/config.dart`.
   - Si pruebas en **Chrome Web** o **Emulador iOS**, deja la IP como `localhost`.
   - Si pruebas en **Emulador Android**, cambia la IP a `10.0.2.2`.
   - Si pruebas en un **Dispositivo Físico**, cambia la IP a la IP de tu computadora en tu red Wi-Fi (ej. `192.168.1.15`).

3. Ejecuta la aplicación:
   ```bash
   flutter run
   ```

## Usuarios de Prueba
Al correr los scripts de base de datos se generan estos usuarios por defecto para que pruebes el sistema (Contraseña general: `password123` excepto el admin):
- `admin` (Contraseña: `admin123`)
- `johndoe`
- `janesmith`
- `bob`


