-- Esquema de la base del portafolio (SQLite / Turso)
-- Se puede correr varias veces: "IF NOT EXISTS" evita errores si las tablas ya existen.

-- ── Usuarios del panel (solo vos) ───────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  email         TEXT    NOT NULL UNIQUE COLLATE NOCASE,
  password_hash TEXT    NOT NULL,
  created_at    TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ── Proyectos ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT    NOT NULL,
  slug        TEXT    NOT NULL UNIQUE,
  summary     TEXT    NOT NULL DEFAULT '',
  description TEXT    NOT NULL DEFAULT '',          -- Markdown largo (opcional)
  repo_url    TEXT,
  demo_url    TEXT,
  cover_url   TEXT,
  cover_public_id TEXT,                         -- id de la imagen en Cloudinary (para borrarla)
  featured    INTEGER NOT NULL DEFAULT 0       CHECK (featured IN (0, 1)),            -- SQLite no tiene BOOLEAN
  status      TEXT    NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')), -- SQLite no tiene ENUM
  sort_order  INTEGER NOT NULL DEFAULT 0,          -- "order" es palabra reservada en SQL
  created_at  TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ── Tecnologías ──────────────────────────────────────────────────────
-- COLLATE NOCASE: "React" y "react" se consideran la misma.
CREATE TABLE IF NOT EXISTS technologies (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT    NOT NULL UNIQUE COLLATE NOCASE
);

-- ── Relación N:M proyecto ↔ tecnología ──────────────────────────────
CREATE TABLE IF NOT EXISTS project_technologies (
  project_id    INTEGER NOT NULL REFERENCES projects(id)     ON DELETE CASCADE,
  technology_id INTEGER NOT NULL REFERENCES technologies(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, technology_id)               -- clave compuesta: no se repite el par
);

-- ── Índices ──────────────────────────────────────────────────────────
-- Acelera la consulta pública: WHERE status = 'published' ORDER BY featured, sort_order
CREATE INDEX IF NOT EXISTS idx_projects_public  ON projects (status, featured, sort_order);
-- Acelera buscar "qué proyectos usan tal tecnología"
CREATE INDEX IF NOT EXISTS idx_pt_technology    ON project_technologies (technology_id);

-- ── updated_at automático ────────────────────────────────────────────
-- SQLite no tiene ON UPDATE CURRENT_TIMESTAMP, así que lo hace un trigger.
CREATE TRIGGER IF NOT EXISTS trg_projects_updated_at
AFTER UPDATE ON projects
FOR EACH ROW
WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE projects SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;
