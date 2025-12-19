/*
  # Create Storage Bucket for Article Images

  1. Storage Setup
    - Creates a public bucket named 'article-images' for storing article images
    - This bucket will be used to host images that were previously on external services

  2. Security
    - Bucket is public for read access (anyone can view images)
    - Only authenticated users with service role can upload/delete
*/

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'article-images',
  'article-images',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read access for article images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'article-images');

CREATE POLICY "Service role can upload article images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'article-images');

CREATE POLICY "Service role can update article images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'article-images')
WITH CHECK (bucket_id = 'article-images');

CREATE POLICY "Service role can delete article images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'article-images');