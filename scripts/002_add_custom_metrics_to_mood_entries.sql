-- הוספת עמודה לשמירת מדדים נוספים בפורמט JSON
ALTER TABLE mood_entries 
ADD COLUMN IF NOT EXISTS custom_metrics JSONB DEFAULT '[]'::jsonb;

-- הוספת אינדקס לשיפור ביצועים
CREATE INDEX IF NOT EXISTS mood_entries_custom_metrics_idx ON mood_entries USING GIN (custom_metrics);
