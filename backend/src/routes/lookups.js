import {Router} from 'express';
import {pool} from '../db.js'

const router = Router();



/**
 * GET all types
 */
router.get("/types", async (_req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT * FROM dim_type ORDER BY id ASC");
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "No se encontraron tipos" });
    }
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

/**
 * GET one type by id
 */
router.get("/types/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM dim_type WHERE id = $1", [
      id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Tipo no encontrado" });
    }
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

/**
 * POST create a new type
 */
router.post("/types", async (req, res, next) => {
  try {
    const { value } = req.body;
    if (!value) return res.status(400).json({ error: "El campo 'value' es requerido" });

    const { rows } = await pool.query(
      "INSERT INTO dim_type (value) VALUES ($1) RETURNING *",
      [value]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

/**
 * PUT update a type
 */
router.put("/types/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { value } = req.body;

    const { rows } = await pool.query(
      "UPDATE dim_type SET value = $1 WHERE id = $2 RETURNING *",
      [value, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Tipo no encontrado" });
    }

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE remove a type
 */
router.delete("/types/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const { rowCount } = await pool.query("DELETE FROM dim_type WHERE id = $1", [
      id,
    ]);

    if (rowCount === 0) {
      return res.status(404).json({ error: "Tipo no encontrado" });
    }

    res.json({ message: "Tipo eliminado correctamente" });
  } catch (err) {
    next(err);
  }
});




/**
 * GET all ratings
 */
router.get("/ratings", async (_req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT * FROM dim_rating ORDER BY value ASC");
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "No se encontraron ratings" });
    }
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

/**
 * GET one rating by id
 */
router.get("/ratings/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM dim_rating WHERE id = $1", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Rating no encontrado" });
    }
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

/**
 * POST create a new rating
 */
router.post("/ratings", async (req, res, next) => {
  try {
    const { value } = req.body;
    if (!value) return res.status(400).json({ error: "El campo 'value' es requerido" });

    const { rows } = await pool.query(
      "INSERT INTO dim_rating (value) VALUES ($1) RETURNING *",
      [value]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

/**
 * PUT update a rating
 */
router.put("/ratings/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { value } = req.body;

    const { rows } = await pool.query(
      "UPDATE dim_rating SET value = $1 WHERE id = $2 RETURNING *",
      [value, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Rating no encontrado" });
    }

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE remove a rating
 */
router.delete("/ratings/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const { rowCount } = await pool.query("DELETE FROM dim_rating WHERE id = $1", [id]);

    if (rowCount === 0) {
      return res.status(404).json({ error: "Rating no encontrado" });
    }

    res.json({ message: "Rating eliminado correctamente" });
  } catch (err) {
    next(err);
  }
});

// /peliculas/type/:type_id → filtrar por tipo.
// /peliculas/rating/:rating_id → filtrar por rating.
// /peliculas/search/:query → buscar por título.
// /peliculas/recent/:limit → top N películas recientes.
// /peliculas/stats/rating → estadísticas por clasificación.
// /peliculas/stats/type → estadísticas por tipo.
// /peliculas/stats/paises → top 10 países con más películas.

/**
 * GET todas las películas con tipo y rating
*/
// sin paginacion
// router.get("/peliculas", async (_req, res, next) => {
//   try {
//     const { rows } = await pool.query(`
//       SELECT p.*, 
//              t.value AS tipo_nombre,
//              r.value AS rating_nombre
//       FROM peliculas p
//       LEFT JOIN dim_type t ON p.type_id = t.id
//       LEFT JOIN dim_rating r ON p.rating_id = r.id
//       ORDER BY p.id ASC
//     `);
//     res.json(rows);
//   } catch (err) {
//     next(err);
//   }
// });

// GET /peliculas ?page=1&page_size=20&order_by=titulo&order_dir=asc&q=matrix
router.get("/peliculas", async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const page_size = Math.min(Math.max(parseInt(req.query.page_size || "20", 10), 1), 100);
    const q = (req.query.q || "").toString().trim();

    // ✅ Mapeo a columnas REALES
    const allowedOrder = {
      id: "p.id",
      titulo: "p.titulo",         // <-- antes era p.title (incorrecto)
      year: "p.release_year",
      rating: "r.value",
      type: "t.value",
    };
    const order_by = allowedOrder[req.query.order_by] || "p.id";
    const order_dir = (req.query.order_dir || "asc").toString().toUpperCase() === "DESC" ? "DESC" : "ASC";

    // filtros
    const where = [];
    const values = [];
    let idx = 1;

    if (q) { where.push(`p.titulo ILIKE '%' || $${idx} || '%'`); values.push(q); idx++; }
    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    // total
    const countSql = `SELECT COUNT(*)::int AS total FROM peliculas p ${whereSql}`;
    const total = (await pool.query(countSql, values)).rows[0].total;

    // datos
    const offset = (page - 1) * page_size;
    const dataSql = `
      SELECT p.*,
             t.value AS tipo_nombre,
             r.value AS rating_nombre
      FROM peliculas p
      LEFT JOIN dim_type   t ON p.type_id   = t.id
      LEFT JOIN dim_rating r ON p.rating_id = r.id
      ${whereSql}
      ORDER BY ${order_by} ${order_dir}
      OFFSET $${idx} LIMIT $${idx + 1}
    `;
    const { rows } = await pool.query(dataSql, [...values, offset, page_size]);

    res.json({ total, page, page_size, items: rows });
  } catch (err) { next(err); }
});


/**
 * GET una película por id
 */
router.get("/peliculas/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(`
      SELECT p.*, 
             t.value AS tipo_nombre,
             r.value AS rating_nombre
      FROM peliculas p
      LEFT JOIN dim_type t ON p.type_id = t.id
      LEFT JOIN dim_rating r ON p.rating_id = r.id
      WHERE p.id = $1
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Película no encontrada" });
    }
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

/**
 * POST crear nueva película
 */
router.post("/peliculas", async (req, res, next) => {
  try {
    const {
      id, tipo, titulo, director, actores, pais,
      date_added, release_year, rating, duration,
      listed_in, description, type_id, rating_id
    } = req.body;

    const { rows } = await pool.query(`
      INSERT INTO peliculas (
        id, tipo, titulo, director, actores, pais, date_added,
        release_year, rating, duration, listed_in, description,
        type_id, rating_id
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      RETURNING *
    `, [
      id, tipo, titulo, director, actores, pais, date_added,
      release_year, rating, duration, listed_in, description,
      type_id, rating_id
    ]);

    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

/**
 * PUT actualizar película por id
 */
router.put("/peliculas/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      tipo, titulo, director, actores, pais,
      date_added, release_year, rating, duration,
      listed_in, description, type_id, rating_id
    } = req.body;

    const { rows } = await pool.query(`
      UPDATE peliculas
      SET tipo=$1, titulo=$2, director=$3, actores=$4, pais=$5,
          date_added=$6, release_year=$7, rating=$8, duration=$9,
          listed_in=$10, description=$11, type_id=$12, rating_id=$13
      WHERE id=$14
      RETURNING *
    `, [
      tipo, titulo, director, actores, pais, date_added,
      release_year, rating, duration, listed_in, description,
      type_id, rating_id, id
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Película no encontrada" });
    }
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE eliminar película por id
 */
router.delete("/peliculas/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query("DELETE FROM peliculas WHERE id=$1", [id]);

    if (rowCount === 0) {
      return res.status(404).json({ error: "Película no encontrada" });
    }
    res.json({ message: "Película eliminada correctamente" });
  } catch (err) {
    next(err);
  }
});

/* ================================
   📊 ENDPOINTS AVANZADOS
================================ */

/**
 * Filtrar películas por tipo
 */
router.get("/peliculas/type/:type_id", async (req, res, next) => {
  try {
    const { type_id } = req.params;
    const { rows } = await pool.query(`
      SELECT * FROM peliculas WHERE type_id = $1
    `, [type_id]);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

/**
 * Filtrar películas por rating
 */
router.get("/peliculas/rating/:rating_id", async (req, res, next) => {
  try {
    const { rating_id } = req.params;
    const { rows } = await pool.query(`
      SELECT * FROM peliculas WHERE rating_id = $1
    `, [rating_id]);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

/**
 * Buscar películas por título
 */
router.get("/peliculas/search/:query", async (req, res, next) => {
  try {
    const { query } = req.params;
    const { rows } = await pool.query(`
      SELECT * FROM peliculas 
      WHERE titulo ILIKE '%' || $1 || '%'
    `, [query]);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

/**
 * Top N películas más recientes
 */
router.get("/peliculas/recent/:limit", async (req, res, next) => {
  try {
    const { limit } = req.params;
    const { rows } = await pool.query(`
      SELECT * FROM peliculas
      ORDER BY release_year DESC
      LIMIT $1
    `, [limit]);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

/**
 * Estadísticas de películas por rating
 */
router.get("/peliculas/stats/rating", async (_req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT r.value AS rating, COUNT(*) AS cantidad
      FROM peliculas p
      LEFT JOIN dim_rating r ON p.rating_id = r.id
      GROUP BY r.value
      ORDER BY cantidad DESC
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

/**
 * Estadísticas de películas por tipo
 */
router.get("/peliculas/stats/type", async (_req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT t.value AS tipo, COUNT(*) AS cantidad
      FROM peliculas p
      LEFT JOIN dim_type t ON p.type_id = t.id
      GROUP BY t.value
      ORDER BY cantidad DESC
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

/**
 * Top países con más películas
 */
router.get("/peliculas/stats/paises", async (_req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT pais, COUNT(*) AS cantidad
      FROM peliculas
      GROUP BY pais
      ORDER BY cantidad DESC
      LIMIT 10
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

export default router;