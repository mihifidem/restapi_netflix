import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";

export default function PeliculasList() {
  const [peliculas, setPeliculas] = useState([]);

  const load = async () => {
    const { data } = await api.get("/peliculas");
    setPeliculas(data);
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!confirm("¿Eliminar película?")) return;
    await api.delete(`/peliculas/${id}`);
    load();
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Películas</h2>
        <Link to="/peliculas/nueva" className="btn btn-primary">➕ Nueva</Link>
      </div>

      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>ID</th><th>Título</th><th>Tipo</th><th>Rating</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {peliculas.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.titulo}</td>
              <td>{p.tipo_nombre}</td>
              <td>{p.rating_nombre}</td>
              <td>
                <Link to={`/peliculas/edit/${p.id}`} className="btn btn-sm btn-warning me-2">✏️ Editar</Link>
                <button onClick={() => remove(p.id)} className="btn btn-sm btn-danger">🗑️ Eliminar</button>
              </td>
            </tr>
          ))}
          {peliculas.length === 0 && <tr><td colSpan="5">No hay películas</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
