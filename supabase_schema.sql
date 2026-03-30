-- =============================================
-- 在 Supabase → SQL Editor 執行此檔案
-- =============================================

-- 1. 建立 projects 資料表
CREATE TABLE IF NOT EXISTS projects (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title        TEXT NOT NULL,
  description  TEXT,
  image_url    TEXT,
  tech_stack   TEXT[],         -- 技術標籤陣列，例如 ARRAY['React', 'Node.js']
  github_url   TEXT,
  demo_url     TEXT,
  featured     BOOLEAN DEFAULT false,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 開啟 Row Level Security（RLS）
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- 3. 允許任何人讀取（公開作品集）
CREATE POLICY "public_read" ON projects
  FOR SELECT
  USING (true);

-- =============================================
-- 範例資料（可依需求修改後執行）
-- =============================================
INSERT INTO projects (title, description, tech_stack, github_url, demo_url, featured)
VALUES
  (
    'Personal Portfolio',
    '使用純 HTML/CSS/JS 建立的個人作品集，資料串接 Supabase 動態載入。',
    ARRAY['HTML', 'CSS', 'JavaScript', 'Supabase'],
    'https://github.com/yourusername/portfolio',
    'https://yourusername.github.io/portfolio',
    true
  ),
  (
    'Todo App',
    '支援 CRUD 的待辦事項應用，使用 React + Supabase 即時同步。',
    ARRAY['React', 'Supabase', 'Tailwind CSS'],
    'https://github.com/yourusername/todo-app',
    NULL,
    false
  ),
  (
    'API Dashboard',
    '串接第三方 API 的數據視覺化儀表板，包含圖表與即時更新功能。',
    ARRAY['Vue', 'Chart.js', 'Node.js'],
    NULL,
    NULL,
    false
  );
