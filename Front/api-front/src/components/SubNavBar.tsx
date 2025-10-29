import { useState } from "react";

interface SubNavBarProps {
  entity: string;
  onConsultarTodos: () => void;
  onConsultar: (id: string) => void;
  onConsultarPorCategoria?: () => void;
  onAgregar: () => void;
  onModificar: (id: string) => void;
  onEliminar: (id: string) => void;
}

export default function SubNavBar({
  entity,
  onConsultarTodos,
  onConsultar,
  onConsultarPorCategoria,
  onAgregar,
  onModificar,
  onEliminar,
}: SubNavBarProps) {
  const [searchId, setSearchId] = useState("");

  const handleConsultar = () => {
    if (searchId.trim()) {
      onConsultar(searchId);
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
                  onConsultarTodos();
                }}
              >
                Consultar Todos
              </a>
            </li>

            {/* Dropdown para "Consultar Uno" */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="consultarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Consultar Uno
              </a>
              <ul className="dropdown-menu" aria-labelledby="consultarDropdown">
                <li>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onConsultar(""); // Llamar sin ID para mostrar el formulario
                    }}
                  >
                    🔍 Buscar por ID
                  </a>
                </li>
                {onConsultarPorCategoria && (
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onConsultarPorCategoria();
                      }}
                    >
                      🏷️ Buscar por Categoría
                    </a>
                  </li>
                )}
              </ul>
            </li>

            <li className="nav-item">
              <a
                className="nav-link"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onAgregar();
                }}
              >
                Agregar
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onModificar("");
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
                  onEliminar("");
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
