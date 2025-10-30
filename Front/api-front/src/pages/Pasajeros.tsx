import { useState } from "react";
import SubNavBar from "../components/SubNavBar.tsx";
import pasajeroService, { Pasajero } from "../services/Pasajero.Service.ts";
import solicitudService, { Solicitud } from "../services/Solicitud.Service.ts";
import PrimaryButton, {
  PrimaryOutlineButton,
} from "../components/PrimaryButton.tsx";

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

  // Estados para el modal de solicitudes
  const [showSolicitudesModal, setShowSolicitudesModal] =
    useState<boolean>(false);
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loadingSolicitudes, setLoadingSolicitudes] = useState<boolean>(false);
  const [pasajeroSeleccionado, setPasajeroSeleccionado] =
    useState<Pasajero | null>(null);

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

  const handleConsultar = async (id?: string) => {
    limpiarMensajes();
    setVistaActual("consultarUno");

    if (id && id.trim()) {
      setLoading(true);
      setSearchId(id);

      try {
        const pasajero = await pasajeroService.getPasajeroById(Number(id));
        setPasajeroEncontrado(pasajero);
        setSuccessMessage(`Pasajero #${pasajero.id} encontrado exitosamente`);
      } catch (err) {
        setError(`Error: ${err}`);
        setPasajeroEncontrado(null);
      } finally {
        setLoading(false);
      }
    } else {
      // Si no hay ID, solo limpiamos los estados pero mantenemos la vista de búsqueda
      setSearchId("");
      setPasajeroEncontrado(null);
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
      const error = err as Error & { response?: Response };
      // Si el error es 404 (no encontrado), mostrar un mensaje más amigable
      if (error.response?.status === 404) {
        setError(`No existe un pasajero con el ID ${searchId}`);
      } else {
        setError(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerSolicitudes = async (pasajero: Pasajero) => {
    setPasajeroSeleccionado(pasajero);
    setShowSolicitudesModal(true);
    setLoadingSolicitudes(true);

    try {
      const solicitudesPasajero =
        await solicitudService.getSolicitudesByPasajero(pasajero.id!);
      setSolicitudes(solicitudesPasajero);
    } catch (err) {
      console.error("Error al cargar solicitudes:", err);
      setSolicitudes([]);
    } finally {
      setLoadingSolicitudes(false);
    }
  };

  const handleCerrarModal = () => {
    setShowSolicitudesModal(false);
    setPasajeroSeleccionado(null);
    setSolicitudes([]);
  };

  return (
    <div style={{ paddingTop: "220px" }}>
      <SubNavBar
        entity="pasajero"
        onConsultarTodos={handleConsultarTodos}
        onConsultar={(id) => handleConsultar(id)}
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
                    className="col-12 col-sm-6 col-md-6 col-lg-4 mb-4"
                  >
                    <div className="card h-100 shadow">
                      <div className="card-body">
                        <h5
                          className="card-title"
                          style={{
                            fontSize: "1.5rem",
                            fontWeight: "bold",
                            color: "#000",
                          }}
                        >
                          {pasajero.nombre} {pasajero.apellido}
                        </h5>
                        <p
                          className="card-text"
                          style={{ fontSize: "1.1rem", color: "#000" }}
                        >
                          <strong>ID:</strong> {pasajero.id}
                          <br />
                          <strong>Email:</strong> {pasajero.email}
                          <br />
                          <strong>Teléfono:</strong> {pasajero.telefono}
                          <br />
                          <strong>Dirección:</strong> {pasajero.direccion}
                        </p>
                        <PrimaryOutlineButton
                          texto="Ver Viajes Solicitados"
                          onClick={() => handleVerSolicitudes(pasajero)}
                          color="info"
                        />
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
                    <PrimaryButton
                      texto={loading ? "Buscando..." : "Buscar"}
                      onClick={handleBuscarUno}
                      color="primary"
                    />
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
                        <p style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
                          <strong>Dirección:</strong>{" "}
                          {pasajeroEncontrado.direccion}
                        </p>
                        <PrimaryOutlineButton
                          texto="Ver Viajes Solicitados"
                          onClick={() =>
                            handleVerSolicitudes(pasajeroEncontrado)
                          }
                          color="info"
                        />
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
                          type="tel"
                          className="form-control form-control-lg"
                          value={formData.telefono}
                          onChange={(e) => {
                            // Remover cualquier caracter que no sea número
                            const numerosOnly = e.target.value.replace(
                              /\D/g,
                              ""
                            );
                            setFormData({
                              ...formData,
                              telefono: numerosOnly,
                            });
                          }}
                          onKeyPress={(e) => {
                            // Prevenir la entrada de caracteres no numéricos
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                          placeholder="Ingrese el teléfono (solo números)"
                          style={{ fontSize: "1.1rem" }}
                          inputMode="numeric"
                          pattern="[0-9]*"
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
                    <PrimaryButton
                      texto={loading ? "Guardando..." : "Guardar"}
                      onClick={handleGuardarNuevo}
                      color="primary"
                    />
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
                    <PrimaryButton
                      texto={loading ? "Buscando..." : "Buscar"}
                      onClick={handleBuscarModificar}
                      color="primary"
                    />
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
                            type="tel"
                            className="form-control form-control-lg"
                            value={formData.telefono}
                            onChange={(e) => {
                              // Remover cualquier caracter que no sea número
                              const numerosOnly = e.target.value.replace(
                                /\D/g,
                                ""
                              );
                              setFormData({
                                ...formData,
                                telefono: numerosOnly,
                              });
                            }}
                            onKeyPress={(e) => {
                              // Prevenir la entrada de caracteres no numéricos
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            placeholder="Ingrese el teléfono (solo números)"
                            style={{ fontSize: "1.1rem" }}
                            inputMode="numeric"
                            pattern="[0-9]*"
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
                      <PrimaryButton
                        texto={loading ? "Actualizando..." : "Actualizar"}
                        onClick={handleGuardarModificacion}
                        color="success"
                      />
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
                    <PrimaryButton
                      texto={loading ? "Eliminando..." : "Eliminar"}
                      onClick={handleConfirmarEliminar}
                      color="danger"
                    />
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

      {/* Modal de Solicitudes */}
      {showSolicitudesModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
          onClick={handleCerrarModal}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "10px",
              padding: "2rem",
              maxWidth: "90%",
              maxHeight: "90%",
              overflow: "auto",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h3 style={{ fontSize: "1.8rem", fontWeight: "bold", margin: 0 }}>
                Viajes Solicitados - {pasajeroSeleccionado?.nombre}{" "}
                {pasajeroSeleccionado?.apellido}
              </h3>
              <button
                onClick={handleCerrarModal}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "2rem",
                  cursor: "pointer",
                  color: "#666",
                }}
              >
                ×
              </button>
            </div>

            {loadingSolicitudes && (
              <div style={{ textAlign: "center", padding: "2rem" }}>
                <div className="spinner-border text-info" role="status"></div>
                <p style={{ marginTop: "1rem", fontSize: "1.1rem" }}>
                  Cargando solicitudes...
                </p>
              </div>
            )}

            {!loadingSolicitudes && solicitudes.length === 0 && (
              <div className="alert alert-info" style={{ fontSize: "1.1rem" }}>
                Este pasajero no tiene solicitudes de viajes.
              </div>
            )}

            {!loadingSolicitudes && solicitudes.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
                {solicitudes.map((solicitud, index) => (
                  <div
                    key={index}
                    className="card"
                    style={{
                      minWidth: "300px",
                      flex: "1 1 calc(33.333% - 1.5rem)",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <div className="card-body">
                      <h5
                        className="card-title"
                        style={{
                          fontSize: "1.3rem",
                          fontWeight: "bold",
                          marginBottom: "1rem",
                        }}
                      >
                        {solicitud.viaje.ciudad.nombre}{" "}
                        <span
                          style={{
                            fontSize: "0.9rem",
                            color: "#6c757d",
                            fontWeight: "normal",
                          }}
                        >
                          (ID: {solicitud.viaje.id})
                        </span>
                      </h5>
                      <p
                        className="card-text"
                        style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}
                      >
                        <strong>Fecha Salida:</strong>{" "}
                        {new Date(
                          solicitud.viaje.fechaSalida
                        ).toLocaleDateString("es-ES")}
                      </p>
                      <p
                        className="card-text"
                        style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}
                      >
                        <strong>Fecha Llegada:</strong>{" "}
                        {new Date(
                          solicitud.viaje.fechaLlegada
                        ).toLocaleDateString("es-ES")}
                      </p>
                      <p
                        className="card-text"
                        style={{ fontSize: "1.1rem", marginBottom: "0" }}
                      >
                        <strong>Estado Solicitud:</strong>{" "}
                        <span
                          className={`badge ${
                            solicitud.estado.toLowerCase() === "aceptada"
                              ? "bg-success"
                              : solicitud.estado.toLowerCase() === "pendiente"
                              ? "bg-warning text-dark"
                              : solicitud.estado.toLowerCase() === "rechazada"
                              ? "bg-danger"
                              : solicitud.estado.toLowerCase() === "cancelada"
                              ? "bg-secondary"
                              : "bg-info"
                          }`}
                          style={{ fontSize: "1rem" }}
                        >
                          {solicitud.estado}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
