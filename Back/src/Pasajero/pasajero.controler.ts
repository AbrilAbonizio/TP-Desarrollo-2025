import { Request, Response, NextFunction } from 'express';
import { Pasajero } from './pasajero.entity.js';
import {orm} from '../shared/orm.js';
import { AnyCnameRecord } from 'node:dns';

const em = orm.em;

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
async function findAll(req: Request, res: Response) {
  try{
    const pasajeros = await em.find(Pasajero, {})
    res.status(200).json({message: 'found all pasajeros', data: pasajeros})
  }
  catch(error: any){
    return res.status(500).send({ message: error.message });
  }

}

// Función para obtener un pasajero por id
async function findOne(req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id);
    const pasajero = await em.findOneOrFail(Pasajero, {id})
    try{
      res.status(200).json({message: 'found pasajero', data: pasajero})
    }
    catch(error: any){
      return res.status(500).send({ message: error.message});
    }
  }
  catch(error: any){
    return res.status(500).send({ message: error.message});
  }
}

// Función para agregar un nuevo pasajero
async function add(req: Request, res: Response) {
  try{
    // Es una operacion sincronica que no necesita acceder a la base de datos
    const pasajero = em.create(Pasajero, req.body); // FALTA SANITIZAR EL BODY 
    await em.flush(); //commit hacia la base de datos, SI ES ASINCRONICA
    res.status(201).json({message: 'Pasajero created', data: pasajero})
  }
  catch(error: any){
    return res.status(500).send({ message: error.message});
  }
}

// Función para modificar los datos de un pasajero
async function update(req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id);
    const pasajero = em.getReference(Pasajero, id); //No siempre es conveniente
    em.assign(Pasajero, req.body); // FALTA SANITIZAR EL BODY
    await em.flush();
    res.status(200).json({message: 'Pasajero updated', data: pasajero})
    
  }
  catch(error: any){
    return res.status(500).send({ message: error.message});
  }
}

// Función para eliminar un pasajero
async function remove(req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id);
    const pasajero = em.getReference(Pasajero, id); 
    await em.removeAndFlush(pasajero);
    res.status(204).json({data: pasajero})
  }
  catch(error: any){
    return res.status(500).send({ message: error.message});
  }

}

export { sanitizedInput, findAll, findOne, add, update, remove };
