import express from 'express';
import { ciudadRouter } from './Ciudad/ciudad.routes.js';
import { pasajeroRouter } from './Pasajero/pasajero.routes.js';
import { categoriaRouter } from './Categoria/categoria.routes.js';
import { viajeRouter } from './Viaje/viaje.routes.js';
import { solicitudRouter } from './Solicitud/solicitud.routes.js';

const app = express();

app.use(express.json()); // Middleware para parsear json

app.use('/api/ciudades', ciudadRouter); // Usa ciudadRouter para manejar todas las peticiones que llegan a /api/ciudades
app.use('/api/categorias', categoriaRouter); // Usa categoriaRouter para manejar todas las peticiones que llegan a /api/categorias
app.use('/api/viajes', viajeRouter); // Usa viajesRouter para manejar todas las peticiones que llegan a /api/viajes
app.use('/api/pasajeros', pasajeroRouter); // Usa pasajeroRouter para manejar todas las peticiones que llegan a /api/pasajeros
app.use('/api/solicitudes', solicitudRouter); // Usa solicitudRouter para manejar todas las peticiones que llegan a /api/solicitudes

app.use((_, res) => {
  return res.status(404).send({ message: 'RECURSO NO ENCONTRADO' });
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000/');
});
