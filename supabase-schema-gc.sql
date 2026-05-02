-- ============================================
-- KLEO - Google Classroom Integration Migration
-- Run this in the Supabase SQL Editor AFTER the base schema
-- ============================================

-- 1. Add Google Classroom columns to profesores
ALTER TABLE profesores
  ADD COLUMN IF NOT EXISTS gc_refresh_token TEXT,
  ADD COLUMN IF NOT EXISTS gc_connected BOOLEAN DEFAULT false;

-- 2. Add Google Classroom course ID to clases
ALTER TABLE clases
  ADD COLUMN IF NOT EXISTS gc_course_id TEXT;

-- 3. Add Google Classroom user ID to alumnos
ALTER TABLE alumnos
  ADD COLUMN IF NOT EXISTS gc_user_id TEXT;

-- 4. Add Google Classroom coursework ID to tareas
ALTER TABLE tareas
  ADD COLUMN IF NOT EXISTS gc_coursework_id TEXT;

-- 5. Index for GC lookups
CREATE INDEX IF NOT EXISTS idx_clases_gc_course ON clases(gc_course_id) WHERE gc_course_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_alumnos_gc_user ON alumnos(gc_user_id) WHERE gc_user_id IS NOT NULL;
