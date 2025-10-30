# Documentación del Proyecto 

GoTogether es una plataforma web colaborativa donde los usuarios pueden organizar o unirse a viajes grupales para compartir gastos (transporte, alojamiento y actividades).
El objetivo es reducir costos conectando personas con destinos y fechas similares.


## Tecnologías Utilizadas 

- Backend: 
  Node.js 
  Express
  TypeScript
  MySQL
  Docker

  
- Frontend:
  Framework: React + Vite
  Lenguaje: TypeScript
  Estilos: CSS, Bootstrap, Bootswatch


# Requisitos Previos
  Node.js version >= 20.x
  Gestor de paquetes: pnpm
  Control de versiones: Git + GitHub
  Instalación local de MySQL (Docker, MySQL Workbench, XAMPP)


## Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/AbrilAbonizio/TP-Desarrollo-2025.git
  cd TP-Desarrollo-2025


## Backend

2. Abrir PowerShell y entrar a la carpeta Back
  ```bash
  cd .\Back


3. Instalar dependencias
  ```bash
  pnpm install


## 4. Iniciar la base de datos MySQL 

# Opción 1: Con Docker
  
  Desde la carpeta Back (donde está docker-compose.yml)
  ```bash
  docker-compose up -d
  ``` 
  

# Opción 2: Sin Docker (MySQL local)

  Instalar MySQL o MariaDB en tu computadora.

  Crear la base de datos que usará el proyecto, por ejemplo:
    ```bash
    CREATE DATABASE dsw;
    ´´´



5. Configurar las variables de entorno 
Crear un archivo .env dentro de la carpeta /Back con las siguientes variables:

# Si usas Docker
    ```bash
    DB_HOST=localhost 
    DB_USER=dsw
    DB_PASSWORD=dsw
    DB_NAME=dsw
    DB_PORT=3306
    PORT=3000
 ``` 

# Si usas MySQL Local
  ```bash
  DB_HOST=localhost
  DB_USER=root
  DB_PASSWORD=dsw
  DB_NAME=dsw
  DB_PORT=3306
  PORT=3000
 ``` 


6. Ejecutar el backend en modo desarrollo
  ```bash
  pnpm run dev
  # o
  pnpm run start:dev
  ```  


Esto compila TypeScript con tsc-watch y ejecuta node ./dist/app.js cuando compila correctamente.
La API quedará disponible en: http://localhost:3000


## Frontnd

1. Entrar al proyecto del front
  ```bash
  cd ..\Front\api-front


2. Instalar dependencias
  ```bash
  pnpm install


3. Iniciar server de desarrollo
  ```bash
  pnpm run dev

Por defecto sirve en http://localhost:5173 (revisar consola para puerto exacto).



### Estructura del Proyecto

Backend 
src: Contiene la lógica del servidor
Categoría: Contiene los componentes, servicios e interfaces de la aplicación
Pasajero: Contiene los componentes, servicios e interfaces de la aplicación
Ciudad: Contiene los componentes, servicios e interfaces de la aplicación
Solicitud: Contiene los componentes, servicios e interfaces de la aplicación
Viaje: Contiene los componentes, servicios e interfaces de la aplicación


Frontend
public: Archivos estáticos, como imágenes
src: Contiene los componentes, servicios e interfaces de la aplicación
components: Componentes como navbar, card, formularios, etc
pages: Diferentes páginas de la aplicación
services: Servicios para interactuar con la API del BackEnd