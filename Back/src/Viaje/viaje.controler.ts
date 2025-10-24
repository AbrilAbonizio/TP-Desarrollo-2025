import { Request, Response, NextFunction } from "express";
import { Viaje } from "./viaje.entity.js";
import { orm } from "../shared/orm.js";

const em = orm.em;

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
async function findAll(req: Request, res: Response) {
  try {
    const viajes = await em.find(
      Viaje,
      {},
      { populate: ["solicitudes", "ciudad", "categorias"] }
    );
    return res
      .status(200)
      .json({ message: "Se encontraron los TODOS los viajes", data: viajes });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error retrieving viajes", error: error.message });
  }
}

// Función para obtener un viaje por id
function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const viaje = em.findOneOrFail(
      Viaje,
      { id: id },
      { populate: ["solicitudes", "ciudad", "categorias"] }
    );
    return res.status(200).json({ message: "Viaje encontrado", data: viaje });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error retrieving viaje", error: error.message });
  }
}

// Función para agregar un nuevo viaje
async function add(req: Request, res: Response) {
  try {
    const viaje = em.create(Viaje, req.body.sanitizedInput);
    await em.flush();
    return res.status(201).send({ message: "Viaje created", data: viaje });
  } catch (error: any) {
    res
      .status(500)
      .send({ message: "Error creating viaje", error: error.message });
  }
}

// Función para modificar los datos de un viaje
async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const viaje = await em.findOneOrFail(Viaje, { id: id });
    em.assign(viaje, req.body.sanitizedInput);
    await em.flush();
    res.status(200).send({ message: "Viaje updated", data: viaje });
  } catch (error: any) {
    res
      .status(500)
      .send({ message: "Error updating viaje", error: error.message });
  }
}

// Función para eliminar un viaje
async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const viaje = em.getReference(Viaje, id);
    await em.removeAndFlush(viaje);
    return res.status(200).send({ message: "Viaje deleted" });
  } catch (error) {
    res
      .status(500)
      .send({
        message: "Error deleting viaje",
        error: (error as Error).message,
      });
  }
}

export { sanitizedInput, findAll, findOne, add, update, remove };
