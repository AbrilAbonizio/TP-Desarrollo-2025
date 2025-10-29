import { useState } from "react";
import SubNavBar from "../components/SubNavBar.tsx";
import categoriaService, { Categoria } from "../services/Categoria.Service.ts";

export default function Categorias() {
  const [categoriaEncontrada, setCategoriaEncontrada] =
    useState<Categoria | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleConsultar = async (id: string) => {
    setLoading(true);
    setError("");
    setCategoriaEncontrada(null);

    try {
      const categoria = await categoriaService.getCategoriaById(Number(id));
      setCategoriaEncontrada(categoria);
      console.log("Categoría encontrada:", categoria);
    } catch (err) {
      setError(`Error al consultar categoría con ID ${id}: ${err}`);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleModificar = (id: string) => {
    console.log("Modificar categoría con ID:", id);
    // Aquí irá la lógica para modificar una categoría
  };

  const handleEliminar = (id: string) => {
    console.log("Eliminar categoría con ID:", id);
    // Aquí irá la lógica para eliminar una categoría
  };

  return (
    <div style={{ paddingTop: "130px" }}>
      <SubNavBar
        entity="categoría"
        onConsultar={handleConsultar}
        onModificar={handleModificar}
        onEliminar={handleEliminar}
      />
      <div className="container-fluid px-3 px-md-5">
        <div className="row">
          <div className="col-12">
            <h1>Categorías</h1>

            {loading && (
              <div className="alert alert-info mt-3">
                <div
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                >
                  <span className="visually-hidden">Cargando...</span>
                </div>
                Buscando categoría...
              </div>
            )}

            {error && (
              <div className="alert alert-danger mt-3" role="alert">
                {error}
              </div>
            )}

            {categoriaEncontrada && (
              <div className="card mt-3">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">Categoría Encontrada</h5>
                </div>
                <div className="card-body">
                  <p>
                    <strong>ID:</strong> {categoriaEncontrada.id}
                  </p>
                  <p>
                    <strong>Descripción:</strong>{" "}
                    {categoriaEncontrada.descripcion}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
