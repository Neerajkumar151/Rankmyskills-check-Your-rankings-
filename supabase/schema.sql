-- ============================================
-- RANKMYSKILLS DATABASE SCHEMA - FIXED VERSION
-- ============================================

-- ============================================
-- 1. ENABLE EXTENSIONS
-- ============================================
extension if not exists "uuid-ossp";

-- ============================================
-- 2. USERS TABLE (extends auth.users)
-- ============================================

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  college TEXT DEFAULT '',
  bio TEXT,
  profile_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for clean slate)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.users;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.users;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.users;

-- RLS Policies - FIXED
-- Allow users to view their own profile
CREATE POLICY "Users can view their own profile"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON public.users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- ============================================
-- 3. PLATFORM ACCOUNTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.platform_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('leetcode', 'codechef', 'codeforces', 'gfg')),
  username TEXT NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, platform)
);

-- Enable RLS
ALTER TABLE public.platform_accounts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own platform accounts" ON public.platform_accounts;
DROP POLICY IF EXISTS "Users can manage their own platform accounts" ON public.platform_accounts;

-- RLS Policies
CREATE POLICY "Users can view their own platform accounts"
  ON public.platform_accounts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own platform accounts"
  ON public.platform_accounts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own platform accounts"
  ON public.platform_accounts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own platform accounts"
  ON public.platform_accounts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- 4. VERIFICATION REQUESTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.verification_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  username TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  attempts INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_verification_requests_user_platform 
  ON public.verification_requests(user_id, platform);

CREATE INDEX IF NOT EXISTS idx_verification_requests_code 
  ON public.verification_requests(code);

-- Enable RLS
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own verification requests" ON public.verification_requests;
DROP POLICY IF EXISTS "Users can create their own verification requests" ON public.verification_requests;
DROP POLICY IF EXISTS "Users can update their own verification requests" ON public.verification_requests;
DROP POLICY IF EXISTS "Users can delete their own verification requests" ON public.verification_requests;

-- RLS Policies
CREATE POLICY "Users can view their own verification requests"
  ON public.verification_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own verification requests"
  ON public.verification_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own verification requests"
  ON public.verification_requests
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own verification requests"
  ON public.verification_requests
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- 5. STORAGE BUCKET FOR PROFILE IMAGES
-- ============================================

-- Create bucket (run this in Supabase Dashboard or use SQL)
-- Note: This needs to be done via Dashboard or API, not pure SQL
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('profile-images', 'profile-images', true)
-- ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies (run after creating bucket)
-- Drop existing storage policies
DROP POLICY IF EXISTS "Users can upload their own profile images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile images" ON storage.objects;
DROP POLICY IF EXISTS "Profile images are publicly accessible" ON storage.objects;

-- Allow users to upload their own images
CREATE POLICY "Users can upload their own profile images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'profile-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to update their own images
CREATE POLICY "Users can update their own profile images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'profile-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to delete their own images
CREATE POLICY "Users can delete their own profile images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'profile-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow public access to profile images
CREATE POLICY "Profile images are publicly accessible"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'profile-images');

-- ============================================
-- 6. FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for platform_accounts
DROP TRIGGER IF EXISTS update_platform_accounts_updated_at ON public.platform_accounts;
CREATE TRIGGER update_platform_accounts_updated_at
  BEFORE UPDATE ON public.platform_accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user signup - FIXED VERSION
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_name TEXT;
  user_college TEXT;
BEGIN
  -- Extract name from user metadata or use email prefix
  user_name := COALESCE(
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'full_name',
    split_part(NEW.email, '@', 1)
  );
  
  -- Extract college from metadata
  user_college := COALESCE(
    NEW.raw_user_meta_data->>'college',
    NEW.raw_user_meta_data->>'college_name',
    ''
  );

  -- Insert user profile
  INSERT INTO public.users (id, name, email, college, bio, profile_image_url)
  VALUES (
    NEW.id,
    user_name,
    NEW.email,
    user_college,
    NULL,
    NULL
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 7. GRANT PERMISSIONS - FIXED
-- ============================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.platform_accounts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.verification_requests TO authenticated;

-- Grant sequence permissions
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant storage permissions
GRANT ALL ON SCHEMA storage TO authenticated;

-- ============================================
-- 8. CLEANUP FUNCTION FOR EXPIRED REQUESTS
-- ============================================

CREATE OR REPLACE FUNCTION cleanup_expired_verification_requests()
RETURNS void AS $$
BEGIN
  DELETE FROM public.verification_requests
  WHERE expires_at < NOW() AND verified = FALSE;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 9. VERIFICATION ATTEMPT LIMITING
-- ============================================

-- Function to check and increment verification attempts
CREATE OR REPLACE FUNCTION check_verification_attempts(p_user_id UUID, p_platform TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_request RECORD;
BEGIN
  SELECT * INTO v_request
  FROM public.verification_requests
  WHERE user_id = p_user_id 
    AND platform = p_platform
    AND verified = FALSE
    AND expires_at > NOW()
  ORDER BY created_at DESC
  LIMIT 1;
  
  IF v_request IS NULL THEN
    RETURN TRUE; -- No active request, allow new one
  END IF;
  
  IF v_request.attempts >= 3 THEN
    RETURN FALSE; -- Max attempts reached
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
