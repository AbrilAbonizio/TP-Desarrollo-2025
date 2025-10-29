import SubNavBar from "../components/SubNavBar.tsx";

export default function Pasajeros() {
  const handleConsultar = (id: string) => {
    console.log("Consultar pasajero con ID:", id);
    // Aquí irá la lógica para obtener un pasajero por ID
  };

  const handleModificar = (id: string) => {
    console.log("Modificar pasajero con ID:", id);
    // Aquí irá la lógica para modificar un pasajero
  };

  const handleEliminar = (id: string) => {
    console.log("Eliminar pasajero con ID:", id);
    // Aquí irá la lógica para eliminar un pasajero
  };

  return (
    <div style={{ paddingTop: "130px" }}>
      <SubNavBar
        entity="pasajero"
        onConsultar={handleConsultar}
        onModificar={handleModificar}
        onEliminar={handleEliminar}
      />
      <div className="container-fluid px-3 px-md-5 mt-4">
        <div className="row">
          <div className="col-12">
            <h1>Pasajeros</h1>
            <p>EN PRODUCCION</p>
          </div>
        </div>
      </div>
    </div>
  );
}
