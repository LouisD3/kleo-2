-- Add emoji and archivada columns to clases table
ALTER TABLE clases ADD COLUMN IF NOT EXISTS emoji TEXT DEFAULT NULL;
ALTER TABLE clases ADD COLUMN IF NOT EXISTS archivada BOOLEAN DEFAULT FALSE;
