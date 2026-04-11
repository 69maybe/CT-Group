-- Migration: Add multilingual support for articles
-- Date: 2024-04-07

-- Add English translation columns to articles table
ALTER TABLE articles ADD COLUMN IF NOT EXISTS title_en VARCHAR(500);
ALTER TABLE articles ADD COLUMN IF NOT EXISTS excerpt_en TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS content_en TEXT;

-- Create index for faster lookups (optional)
CREATE INDEX IF NOT EXISTS idx_articles_locale ON articles(title, title_en);
