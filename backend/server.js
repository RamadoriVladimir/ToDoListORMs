const express = require('express');
const cors = require('cors');
const path = require('path'); // Para manejar rutas de archivos en el servidor
const todoRoutes = require('./routes/todoRoutes');
const { createTodosTable, initializeMongoDB, initializeMySQL } = require('./models/todo');

// Inicializamos la aplicación de Express
const app = express();

// Middleware para habilitar CORS y manejo de JSON
app.use(cors());
app.use(express.json());

// Configuración de la base de datos
const DB_TYPE = process.env.DB_TYPE || 'mysql'; // Cambia entre 'mysql' y 'mongodb' para probar ambas
let db;

if (DB_TYPE === 'mysql') {
    const mysql = require('mysql2/promise');
    db = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'todolist'
    });

    // Inicializar MySQL y crear la tabla
    (async () => {
        try {
            await initializeMySQL(); // Asegúrate de inicializar MySQL
            await createTodosTable(DB_TYPE);
            console.log('OK: Tabla "todos" creada o ya existente en MySQL.');
        } catch (err) {
            console.error('Error al crear la tabla todos en MySQL:', err);
        }
    })();
    
} else if (DB_TYPE === 'mongodb') {
    db = initializeMongoDB(); // Inicializamos MongoDB
}

// Hacemos la conexión a la base de datos accesible en las rutas
app.use((req, res, next) => {
    req.db = db;
    req.dbType = DB_TYPE;
    next();
});

// Servimos archivos estáticos desde la carpeta "frontend"
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Usamos las rutas para las tareas
app.use('/api', todoRoutes);

// Ruta principal para servir el archivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'frontend', 'index.html'));
});

// Escuchamos en el puerto 3000
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});