# Plataforma Financiera

Este proyecto es una plataforma financiera construida con Node.js, Express y MongoDB. La aplicación permite a los usuarios registrarse, iniciar sesión y acceder a un dashboard.

## Requisitos

- Node.js
- npm (Node Package Manager)
- MongoDB

## Instalación

1. Clona este repositorio:

    ```bash
    git clone https://github.com/tuusuario/plataforma-financiera.git
    cd plataforma-financiera
    ```

2. Navega al directorio del proyecto:
   
    ```bash
    cd finance-platform
    ```

3. Instala las dependencias:

    ```bash
    npm install
    ```

4. Configura las variables de entorno:

   Crea un archivo `.env` en la raíz del proyecto y añade las siguientes variables:

    ```env
    MONGO_URI=mongodb+srv://prueba:Prueba1432XD@cluster0.ix6spj2.mongodb.net/FinanceDataPlatform?retryWrites=true&w=majority&appName=Cluster0
    ```

## Uso

1. Inicia el servidor:

    ```bash
    node src/main.js
    ```

2. Abre tu navegador y navega a `http://localhost:3000` para ver la aplicación.

