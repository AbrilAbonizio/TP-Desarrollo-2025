import { Router } from "express";
import {
  sanitizedInput,
  findAll,
  findOne,
  add,
  update,
  remove,
  findAllByPasajero,
} from "./solicitud.controller.js";

export const solicitudRouter = Router();

solicitudRouter.get("/", findAll); // Ruta para obtener una lista de solicitudes
solicitudRouter.get("/:idPasajero/:idViaje", findOne); // Ruta para obtener una solicitud por id
solicitudRouter.get("/:idPasajero", findAllByPasajero); // Ruta para obtener todas las solicitudes de un pasajero
solicitudRouter.post("/", sanitizedInput, add); // Ruta para agregar una solicitud
solicitudRouter.put("/:idPasajero/:idViaje", sanitizedInput, update); // Ruta para modificar una solicitud
solicitudRouter.patch("/:idPasajero/:idViaje", sanitizedInput, update); // Ruta para modificar una solicitud
solicitudRouter.delete("/:idPasajero/:idViaje", remove); // Ruta para eliminar una solicituds
