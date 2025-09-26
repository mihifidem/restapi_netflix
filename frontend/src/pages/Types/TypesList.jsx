import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";

export default function TypesList() {
  const [types, setTypes] = useState([]);

  const load = async () => {
    const { data } = await api.get("/types");
    setTypes(data);
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!confirm("¿Eliminar tipo?")) return;
    await api.delete(`/types/${id}`);
    load();
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Tipos</h2>
        <Link to="/types/nueva" className="btn btn-primary">➕ Nuevo</Link>
      </div>
      <ul className="list-group">
        {types.map(t => (
          <li key={t.id} className="list-group-item d-flex justify-content-between align-items-center">
            {t.value}
            <div>
              <Link to={`/types/edit/${t.id}`} className="btn btn-sm btn-warning me-2">Editar</Link>
              <button onClick={() => remove(t.id)} className="btn btn-sm btn-danger">Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
