-- Tickets table schema and indexes
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(20),
  priority VARCHAR(10),
  ai_confidence FLOAT,
  status VARCHAR(20) DEFAULT 'open',
  ai_status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes to optimize filtering and sorting
CREATE INDEX IF NOT EXISTS idx_tickets_category ON tickets(category);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON tickets(priority);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at);
