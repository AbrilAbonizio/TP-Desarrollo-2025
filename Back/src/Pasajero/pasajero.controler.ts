import { Request, Response, NextFunction } from 'express';
import { PasajeroRepository } from './pasajero.repository.js';
import { Pasajero } from './pasajero.entity.js';

const repository = new PasajeroRepository(); // Crea una instancia de la clase CiudadRepository

// Middleware para validar que no se ingresen datos extras
function sanitizedInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    telefono: req.body.telefono,
    direccion: req.body.direccion,
    email: req.body.email,
  };
  // MÁS VALIDACIONES
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });
  next();
}

// Función para obtener una lista de pasajeros
function findAll(req: Request, res: Response) {
  res.json({ data: repository.findAll() });
}

// Función para obtener un pasajero por id
function findOne(req: Request, res: Response) {
  const pasajero = repository.findOne({ id: req.params.id });
  if (!pasajero) {
    return res.status(404).send({ message: 'Pasajero not found' });
  }
  return res.json(pasajero);
}

// Función para agregar un nuevo pasajero
function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput;

  const pasajeroInput = new Pasajero(
    input.nombre,
    input.apellido,
    input.telefono,
    input.direccion,
    input.email
  );

  const pasajero = repository.add(pasajeroInput);
  return res.status(201).send({ message: 'Pasajero created', data: pasajero });
}

// Función para modificar los datos de un pasajero
function update(req: Request, res: Response) {
  req.body.sanitizedInput.id = req.params.id;
  const pasajero = repository.update(req.body.sanitizedInput);
  if (pasajero) {
    return res.status(200).send({
      message: 'Pasajero modified successfully',
      data: pasajero,
    });
  } else {
    return res.status(404).send({ message: 'Pasajero not found' });
  }
}

// Función para eliminar un pasajero
function remove(req: Request, res: Response) {
  const pasajero = repository.delete({ id: req.params.id });
  if (pasajero) {
    res
      .status(200)
      .send({ message: 'Pasajero deleted successfully', data: pasajero });
  } else {
    res.status(404).send({ message: 'Pasajero not found' });
  }
}

export { sanitizedInput, findAll, findOne, add, update, remove };
