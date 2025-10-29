import { Request, Response, NextFunction } from "express";
import { Viaje } from "./viaje.entity.js";
import {Pasajero} from "../Pasajero/pasajero.entity.js";
import {Ciudad} from "../Ciudad/ciudad.entity.js";
import {Categoria} from "../Categoria/categoria.entity.js";
import { orm } from "../shared/orm.js";
import { NotFoundError } from '@mikro-orm/core';

const em = orm.em;

// Middleware para validar que no se ingresen datos extras
function sanitizedInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    idOrganizador: req.body.idOrganizador,
    idCiudad: req.body.idCiudad,
    fechaSalida: new Date(req.body.fechaSalida),
    fechaLlegada: new Date(req.body.fechaLlegada),
    estado: req.body.estado,
    cupos: req.body.cupos,
    costoEstimado: req.body.costoEstimado,
    descVehiculo: req.body.descVehiculo,
    categorias: req.body.categorias
  };
  // Validacion para que el viaje tenga al menos una categoria
  //if (!Array.isArray(req.body.sanitizedInput.categorias) || req.body.sanitizedInput.categorias.length === 0) {
    //return res.status(400).json({ message: 'El campo categorias debe ser un array con al menos un id' });
  //}

  // MÁS VALIDACIONES
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });
  next();
}

// Función para obtener una lista de viajes
async function findAll(req: Request, res: Response) {
  try {
    const viajes = await em.find(Viaje, {}, { populate: ["ciudad", "categorias", "organizador"] });
    return res.status(200).json({ message: "Se encontraron TODOS los viajes", data: viajes });
  } 
  catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

// Función para obtener un viaje por id
async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const viaje = await em.findOneOrFail(Viaje,  id , { populate: ["organizador", "ciudad", "categorias"] }
    );
    return res.status(200).json({ message: "Viaje encontrado", data: viaje });
  }
  catch (error: any) {
    if (error instanceof NotFoundError){
      return res.status(404).json({message: "Viaje not found"});
    }
    return res.status(500).json({ message: error.message });
  }
}

// Función para agregar un nuevo viaje
async function add(req: Request, res: Response) {
  try {

    const {idOrganizador, idCiudad} = req.body.sanitizedInput
    const estado = 'Disponible';

    // En el front se va a mostrar una lista de categorias, osea que va a estar limitado a solo
    // esas categorias que se encuentran en la BD, por lo tanto no es necesario validar
    // si existe o no la categoria

    //Obtiene referencias al organizador y al viaje
    const organizador = em.getReference(Pasajero, Number.parseInt(idOrganizador));
    const ciudad = em.getReference(Ciudad, Number.parseInt(idCiudad));

    // Obtiene referencias a cada categoria
    const categorias = req.body.sanitizedInput.categorias?.map((id: number) =>em.getReference(Categoria, id)) || [];

    const viaje = em.create(Viaje, {organizador, ciudad, categorias, estado, ...req.body.sanitizedInput});
    await em.flush();
    return res.status(201).json({ message: "Viaje created", data: viaje });

  } 
  catch (error: any) {
     // Si create() no encuentra el pasajero o la ciudad lanza error
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(404).json({ message: 'Pasajero, Ciudad or Categoria not found'});
    }

    return res.status(500).json({ message: error.message });
  }
}

// Función para modificar los datos de un viaje
async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const viaje = await em.findOneOrFail(Viaje, id, {populate: ["organizador", "ciudad", "categorias"]});
    em.assign(viaje, req.body.sanitizedInput); // VER COMO HACER PARA AGREGARLE UNA CATEGORIA Y NO QUE SE BORRE TODO
    await em.flush();
    return res.status(200).send({ message: "Viaje updated", data: viaje });
  } 
  catch (error: any) {
    if (error instanceof NotFoundError){
      return res.status(404).json({message: "Viaje not found"});
    }
    return res.status(500).json({ message: error.message });
  }
}

// Función para eliminar un viaje
async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const viaje = await em.findOneOrFail(Viaje, id, {populate: ["organizador", "ciudad", "categorias", "solicitudes"]});
    
    // Borrar las solicitudes del viaje
    em.remove(viaje.solicitudes);
    
    em.remove(viaje);
    await em.flush();
    return res.status(200).send({ message: "Viaje deleted" });
  } 
  catch (error: any) {
    if (error instanceof NotFoundError){
      return res.status(404).json({message: "Viaje not found"});
    }
    return res.status(500).json({message: error.message});
  }
}

async function buscarXCategoria(req: Request, res: Response){
  try{
    const idCategoria = Number.parseInt(req.params.idCategoria);
    const viajes = await em.find(Viaje, {categorias: { id: idCategoria }, estado: "disponible"}, {populate:['ciudad', 'solicitudes', 'categorias', 'organizador']});

    const viajesConCupos = viajes.map(viaje => {
      const cantAceptadas = viaje.solicitudes.getItems().filter(s => s.estado === 'Aceptada').length;
      const cupoDisponible = viaje.cupos - cantAceptadas; 
      return {...viaje, cupoDisponible}});
    
    return res.status(200).json({message: "Listado de viajes", data: viajesConCupos});
    
    }
    catch(error: any){
    return res.status(500).json({message: error.message});
  }
}


export { sanitizedInput, findAll, findOne, add, update, remove, buscarXCategoria };
