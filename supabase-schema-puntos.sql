-- ============================================
-- KLEO - Points & Gamification Schema
-- Run this AFTER supabase-schema.sql
-- ============================================

-- Add total points to students
ALTER TABLE alumnos ADD COLUMN IF NOT EXISTS puntos INTEGER DEFAULT 0;

-- Log of point awards
CREATE TABLE IF NOT EXISTS puntos_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alumno_id UUID NOT NULL REFERENCES alumnos(id) ON DELETE CASCADE,
  profesor_id UUID NOT NULL REFERENCES profesores(id) ON DELETE CASCADE,
  tarea_id UUID REFERENCES tareas(id) ON DELETE SET NULL,
  cantidad INTEGER NOT NULL,
  motivo TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE puntos_log ENABLE ROW LEVEL SECURITY;

-- Teachers can see/manage points for their students
CREATE POLICY "puntos_log_profesor" ON puntos_log
  FOR ALL USING (
    profesor_id = auth.uid()
  );

-- Students can read their own points log
CREATE POLICY "puntos_log_alumno_read" ON puntos_log
  FOR SELECT USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_puntos_log_alumno ON puntos_log(alumno_id);
CREATE INDEX IF NOT EXISTS idx_puntos_log_profesor ON puntos_log(profesor_id);
