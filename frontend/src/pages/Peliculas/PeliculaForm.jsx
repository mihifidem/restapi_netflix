import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";

export default function PeliculaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    id: "",
    titulo: "",
    director: "",
    type_id: "",
    rating_id: ""
  });
  const [types, setTypes] = useState([]);
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    api.get("/types").then(res => setTypes(res.data));
    api.get("/ratings").then(res => setRatings(res.data));
    if (id) {
      api.get(`/peliculas/${id}`).then(res => setForm(res.data));
    }
  }, [id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (id) await api.put(`/peliculas/${id}`, form);
    else await api.post("/peliculas", form);
    navigate("/peliculas");
  };

  return (
    <div className="container mt-4">
      <h2>{id ? "Editar" : "Nueva"} Película</h2>
      <form onSubmit={handleSubmit} className="row g-3">
        {!id && (
          <div className="col-md-6">
            <label className="form-label">ID</label>
            <input className="form-control" name="id" value={form.id} onChange={handleChange} />
          </div>
        )}
        <div className="col-md-6">
          <label className="form-label">Título</label>
          <input className="form-control" name="titulo" value={form.titulo} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Director</label>
          <input className="form-control" name="director" value={form.director} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Tipo</label>
          <select className="form-select" name="type_id" value={form.type_id} onChange={handleChange}>
            <option value="">Seleccionar</option>
            {types.map(t => <option key={t.id} value={t.id}>{t.value}</option>)}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Rating</label>
          <select className="form-select" name="rating_id" value={form.rating_id} onChange={handleChange}>
            <option value="">Seleccionar</option>
            {ratings.map(r => <option key={r.id} value={r.id}>{r.value}</option>)}
          </select>
        </div>
        <div className="col-12">
          <button className="btn btn-success" type="submit">Guardar</button>
        </div>
      </form>
    </div>
  );
}
