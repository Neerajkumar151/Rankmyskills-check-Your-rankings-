
-- Fix SECURITY DEFINER functions to have fixed search_path

CREATE OR REPLACE FUNCTION public.check_verification_attempts(p_user_id uuid, p_platform text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = pg_catalog, pg_temp
AS $function$
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
    RETURN TRUE;
  END IF;
  
  IF v_request.attempts >= 3 THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = pg_catalog, pg_temp
AS $function$
DECLARE
  user_name TEXT;
  user_college TEXT;
BEGIN
  user_name := COALESCE(
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'full_name',
    split_part(NEW.email, '@', 1)
  );
  
  user_college := COALESCE(
    NEW.raw_user_meta_data->>'college',
    NEW.raw_user_meta_data->>'college_name',
    ''
  );

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
$function$;

CREATE OR REPLACE FUNCTION public.cleanup_expired_verification_requests()
 RETURNS void
 LANGUAGE plpgsql
 SET search_path = pg_catalog, pg_temp
AS $function$
BEGIN
  DELETE FROM public.verification_requests
  WHERE expires_at < NOW() AND verified = FALSE;
END;
$function$;

-- Update RLS policy for users table to require authentication
DROP POLICY IF EXISTS "Authenticated users can view all user profiles for leaderboard" ON public.users;

CREATE POLICY "Authenticated users can view all user profiles for leaderboard"
ON public.users
FOR SELECT
TO authenticated
USING (true);
