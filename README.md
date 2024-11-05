##INSTALL NODE:
# installs nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
# download and install Node.js (you may need to restart the terminal)
nvm install 20
# verifies the right Node.js version is in the environment
node -v # should print `v20.17.0`
# verifies the right npm version is in the environment
npm -v # should print `10.8.2`

## Ver por versiones más nuevas:
https://nodejs.org/en/download/package-manage

##CONFIGURE INSTALL
npm init -y
npm install express cors mysql2

##MONGO SERVER UP, AS ROOT USER:
service mongod start

##SERVER UP
node server.js

//Para cada tarea, agregamos dos botones:
//Eliminar: Un botón rojo que, al hacer clic, envía una solicitud DELETE al backend y elimina la tarea.
//Completar/Activar: Dependiendo del estado de la tarea (si está completada o no), este botón mostrará "Completar" o "Activar", y cambiará el estado de la tarea de false a true (o viceversa).
//El botón de completar marcará la tarea como completada y aplicará el estilo tachado, mientras que el de activar quitará el estilo tachado.

Cambios en el controlador:
Uso de req.db: En lugar de interactuar directamente con Mongoose, ahora usamos el pool de conexión de MySQL (req.db) para pasar la conexión a las funciones del modelo.
Funciones del modelo: Reemplazamos las funciones de Mongoose (find(), findByIdAndUpdate(), etc.) por las funciones que definimos en models/todo.js (getAllTodos, createTodo, updateTodo, deleteTodo).
Manejo de respuestas: Después de cada operación, devolvemos la respuesta adecuada. Si la tarea no existe o no se encuentra, devolvemos un estado 404 con un mensaje.
Con estas modificaciones, tu controlador todoController.js ahora estará adaptado para funcionar con el modelo de MySQL.
