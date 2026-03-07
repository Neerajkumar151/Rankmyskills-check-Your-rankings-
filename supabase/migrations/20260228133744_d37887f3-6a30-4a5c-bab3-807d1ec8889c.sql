
-- Create platform_stats table to store fetched ratings/scores from platforms
CREATE TABLE public.platform_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  username TEXT NOT NULL,
  rating INTEGER DEFAULT 0,
  problems_solved INTEGER DEFAULT 0,
  max_rating INTEGER DEFAULT 0,
  global_score NUMERIC(10,2) DEFAULT 0,
  last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, platform)
);

-- Enable RLS
ALTER TABLE public.platform_stats ENABLE ROW LEVEL SECURITY;

-- Everyone can read platform stats (for leaderboard)
CREATE POLICY "Platform stats are viewable by authenticated users"
ON public.platform_stats FOR SELECT
TO authenticated
USING (true);

-- Users can only insert/update their own stats
CREATE POLICY "Users can insert their own platform stats"
ON public.platform_stats FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own platform stats"
ON public.platform_stats FOR UPDATE
USING (auth.uid() = user_id);

-- Create a view for the leaderboard with computed global score
-- Also need to make users table readable for leaderboard
CREATE POLICY "Authenticated users can view all user profiles for leaderboard"
ON public.users FOR SELECT
TO authenticated
USING (true);

-- Drop the restrictive select policy and replace with public readable
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
