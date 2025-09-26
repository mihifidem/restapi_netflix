import { useEffect, useState } from "react";
import api from "../../api";

export default function PeliculasStats() {
  const [byType, setByType] = useState([]);
  const [byRating, setByRating] = useState([]);
  const [byCountry, setByCountry] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get("/peliculas/stats/type"),
      api.get("/peliculas/stats/rating"),
      api.get("/peliculas/stats/paises"),
    ]).then(([t, r, c]) => {
      setByType(t.data);
      setByRating(r.data);
      setByCountry(c.data);
    });
  }, []);

  return (
    <div className="container mt-4">
      <h2>📊 Estadísticas de Películas</h2>

      <h4 className="mt-4">Por Tipo</h4>
      <ul className="list-group mb-3">
        {byType.map(x => (
          <li key={x.tipo} className="list-group-item d-flex justify-content-between">
            {x.tipo || "—"} <span className="badge bg-primary">{x.cantidad}</span>
          </li>
        ))}
      </ul>

      <h4>Por Rating</h4>
      <ul className="list-group mb-3">
        {byRating.map(x => (
          <li key={x.rating} className="list-group-item d-flex justify-content-between">
            {x.rating || "—"} <span className="badge bg-success">{x.cantidad}</span>
          </li>
        ))}
      </ul>

      <h4>Top Países</h4>
      <ul className="list-group">
        {byCountry.map(x => (
          <li key={x.pais} className="list-group-item d-flex justify-content-between">
            {x.pais || "—"} <span className="badge bg-warning text-dark">{x.cantidad}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
