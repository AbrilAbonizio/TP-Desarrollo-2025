import { Request, Response, NextFunction } from 'express';
import { SolicitudRepository } from './solicitud.repository.js';
import { Solicitud } from './solicitud.entity.js';

const repository = new SolicitudRepository(); // Crea una instancia de la clase SolicitudRepository

// Middleware para validar que no se ingresen datos extras
function sanitizedInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    estado: req.body.estado,
    fechaSolicitud: req.body.fechaSolicitud,
    idPasajero: req.body.idPasajero,
    idViaje: req.body.idViaje
  };
  // MÁS VALIDACIONES
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });
  next();
}

// Función para obtener una lista de solicitudes
async function findAll(req: Request, res: Response) {
  res.json({ data: await repository.findAll() });
}

// Función para obtener una solicitud por id
async function findOne(req: Request, res: Response) {
  const solicitud = await repository.findOne({ id: req.params.id });
  if (!solicitud) {
    return res.status(404).send({ message: 'Solicitud not found' });
  }
  return res.json(solicitud);
}

// Función para agregar una nueva solicitud
async function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput;

  const solicitudInput = new Solicitud(
    input.idPasajero, 
    input.idViaje, 
    input.estado, 
    input.fechaSolicitud);

  const solicitud = await repository.add(solicitudInput);
  return res.status(201).send({ message: 'Solicitud created', data: solicitud });
}

// Función para modificar los datos de una solicitud
async function update(req: Request, res: Response) {
  req.body.sanitizedInput.id = req.params.id;
  const solicitud = await repository.update(req.body.sanitizedInput.id, req.body.sanitizedInput);
  if (solicitud) {
    return res.status(200).send({message: 'Solicitud modified successfully',data: solicitud,});
  } else {
    return res.status(404).send({ message: 'Solicitud not found' });
  }
}

// Función para eliminar una solicitud
async function remove(req: Request, res: Response) {
  const solicitud = await repository.delete({ id: req.params.id });
  if (solicitud) {
    res.status(200).send({ message: 'Solicitud deleted successfully', data: solicitud });
  } else {
    res.status(404).send({ message: 'Solicitud not found' });
  }
}

export { sanitizedInput, findAll, findOne, add, update, remove };

