-- יצירת טבלת רשומות מצב רוח
CREATE TABLE IF NOT EXISTS mood_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mood_level INT NOT NULL CHECK (mood_level >= 1 AND mood_level <= 10),
  energy_level INT NOT NULL CHECK (energy_level >= 1 AND energy_level <= 10),
  stress_level INT NOT NULL CHECK (stress_level >= 1 AND stress_level <= 10),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- יצירת אינדקס לשיפור ביצועים
CREATE INDEX IF NOT EXISTS mood_entries_user_id_idx ON mood_entries(user_id);
CREATE INDEX IF NOT EXISTS mood_entries_created_at_idx ON mood_entries(created_at DESC);

-- הפעלת Row Level Security
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;

-- מדיניות: משתמשים יכולים לראות רק את הרשומות שלהם
CREATE POLICY "Users can view their own mood entries"
  ON mood_entries
  FOR SELECT
  USING (auth.uid() = user_id);

-- מדיניות: משתמשים יכולים להוסיף רשומות רק עבור עצמם
CREATE POLICY "Users can insert their own mood entries"
  ON mood_entries
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- מדיניות: משתמשים יכולים לעדכן רק את הרשומות שלהם
CREATE POLICY "Users can update their own mood entries"
  ON mood_entries
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- מדיניות: משתמשים יכולים למחוק רק את הרשומות שלהם
CREATE POLICY "Users can delete their own mood entries"
  ON mood_entries
  FOR DELETE
  USING (auth.uid() = user_id);
