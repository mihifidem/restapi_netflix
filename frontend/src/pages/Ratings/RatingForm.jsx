import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";

export default function RatingForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [value, setValue] = useState("");

  useEffect(() => {
    if (id) {
      api.get(`/ratings/${id}`).then(({ data }) => setValue(data.value));
    }
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    if (id) {
      await api.put(`/ratings/${id}`, { value });
    } else {
      await api.post("/ratings", { value });
    }
    navigate("/ratings");
  };

  return (
    <div className="container mt-4">
      <h2>{id ? "Editar Rating" : "Nuevo Rating"}</h2>
      <form onSubmit={submit}>
        <div className="mb-3">
          <label className="form-label">Valor</label>
          <input
            className="form-control"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <button className="btn btn-success" type="submit">
          Guardar
        </button>
      </form>
    </div>
  );
}
