import { Router } from 'express';
import {
  sanitizedInput,
  findAll,
  findOne,
  add,
  update,
  remove,
} from './pasajero.controller.js';



export const pasajeroRouter = Router();

pasajeroRouter.get('/', findAll); // Ruta para obtener una lista de pasajeros
pasajeroRouter.get('/:id', findOne); // Ruta para obtener un pasajero por id
pasajeroRouter.post('/', sanitizedInput, add); // Ruta para agregar un pasajero
pasajeroRouter.put('/:id', sanitizedInput, update); // Ruta para modificar un pasajero
pasajeroRouter.patch('/:id', sanitizedInput, update); // Ruta para modificar un pasajero
pasajeroRouter.delete('/:id', remove); // Ruta para eliminar un pasajero
