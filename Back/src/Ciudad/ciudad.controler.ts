import { Request, Response, NextFunction } from 'express';
//import { CiudadRepository } from './ciudad.repository.js';
import { Ciudad } from './ciudad.entity.js';

//const repository = new CiudadRepository(); // Crea una instancia de la clase CiudadRepository

// Middleware para validar que no se ingresen datos extras
function sanitizedInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    nombre: req.body.nombre,
    provincia: req.body.provincia,
    latitud: req.body.latitud,
    longitud: req.body.longitud,
  };
  // MÁS VALIDACIONES
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });
  next();
}

// Función para obtener una lista de ciudades
async function findAll(req: Request, res: Response) {
  return res.status(500).send({ message: 'Not Implemented'});
}

// Función para obtener una ciudad por id
async function findOne(req: Request, res: Response) {
  return res.status(500).send({ message: 'Not Implemented'});
}

// Función para agregar una nueva ciudad
async function add(req: Request, res: Response) {
  return res.status(500).send({ message: 'Not Implemented'});
}

// Función para modificar los datos de una ciudad
async function update(req: Request, res: Response) {
 return res.status(500).send({ message: 'Not Implemented'});
}

// Función para eliminar una ciudad
async function remove(req: Request, res: Response) {
  return res.status(500).send({ message: 'Not Implemented'});
}

export { sanitizedInput, findAll, findOne, add, update, remove };

