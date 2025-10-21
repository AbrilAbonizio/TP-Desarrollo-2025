/*import { Request, Response, NextFunction } from 'express';
import { CiudadRepository } from './ciudad.repository.js';
import { Ciudad } from './ciudad.entity.js';

const repository = new CiudadRepository(); // Crea una instancia de la clase CiudadRepository

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
function findAll(req: Request, res: Response) {
  res.json({ data: repository.findAll() });
}

// Función para obtener una ciudad por id
function findOne(req: Request, res: Response) {
  const ciudad = repository.findOne({ id: req.params.id });
  if (!ciudad) {
    return res.status(404).send({ message: 'Ciudad not found' });
  }
  return res.json(ciudad);
}

// Función para agregar una nueva ciudad
function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput;

  const ciudadInput = new Ciudad(
    input.nombre,
    input.provincia,
    input.latitud,
    input.longitud
  );

  const ciudad = repository.add(ciudadInput);
  return res.status(201).send({ message: 'Ciudad created', data: ciudad });
}

// Función para modificar los datos de una ciudad
function update(req: Request, res: Response) {
  req.body.sanitizedInput.id = req.params.id;
  const ciudad = repository.update(req.body.sanitizedInput);
  if (ciudad) {
    return res.status(200).send({
      message: 'Ciudad modified successfully',
      data: ciudad,
    });
  } else {
    return res.status(404).send({ message: 'Ciudad not found' });
  }
}

// Función para eliminar una ciudad
function remove(req: Request, res: Response) {
  const ciudad = repository.delete({ id: req.params.id });
  if (ciudad) {
    res
      .status(200)
      .send({ message: 'Ciudad deleted successfully', data: ciudad });
  } else {
    res.status(404).send({ message: 'Ciudad not found' });
  }
}

export { sanitizedInput, findAll, findOne, add, update, remove };
*/
