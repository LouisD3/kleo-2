-- Migration: Add parcours column to resultados for remediation loop tracking
-- Run this AFTER the base schema (supabase-schema.sql) and GC schema (supabase-schema-gc.sql)

ALTER TABLE resultados
ADD COLUMN IF NOT EXISTS parcours jsonb DEFAULT NULL;

-- parcours stores the full student journey as a JSON array:
-- [
--   { "pregunta_index": 0, "tipo": "original", "respuesta_alumno": "A", "es_correcta": true, "diagnostico": "...", "timestamp": "..." },
--   { "pregunta_index": 1, "tipo": "original", "respuesta_alumno": "B", "es_correcta": false, "diagnostico": "...", "timestamp": "..." },
--   { "pregunta_index": 1, "tipo": "remediacion", "intento": 1, "pregunta_remediation": {...}, "respuesta_alumno": "C", "es_correcta": true, "diagnostico": "...", "timestamp": "..." },
--   ...
-- ]

COMMENT ON COLUMN resultados.parcours IS 'Full student journey with remediation steps (jsonb array)';
