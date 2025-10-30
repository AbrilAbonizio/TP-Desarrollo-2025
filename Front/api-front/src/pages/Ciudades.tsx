import { useState } from "react";
import SubNavBar from "../components/SubNavBar.tsx";
import ciudadService, { Ciudad } from "../services/Ciudad.Service.ts";

type Vista =
  | "inicio"
  | "consultarTodos"
  | "consultarUno"
  | "agregar"
  | "modificar"
  | "eliminar";

export default function Ciudades() {
  const [vistaActual, setVistaActual] = useState<Vista>("inicio");
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [ciudadEncontrada, setCiudadEncontrada] = useState<Ciudad | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<Ciudad>({
    nombre: "",
    provincia: "",
    latitud: 0,
    longitud: 0,
  });
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [searchId, setSearchId] = useState<string>("");

  const limpiarMensajes = () => {
    setError("");
    setSuccessMessage("");
  };

  const handleConsultarTodos = async () => {
    setVistaActual("consultarTodos");
    limpiarMensajes();
    setLoading(true);

    try {
      const todasCiudades = await ciudadService.getAllCiudades();
      setCiudades(todasCiudades);
    } catch (err) {
      setError(`Error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleConsultar = async (id?: string) => {
    setVistaActual("consultarUno");
    limpiarMensajes();

    // Si se pasa un ID, buscarlo automáticamente
    if (id && id.trim()) {
      setLoading(true);
      setSearchId(id);

      try {
        const ciudad = await ciudadService.getCiudadById(Number(id));
        setCiudadEncontrada(ciudad);
        setSuccessMessage(`Ciudad #${ciudad.id} encontrada exitosamente`);
      } catch (err) {
        setError(`Error: ${err}`);
        setCiudadEncontrada(null);
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
      const ciudad = await ciudadService.getCiudadById(Number(searchId));
      setCiudadEncontrada(ciudad);
    } catch (err) {
      setError(`Error: ${err}`);
      setCiudadEncontrada(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAgregar = () => {
    setVistaActual("agregar");
    setFormData({ nombre: "", provincia: "", latitud: 0, longitud: 0 });
    limpiarMensajes();
  };

  const handleGuardarNuevo = async () => {
    if (!formData.nombre.trim() || !formData.provincia.trim()) {
      setError("Nombre y provincia son obligatorios");
      return;
    }

    setLoading(true);
    limpiarMensajes();

    try {
      const nuevaCiudad = await ciudadService.createCiudad(formData);
      setSuccessMessage(`Ciudad creada con ID ${nuevaCiudad.id}`);
      setFormData({ nombre: "", provincia: "", latitud: 0, longitud: 0 });
    } catch (err) {
      setError(`Error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleModificar = async () => {
    setVistaActual("modificar");
    limpiarMensajes();
    setFormData({ nombre: "", provincia: "", latitud: 0, longitud: 0 });
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
      const ciudad = await ciudadService.getCiudadById(Number(searchId));
      setFormData(ciudad);
    } catch (err) {
      setError(`Error: ${err}`);
      setFormData({ nombre: "", provincia: "", latitud: 0, longitud: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleGuardarModificacion = async () => {
    if (!formData.nombre.trim() || !formData.provincia.trim()) {
      setError("Nombre y provincia son obligatorios");
      return;
    }

    setLoading(true);
    limpiarMensajes();

    try {
      await ciudadService.updateCiudad(formData.id!, formData);
      setSuccessMessage(`Ciudad ${formData.id} actualizada exitosamente`);
    } catch (err) {
      setError(`Error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

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
      !window.confirm(`¿Está seguro de eliminar la ciudad con ID ${searchId}?`)
    ) {
      return;
    }

    setLoading(true);
    limpiarMensajes();

    try {
      await ciudadService.deleteCiudad(Number(searchId));
      setSuccessMessage(`Ciudad ${searchId} eliminada exitosamente`);
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
        entity="ciudad"
        onConsultarTodos={handleConsultarTodos}
        onConsultar={handleConsultar}
        onAgregar={handleAgregar}
        onModificar={handleModificar}
        onEliminar={handleEliminar}
      />
      <div className="container-fluid px-3 px-md-5">
        <div className="row">
          <div className="col-12">
            <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>Ciudades</h1>

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
                    Todas las Ciudades ({ciudades.length})
                  </h3>
                </div>
                {ciudades.map((ciudad) => (
                  <div
                    key={ciudad.id}
                    className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
                  >
                    <div className="card h-100 shadow">
                      <div className="card-body">
                        <h5
                          className="card-title"
                          style={{ fontSize: "1.5rem", fontWeight: "bold" }}
                        >
                          {ciudad.nombre}
                        </h5>
                        <p className="card-text" style={{ fontSize: "1.1rem" }}>
                          <strong>ID:</strong> {ciudad.id}
                          <br />
                          <strong>Provincia:</strong> {ciudad.provincia}
                          <br />
                          <strong>Lat:</strong> {ciudad.latitud}
                          <br />
                          <strong>Lng:</strong> {ciudad.longitud}
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
                    Consultar Ciudad por ID
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
                        ID de la Ciudad
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

                  {ciudadEncontrada && (
                    <div className="card mt-4 bg-light">
                      <div className="card-body">
                        <h5 style={{ fontSize: "1.5rem", color: "#0d6efd" }}>
                          Resultado:
                        </h5>
                        <p
                          style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}
                        >
                          <strong>ID:</strong> {ciudadEncontrada.id}
                        </p>
                        <p
                          style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}
                        >
                          <strong>Nombre:</strong> {ciudadEncontrada.nombre}
                        </p>
                        <p
                          style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}
                        >
                          <strong>Provincia:</strong>{" "}
                          {ciudadEncontrada.provincia}
                        </p>
                        <p
                          style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}
                        >
                          <strong>Latitud:</strong> {ciudadEncontrada.latitud}
                        </p>
                        <p style={{ fontSize: "1.2rem", marginBottom: "0" }}>
                          <strong>Longitud:</strong> {ciudadEncontrada.longitud}
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
                    Agregar Nueva Ciudad
                  </h4>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleGuardarNuevo();
                    }}
                  >
                    <div className="row">
                      <div className="col-md-6 mb-4">
                        <label
                          className="form-label"
                          style={{ fontSize: "1.2rem", fontWeight: "500" }}
                        >
                          Nombre *
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          value={formData.nombre}
                          onChange={(e) =>
                            setFormData({ ...formData, nombre: e.target.value })
                          }
                          placeholder="Ingrese el nombre"
                          style={{ fontSize: "1.1rem" }}
                        />
                      </div>
                      <div className="col-md-6 mb-4">
                        <label
                          className="form-label"
                          style={{ fontSize: "1.2rem", fontWeight: "500" }}
                        >
                          Provincia *
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          value={formData.provincia}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              provincia: e.target.value,
                            })
                          }
                          placeholder="Ingrese la provincia"
                          style={{ fontSize: "1.1rem" }}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-4">
                        <label
                          className="form-label"
                          style={{ fontSize: "1.2rem", fontWeight: "500" }}
                        >
                          Latitud
                        </label>
                        <input
                          type="number"
                          step="any"
                          className="form-control form-control-lg"
                          value={formData.latitud}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              latitud: Number(e.target.value),
                            })
                          }
                          style={{ fontSize: "1.1rem" }}
                        />
                      </div>
                      <div className="col-md-6 mb-4">
                        <label
                          className="form-label"
                          style={{ fontSize: "1.2rem", fontWeight: "500" }}
                        >
                          Longitud
                        </label>
                        <input
                          type="number"
                          step="any"
                          className="form-control form-control-lg"
                          value={formData.longitud}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              longitud: Number(e.target.value),
                            })
                          }
                          style={{ fontSize: "1.1rem" }}
                        />
                      </div>
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
                    Modificar Ciudad
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
                        ID de la Ciudad a Modificar
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
                        style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}
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
                      <div className="row">
                        <div className="col-md-6 mb-4">
                          <label
                            className="form-label"
                            style={{ fontSize: "1.2rem", fontWeight: "500" }}
                          >
                            Nombre *
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-lg"
                            value={formData.nombre}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                nombre: e.target.value,
                              })
                            }
                            style={{ fontSize: "1.1rem" }}
                          />
                        </div>
                        <div className="col-md-6 mb-4">
                          <label
                            className="form-label"
                            style={{ fontSize: "1.2rem", fontWeight: "500" }}
                          >
                            Provincia *
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-lg"
                            value={formData.provincia}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                provincia: e.target.value,
                              })
                            }
                            style={{ fontSize: "1.1rem" }}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6 mb-4">
                          <label
                            className="form-label"
                            style={{ fontSize: "1.2rem", fontWeight: "500" }}
                          >
                            Latitud
                          </label>
                          <input
                            type="number"
                            step="any"
                            className="form-control form-control-lg"
                            value={formData.latitud}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                latitud: Number(e.target.value),
                              })
                            }
                            style={{ fontSize: "1.1rem" }}
                          />
                        </div>
                        <div className="col-md-6 mb-4">
                          <label
                            className="form-label"
                            style={{ fontSize: "1.2rem", fontWeight: "500" }}
                          >
                            Longitud
                          </label>
                          <input
                            type="number"
                            step="any"
                            className="form-control form-control-lg"
                            value={formData.longitud}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                longitud: Number(e.target.value),
                              })
                            }
                            style={{ fontSize: "1.1rem" }}
                          />
                        </div>
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
                    Eliminar Ciudad
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
                        ID de la Ciudad a Eliminar
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
