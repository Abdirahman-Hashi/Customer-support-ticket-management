-- Tickets table schema and indexes
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'category_enum') THEN
    CREATE TYPE category_enum AS ENUM ('billing', 'technical', 'general');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'priority_enum') THEN
    CREATE TYPE priority_enum AS ENUM ('low', 'medium', 'high');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_enum') THEN
    CREATE TYPE status_enum AS ENUM ('open', 'closed');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ai_status_enum') THEN
    CREATE TYPE ai_status_enum AS ENUM ('pending', 'done', 'fallback');
  END IF;
END$$;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tickets (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category category_enum,
  priority priority_enum,
  ai_confidence FLOAT,
  status status_enum DEFAULT 'open',
  ai_status ai_status_enum DEFAULT 'pending',
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes to optimize filtering and sorting
-- Backfill for existing DBs: ensure created_by column exists
ALTER TABLE tickets
  ADD COLUMN IF NOT EXISTS created_by INTEGER REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_tickets_category ON tickets(category);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON tickets(priority);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at);
CREATE INDEX IF NOT EXISTS idx_tickets_created_by ON tickets(created_by);
-- Ensure deterministic lookup for admin by name (case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_name_lower_unique ON users ((lower(name)));
