/*import { Request, Response, NextFunction } from 'express';
import { ViajeRepository } from "./viaje.repository.js";
import { Viaje } from './viaje.entity.js';

const repository = new ViajeRepository(); // Crea una instancia de la clase ViajeRepository

// Middleware para validar que no se ingresen datos extras
function sanitizedInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    fechaSalida: req.body.fechaSalida,
    fechaLlegada: req.body.fechaLlegada,
    estado: req.body.estado,
    cupos: req.body.cupos,
    costoEstimado: req.body.costoEstimado,
    cupoDisponible: req.body.cupoDisponible,
    total: req.body.total,
    totalPorPersona: req.body.totalPorPersona,
    descripcionVehiculo: req.body.descripcionVehiculo,
  };
  // MÁS VALIDACIONES
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });
  next();
}

// Función para obtener una lista de viajes
function findAll(req: Request, res: Response) {
  res.json({ data: repository.findAll() });
}

// Función para obtener un viaje por id
function findOne(req: Request, res: Response) {
  const viaje = repository.findOne({ id: req.params.id });
  if (!viaje) {
    return res.status(404).send({ message: 'Viaje not found' });
  }
  return res.json(viaje);
}

// Función para agregar un nuevo viaje
function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput;
  const viajeInput = new Viaje(
    0, // El ID será ignorado y generado automáticamente en el repositorio
    new Date(input.fechaSalida),
    new Date(input.fechaLlegada),
    input.estado,
    input.cupos,
    input.costoEstimado,
    input.cupoDisponible,
    input.total,
    input.totalPorPersona,
    input.descripcionVehiculo
  );
  const viaje = repository.add(viajeInput);
  return res.status(201).send({ message: 'Viaje created', data: viaje });
}

// Función para modificar los datos de un viaje
function update(req: Request, res: Response) {
  req.body.sanitizedInput.idViaje = parseInt(req.params.id);
  if (req.body.sanitizedInput.fechaSalida) {
    req.body.sanitizedInput.fechaSalida = new Date(
      req.body.sanitizedInput.fechaSalida
    );
  }

  if (req.body.sanitizedInput.fechaLlegada) {
    req.body.sanitizedInput.fechaLlegada = new Date(
      req.body.sanitizedInput.fechaLlegada
    );
  }
  const viaje = repository.update(req.body.sanitizedInput);

  if (viaje) {
    return res.status(200).send({
      message: 'Viaje modified successfully',

      data: viaje,
    });
  } else {
    return res.status(404).send({ message: 'Viaje not found' });
  }
}

// Función para eliminar un viaje
function remove(req: Request, res: Response) {
  const viaje = repository.delete({ id: req.params.id });
  if (viaje) {
    res
      .status(200)
      .send({ message: 'Viaje deleted successfully', data: viaje });
  } else {
    res.status(404).send({ message: 'Viaje not found' });
  }
}

export { sanitizedInput, findAll, findOne, add, update, remove };
*/
