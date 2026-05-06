-- Migration: Content library (biblioteca) for pre-generated resources
-- Run AFTER base schema

CREATE TABLE IF NOT EXISTS biblioteca (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  materia text NOT NULL,
  grado text NOT NULL,
  pda text NOT NULL,
  contenido_pda text,
  tema text,
  metodologia text NOT NULL,
  dificultad text NOT NULL DEFAULT 'Media',
  tipo_recurso text NOT NULL DEFAULT 'ejercicio',
  preguntas jsonb NOT NULL,
  numero_preguntas int NOT NULL DEFAULT 1,
  idioma text NOT NULL DEFAULT 'es',
  validacion_factual int,
  validacion_metodologica int,
  aprobado boolean NOT NULL DEFAULT false,
  favoritos_count int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Index for search
CREATE INDEX IF NOT EXISTS idx_biblioteca_materia_grado ON biblioteca(materia, grado);
CREATE INDEX IF NOT EXISTS idx_biblioteca_pda ON biblioteca USING gin(to_tsvector('spanish', pda));
CREATE INDEX IF NOT EXISTS idx_biblioteca_tema ON biblioteca USING gin(to_tsvector('spanish', tema));

-- RLS: any authenticated user can read approved resources
ALTER TABLE biblioteca ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read approved biblioteca"
  ON biblioteca FOR SELECT
  USING (aprobado = true);

-- Favoritos per teacher
CREATE TABLE IF NOT EXISTS biblioteca_favoritos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profesor_id uuid NOT NULL REFERENCES profesores(id) ON DELETE CASCADE,
  recurso_id uuid NOT NULL REFERENCES biblioteca(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(profesor_id, recurso_id)
);

ALTER TABLE biblioteca_favoritos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers manage their own favoritos"
  ON biblioteca_favoritos FOR ALL
  USING (profesor_id = auth.uid());
