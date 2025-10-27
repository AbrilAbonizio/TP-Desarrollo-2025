import { Request, Response, NextFunction } from "express";
import { Viaje } from "./viaje.entity.js";
import {Pasajero} from "../Pasajero/pasajero.entity.js";
import {Ciudad} from "../Ciudad/ciudad.entity.js";
import { orm } from "../shared/orm.js";

const em = orm.em;

// Middleware para validar que no se ingresen datos extras
function sanitizedInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    idOrganizador: req.body.idOrganizador,
    idCiudad: req.body.idCiudad,
    fechaSalida: req.body.fechaSalida,
    fechaLlegada: req.body.fechaLlegada,
    estado: req.body.estado,
    cupos: req.body.cupos,
    costoEstimado: req.body.costoEstimado,
    descVehiculo: req.body.descVehiculo
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
async function findAll(req: Request, res: Response) {
  try {
    const viajes = await em.find(Viaje, {}, { populate: ["ciudad", "categorias", "organizador"] });
    return res.status(200).json({ message: "Se encontraron TODOS los viajes", data: viajes });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

// Función para obtener un viaje por id
async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const viaje = await em.findOneOrFail(Viaje, { id: id }, { populate: ["organizador", "ciudad", "categorias"] }
    );
    return res.status(200).json({ message: "Viaje encontrado", data: viaje });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

// Función para agregar un nuevo viaje
async function add(req: Request, res: Response) {
  try {
    const { idOrganizador: idOrganizadorBody, idCiudad: idCiudadBody, fechaSalida, 
    fechaLlegada, estado, cupos, costoEstimado, descVehiculo } = req.body.sanitizedInput;

    const idOrganizador = Number.parseInt(idOrganizadorBody);
    const idCiudad = Number.parseInt(idCiudadBody);

    const organizador = em.getReference(Pasajero, idOrganizador);
    const ciudad = em.getReference(Ciudad, idCiudad);

    // Validar campos requeridos
    if (!descVehiculo) {
      return res.status(400).json({ message: 'descVehiculo es requerido' });
    }

    const viaje = em.create(Viaje, { organizador, ciudad, fechaSalida: new Date(fechaSalida), fechaLlegada: new Date(fechaLlegada), estado, cupos, costoEstimado, descVehiculo });
    await em.flush();
    return res.status(201).json({ message: "Viaje created", data: viaje });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// Función para modificar los datos de un viaje
async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const viaje = await em.findOneOrFail(Viaje, { id });
    em.assign(viaje, req.body.sanitizedInput);
    await em.flush();
    res.status(200).send({ message: "Viaje updated", data: viaje });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// Función para eliminar un viaje
async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const viaje = em.getReference(Viaje, id);
    await em.removeAndFlush(viaje);
    return res.status(200).send({ message: "Viaje deleted" });
  } catch (error: any) {
    res.status(500).json({message: error.message});
  }
}

export { sanitizedInput, findAll, findOne, add, update, remove };
