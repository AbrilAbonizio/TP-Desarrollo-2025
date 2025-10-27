import { Request, Response, NextFunction } from 'express';
import { Ciudad } from './ciudad.entity.js';
import { orm } from '../shared/orm.js';
import { NotFoundError } from '@mikro-orm/core';

const em = orm.em;

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
  try{
    const ciudades = await em.find(Ciudad, {});
    return res.status(200).json({message: 'found all ciudades', data: ciudades})
  }
  catch(error: any){
    return res.status(500).json({message: error.message})
  }
}


// Función para obtener una ciudad por id
async function findOne(req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id);
    const ciudad = await em.findOneOrFail(Ciudad, {id});
    return res.status(200).json({message: 'Found Ciudad', data: ciudad})
  }
  catch(error: any){
    if (error instanceof NotFoundError){
      return res.status(404).json({message: "Ciudad not found"});
    }
    return res.status(500).json({message: error.message});
  }
}

// Función para agregar una nueva ciudad
async function add(req: Request, res: Response) {
  try{
    const ciudad = em.create(Ciudad, req.body.sanitizedInput);
    await em.flush();
    return res.status(201).json({message: 'Ciudad created', data: ciudad})
  }
  catch(error: any){
    return res.status(500).json({ message: error.message});
  }
}

// Función para modificar los datos de una ciudad
async function update(req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id);
    const ciudad = await em.findOneOrFail(Ciudad, id); // busca id en la base de datos
    em.assign(ciudad, req.body.sanitizedInput); // asigna al objeto los nuevos datos
    await em.flush();
    return res.status(200).json({message: "Ciudad modified", data: ciudad});
  }
  catch(error:any){
    if (error instanceof NotFoundError){
      return res.status(404).json({message: "Ciudad not found"});
    }
    return res.status(500).send({ message: error.message});
  }
}

// Función para eliminar una ciudad
async function remove(req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id);
    const ciudad = await em.findOneOrFail(Ciudad, id, {populate: ['viajes', 'viajes.solicitudes',]});

    // Borrar solicitudes asociadas a cada viaje de la ciudad
    for (const viaje of ciudad.viajes) {
      em.remove(viaje.solicitudes);
    }

    // Borrar los viajes de la ciudad
    em.remove(ciudad.viajes);
  
    em.remove(ciudad);
    await em.flush();
    return res.status(200).json({message: "Ciudad deleted", data: ciudad});
  }
  catch (error: any){
    if (error instanceof NotFoundError){
      return res.status(404).json({message: "Ciudad not found"});
    }
    return res.status(500).send({ message: error.message});
  }

}

export { sanitizedInput, findAll, findOne, add, update, remove };

