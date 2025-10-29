import { useState } from "react";

interface SubNavBarProps {
  entity: string;
  onConsultar: (id: string) => void;
  onModificar: (id: string) => void;
  onEliminar: (id: string) => void;
}

export default function SubNavBar({
  entity,
  onConsultar,
  onModificar,
  onEliminar,
}: SubNavBarProps) {
  const [searchId, setSearchId] = useState("");

  const handleConsultar = () => {
    if (searchId.trim()) {
      onConsultar(searchId);
    }
  };

  const handleModificar = () => {
    if (searchId.trim()) {
      onModificar(searchId);
    }
  };

  const handleEliminar = () => {
    if (searchId.trim()) {
      onEliminar(searchId);
    }
  };

  return (
    <nav
      className="navbar navbar-expand-lg bg-dark"
      data-bs-theme="dark"
      style={{
        position: "fixed",
        top: "90px",
        left: 0,
        right: 0,
        zIndex: 1020,
      }}
    >
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          {entity.charAt(0).toUpperCase() + entity.slice(1)}
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarColor02"
          aria-controls="navbarColor02"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarColor02">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <a
                className="nav-link"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleConsultar();
                }}
              >
                Consultar
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleModificar();
                }}
              >
                Modificar
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleEliminar();
                }}
              >
                Eliminar
              </a>
            </li>
          </ul>
          <form
            className="d-flex"
            onSubmit={(e) => {
              e.preventDefault();
              handleConsultar();
            }}
          >
            <input
              className="form-control me-sm-2"
              type="search"
              placeholder={`Buscar ${entity} por ID`}
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <button className="btn btn-secondary my-2 my-sm-0" type="submit">
              Buscar
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}
