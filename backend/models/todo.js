// Dependencias ORM
const { Sequelize, DataTypes } = require('sequelize');
const mongoose = require('mongoose');

// Conexión a MySQL con Sequelize
let sequelize;
const initializeMySQL = async () => {
    sequelize = new Sequelize('todolist', 'root', '', {
        host: 'localhost',
        dialect: 'mysql'
    });

    try {
        // Probar la conexión
        await sequelize.authenticate();
        console.log('Conexión a MySQL establecida correctamente.');
    } catch (error) {
        console.error('No se pudo conectar a MySQL:', error);
    }

    // Definición del modelo MySQL usando Sequelize
    const TodoSQL = sequelize.define('Todo', {
        task: { type: DataTypes.STRING, allowNull: false },
        completed: { type: DataTypes.BOOLEAN, defaultValue: false }
    }, { timestamps: false });

    // Sincronizar modelos con la base de datos
    await sequelize.sync(); // Esto crea las tablas si no existen
};

// Conexión a MongoDB con Mongoose
const initializeMongoDB = () => {
    mongoose.connect('mongodb://localhost/todolist', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
};

// Definición del modelo MongoDB usando Mongoose
const TodoMongo = mongoose.model('Todo', new mongoose.Schema({
    task: String,
    completed: { type: Boolean, default: false }
}));

// Métodos para MySQL y MongoDB
const createTodosTable = async (db, dbType) => {
    if (dbType === 'mysql') {
        try {
            await TodoSQL.sync(); // Sincroniza el modelo con la base de datos
            console.log('Tabla "Todo" creada o ya existente en MySQL.');
        } catch (err) {
            console.error('Error al crear la tabla "Todo":', err);
        }
    }
};

// Obtener todas las tareas
const getAllTodos = async (db, dbType) => {
    return dbType === 'mysql' ? TodoSQL.findAll() : TodoMongo.find();
};

// Crear una nueva tarea
const createTodo = async (db, dbType, task) => {
    const todo = dbType === 'mysql' ? await TodoSQL.create({ task }) : await TodoMongo.create({ task });
    return todo.id || todo._id;
};

// Actualizar el estado de una tarea
const updateTodo = async (db, dbType, id, completed) => {
    if (dbType === 'mysql') {
        const [affectedRows] = await TodoSQL.update({ completed }, { where: { id } });
        return affectedRows;
    } else {
        const result = await TodoMongo.updateOne({ _id: id }, { completed });
        return result.modifiedCount;
    }
};

// Eliminar una tarea
const deleteTodo = async (db, dbType, id) => {
    if (dbType === 'mysql') {
        return await TodoSQL.destroy({ where: { id } });
    } else {
        return await TodoMongo.deleteOne({ _id: id });
    }
};

// Exportamos funciones
module.exports = {
    initializeMySQL,
    initializeMongoDB,
    createTodosTable,
    getAllTodos,
    createTodo,
    updateTodo,
    deleteTodo
};
