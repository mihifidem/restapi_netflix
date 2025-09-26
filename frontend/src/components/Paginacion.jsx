import { useState, useMemo } from "react";

function Paginacion({ total, page, setPage, pageSize }) {
  const totalPages = useMemo(() => Math.max(Math.ceil(total / pageSize), 1), [total, pageSize]);

  // bloque actual de 100
  const [pageBlock, setPageBlock] = useState(0);

  const start = pageBlock * 100 + 1;
  const end = Math.min(totalPages, (pageBlock + 1) * 100);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <ul className="pagination">
      {pages.map((n) => (
        <li key={n} className={`page-item ${n === page ? "active" : ""}`}>
          <button className="page-link" onClick={() => setPage(n)}>
            {n}
          </button>
        </li>
      ))}

      {/* Botón Ver más si aún hay más páginas */}
      {end < totalPages && (
        <li className="page-item">
          <button className="page-link" onClick={() => setPageBlock(b => b + 1)}>
            Ver más →
          </button>
        </li>
      )}

      {/* Botón Ver menos si no estamos en el primer bloque */}
      {pageBlock > 0 && (
        <li className="page-item">
          <button className="page-link" onClick={() => setPageBlock(b => Math.max(b - 1, 0))}>
            ← Ver menos
          </button>
        </li>
      )}
    </ul>
  );
}
