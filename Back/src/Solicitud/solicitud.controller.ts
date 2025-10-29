import { Request, Response, NextFunction } from 'express';
import { Solicitud } from './solicitud.entity.js';
import { Pasajero } from '../Pasajero/pasajero.entity.js';
import { Viaje } from '../Viaje/viaje.entity.js';
import {orm} from '../shared/orm.js';
import { NotFoundError } from '@mikro-orm/core';


const em = orm.em;

// Middleware para validar que no se ingresen datos extras
function sanitizedInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    estado: req.body.estado,
    fechaSolicitud: new Date(req.body.fechaSolicitud),
    idPasajero: req.params.idPasajero || req.body.idPasajero,
    idViaje: req.params.idViaje || req.body.idViaje
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
  try{
    const solicitudes = await em.find(Solicitud, {}, {populate: ['pasajero', 'viaje', 'viaje.ciudad', 'viaje.categorias', 'viaje.organizador']})
    res.status(200).json({message: 'found all solicitudes', data: solicitudes})
  }
  catch(error: any){
    return res.status(500).send({ message: error.message });
  }
}

// Función para obtener una solicitud por id
async function findOne(req: Request, res: Response) {
  try{
    const pasajero = Number.parseInt(req.params.idPasajero);
    const viaje = Number.parseInt(req.params.idViaje);
    const solicitud = await em.findOneOrFail(Solicitud, { pasajero, viaje }, {populate: ['pasajero', 'viaje', 'viaje.ciudad', 'viaje.categorias', 'viaje.organizador']});
    res.status(200).json({message: 'Found Solicitud', data: solicitud})
  }
  catch(error: any){
    if (error instanceof NotFoundError){
      return res.status(404).json({message: "Solicitud not found"});
    }
    return res.status(500).send({ message: error.message});
  }
}

// Función para agregar una nueva solicitud
async function add(req: Request, res: Response) {
  try{
    const { fechaSolicitud, idPasajero, idViaje } = req.body.sanitizedInput;
    const estado = 'Pendiente';

    const pasajero = em.getReference(Pasajero, Number.parseInt(idPasajero));
    const viaje = await em.findOneOrFail(Viaje, Number.parseInt(idViaje), {populate: ['solicitudes']});

    // Validacion que no haya una solicitud creada para el mismo viaje y mismo pasajero
    const solicitudExistente = await em.findOne(Solicitud, { pasajero, viaje });
    if (solicitudExistente) {
      return res.status(409).json({ message: 'Solicitud ya existe para este pasajero y viaje' });
    }

    // Validar si hay cupo para hacer la inscripcion
    const solicitudes = viaje.solicitudes.filter((solicitud) => solicitud.estado === 'Aceptada');
    const cupoDisponible = viaje.cupos - solicitudes.length;
    if (cupoDisponible === 0){
      return res.status(409).json({message: "Cupo de viaje completo"});
    }

    const solicitud = em.create(Solicitud, { pasajero, viaje, fechaSolicitud, estado });
    await em.flush();

    return res.status(201).json({ message: 'Solicitud created', data: solicitud });
  } 
  catch(error: any){
    // Si create() no encuentra el pasajero o el viaje lanza error
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(404).json({ message: 'Pasajero o Viaje not found'});
    }

    return res.status(500).send({ message: error.message});
  }
}

// Función para modificar los datos de una solicitud
async function update(req: Request, res: Response) {
  try{
    const pasajero = Number.parseInt(req.params.idPasajero);
    const viaje = Number.parseInt(req.params.idViaje);

    const solicitud = await em.findOneOrFail(Solicitud, { pasajero, viaje }, {populate: ['pasajero', 'viaje', 'viaje.ciudad', 'viaje.categorias', 'viaje.organizador']});
    em.assign(solicitud, req.body.sanitizedInput);
     
    await em.flush();
    res.status(200).json({message: 'Solicitud updated', data: solicitud})
   }
   catch(error: any){
    if (error instanceof NotFoundError){
      // Para saber cual id es el que falla tengo que buscar el pasajero Y el viaje
      // en la BD para despues verificarlo
      return res.status(404).json({message: "Solicitud not found"});
    }
     return res.status(500).send({ message: error.message});
   }
}

// Función para eliminar una solicitud
async function remove(req: Request, res: Response) {
  try{
    const pasajero = Number.parseInt(req.params.idPasajero);
    const viaje = Number.parseInt(req.params.idViaje);
    
    const solicitud = await em.findOneOrFail(Solicitud, { pasajero, viaje} );
    await em.removeAndFlush(solicitud);
    res.status(200).json({message: 'Solicitud deleted successfully', data: solicitud});
  }
  catch(error: any){
    if (error instanceof NotFoundError){
      return res.status(404).json({message: "Solicitud not found"});
    }
    return res.status(500).send({ message: error.message});
  }
}

export { sanitizedInput, findAll, findOne, add, update, remove };

