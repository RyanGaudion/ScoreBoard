-- Create scores table
CREATE TABLE scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id TEXT NOT NULL UNIQUE,
  score INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial scores
INSERT INTO scores (team_id, score) VALUES
  ('blue', 0),
  ('yellow', 0),
  ('red', 0),
  ('green', 0);

-- Enable RLS
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view scores"
  ON scores FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can update scores"
  ON scores FOR UPDATE
  TO public
  USING (true);