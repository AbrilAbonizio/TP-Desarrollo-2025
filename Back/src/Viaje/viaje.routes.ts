import { Router } from "express";

import {
  sanitizedInput,
  findAll,
  findOne,
  add,
  update,
  remove,
} from "./viaje.controler.js";

export const viajeRouter = Router();

viajeRouter.get("/", findAll); // Ruta para obtener una lista de solicitudes
viajeRouter.get("/:id", findOne); // Ruta para obtener una solicitud por id
viajeRouter.post("/", sanitizedInput, add); // Ruta para agregar una solicitud
viajeRouter.put("/:id", sanitizedInput, update); // Ruta para modificar una solicitud
viajeRouter.patch("/:id", sanitizedInput, update); // Ruta para modificar una solicitud
viajeRouter.delete("/:id", remove); // Ruta para eliminar una solicitud
