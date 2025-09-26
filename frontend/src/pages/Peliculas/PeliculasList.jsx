import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import api from "../../api";

export default function PeliculasList() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [orderBy, setOrderBy] = useState("id");       // id | title | year | rating | type
  const [orderDir, setOrderDir] = useState("asc");    // asc | desc
  const [q, setQ] = useState("");                     // búsqueda por título
  const [loading, setLoading] = useState(false);

  const totalPages = useMemo(() => Math.max(Math.ceil(total / pageSize), 1), [total, pageSize]);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/peliculas", {
        params: { page, page_size: pageSize, order_by: orderBy, order_dir: orderDir, q }
      });
      setItems(data.items);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [page, pageSize, orderBy, orderDir]); // carga por cambios de paginación/orden
  // Búsqueda: cuando cambie q, reiniciamos a página 1 y recargamos con pequeña espera (debounce simple)
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); load(); }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [q]);

  const remove = async (id) => {
    if (!confirm("¿Eliminar película?")) return;
    await api.delete(`/peliculas/${id}`);
    // si borramos la última de la página, ajustamos
    if (items.length === 1 && page > 1) setPage(page - 1);
    else load();
  };

  const prev = () => setPage(p => Math.max(p - 1, 1));
  const next = () => setPage(p => Math.min(p + 1, totalPages));

  return (
    <div className="container mt-4">
      <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-3">
        <h2 className="m-0">Películas</h2>
        <div className="d-flex flex-wrap gap-2 align-items-center">
          <input
            className="form-control"
            style={{ minWidth: 240 }}
            placeholder="Buscar por título…"
            value={q}
            onChange={e => setQ(e.target.value)}
          />
          <select
            className="form-select"
            value={orderBy}
            onChange={e => setOrderBy(e.target.value)}
          >
            <option value="id">Orden: ID</option>
            <option value="title">Orden: Título</option>
            <option value="year">Orden: Año</option>
            <option value="rating">Orden: Rating</option>
            <option value="type">Orden: Tipo</option>
          </select>
          <select
            className="form-select"
            value={orderDir}
            onChange={e => setOrderDir(e.target.value)}
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
          <select
            className="form-select"
            value={pageSize}
            onChange={e => { setPage(1); setPageSize(parseInt(e.target.value, 10)); }}
          >
            <option value="5">5 / pág</option>
            <option value="10">10 / pág</option>
            <option value="20">20 / pág</option>
            <option value="50">50 / pág</option>
          </select>
          <Link to="/peliculas/nueva" className="btn btn-primary">➕ Nueva</Link>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="small text-muted">
          {loading ? "Cargando…" : `Total: ${total} | Página ${page} de ${totalPages}`}
        </div>
        <div className="btn-group">
          <button className="btn btn-outline-secondary" onClick={prev} disabled={page <= 1}>⟵ Anterior</button>
          <button className="btn btn-outline-secondary" onClick={next} disabled={page >= totalPages}>Siguiente ⟶</button>
        </div>
      </div>

      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>ID</th><th>Título</th><th>Tipo</th><th>Rating</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map(p => (
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
          {!loading && items.length === 0 && (
            <tr><td colSpan="5">No hay películas</td></tr>
          )}
          {loading && (
            <tr><td colSpan="5">Cargando…</td></tr>
          )}
        </tbody>
      </table>
{/* <ul className="pagination">
  {Array.from({ length: totalPages }).map((_, i) => {
    const n = i + 1;
    return (
      <li key={n} className={`page-item ${n === page ? "active" : ""}`}>
        <button className="page-link" onClick={() => setPage(n)}>{n}</button>
      </li>
    );
  })}
</ul> */}




      <div className="d-flex justify-content-end gap-2">
        <button className="btn btn-outline-secondary" onClick={prev} disabled={page <= 1}>⟵ Anterior</button>
        <button className="btn btn-outline-secondary" onClick={next} disabled={page >= totalPages}>Siguiente ⟶</button>
      </div>
    </div>
  );
}
