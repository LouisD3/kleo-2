-- Fix RLS policies for registration flow
-- Run this in Supabase SQL Editor

-- Drop the old policy
DROP POLICY IF EXISTS "profesores_own" ON profesores;

-- Separate SELECT/UPDATE/DELETE (requires auth match)
CREATE POLICY "profesores_select" ON profesores
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "profesores_update" ON profesores
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "profesores_delete" ON profesores
  FOR DELETE USING (id = auth.uid());

-- INSERT: allow inserting your own row (id must match your auth uid)
CREATE POLICY "profesores_insert" ON profesores
  FOR INSERT WITH CHECK (id = auth.uid());

-- Also fix clases INSERT for registration (creates default class)
DROP POLICY IF EXISTS "clases_profesor" ON clases;

CREATE POLICY "clases_select" ON clases
  FOR SELECT USING (profesor_id = auth.uid());

CREATE POLICY "clases_insert" ON clases
  FOR INSERT WITH CHECK (profesor_id = auth.uid());

CREATE POLICY "clases_update" ON clases
  FOR UPDATE USING (profesor_id = auth.uid());

CREATE POLICY "clases_delete" ON clases
  FOR DELETE USING (profesor_id = auth.uid());
