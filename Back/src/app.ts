<<<<<<< Updated upstream
import express, { NextFunction, Request, Response } from 'express';
import { ciudadRouter } from './Ciudad/ciudad.routes.js';
=======
import express from 'express';
import { ciudadRouter } from './Ciudad/ciudad.routes.js';
import { categoriaRouter } from './Categoria/categoria.routes.js';
import { viajeRouter } from './Viaje/viaje.routes.js';
>>>>>>> Stashed changes

const app = express();

app.use(express.json()); // Middleware para parsear json

app.use('/api/ciudades', ciudadRouter); // Usa ciudadRouter para manejar todas las peticiones que llegan a /api/ciudades
// Va una linea para agregar una nueva CRUD
<<<<<<< Updated upstream

app.use((_, res) => {
  return res.status(404).send({ message: 'Resourse not found' });
=======
app.use('/api/categorias', categoriaRouter); // Usa categoriaRouter para manejar todas las peticiones que llegan a /api/categorias
app.use('/api/viajes', viajeRouter); // Usa categoriaRouter para manejar todas las peticiones que llegan a /api/categorias

app.use((_, res) => {
  return res.status(404).send({ message: 'RECURSO NO ENCONTRADO' });
>>>>>>> Stashed changes
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000/');
});
