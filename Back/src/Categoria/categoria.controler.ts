import e, { Request, Response, NextFunction } from "express";
import { Categoria } from "./categoria.entity.js";
import { orm } from "../shared/orm.js";
import { NotFoundError } from '@mikro-orm/core';

const em = orm.em;

function sanitizedInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    descripcion: req.body.descripcion,
  };
  // MÁS VALIDACIONES
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });
  next();
}

async function findAll(req: Request, res: Response) {
  try {
    const categorias = await em.find(Categoria, {});
    return res.status(200).json({ message: "Categorias obtenidas con exito", data: categorias });
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener las categorias", error: error });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const categoria = await em.findOneOrFail(Categoria, { id });
    return res.status(200).json({ message: "Categoria obtenida con exito", data: categoria });
  } catch (error) {
    if (error instanceof NotFoundError){
      return res.status(404).json({message: "Categoria not found"});
    }
    return res.status(500).json({ message: "Error al obtener la categoria", error: error });
  }
}

async function add(req: Request, res: Response) {
  try {
    const categoria = em.create(Categoria, req.body.sanitizedInput);
    await em.flush();
    return res.status(201).json({ message: "Categoria creada con exito", data: categoria });
  } catch (error) {
    return res.status(500).json({ message: "Error al crear la categoria", error: error });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const categoria = await em.findOneOrFail(Categoria, id);
    em.assign(categoria, req.body.sanitizedInput);
    await em.flush();
    return res.status(200).json({message: "Categoria actualizada con exito", data: categoria});
  } 
  catch (error: any) {
    if (error instanceof NotFoundError){
      return res.status(404).json({message: "Categoria not found"});
    }
    return res.status(500).json({message: "Error al actualizar la categoria", error: error.message});
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const categoria = await em.findOneOrFail(Categoria, id);
    await em.removeAndFlush(categoria);
    return res.status(200).json({ message: "Categoria eliminada con exito" });
  } 
  catch (error) {
    if (error instanceof NotFoundError){
      return res.status(404).json({message: "Categoria not found"});
    }
    return res.status(500).json({ message: "Error al eliminar la categoria", error: error });
  }
}

export { findAll, findOne, add, update, remove, sanitizedInput};
