import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav
      className="navbar navbar-expand-lg bg-primary fixed-top"
      data-bs-theme="dark"
    >
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Sistema de Viajes
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarColor01"
          aria-controls="navbarColor01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarColor01">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link active" to="/">
                Inicio
                <span className="visually-hidden">(current)</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/pasajeros">
                Pasajeros
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/viajes">
                Viajes
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/ciudades">
                Ciudades
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/categorias">
                Categorías
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
