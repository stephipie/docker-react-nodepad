CREATE TABLE IF NOT EXISTS notes (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO notes (title, content, is_completed) VALUES
('Test Note 1', 'This is a test note.', false),
('Test Note 2', 'This is another test note.', true),
('Test Note 3', 'This is yet another test note.', false)
ON CONFLICT DO NOTHING;