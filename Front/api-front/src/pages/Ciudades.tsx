import { useState } from "react";
import SubNavBar from "../components/SubNavBar.tsx";
import ciudadService, { Ciudad } from "../services/Ciudad.Service.ts";
import PrimaryButton from "../components/PrimaryButton.tsx";
import FormInput from "../components/FormInput.tsx";
import FormCard from "../components/FormCard.tsx";
import AlertMessage from "../components/AlertMessage.tsx";
import GeneralCard from "../components/GeneralCard.tsx";

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

            {loading && <AlertMessage type="loading" />}
            {error && <AlertMessage type="error" message={error} />}
            {successMessage && (
              <AlertMessage type="success" message={successMessage} />
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
              <FormCard title="Consultar Ciudad por ID">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleBuscarUno();
                  }}
                >
                  <FormInput
                    label="ID de la Ciudad"
                    type="number"
                    value={searchId}
                    onChange={setSearchId}
                    placeholder="Ingrese el ID"
                  />
                  <PrimaryButton
                    texto={loading ? "Buscando..." : "Buscar"}
                    onClick={handleBuscarUno}
                    color="primary"
                  />
                </form>

                {ciudadEncontrada && (
                  <GeneralCard
                    title="Resultado:"
                    data={[
                      { label: "ID", value: ciudadEncontrada.id },
                      { label: "Nombre", value: ciudadEncontrada.nombre },
                      { label: "Provincia", value: ciudadEncontrada.provincia },
                      { label: "Latitud", value: ciudadEncontrada.latitud },
                      { label: "Longitud", value: ciudadEncontrada.longitud },
                    ]}
                  />
                )}
              </FormCard>
            )}

            {/* Vista: Agregar */}
            {vistaActual === "agregar" && (
              <FormCard title="Agregar Nueva Ciudad">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleGuardarNuevo();
                  }}
                >
                  <div className="row">
                    <div className="col-md-6">
                      <FormInput
                        label="Nombre"
                        value={formData.nombre}
                        onChange={(value) =>
                          setFormData({ ...formData, nombre: value })
                        }
                        placeholder="Ingrese el nombre"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <FormInput
                        label="Provincia"
                        value={formData.provincia}
                        onChange={(value) =>
                          setFormData({ ...formData, provincia: value })
                        }
                        placeholder="Ingrese la provincia"
                        required
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <FormInput
                        label="Latitud"
                        type="number"
                        step="any"
                        value={formData.latitud}
                        onChange={(value) =>
                          setFormData({ ...formData, latitud: Number(value) })
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <FormInput
                        label="Longitud"
                        type="number"
                        step="any"
                        value={formData.longitud}
                        onChange={(value) =>
                          setFormData({ ...formData, longitud: Number(value) })
                        }
                      />
                    </div>
                  </div>
                  <PrimaryButton
                    texto={loading ? "Guardando..." : "Guardar"}
                    onClick={handleGuardarNuevo}
                    color="primary"
                  />
                </form>
              </FormCard>
            )}

            {/* Vista: Modificar */}
            {vistaActual === "modificar" && (
              <FormCard title="Modificar Ciudad">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleBuscarModificar();
                  }}
                >
                  <FormInput
                    label="ID de la Ciudad a Modificar"
                    type="number"
                    value={searchId}
                    onChange={setSearchId}
                    placeholder="Ingrese el ID"
                  />
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
                    <h5 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>
                      Editar Datos
                    </h5>
                    <FormInput
                      label="ID"
                      value={formData.id}
                      onChange={() => {}}
                      disabled
                    />
                    <div className="row">
                      <div className="col-md-6">
                        <FormInput
                          label="Nombre"
                          value={formData.nombre}
                          onChange={(value) =>
                            setFormData({ ...formData, nombre: value })
                          }
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <FormInput
                          label="Provincia"
                          value={formData.provincia}
                          onChange={(value) =>
                            setFormData({ ...formData, provincia: value })
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <FormInput
                          label="Latitud"
                          type="number"
                          step="any"
                          value={formData.latitud}
                          onChange={(value) =>
                            setFormData({ ...formData, latitud: Number(value) })
                          }
                        />
                      </div>
                      <div className="col-md-6">
                        <FormInput
                          label="Longitud"
                          type="number"
                          step="any"
                          value={formData.longitud}
                          onChange={(value) =>
                            setFormData({
                              ...formData,
                              longitud: Number(value),
                            })
                          }
                        />
                      </div>
                    </div>
                    <PrimaryButton
                      texto={loading ? "Actualizando..." : "Actualizar"}
                      onClick={handleGuardarModificacion}
                      color="success"
                    />
                  </form>
                )}
              </FormCard>
            )}

            {/* Vista: Eliminar */}
            {vistaActual === "eliminar" && (
              <FormCard
                title="Eliminar Ciudad"
                titleColor="#dc3545"
                borderColor="danger"
                warning="Esta acción no se puede deshacer"
              >
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleConfirmarEliminar();
                  }}
                >
                  <FormInput
                    label="ID de la Ciudad a Eliminar"
                    type="number"
                    value={searchId}
                    onChange={setSearchId}
                    placeholder="Ingrese el ID"
                  />
                  <PrimaryButton
                    texto={loading ? "Eliminando..." : "Eliminar"}
                    onClick={handleConfirmarEliminar}
                    color="danger"
                  />
                </form>
              </FormCard>
            )}

            {/* Vista: Inicio */}
            {vistaActual === "inicio" && (
              <AlertMessage
                type="info"
                message="👆 Seleccione una opción del menú superior para comenzar"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
