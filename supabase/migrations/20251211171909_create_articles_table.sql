/*
  # Create articles table

  1. New Tables
    - `articles`
      - `id` (uuid, primary key) - Unique identifier for each article
      - `title` (text) - Article title
      - `slug` (text, unique) - URL-friendly version of title
      - `category` (text) - Article category (Stiri, Fashion, Lifestyle, etc.)
      - `author` (text) - Article author name
      - `excerpt` (text) - Short description/preview of article
      - `content` (text) - Full article content
      - `image_url` (text) - Main article image URL
      - `published_at` (timestamptz) - Publication date and time
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record update timestamp

  2. Security
    - Enable RLS on `articles` table
    - Add policy for public read access (articles are publicly viewable)
    - No write policies needed for now (articles will be managed separately)

  3. Indexes
    - Index on `slug` for fast lookups by URL
    - Index on `category` for filtering by category
    - Index on `published_at` for sorting by date
*/

CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  category text NOT NULL,
  author text NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  image_url text NOT NULL,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Articles are publicly readable"
  ON articles
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);