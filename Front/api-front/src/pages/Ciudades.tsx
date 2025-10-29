import SubNavBar from "../components/SubNavBar.tsx";

export default function Ciudades() {
  const handleConsultar = (id: string) => {
    console.log("Consultar ciudad con ID:", id);
    // Aquí irá la lógica para obtener una ciudad por ID
  };

  const handleModificar = (id: string) => {
    console.log("Modificar ciudad con ID:", id);
    // Aquí irá la lógica para modificar una ciudad
  };

  const handleEliminar = (id: string) => {
    console.log("Eliminar ciudad con ID:", id);
    // Aquí irá la lógica para eliminar una ciudad
  };

  return (
    <div style={{ paddingTop: "180px" }}>
      <SubNavBar
        entity="ciudad"
        onConsultar={handleConsultar}
        onModificar={handleModificar}
        onEliminar={handleEliminar}
      />
      <div className="container-fluid px-3 px-md-5 mt-4">
        <div className="row">
          <div className="col-12">
            <h1>Ciudades</h1>
            <p>EN PRODUCCION</p>
          </div>
        </div>
      </div>
    </div>
  );
}
