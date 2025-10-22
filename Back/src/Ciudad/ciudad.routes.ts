import { Router } from 'express';
import {
  sanitizedInput,
  findAll,
  findOne,
  add,
  update,
  remove,
} from './ciudad.controler.js';

export const ciudadRouter = Router();

ciudadRouter.get('/', findAll); // Ruta para obtener una lista de ciudades
ciudadRouter.get('/:id', findOne); // Ruta para obtener una ciudad por id
ciudadRouter.post('/', sanitizedInput, add); // Ruta para agregar una ciudad
ciudadRouter.put('/:id', sanitizedInput, update); // Ruta para modificar una ciudad
ciudadRouter.patch('/:id', sanitizedInput, update); // Ruta para modificar una ciudad
ciudadRouter.delete('/:id', remove); // Ruta para eliminar una ciudad
