-- ============================================
-- KLEO - Supabase Database Schema
-- Run this in the Supabase SQL Editor
-- ============================================

-- 1. PROFESORES (teachers, linked to auth.users)
CREATE TABLE profesores (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  escuela TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. CLASES (classrooms)
CREATE TABLE clases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profesor_id UUID NOT NULL REFERENCES profesores(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  grado TEXT NOT NULL,
  ciclo_escolar TEXT DEFAULT '2025-2026',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. ALUMNOS (students, managed by teacher, login via access code)
CREATE TABLE alumnos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clase_id UUID NOT NULL REFERENCES clases(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  codigo_acceso TEXT UNIQUE NOT NULL,
  avatar_iniciales TEXT NOT NULL,
  avatar_color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. TAREAS (tasks)
CREATE TABLE tareas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profesor_id UUID NOT NULL REFERENCES profesores(id) ON DELETE CASCADE,
  clase_id UUID NOT NULL REFERENCES clases(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  materia TEXT NOT NULL,
  dificultad TEXT NOT NULL CHECK (dificultad IN ('Fácil', 'Media', 'Difícil')),
  metodologia TEXT NOT NULL,
  tipos TEXT[] DEFAULT '{}',
  preguntas JSONB DEFAULT '[]',
  estado TEXT NOT NULL DEFAULT 'borrador' CHECK (estado IN ('borrador', 'en_curso', 'completada')),
  fecha_limite TIMESTAMPTZ,
  pda JSONB,
  numero_preguntas INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. RESULTADOS (student results)
CREATE TABLE resultados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tarea_id UUID NOT NULL REFERENCES tareas(id) ON DELETE CASCADE,
  alumno_id UUID NOT NULL REFERENCES alumnos(id) ON DELETE CASCADE,
  respuestas JSONB DEFAULT '{}',
  calificacion NUMERIC(4,2),
  retroalimentacion JSONB DEFAULT '[]',
  areas_de_mejora TEXT[] DEFAULT '{}',
  calificacion_manual NUMERIC(4,2),
  submitted_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tarea_id, alumno_id)
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE profesores ENABLE ROW LEVEL SECURITY;
ALTER TABLE clases ENABLE ROW LEVEL SECURITY;
ALTER TABLE alumnos ENABLE ROW LEVEL SECURITY;
ALTER TABLE tareas ENABLE ROW LEVEL SECURITY;
ALTER TABLE resultados ENABLE ROW LEVEL SECURITY;

-- Profesores: can only see/edit their own profile
CREATE POLICY "profesores_own" ON profesores
  FOR ALL USING (id = auth.uid());

-- Clases: teachers see their own classes
CREATE POLICY "clases_profesor" ON clases
  FOR ALL USING (profesor_id = auth.uid());

-- Alumnos: teachers see students in their classes
CREATE POLICY "alumnos_profesor" ON alumnos
  FOR ALL USING (
    clase_id IN (SELECT id FROM clases WHERE profesor_id = auth.uid())
  );

-- Alumnos: students can read their own row (via service role for code login)
CREATE POLICY "alumnos_self_read" ON alumnos
  FOR SELECT USING (true);

-- Tareas: teachers manage their own tasks
CREATE POLICY "tareas_profesor" ON tareas
  FOR ALL USING (profesor_id = auth.uid());

-- Tareas: anyone can read published tasks (for students)
CREATE POLICY "tareas_published_read" ON tareas
  FOR SELECT USING (estado IN ('en_curso', 'completada'));

-- Resultados: teachers see results for their tasks
CREATE POLICY "resultados_profesor" ON resultados
  FOR SELECT USING (
    tarea_id IN (SELECT id FROM tareas WHERE profesor_id = auth.uid())
  );

-- Resultados: allow insert/update for all (students submit via client)
CREATE POLICY "resultados_insert" ON resultados
  FOR INSERT WITH CHECK (true);

CREATE POLICY "resultados_update" ON resultados
  FOR UPDATE USING (true);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_clases_profesor ON clases(profesor_id);
CREATE INDEX idx_alumnos_clase ON alumnos(clase_id);
CREATE INDEX idx_alumnos_codigo ON alumnos(codigo_acceso);
CREATE INDEX idx_tareas_profesor ON tareas(profesor_id);
CREATE INDEX idx_tareas_clase ON tareas(clase_id);
CREATE INDEX idx_resultados_tarea ON resultados(tarea_id);
CREATE INDEX idx_resultados_alumno ON resultados(alumno_id);

-- ============================================
-- FUNCTION: auto-update updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tareas_updated_at
  BEFORE UPDATE ON tareas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
