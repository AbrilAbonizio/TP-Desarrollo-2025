import { Request, Response, NextFunction } from "express";
import { CategoriaRepository } from "./categoria.repository.js";
import { Categoria } from "./categoria.entity.js";

const repository = new CategoriaRepository(); // Crea una instancia de la clase CategoriaRepository

// Middleware para validar que no se ingresen datos extras
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

// Función para obtener una lista de categorias
function findAll(req: Request, res: Response) {
  res.json({ data: repository.findAll() });
}

// Función para obtener una categoria por id
function findOne(req: Request, res: Response) {
  const categoria = repository.findOne({ id: req.params.id });
  if (!categoria) {
    return res.status(404).send({ message: "Categoria not found" });
  }
  return res.json(categoria);
}

// Función para agregar una nueva categoria
function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput;

  const categoriaInput = new Categoria(input.descripcion);

  const categoria = repository.add(categoriaInput);
  return res
    .status(201)
    .send({ message: "Categoria created", data: categoria });
}

// Función para modificar los datos de una categoria
function update(req: Request, res: Response) {
  req.body.sanitizedInput.id = req.params.id;
  const categoria = repository.update(req.body.sanitizedInput);
  if (categoria) {
    return res.status(200).send({
      message: "Categoria modified successfully",
      data: categoria,
    });
  } else {
    return res.status(404).send({ message: "Categoria not found" });
  }
}

// Función para eliminar una categoria
function remove(req: Request, res: Response) {
  const categoria = repository.delete({ id: req.params.id });
  if (categoria) {
    res
      .status(200)
      .send({ message: "Categoria deleted successfully", data: categoria });
  } else {
    res.status(404).send({ message: "Categoria not found" });
  }
}

export { sanitizedInput, findAll, findOne, add, update, remove };
