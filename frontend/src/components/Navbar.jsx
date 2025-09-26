import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">🎬 Netflix Admin</NavLink>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><NavLink className="nav-link" to="/peliculas">Películas</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/peliculas/stats">Estadísticas</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/types">Tipos</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/ratings">Ratings</NavLink></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
