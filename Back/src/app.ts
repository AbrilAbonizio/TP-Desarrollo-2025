import express from 'express';
import { ciudadRouter } from './Ciudad/ciudad.routes.js';
import { pasajeroRouter } from './Pasajero/pasajero.routes.js';

const app = express();

app.use(express.json()); // Middleware para parsear json

app.use('/api/ciudades', ciudadRouter); // Usa ciudadRouter para manejar todas las peticiones que llegan a /api/ciudades
// Va una linea para agregar una nueva CRUD
app.use('/api/pasajeros', pasajeroRouter);

app.use((_, res) => {
  return res.status(404).send({ message: 'Resourse not found' });
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000/');
});
