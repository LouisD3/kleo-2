-- ============================================================
-- Kleo CPA Migration — Phase 2
-- Run once on Supabase SQL editor (local dev).
-- ============================================================

BEGIN;

-- 1. Drop residual Google Classroom columns (if they exist)
ALTER TABLE profesores DROP COLUMN IF EXISTS gc_refresh_token;
ALTER TABLE profesores DROP COLUMN IF EXISTS gc_connected;
ALTER TABLE clases     DROP COLUMN IF EXISTS gc_course_id;
ALTER TABLE alumnos    DROP COLUMN IF EXISTS gc_user_id;
ALTER TABLE tareas     DROP COLUMN IF EXISTS gc_coursework_id;

-- 2. Wipe existing data (only 2 test users, clean slate)
TRUNCATE TABLE resultados CASCADE;
TRUNCATE TABLE tareas CASCADE;

-- 3. Modify tareas table for CPA
ALTER TABLE tareas RENAME COLUMN preguntas TO contenido_cpa;
ALTER TABLE tareas DROP COLUMN IF EXISTS materia;
ALTER TABLE tareas DROP COLUMN IF EXISTS metodologia;
ALTER TABLE tareas DROP COLUMN IF EXISTS tipos;
ALTER TABLE tareas DROP COLUMN IF EXISTS numero_preguntas;
ALTER TABLE tareas ADD COLUMN IF NOT EXISTS secuencia_ref INT NULL;

-- 4. Modify resultados table for CPA scoring
ALTER TABLE resultados ADD COLUMN IF NOT EXISTS scores_cpa JSONB NOT NULL DEFAULT '{}';
ALTER TABLE resultados ADD COLUMN IF NOT EXISTS numero_intentos INT NOT NULL DEFAULT 0;
ALTER TABLE resultados ADD COLUMN IF NOT EXISTS ultima_tentativa_at TIMESTAMPTZ NULL;

-- 5. Create intentos table
CREATE TABLE IF NOT EXISTS intentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resultado_id UUID NOT NULL REFERENCES resultados(id) ON DELETE CASCADE,
  alumno_id UUID NOT NULL REFERENCES alumnos(id) ON DELETE CASCADE,
  tarea_id UUID NOT NULL REFERENCES tareas(id) ON DELETE CASCADE,
  numero INT NOT NULL,
  inicio_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  fin_at TIMESTAMPTZ NULL,
  tiempo_concreto_ms INT NOT NULL DEFAULT 0,
  tiempo_pictorico_ms INT NOT NULL DEFAULT 0,
  tiempo_abstracto_ms INT NOT NULL DEFAULT 0,
  concreto JSONB NOT NULL DEFAULT '{}',
  pictorico JSONB NOT NULL DEFAULT '{}',
  abstracto JSONB NOT NULL DEFAULT '{}',
  scores_cpa JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_intentos_alumno_tarea ON intentos(alumno_id, tarea_id);
CREATE INDEX IF NOT EXISTS idx_intentos_tarea ON intentos(tarea_id);

-- 6. RLS on intentos
ALTER TABLE intentos ENABLE ROW LEVEL SECURITY;

-- Students can insert their own intentos
CREATE POLICY intentos_insert_alumno ON intentos
  FOR INSERT
  WITH CHECK (true);

-- Students can read their own intentos
CREATE POLICY intentos_select_alumno ON intentos
  FOR SELECT
  USING (true);

-- Teachers can read intentos for students in their classes
CREATE POLICY intentos_select_profesor ON intentos
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM alumnos a
      JOIN clases c ON a.clase_id = c.id
      WHERE a.id = intentos.alumno_id
        AND c.profesor_id = auth.uid()
    )
  );

COMMIT;
