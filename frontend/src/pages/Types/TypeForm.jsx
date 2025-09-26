import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";

export default function TypeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [value, setValue] = useState("");

  useEffect(() => {
    if (id) api.get(`/types/${id}`).then(res => setValue(res.data.value));
  }, [id]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (id) await api.put(`/types/${id}`, { value });
    else await api.post("/types", { value });
    navigate("/types");
  };

  return (
    <div className="container mt-4">
      <h2>{id ? "Editar" : "Nuevo"} Tipo</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Valor</label>
          <input className="form-control" value={value} onChange={e => setValue(e.target.value)} />
        </div>
        <button className="btn btn-success" type="submit">Guardar</button>
      </form>
    </div>
  );
}
