import { Request, Response, NextFunction } from 'express';
//import { SolicitudRepository } from './solicitud.repository.js';
import { Solicitud } from './solicitud.entity.js';

//const repository = new SolicitudRepository(); // Crea una instancia de la clase SolicitudRepository

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
 return res.status(500).send({ message: 'Not Implemented'});
}

// Función para obtener una solicitud por id
async function findOne(req: Request, res: Response) {
  return res.status(500).send({ message: 'Not Implemented'});
}

// Función para agregar una nueva solicitud
async function add(req: Request, res: Response) {
  return res.status(500).send({ message: 'Not Implemented'});
}

// Función para modificar los datos de una solicitud
async function update(req: Request, res: Response) {
 return res.status(500).send({ message: 'Not Implemented'});
}

// Función para eliminar una solicitud
async function remove(req: Request, res: Response) {
  return res.status(500).send({ message: 'Not Implemented'});
}

export { sanitizedInput, findAll, findOne, add, update, remove };

