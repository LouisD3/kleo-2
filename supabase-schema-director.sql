-- Migration: School admin console (director role)
-- Run AFTER supabase-schema.sql, supabase-schema-gc.sql, supabase-schema-remediation.sql

-- 1. Add role column to profesores
ALTER TABLE profesores
ADD COLUMN IF NOT EXISTS rol text NOT NULL DEFAULT 'profesor'
CHECK (rol IN ('profesor', 'director'));

-- 2. Create escuelas table
CREATE TABLE IF NOT EXISTS escuelas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  director_id uuid NOT NULL REFERENCES profesores(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- 3. Link profesores to escuelas (a profesor belongs to one school)
ALTER TABLE profesores
ADD COLUMN IF NOT EXISTS escuela_id uuid REFERENCES escuelas(id) ON DELETE SET NULL;

-- 4. RLS policies for escuelas
ALTER TABLE escuelas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Directors can view their own school"
  ON escuelas FOR SELECT
  USING (director_id IN (
    SELECT id FROM profesores WHERE id = auth.uid()
  ));

CREATE POLICY "Directors can update their own school"
  ON escuelas FOR UPDATE
  USING (director_id IN (
    SELECT id FROM profesores WHERE id = auth.uid()
  ));

-- 5. Allow directors to read all profesores in their school
CREATE POLICY "Directors can view school profesores"
  ON profesores FOR SELECT
  USING (
    escuela_id IN (
      SELECT id FROM escuelas WHERE director_id IN (
        SELECT id FROM profesores WHERE id = auth.uid()
      )
    )
    OR id = auth.uid()
  );

-- 6. Allow directors to read classes of their school's teachers
CREATE POLICY "Directors can view school clases"
  ON clases FOR SELECT
  USING (
    profesor_id IN (
      SELECT p.id FROM profesores p
      JOIN escuelas e ON p.escuela_id = e.id
      WHERE e.director_id IN (
        SELECT id FROM profesores WHERE id = auth.uid()
      )
    )
  );

-- 7. Allow directors to read alumnos of their school
CREATE POLICY "Directors can view school alumnos"
  ON alumnos FOR SELECT
  USING (
    clase_id IN (
      SELECT c.id FROM clases c
      JOIN profesores p ON c.profesor_id = p.id
      JOIN escuelas e ON p.escuela_id = e.id
      WHERE e.director_id IN (
        SELECT id FROM profesores WHERE id = auth.uid()
      )
    )
  );

-- 8. Allow directors to read resultados of their school
CREATE POLICY "Directors can view school resultados"
  ON resultados FOR SELECT
  USING (
    tarea_id IN (
      SELECT t.id FROM tareas t
      JOIN clases c ON t.clase_id = c.id
      JOIN profesores p ON c.profesor_id = p.id
      JOIN escuelas e ON p.escuela_id = e.id
      WHERE e.director_id IN (
        SELECT id FROM profesores WHERE id = auth.uid()
      )
    )
  );

-- 9. Allow directors to read tareas of their school
CREATE POLICY "Directors can view school tareas"
  ON tareas FOR SELECT
  USING (
    clase_id IN (
      SELECT c.id FROM clases c
      JOIN profesores p ON c.profesor_id = p.id
      JOIN escuelas e ON p.escuela_id = e.id
      WHERE e.director_id IN (
        SELECT id FROM profesores WHERE id = auth.uid()
      )
    )
  );
