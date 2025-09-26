import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";

// Películas
import PeliculasList from "./pages/Peliculas/PeliculasList";
import PeliculaForm from "./pages/Peliculas/PeliculaForm";
import PeliculasStats from "./pages/Peliculas/PeliculasStats";

// Types
import TypesList from "./pages/Types/TypesList";
import TypeForm from "./pages/Types/TypeForm";

// Ratings
import RatingsList from "./pages/Ratings/RatingsList";
import RatingForm from "./pages/Ratings/RatingForm";

export default function App() {
  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          {/* Redirigir raíz */}
          <Route path="/" element={<Navigate to="/peliculas" replace />} />

          {/* Películas */}
          <Route path="/peliculas" element={<PeliculasList />} />
          <Route path="/peliculas/nueva" element={<PeliculaForm />} />
          <Route path="/peliculas/edit/:id" element={<PeliculaForm />} />
          <Route path="/peliculas/stats" element={<PeliculasStats />} />

          {/* Types */}
          <Route path="/types" element={<TypesList />} />
          <Route path="/types/nueva" element={<TypeForm />} />
          <Route path="/types/edit/:id" element={<TypeForm />} />

          {/* Ratings */}
          <Route path="/ratings" element={<RatingsList />} />
          <Route path="/ratings/nueva" element={<RatingForm />} />
          <Route path="/ratings/edit/:id" element={<RatingForm />} />
        </Routes>
      </div>
    </>
  );
}
