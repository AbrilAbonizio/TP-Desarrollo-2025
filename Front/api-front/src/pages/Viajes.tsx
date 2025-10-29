import SubNavBar from "../components/SubNavBar.tsx";

export default function Viajes() {
  const handleConsultar = (id: string) => {
    console.log("Consultar viaje con ID:", id);
    // Aquí irá la lógica para obtener un viaje por ID
  };

  const handleModificar = (id: string) => {
    console.log("Modificar viaje con ID:", id);
    // Aquí irá la lógica para modificar un viaje
  };

  const handleEliminar = (id: string) => {
    console.log("Eliminar viaje con ID:", id);
    // Aquí irá la lógica para eliminar un viaje
  };

  return (
    <div style={{ paddingTop: "130px" }}>
      <SubNavBar
        entity="viaje"
        onConsultar={handleConsultar}
        onModificar={handleModificar}
        onEliminar={handleEliminar}
      />
      <div className="container-fluid px-3 px-md-5 mt-4">
        <div className="row">
          <div className="col-12">
            <h1>Viajes</h1>
            <p>EN PRODUCCION</p>
          </div>
        </div>
      </div>
    </div>
  );
}
