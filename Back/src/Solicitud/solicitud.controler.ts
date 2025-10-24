import { Request, Response, NextFunction } from 'express';
import { Solicitud } from './solicitud.entity.js';
import { Pasajero } from '../Pasajero/pasajero.entity.js';
import { Viaje } from '../Viaje/viaje.entity.js';
import {orm} from '../shared/orm.js';

const em = orm.em;

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
  try{
     const solicitudes = await em.find(Solicitud, {}, {populate: ['pasajero', 'viaje', 'viaje.ciudad']})
     res.status(200).json({message: 'found all solicitudes', data: solicitudes})
   }
   catch(error: any){
     return res.status(500).send({ message: error.message });
   }
}

// Función para obtener una solicitud por id
async function findOne(req: Request, res: Response) {
    const { idPasajero: idPasajeroParam, idViaje: idViajeParam } = req.params;

    // Validación para sólo dígitos
    if (!/^\d+$/.test(idPasajeroParam) || !/^\d+$/.test(idViajeParam)) {
      return res.status(400).json({ message: 'IDs inválidos' });
    }

    const idPasajero = Number(idPasajeroParam);
    const idViaje = Number(idViajeParam);
    
    try{
      const pasajero = em.getReference(Pasajero, idPasajero);
      const viaje = em.getReference(Viaje, idViaje);
      const solicitud = await em.findOne(Solicitud, { pasajero, viaje }, {populate: ['pasajero', 'viaje', 'viaje.ciudad']});
      
      if (!solicitud) {
        return res.status(404).send({ message: 'Solicitud not found' });
      }
      
      res.status(200).json({message: 'found solicitud', data: solicitud})
    }
    catch(error: any){
      return res.status(500).send({ message: error.message});
    }
}

// Función para agregar una nueva solicitud
async function add(req: Request, res: Response) {
  try{
      const {idPasajero: idPasajeroBody, idViaje: idViajeBody, estado, fechaSolicitud} = req.body.sanitizedInput;

      if (!/^\d+$/.test(idPasajeroBody) || !/^\d+$/.test(idViajeBody)) {
        return res.status(400).json({ message: 'IDs inválidos' });
      }

      const idPasajero = Number(idPasajeroBody);
      const idViaje = Number(idViajeBody);

      const pasajero = em.getReference(Pasajero, idPasajero)
      const viaje = em.getReference(Viaje, idViaje)

      const solicitud = em.create(Solicitud,{pasajero, viaje, estado, fechaSolicitud: new Date(fechaSolicitud)});
      await em.flush(); 
      res.status(201).json({message: 'Solicitud created', data: solicitud})
    }
    catch(error: any){
      return res.status(500).send({ message: error.message});
    }
}

// Función para modificar los datos de una solicitud
async function update(req: Request, res: Response) {
  try{
     const { idPasajero: idPasajeroParam, idViaje: idViajeParam } = req.params;
     
     if (!/^\d+$/.test(idPasajeroParam) || !/^\d+$/.test(idViajeParam)) {
       return res.status(400).send({ message: 'Invalid IDs' });
     }

     const idPasajero = Number(idPasajeroParam);
     const idViaje = Number(idViajeParam);

     //Usa las relaciones de la entidad, no los nombres de las columnas de la base de datos
     const pasajero = em.getReference(Pasajero, idPasajero);
     const viaje = em.getReference(Viaje, idViaje);
     
     const solicitud = await em.findOne(Solicitud, { pasajero, viaje });
     
     if (!solicitud) {
       return res.status(404).send({ message: 'Solicitud not found' });
     }
     
     // Solo actualizar campos permitidos (estado y fechaSolicitud)
     //if (req.body.sanitizedInput.estado) {
       //solicitud.estado = req.body.sanitizedInput.estado;
     //}
     //if (req.body.sanitizedInput.fechaSolicitud) {
       //solicitud.fechaSolicitud = new Date(req.body.sanitizedInput.fechaSolicitud);
     //}
     
     await em.flush();
     res.status(200).json({message: 'Solicitud updated', data: solicitud})
   }
   catch(error: any){
     return res.status(500).send({ message: error.message});
   }
}

// Función para eliminar una solicitud
async function remove(req: Request, res: Response) {
  try{
    const { idPasajero: idPasajeroParam, idViaje: idViajeParam } = req.params;

    if (!/^\d+$/.test(idPasajeroParam) || !/^\d+$/.test(idViajeParam)) {
      return res.status(400).send({ message: 'Invalid IDs' });
    }

    const idPasajero = Number(idPasajeroParam);
    const idViaje = Number(idViajeParam);

    const pasajero = em.getReference(Pasajero, idPasajero);
    const viaje = em.getReference(Viaje, idViaje);
    
    // Para claves compuestas, hay que buscar primero
    const solicitud = await em.findOne(Solicitud, { pasajero, viaje });
    
    if (!solicitud) {
      return res.status(404).send({ message: 'Solicitud not found' });
    }
    
    await em.removeAndFlush(solicitud);
    res.status(200).json({message: 'Solicitud deleted successfully', data: solicitud});
  }
  catch(error: any){
    return res.status(500).send({ message: error.message});
  }
}

export { sanitizedInput, findAll, findOne, add, update, remove };

