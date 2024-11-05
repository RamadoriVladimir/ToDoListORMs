const Todo = require('../models/todo');

exports.getTasks = async (req, res) => {
    try {
        const todos = await Todo.getAllTodos(req.db, req.dbType);
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las tareas' });
    }
};

exports.createTask = async (req, res) => {
    const { task } = req.body;
    try {
        const newTodoId = await Todo.createTodo(req.db, req.dbType, task);
        res.status(201).json({ id: newTodoId, task, completed: false });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la tarea' });
    }
};

exports.completeTask = async (req, res) => {
    const id = req.params.id;
    try {
        const affectedRows = await Todo.updateTodo(req.db, req.dbType, id, true);
        if (affectedRows > 0) {
            res.status(200).json({ id, completed: true });
        } else {
            res.status(404).json({ message: 'Tarea no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la tarea' });
    }
};

exports.activateTask = async (req, res) => {
    const id = req.params.id;
    try {
        const affectedRows = await Todo.updateTodo(req.db, req.dbType, id, false);
        if (affectedRows > 0) {
            res.status(200).json({ id, completed: false });
        } else {
            res.status(404).json({ message: 'Tarea no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la tarea' });
    }
};

exports.deleteTask = async (req, res) => {
    const id = req.params.id;
    try {
        const affectedRows = await Todo.deleteTodo(req.db, req.dbType, id);
        if (affectedRows > 0) {
            res.status(200).json({ message: 'Tarea eliminada' });
        } else {
            res.status(404).json({ message: 'Tarea no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la tarea' });
    }
};
