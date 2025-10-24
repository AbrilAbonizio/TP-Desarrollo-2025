import { Router } from "express";
import {
  findAll,
  findOne,
  add,
  update,
  remove,
} from "./categoria.controler.js";

export const categoriaRouter = Router();

categoriaRouter.get("/", findAll); // Ruta para obtener una lista de categorias
categoriaRouter.get("/:id", findOne); // Ruta para obtener una categoria por id
categoriaRouter.post("/", add); // Ruta para agregar una categoria
categoriaRouter.put("/:id", update); // Ruta para modificar una categoria
categoriaRouter.patch("/:id", update); // Ruta para modificar una categoria
categoriaRouter.delete("/:id", remove); // Ruta para eliminar una categoria
