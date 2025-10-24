import e, { Request, Response } from "express";

import { Categoria } from "./categoria.entity.js";
import { orm } from "../shared/orm.js";

const em = orm.em;

async function findAll(req: Request, res: Response) {
  try {
    const categorias = await em.find(Categoria, {});
    res
      .status(200)
      .json({ message: "Categorias obtenidas con exito", data: categorias });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener las categorias", error: error });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const categoria = await em.findOneOrFail(Categoria, { id });

    res
      .status(200)
      .json({ message: "Categoria obtenida con exito", data: categoria });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener la categoria", error: error });
  }
}

async function add(req: Request, res: Response) {
  try {
    const categoria = em.create(Categoria, req.body);
    await em.flush();
    res
      .status(201)
      .json({ message: "Categoria creada con exito", data: categoria });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear la categoria", error: error });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const categoria = em.getReference(Categoria, id);
    em.assign(categoria, req.body);
    await em.flush();
    res.status(200).json({
      message: "Categoria actualizada con exito",
      data: categoria,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Error al actualizar la categoria",
      error: error.message,
    });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const categoria = em.getReference(Categoria, id);
    await em.removeAndFlush(categoria);
    res.status(200).json({ message: "Categoria eliminada con exito" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar la categoria", error: error });
  }
}

export { findAll, findOne, add, update, remove };
