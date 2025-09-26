import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";

export default function RatingsList() {
  const [ratings, setRatings] = useState([]);

  const load = async () => {
    const { data } = await api.get("/ratings");
    setRatings(data);
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!confirm("¿Eliminar rating?")) return;
    await api.delete(`/ratings/${id}`);
    load();
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Ratings</h2>
        <Link to="/ratings/nueva" className="btn btn-primary">➕ Nuevo</Link>
      </div>
      <ul className="list-group">
        {ratings.map(r => (
          <li key={r.id} className="list-group-item d-flex justify-content-between align-items-center">
            {r.value}
            <div>
              <Link to={`/ratings/edit/${r.id}`} className="btn btn-sm btn-warning me-2">Editar</Link>
              <button onClick={() => remove(r.id)} className="btn btn-sm btn-danger">Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
