import { useState } from "react";
import SubNavBar from "../components/SubNavBar.tsx";
import categoriaService, { Categoria } from "../services/Categoria.Service.ts";

type Vista =
  | "inicio"
  | "consultarTodos"
  | "consultarUno"
  | "agregar"
  | "modificar"
  | "eliminar";

export default function Categorias() {
  const [vistaActual, setVistaActual] = useState<Vista>("inicio");
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaEncontrada, setCategoriaEncontrada] =
    useState<Categoria | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<Categoria>({ descripcion: "" });
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [searchId, setSearchId] = useState<string>("");

  const limpiarMensajes = () => {
    setError("");
    setSuccessMessage("");
  };

  // Consultar todos
  const handleConsultarTodos = async () => {
    setVistaActual("consultarTodos");
    limpiarMensajes();
    setLoading(true);

    try {
      const todasCategorias = await categoriaService.getAllCategorias();
      setCategorias(todasCategorias);
    } catch (err) {
      setError(`Error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  // Consultar uno
  const handleConsultar = async (id?: string) => {
    setVistaActual("consultarUno");
    limpiarMensajes();

    // Si se pasa un ID, buscarlo automáticamente
    if (id && id.trim()) {
      setLoading(true);
      setSearchId(id);

      try {
        const categoria = await categoriaService.getCategoriaById(Number(id));
        setCategoriaEncontrada(categoria);
        setSuccessMessage(`Categoría #${categoria.id} encontrada exitosamente`);
      } catch (err) {
        setError(`Error: ${err}`);
        setCategoriaEncontrada(null);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBuscarUno = async () => {
    if (!searchId.trim()) {
      setError("Ingrese un ID");
      return;
    }

    setLoading(true);
    limpiarMensajes();

    try {
      const categoria = await categoriaService.getCategoriaById(
        Number(searchId)
      );
      setCategoriaEncontrada(categoria);
    } catch (err) {
      setError(`Error: ${err}`);
      setCategoriaEncontrada(null);
    } finally {
      setLoading(false);
    }
  };

  // Agregar
  const handleAgregar = () => {
    setVistaActual("agregar");
    setFormData({ descripcion: "" });
    limpiarMensajes();
  };

  const handleGuardarNuevo = async () => {
    if (!formData.descripcion.trim()) {
      setError("La descripción es obligatoria");
      return;
    }

    setLoading(true);
    limpiarMensajes();

    try {
      const nuevaCategoria = await categoriaService.createCategoria(formData);
      setSuccessMessage(`Categoría creada con ID ${nuevaCategoria.id}`);
      setFormData({ descripcion: "" });
    } catch (err) {
      setError(`Error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  // Modificar
  const handleModificar = async () => {
    setVistaActual("modificar");
    limpiarMensajes();
    setFormData({ descripcion: "" });
    setSearchId("");
  };

  const handleBuscarModificar = async () => {
    if (!searchId.trim()) {
      setError("Ingrese un ID");
      return;
    }

    setLoading(true);
    limpiarMensajes();

    try {
      const categoria = await categoriaService.getCategoriaById(
        Number(searchId)
      );
      setFormData(categoria);
    } catch (err) {
      setError(`Error: ${err}`);
      setFormData({ descripcion: "" });
    } finally {
      setLoading(false);
    }
  };

  const handleGuardarModificacion = async () => {
    if (!formData.descripcion.trim()) {
      setError("La descripción es obligatoria");
      return;
    }

    setLoading(true);
    limpiarMensajes();

    try {
      await categoriaService.updateCategoria(formData.id!, formData);
      setSuccessMessage(`Categoría ${formData.id} actualizada exitosamente`);
    } catch (err) {
      setError(`Error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar
  const handleEliminar = async () => {
    setVistaActual("eliminar");
    limpiarMensajes();
    setSearchId("");
  };

  const handleConfirmarEliminar = async () => {
    if (!searchId.trim()) {
      setError("Ingrese un ID");
      return;
    }

    if (
      !window.confirm(
        `¿Está seguro de eliminar la categoría con ID ${searchId}?`
      )
    ) {
      return;
    }

    setLoading(true);
    limpiarMensajes();

    try {
      await categoriaService.deleteCategoria(Number(searchId));
      setSuccessMessage(`Categoría ${searchId} eliminada exitosamente`);
      setSearchId("");
    } catch (err) {
      setError(`Error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: "220px" }}>
      <SubNavBar
        entity="categoría"
        onConsultarTodos={handleConsultarTodos}
        onConsultar={handleConsultar}
        onAgregar={handleAgregar}
        onModificar={handleModificar}
        onEliminar={handleEliminar}
      />
      <div className="container-fluid px-3 px-md-5">
        <div className="row">
          <div className="col-12">
            <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
              Categorías
            </h1>

            {loading && (
              <div
                className="alert alert-info mt-4"
                style={{ fontSize: "1.1rem" }}
              >
                <div
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></div>
                Procesando...
              </div>
            )}

            {error && (
              <div
                className="alert alert-danger mt-4"
                style={{ fontSize: "1.1rem" }}
              >
                {error}
              </div>
            )}
            {successMessage && (
              <div
                className="alert alert-success mt-4"
                style={{ fontSize: "1.1rem" }}
              >
                {successMessage}
              </div>
            )}

            {/* Vista: Consultar Todos */}
            {vistaActual === "consultarTodos" && (
              <div className="row mt-4">
                <div className="col-12 mb-4">
                  <h3 style={{ fontSize: "2rem" }}>
                    Todas las Categorías ({categorias.length})
                  </h3>
                </div>
                {categorias.map((cat) => (
                  <div
                    key={cat.id}
                    className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
                  >
                    <div 
                      className="card shadow" 
                      style={{
                        minHeight: "160px",
                        maxHeight: "200px",
                        display: "flex",
                        flexDirection: "column"
                      }}
                    >
                      <div className="card-body d-flex flex-column">
                        <h5
                          className="card-title mb-3"
                          style={{ fontSize: "1.5rem", fontWeight: "bold" }}
                        >
                          ID: {cat.id}
                        </h5>
                        <p 
                          className="card-text flex-grow-1" 
                          style={{ 
                            fontSize: "1.2rem",
                            overflow: "auto"
                          }}
                        >
                          {cat.descripcion}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Vista: Consultar Uno */}
            {vistaActual === "consultarUno" && (
              <div className="card mt-4 shadow-lg">
                <div className="card-body p-4">
                  <h4 style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>
                    Consultar Categoría por ID
                  </h4>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleBuscarUno();
                    }}
                  >
                    <div className="mb-4">
                      <label
                        className="form-label"
                        style={{ fontSize: "1.2rem", fontWeight: "500" }}
                      >
                        ID de la Categoría
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-lg"
                        placeholder="Ingrese el ID"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        style={{ fontSize: "1.1rem" }}
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      style={{ fontSize: "1.2rem" }}
                      disabled={loading}
                    >
                      {loading ? "Buscando..." : "Buscar"}
                    </button>
                  </form>

                  {categoriaEncontrada && (
                    <div className="card mt-4 bg-light">
                      <div className="card-body">
                        <h5 style={{ fontSize: "1.5rem", color: "#0d6efd" }}>
                          Resultado:
                        </h5>
                        <p
                          style={{
                            fontSize: "1.2rem",
                            marginBottom: "0.5rem",
                          }}
                        >
                          <strong>ID:</strong> {categoriaEncontrada.id}
                        </p>
                        <p style={{ fontSize: "1.2rem", marginBottom: "0" }}>
                          <strong>Descripción:</strong>{" "}
                          {categoriaEncontrada.descripcion}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Vista: Agregar */}
            {vistaActual === "agregar" && (
              <div className="card mt-4 shadow-lg">
                <div className="card-body p-4">
                  <h4 style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>
                    Agregar Nueva Categoría
                  </h4>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleGuardarNuevo();
                    }}
                  >
                    <div className="mb-4">
                      <label
                        className="form-label"
                        style={{ fontSize: "1.2rem", fontWeight: "500" }}
                      >
                        Descripción *
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        value={formData.descripcion}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            descripcion: e.target.value,
                          })
                        }
                        placeholder="Ingrese la descripción"
                        style={{ fontSize: "1.1rem" }}
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      style={{ fontSize: "1.2rem" }}
                      disabled={loading}
                    >
                      {loading ? "Guardando..." : "Guardar"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Vista: Modificar */}
            {vistaActual === "modificar" && (
              <div className="card mt-4 shadow-lg">
                <div className="card-body p-4">
                  <h4 style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>
                    Modificar Categoría
                  </h4>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleBuscarModificar();
                    }}
                  >
                    <div className="mb-4">
                      <label
                        className="form-label"
                        style={{ fontSize: "1.2rem", fontWeight: "500" }}
                      >
                        ID de la Categoría a Modificar
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-lg"
                        placeholder="Ingrese el ID"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        style={{ fontSize: "1.1rem" }}
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      style={{ fontSize: "1.2rem" }}
                      disabled={loading}
                    >
                      {loading ? "Buscando..." : "Buscar"}
                    </button>
                  </form>

                  {formData.id && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleGuardarModificacion();
                      }}
                      className="mt-4 pt-4 border-top"
                    >
                      <h5
                        style={{
                          fontSize: "1.5rem",
                          marginBottom: "1.5rem",
                        }}
                      >
                        Editar Datos
                      </h5>
                      <div className="mb-4">
                        <label
                          className="form-label"
                          style={{ fontSize: "1.2rem", fontWeight: "500" }}
                        >
                          ID
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          value={formData.id}
                          disabled
                          style={{
                            fontSize: "1.1rem",
                            backgroundColor: "#e9ecef",
                          }}
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          className="form-label"
                          style={{ fontSize: "1.2rem", fontWeight: "500" }}
                        >
                          Descripción *
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          value={formData.descripcion}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              descripcion: e.target.value,
                            })
                          }
                          style={{ fontSize: "1.1rem" }}
                        />
                      </div>
                      <button
                        type="submit"
                        className="btn btn-success btn-lg"
                        style={{ fontSize: "1.2rem" }}
                        disabled={loading}
                      >
                        {loading ? "Actualizando..." : "Actualizar"}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}

            {/* Vista: Eliminar */}
            {vistaActual === "eliminar" && (
              <div className="card mt-4 shadow-lg border-danger">
                <div className="card-body p-4">
                  <h4
                    style={{
                      fontSize: "2rem",
                      marginBottom: "1.5rem",
                      color: "#dc3545",
                    }}
                  >
                    Eliminar Categoría
                  </h4>
                  <div
                    className="alert alert-warning"
                    style={{ fontSize: "1.1rem" }}
                  >
                    <strong>⚠️ Advertencia:</strong> Esta acción no se puede
                    deshacer
                  </div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleConfirmarEliminar();
                    }}
                  >
                    <div className="mb-4">
                      <label
                        className="form-label"
                        style={{ fontSize: "1.2rem", fontWeight: "500" }}
                      >
                        ID de la Categoría a Eliminar
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-lg"
                        placeholder="Ingrese el ID"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        style={{ fontSize: "1.1rem" }}
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-danger btn-lg"
                      style={{ fontSize: "1.2rem" }}
                      disabled={loading}
                    >
                      {loading ? "Eliminando..." : "Eliminar"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Vista: Inicio */}
            {vistaActual === "inicio" && (
              <div
                className="alert alert-info mt-4"
                style={{ fontSize: "1.3rem", padding: "1.5rem" }}
              >
                👆 Seleccione una opción del menú superior para comenzar
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
