import { useState, useEffect } from "react";
import SubNavBar from "../components/SubNavBar.tsx";
import viajeService, { Viaje } from "../services/Viaje.Service.ts";
import ciudadService, { Ciudad } from "../services/Ciudad.Service.ts";
import pasajeroService, { Pasajero } from "../services/Pasajero.Service.ts";
import categoriaService, { Categoria } from "../services/Categoria.Service.ts";

type Vista =
  | "inicio"
  | "consultarTodos"
  | "consultarUno"
  | "consultarPorCategoria"
  | "agregar"
  | "modificar"
  | "eliminar";

export default function Viajes() {
  const [vistaActual, setVistaActual] = useState<Vista>("inicio");
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [viajesEncontrados, setViajesEncontrados] = useState<Viaje[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<Viaje>({
    fechaSalida: "",
    fechaLlegada: "",
    estado: "disponible",
    cupos: 1,
    costoEstimado: 0,
    descVehiculo: "",
    idOrganizador: 0,
    idCiudad: 0,
    categorias: [],
  });
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [searchCategoriaId, setSearchCategoriaId] = useState<string>("");
  const [searchCategoriaTexto, setSearchCategoriaTexto] = useState<string>("");

  // Estados para los selectores
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [pasajeros, setPasajeros] = useState<Pasajero[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  // Cargar datos para los selectores
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [ciudadesData, pasajerosData, categoriasData] = await Promise.all(
          [
            ciudadService.getAllCiudades(),
            pasajeroService.getAllPasajeros(),
            categoriaService.getAllCategorias(),
          ]
        );
        setCiudades(ciudadesData);
        setPasajeros(pasajerosData);
        setCategorias(categoriasData);
      } catch (err) {
        console.error("Error cargando datos:", err);
      }
    };
    cargarDatos();
  }, []);

  const limpiarMensajes = () => {
    setError("");
    setSuccessMessage("");
  };

  const handleConsultarTodos = async () => {
    setVistaActual("consultarTodos");
    limpiarMensajes();
    setLoading(true);

    try {
      const todosViajes = await viajeService.getAllViajes();
      setViajes(todosViajes);
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

  const handleConsultarPorCategoria = async () => {
    setVistaActual("consultarPorCategoria");
    limpiarMensajes();
    setSearchCategoriaId("");
    setSearchCategoriaTexto("");
    setViajesEncontrados([]);
  };

  const handleBuscarUno = async () => {
    // Priorizar el dropdown, si no hay selección usar el input de texto
    const categoriaIdFinal =
      searchCategoriaId.trim() || searchCategoriaTexto.trim();

    if (!categoriaIdFinal) {
      setError("Seleccione una categoría del menú o escriba el ID");
      return;
    }

    setLoading(true);
    limpiarMensajes();

    try {
      const viajes = await viajeService.getViajesByCategoria(
        Number(categoriaIdFinal)
      );
      setViajesEncontrados(viajes);
      if (viajes.length === 0) {
        setError("No se encontraron viajes para esta categoría");
      }
    } catch (err) {
      setError(`Error: ${err}`);
      setViajesEncontrados([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAgregar = () => {
    setVistaActual("agregar");
    setFormData({
      fechaSalida: "",
      fechaLlegada: "",
      estado: "disponible",
      cupos: 1,
      costoEstimado: 0,
      descVehiculo: "",
      idOrganizador: 0,
      idCiudad: 0,
      categorias: [],
    });
    limpiarMensajes();
  };

  const handleGuardarNuevo = async () => {
    if (
      !formData.fechaSalida ||
      !formData.fechaLlegada ||
      !formData.idOrganizador ||
      !formData.idCiudad
    ) {
      setError("Todos los campos son obligatorios");
      return;
    }

    setLoading(true);
    limpiarMensajes();

    try {
      const nuevoViaje = await viajeService.createViaje(formData);
      setSuccessMessage(`Viaje creado con ID ${nuevoViaje.id}`);
      setFormData({
        fechaSalida: "",
        fechaLlegada: "",
        estado: "disponible",
        cupos: 1,
        costoEstimado: 0,
        descVehiculo: "",
        idOrganizador: 0,
        idCiudad: 0,
        categorias: [],
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
      fechaSalida: "",
      fechaLlegada: "",
      estado: "disponible",
      cupos: 1,
      costoEstimado: 0,
      descVehiculo: "",
      idOrganizador: 0,
      idCiudad: 0,
      categorias: [],
    });
    setSearchCategoriaId("");
  };

  const handleBuscarModificar = async () => {
    if (!searchCategoriaId.trim()) {
      setError("Ingrese un ID");
      return;
    }

    setLoading(true);
    limpiarMensajes();

    try {
      const viaje = await viajeService.getViajeById(Number(searchCategoriaId));
      setFormData({
        ...viaje,
        idOrganizador: viaje.organizador?.id || 0,
        idCiudad: viaje.ciudad?.id || 0,
        categorias: viaje.categorias || [],
      });
    } catch (err) {
      setError(`Error: ${err}`);
      setFormData({
        fechaSalida: "",
        fechaLlegada: "",
        estado: "disponible",
        cupos: 1,
        costoEstimado: 0,
        descVehiculo: "",
        idOrganizador: 0,
        idCiudad: 0,
        categorias: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGuardarModificacion = async () => {
    if (
      !formData.fechaSalida ||
      !formData.fechaLlegada ||
      !formData.idOrganizador ||
      !formData.idCiudad
    ) {
      setError("Todos los campos son obligatorios");
      return;
    }

    setLoading(true);
    limpiarMensajes();

    try {
      await viajeService.updateViaje(formData.id!, formData);
      setSuccessMessage(`Viaje ${formData.id} actualizado exitosamente`);
    } catch (err) {
      setError(`Error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async () => {
    setVistaActual("eliminar");
    limpiarMensajes();
    setSearchCategoriaId("");
  };

  const handleConfirmarEliminar = async () => {
    if (!searchCategoriaId.trim()) {
      setError("Ingrese un ID");
      return;
    }

    if (
      !window.confirm(
        `¿Está seguro de eliminar el viaje con ID ${searchCategoriaId}?`
      )
    ) {
      return;
    }

    setLoading(true);
    limpiarMensajes();

    try {
      await viajeService.deleteViaje(Number(searchCategoriaId));
      setSuccessMessage(`Viaje ${searchCategoriaId} eliminado exitosamente`);
      setSearchCategoriaId("");
    } catch (err) {
      setError(`Error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoriaChange = (categoriaId: number) => {
    setFormData((prev) => {
      const categorias = prev.categorias.includes(categoriaId)
        ? prev.categorias.filter((id) => id !== categoriaId)
        : [...prev.categorias, categoriaId];
      return { ...prev, categorias };
    });
  };

  return (
    <div style={{ paddingTop: "130px" }}>
      <SubNavBar
        entity="viaje"
        onConsultarTodos={handleConsultarTodos}
        onConsultar={handleConsultar}
        onConsultarPorCategoria={handleConsultarPorCategoria}
        onAgregar={handleAgregar}
        onModificar={handleModificar}
        onEliminar={handleEliminar}
      />
      <div className="container-fluid px-3 px-md-5">
        <div className="row">
          <div className="col-12">
            <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>Viajes</h1>

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
                    Todos los Viajes ({viajes.length})
                  </h3>
                </div>
                {viajes.map((viaje) => (
                  <div
                    key={viaje.id}
                    className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
                  >
                    <div className="card h-100 shadow">
                      <div className="card-body">
                        <h5
                          className="card-title"
                          style={{ fontSize: "1.5rem", fontWeight: "bold" }}
                        >
                          Viaje #{viaje.id}
                        </h5>
                        <p className="card-text" style={{ fontSize: "1.1rem" }}>
                          <strong>Ciudad:</strong> {viaje.ciudad?.nombre}
                          <br />
                          <strong>Organizador:</strong>{" "}
                          {viaje.organizador?.nombre}{" "}
                          {viaje.organizador?.apellido}
                          <br />
                          <strong>Salida:</strong>{" "}
                          {new Date(viaje.fechaSalida).toLocaleDateString()}
                          <br />
                          <strong>Llegada:</strong>{" "}
                          {new Date(viaje.fechaLlegada).toLocaleDateString()}
                          <br />
                          <strong>Estado:</strong> {viaje.estado}
                          <br />
                          <strong>Cupos:</strong> {viaje.cupos}
                          <br />
                          <strong>Costo:</strong> ${viaje.costoEstimado}
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
                    Buscar Viaje por ID
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
                        ID del Viaje
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-lg"
                        placeholder="Ingrese el ID del viaje"
                        value={searchCategoriaId}
                        onChange={(e) => setSearchCategoriaId(e.target.value)}
                        style={{ fontSize: "1.1rem" }}
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      style={{ fontSize: "1.2rem" }}
                      disabled={loading}
                    >
                      {loading ? "Buscando..." : "Buscar Viaje"}
                    </button>
                  </form>

                  {/* Mostrar viaje encontrado */}
                  {formData.id && (
                    <div className="mt-4">
                      <h5
                        style={{
                          fontSize: "1.8rem",
                          color: "#0d6efd",
                          marginBottom: "1.5rem",
                        }}
                      >
                        Viaje Encontrado
                      </h5>
                      <div className="card border-primary shadow">
                        <div className="card-body">
                          <h6
                            className="card-title"
                            style={{
                              fontSize: "1.4rem",
                              fontWeight: "bold",
                              color: "#0d6efd",
                            }}
                          >
                            Viaje #{formData.id}
                          </h6>
                          <hr />
                          <p
                            style={{
                              fontSize: "1.1rem",
                              marginBottom: "0.5rem",
                            }}
                          >
                            <strong>Ciudad:</strong>{" "}
                            {
                              ciudades.find((c) => c.id === formData.idCiudad)
                                ?.nombre
                            }
                          </p>
                          <p
                            style={{
                              fontSize: "1.1rem",
                              marginBottom: "0.5rem",
                            }}
                          >
                            <strong>Organizador:</strong>{" "}
                            {
                              pasajeros.find(
                                (p) => p.id === formData.idOrganizador
                              )?.nombre
                            }{" "}
                            {
                              pasajeros.find(
                                (p) => p.id === formData.idOrganizador
                              )?.apellido
                            }
                          </p>
                          <p
                            style={{
                              fontSize: "1.1rem",
                              marginBottom: "0.5rem",
                            }}
                          >
                            <strong>Salida:</strong>{" "}
                            {new Date(
                              formData.fechaSalida
                            ).toLocaleDateString()}
                          </p>
                          <p
                            style={{
                              fontSize: "1.1rem",
                              marginBottom: "0.5rem",
                            }}
                          >
                            <strong>Llegada:</strong>{" "}
                            {new Date(
                              formData.fechaLlegada
                            ).toLocaleDateString()}
                          </p>
                          <p
                            style={{
                              fontSize: "1.1rem",
                              marginBottom: "0.5rem",
                            }}
                          >
                            <strong>Estado:</strong>{" "}
                            <span className="badge bg-success">
                              {formData.estado}
                            </span>
                          </p>
                          <p
                            style={{
                              fontSize: "1.1rem",
                              marginBottom: "0.5rem",
                            }}
                          >
                            <strong>Cupos:</strong> {formData.cupos}
                          </p>
                          <p
                            style={{
                              fontSize: "1.1rem",
                              marginBottom: "0.5rem",
                            }}
                          >
                            <strong>Costo:</strong> ${formData.costoEstimado}
                          </p>
                          <p style={{ fontSize: "1.1rem", marginBottom: "0" }}>
                            <strong>Vehículo:</strong> {formData.descVehiculo}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Vista: Consultar Por Categoría */}
            {vistaActual === "consultarPorCategoria" && (
              <div className="card mt-4 shadow-lg">
                <div className="card-body p-4">
                  <h4 style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>
                    Buscar Viajes por Categoría
                  </h4>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleBuscarUno();
                    }}
                  >
                    {/* Dropdown de Categorías */}
                    <div className="mb-4">
                      <label
                        className="form-label"
                        style={{ fontSize: "1.2rem", fontWeight: "500" }}
                      >
                        Seleccionar Categoría (Menú)
                      </label>
                      <select
                        className="form-select form-select-lg"
                        value={searchCategoriaId}
                        onChange={(e) => {
                          setSearchCategoriaId(e.target.value);
                          setSearchCategoriaTexto(""); // Limpiar el input de texto
                        }}
                        style={{ fontSize: "1.1rem" }}
                      >
                        <option value="">-- Seleccione una categoría --</option>
                        {categorias.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.descripcion}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Input de Texto para ID de Categoría */}
                    <div className="mb-4">
                      <label
                        className="form-label"
                        style={{ fontSize: "1.2rem", fontWeight: "500" }}
                      >
                        O escriba el ID de la Categoría
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-lg"
                        placeholder="Ingrese el ID de la categoría"
                        value={searchCategoriaTexto}
                        onChange={(e) => {
                          setSearchCategoriaTexto(e.target.value);
                          setSearchCategoriaId(""); // Limpiar el dropdown
                        }}
                        style={{ fontSize: "1.1rem" }}
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      style={{ fontSize: "1.2rem" }}
                      disabled={loading}
                    >
                      {loading ? "Buscando..." : "Buscar Viajes"}
                    </button>
                  </form>

                  {/* Resultados: Múltiples Viajes */}
                  {viajesEncontrados.length > 0 && (
                    <div className="mt-4">
                      <h5
                        style={{
                          fontSize: "1.8rem",
                          color: "#0d6efd",
                          marginBottom: "1.5rem",
                        }}
                      >
                        Resultados: {viajesEncontrados.length} viaje(s)
                        encontrado(s)
                      </h5>
                      <div className="row">
                        {viajesEncontrados.map((viaje) => (
                          <div
                            key={viaje.id}
                            className="col-12 col-md-6 col-lg-4 mb-4"
                          >
                            <div className="card h-100 shadow border-primary">
                              <div className="card-body">
                                <h6
                                  className="card-title"
                                  style={{
                                    fontSize: "1.4rem",
                                    fontWeight: "bold",
                                    color: "#0d6efd",
                                  }}
                                >
                                  Viaje #{viaje.id}
                                </h6>
                                <hr />
                                <p
                                  style={{
                                    fontSize: "1.1rem",
                                    marginBottom: "0.5rem",
                                  }}
                                >
                                  <strong>Ciudad:</strong>{" "}
                                  {viaje.ciudad?.nombre}
                                </p>
                                <p
                                  style={{
                                    fontSize: "1.1rem",
                                    marginBottom: "0.5rem",
                                  }}
                                >
                                  <strong>Organizador:</strong>{" "}
                                  {viaje.organizador?.nombre}{" "}
                                  {viaje.organizador?.apellido}
                                </p>
                                <p
                                  style={{
                                    fontSize: "1.1rem",
                                    marginBottom: "0.5rem",
                                  }}
                                >
                                  <strong>Salida:</strong>{" "}
                                  {new Date(
                                    viaje.fechaSalida
                                  ).toLocaleDateString()}
                                </p>
                                <p
                                  style={{
                                    fontSize: "1.1rem",
                                    marginBottom: "0.5rem",
                                  }}
                                >
                                  <strong>Llegada:</strong>{" "}
                                  {new Date(
                                    viaje.fechaLlegada
                                  ).toLocaleDateString()}
                                </p>
                                <p
                                  style={{
                                    fontSize: "1.1rem",
                                    marginBottom: "0.5rem",
                                  }}
                                >
                                  <strong>Estado:</strong>{" "}
                                  <span className="badge bg-success">
                                    {viaje.estado}
                                  </span>
                                </p>
                                <p
                                  style={{
                                    fontSize: "1.1rem",
                                    marginBottom: "0.5rem",
                                  }}
                                >
                                  <strong>Cupos:</strong> {viaje.cupos}
                                </p>
                                <p
                                  style={{
                                    fontSize: "1.1rem",
                                    marginBottom: "0.5rem",
                                  }}
                                >
                                  <strong>Costo:</strong> ${viaje.costoEstimado}
                                </p>
                                <p
                                  style={{
                                    fontSize: "1.1rem",
                                    marginBottom: "0",
                                  }}
                                >
                                  <strong>Vehículo:</strong>{" "}
                                  {viaje.descVehiculo}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
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
                    Agregar Nuevo Viaje
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
                          Organizador *
                        </label>
                        <select
                          className="form-select form-select-lg"
                          value={formData.idOrganizador}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              idOrganizador: Number(e.target.value),
                            })
                          }
                          style={{ fontSize: "1.1rem" }}
                        >
                          <option value={0}>Seleccione un organizador</option>
                          {pasajeros.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.nombre} {p.apellido}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6 mb-4">
                        <label
                          className="form-label"
                          style={{ fontSize: "1.2rem", fontWeight: "500" }}
                        >
                          Ciudad *
                        </label>
                        <select
                          className="form-select form-select-lg"
                          value={formData.idCiudad}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              idCiudad: Number(e.target.value),
                            })
                          }
                          style={{ fontSize: "1.1rem" }}
                        >
                          <option value={0}>Seleccione una ciudad</option>
                          {ciudades.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.nombre}, {c.provincia}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-4">
                        <label
                          className="form-label"
                          style={{ fontSize: "1.2rem", fontWeight: "500" }}
                        >
                          Fecha Salida *
                        </label>
                        <input
                          type="datetime-local"
                          className="form-control form-control-lg"
                          value={formData.fechaSalida}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              fechaSalida: e.target.value,
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
                          Fecha Llegada *
                        </label>
                        <input
                          type="datetime-local"
                          className="form-control form-control-lg"
                          value={formData.fechaLlegada}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              fechaLlegada: e.target.value,
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
                          Cupos
                        </label>
                        <input
                          type="number"
                          className="form-control form-control-lg"
                          value={formData.cupos}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              cupos: Number(e.target.value),
                            })
                          }
                          min="1"
                          style={{ fontSize: "1.1rem" }}
                        />
                      </div>
                      <div className="col-md-6 mb-4">
                        <label
                          className="form-label"
                          style={{ fontSize: "1.2rem", fontWeight: "500" }}
                        >
                          Costo Estimado
                        </label>
                        <input
                          type="number"
                          className="form-control form-control-lg"
                          value={formData.costoEstimado}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              costoEstimado: Number(e.target.value),
                            })
                          }
                          min="0"
                          style={{ fontSize: "1.1rem" }}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12 mb-4">
                        <label
                          className="form-label"
                          style={{ fontSize: "1.2rem", fontWeight: "500" }}
                        >
                          Descripción Vehículo
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          value={formData.descVehiculo}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              descVehiculo: e.target.value,
                            })
                          }
                          placeholder="Ej: Toyota Corolla 2020"
                          style={{ fontSize: "1.1rem" }}
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label
                        className="form-label"
                        style={{ fontSize: "1.2rem", fontWeight: "500" }}
                      >
                        Categorías
                      </label>
                      <div className="d-flex flex-wrap gap-2">
                        {categorias.map((cat) => (
                          <div key={cat.id} className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={formData.categorias.includes(cat.id!)}
                              onChange={() => handleCategoriaChange(cat.id!)}
                              id={`cat-${cat.id}`}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`cat-${cat.id}`}
                              style={{ fontSize: "1.1rem" }}
                            >
                              {cat.descripcion}
                            </label>
                          </div>
                        ))}
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
                    Modificar Viaje
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
                        ID del Viaje a Modificar
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-lg"
                        placeholder="Ingrese el ID"
                        value={searchCategoriaId}
                        onChange={(e) => setSearchCategoriaId(e.target.value)}
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
                            Organizador *
                          </label>
                          <select
                            className="form-select form-select-lg"
                            value={formData.idOrganizador}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                idOrganizador: Number(e.target.value),
                              })
                            }
                            style={{ fontSize: "1.1rem" }}
                          >
                            <option value={0}>Seleccione un organizador</option>
                            {pasajeros.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.nombre} {p.apellido}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-6 mb-4">
                          <label
                            className="form-label"
                            style={{ fontSize: "1.2rem", fontWeight: "500" }}
                          >
                            Ciudad *
                          </label>
                          <select
                            className="form-select form-select-lg"
                            value={formData.idCiudad}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                idCiudad: Number(e.target.value),
                              })
                            }
                            style={{ fontSize: "1.1rem" }}
                          >
                            <option value={0}>Seleccione una ciudad</option>
                            {ciudades.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.nombre}, {c.provincia}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6 mb-4">
                          <label
                            className="form-label"
                            style={{ fontSize: "1.2rem", fontWeight: "500" }}
                          >
                            Fecha Salida *
                          </label>
                          <input
                            type="datetime-local"
                            className="form-control form-control-lg"
                            value={formData.fechaSalida}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                fechaSalida: e.target.value,
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
                            Fecha Llegada *
                          </label>
                          <input
                            type="datetime-local"
                            className="form-control form-control-lg"
                            value={formData.fechaLlegada}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                fechaLlegada: e.target.value,
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
                            Estado
                          </label>
                          <select
                            className="form-select form-select-lg"
                            value={formData.estado}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                estado: e.target.value,
                              })
                            }
                            style={{ fontSize: "1.1rem" }}
                          >
                            <option value="disponible">Disponible</option>
                            <option value="en curso">En Curso</option>
                            <option value="finalizado">Finalizado</option>
                            <option value="cancelado">Cancelado</option>
                          </select>
                        </div>
                        <div className="col-md-6 mb-4">
                          <label
                            className="form-label"
                            style={{ fontSize: "1.2rem", fontWeight: "500" }}
                          >
                            Cupos
                          </label>
                          <input
                            type="number"
                            className="form-control form-control-lg"
                            value={formData.cupos}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                cupos: Number(e.target.value),
                              })
                            }
                            min="1"
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
                            Costo Estimado
                          </label>
                          <input
                            type="number"
                            className="form-control form-control-lg"
                            value={formData.costoEstimado}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                costoEstimado: Number(e.target.value),
                              })
                            }
                            min="0"
                            style={{ fontSize: "1.1rem" }}
                          />
                        </div>
                        <div className="col-md-6 mb-4">
                          <label
                            className="form-label"
                            style={{ fontSize: "1.2rem", fontWeight: "500" }}
                          >
                            Descripción Vehículo
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-lg"
                            value={formData.descVehiculo}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                descVehiculo: e.target.value,
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
                          Categorías
                        </label>
                        <div className="d-flex flex-wrap gap-2">
                          {categorias.map((cat) => (
                            <div key={cat.id} className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={formData.categorias.includes(cat.id!)}
                                onChange={() => handleCategoriaChange(cat.id!)}
                                id={`cat-mod-${cat.id}`}
                              />
                              <label
                                className="form-check-label"
                                htmlFor={`cat-mod-${cat.id}`}
                                style={{ fontSize: "1.1rem" }}
                              >
                                {cat.descripcion}
                              </label>
                            </div>
                          ))}
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
                    Eliminar Viaje
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
                        ID del Viaje a Eliminar
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-lg"
                        placeholder="Ingrese el ID"
                        value={searchCategoriaId}
                        onChange={(e) => setSearchCategoriaId(e.target.value)}
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
