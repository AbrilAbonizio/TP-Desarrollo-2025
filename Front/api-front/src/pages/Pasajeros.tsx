import { useState } from "react";
import SubNavBar from "../components/SubNavBar.tsx";
import pasajeroService, { Pasajero } from "../services/Pasajero.Service.ts";

type Vista =
  | "inicio"
  | "consultarTodos"
  | "consultarUno"
  | "agregar"
  | "modificar"
  | "eliminar";

export default function Pasajeros() {
  const [vistaActual, setVistaActual] = useState<Vista>("inicio");
  const [pasajeros, setPasajeros] = useState<Pasajero[]>([]);
  const [pasajeroEncontrado, setPasajeroEncontrado] = useState<Pasajero | null>(
    null
  );
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<Pasajero>({
    nombre: "",
    apellido: "",
    telefono: "",
    direccion: "",
    email: "",
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
      const todosPasajeros = await pasajeroService.getAllPasajeros();
      setPasajeros(todosPasajeros);
    } catch (err) {
      setError(`Error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleConsultar = async () => {
    setVistaActual("consultarUno");
    limpiarMensajes();
  };

  const handleBuscarUno = async () => {
    if (!searchId.trim()) {
      setError("Ingrese un ID");
      return;
    }

    setLoading(true);
    limpiarMensajes();

    try {
      const pasajero = await pasajeroService.getPasajeroById(Number(searchId));
      setPasajeroEncontrado(pasajero);
    } catch (err) {
      setError(`Error: ${err}`);
      setPasajeroEncontrado(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAgregar = () => {
    setVistaActual("agregar");
    setFormData({
      nombre: "",
      apellido: "",
      telefono: "",
      direccion: "",
      email: "",
    });
    limpiarMensajes();
  };

  const handleGuardarNuevo = async () => {
    if (
      !formData.nombre.trim() ||
      !formData.apellido.trim() ||
      !formData.email.trim()
    ) {
      setError("Nombre, apellido y email son obligatorios");
      return;
    }

    setLoading(true);
    limpiarMensajes();

    try {
      const nuevoPasajero = await pasajeroService.createPasajero(formData);
      setSuccessMessage(`Pasajero creado con ID ${nuevoPasajero.id}`);
      setFormData({
        nombre: "",
        apellido: "",
        telefono: "",
        direccion: "",
        email: "",
      });
    } catch (err) {
      setError(`Error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleModificar = async () => {
    setVistaActual("modificar");
    limpiarMensajes();
    setFormData({
      nombre: "",
      apellido: "",
      telefono: "",
      direccion: "",
      email: "",
    });
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
      const pasajero = await pasajeroService.getPasajeroById(Number(searchId));
      setFormData(pasajero);
    } catch (err) {
      setError(`Error: ${err}`);
      setFormData({
        nombre: "",
        apellido: "",
        telefono: "",
        direccion: "",
        email: "",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGuardarModificacion = async () => {
    if (
      !formData.nombre.trim() ||
      !formData.apellido.trim() ||
      !formData.email.trim()
    ) {
      setError("Nombre, apellido y email son obligatorios");
      return;
    }

    setLoading(true);
    limpiarMensajes();

    try {
      await pasajeroService.updatePasajero(formData.id!, formData);
      setSuccessMessage(`Pasajero ${formData.id} actualizado exitosamente`);
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
      !window.confirm(
        `¿Está seguro de eliminar el pasajero con ID ${searchId}?`
      )
    ) {
      return;
    }

    setLoading(true);
    limpiarMensajes();

    try {
      await pasajeroService.deletePasajero(Number(searchId));
      setSuccessMessage(`Pasajero ${searchId} eliminado exitosamente`);
      setSearchId("");
    } catch (err) {
      setError(`Error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: "130px" }}>
      <SubNavBar
        entity="pasajero"
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
              Pasajeros
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
                    Todos los Pasajeros ({pasajeros.length})
                  </h3>
                </div>
                {pasajeros.map((pasajero) => (
                  <div
                    key={pasajero.id}
                    className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
                  >
                    <div className="card h-100 shadow">
                      <div className="card-body">
                        <h5
                          className="card-title"
                          style={{ fontSize: "1.5rem", fontWeight: "bold" }}
                        >
                          {pasajero.nombre} {pasajero.apellido}
                        </h5>
                        <p className="card-text" style={{ fontSize: "1.1rem" }}>
                          <strong>ID:</strong> {pasajero.id}
                          <br />
                          <strong>Email:</strong> {pasajero.email}
                          <br />
                          <strong>Teléfono:</strong> {pasajero.telefono}
                          <br />
                          <strong>Dirección:</strong> {pasajero.direccion}
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
                    Consultar Pasajero por ID
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
                        ID del Pasajero
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

                  {pasajeroEncontrado && (
                    <div className="card mt-4 bg-light">
                      <div className="card-body">
                        <h5 style={{ fontSize: "1.5rem", color: "#0d6efd" }}>
                          Resultado:
                        </h5>
                        <p
                          style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}
                        >
                          <strong>ID:</strong> {pasajeroEncontrado.id}
                        </p>
                        <p
                          style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}
                        >
                          <strong>Nombre:</strong> {pasajeroEncontrado.nombre}
                        </p>
                        <p
                          style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}
                        >
                          <strong>Apellido:</strong>{" "}
                          {pasajeroEncontrado.apellido}
                        </p>
                        <p
                          style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}
                        >
                          <strong>Email:</strong> {pasajeroEncontrado.email}
                        </p>
                        <p
                          style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}
                        >
                          <strong>Teléfono:</strong>{" "}
                          {pasajeroEncontrado.telefono}
                        </p>
                        <p style={{ fontSize: "1.2rem", marginBottom: "0" }}>
                          <strong>Dirección:</strong>{" "}
                          {pasajeroEncontrado.direccion}
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
                    Agregar Nuevo Pasajero
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
                          Apellido *
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          value={formData.apellido}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              apellido: e.target.value,
                            })
                          }
                          placeholder="Ingrese el apellido"
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
                          Email *
                        </label>
                        <input
                          type="email"
                          className="form-control form-control-lg"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder="correo@ejemplo.com"
                          style={{ fontSize: "1.1rem" }}
                        />
                      </div>
                      <div className="col-md-6 mb-4">
                        <label
                          className="form-label"
                          style={{ fontSize: "1.2rem", fontWeight: "500" }}
                        >
                          Teléfono
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          value={formData.telefono}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              telefono: e.target.value,
                            })
                          }
                          placeholder="Ingrese el teléfono"
                          style={{ fontSize: "1.1rem" }}
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label
                        className="form-label"
                        style={{ fontSize: "1.2rem", fontWeight: "500" }}
                      >
                        Dirección
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        value={formData.direccion}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            direccion: e.target.value,
                          })
                        }
                        placeholder="Ingrese la dirección"
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
                    Modificar Pasajero
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
                        ID del Pasajero a Modificar
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
                            Apellido *
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-lg"
                            value={formData.apellido}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                apellido: e.target.value,
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
                            Email *
                          </label>
                          <input
                            type="email"
                            className="form-control form-control-lg"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                email: e.target.value,
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
                            Teléfono
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-lg"
                            value={formData.telefono}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                telefono: e.target.value,
                              })
                            }
                            style={{ fontSize: "1.1rem" }}
                          />
                        </div>
                      </div>
                      <div className="mb-4">
                        <label
                          className="form-label"
                          style={{ fontSize: "1.2rem", fontWeight: "500" }}
                        >
                          Dirección
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          value={formData.direccion}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              direccion: e.target.value,
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
                    Eliminar Pasajero
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
                        ID del Pasajero a Eliminar
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
