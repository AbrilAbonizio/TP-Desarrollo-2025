<<<<<<< Updated upstream
export default function Categorias() {
  return <h1>EN PRODUCCION</h1>;
=======
import { useNavigate } from "react-router-dom";

export default function Categorias() {
  const navigate = useNavigate();

  return (
    <div className="container mt-5 pt-5">
      <h1>Categorías</h1>
      <p>Página de categorías - Aquí se mostrarán las categorías de viajes</p>
      <button className="btn btn-primary" onClick={() => navigate("/")}>
        Volver al inicio
      </button>
    </div>
  );
>>>>>>> Stashed changes
}
