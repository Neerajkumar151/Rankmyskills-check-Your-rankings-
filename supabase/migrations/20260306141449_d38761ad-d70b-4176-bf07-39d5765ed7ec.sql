-- Backfill course and graduation_year from auth metadata
UPDATE public.users u
SET 
  course = COALESCE(u.course, (SELECT raw_user_meta_data->>'course' FROM auth.users au WHERE au.id = u.id)),
  graduation_year = COALESCE(u.graduation_year, (SELECT raw_user_meta_data->>'graduation_year' FROM auth.users au WHERE au.id = u.id))
WHERE u.course IS NULL OR u.graduation_year IS NULL;

-- Update handle_new_user to include course and graduation_year
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog', 'pg_temp'
AS $function$
DECLARE
  user_name TEXT;
  user_college TEXT;
  user_course TEXT;
  user_grad_year TEXT;
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

  user_course := NEW.raw_user_meta_data->>'course';
  user_grad_year := NEW.raw_user_meta_data->>'graduation_year';

  INSERT INTO public.users (id, name, email, college, course, graduation_year, bio, profile_image_url)
  VALUES (
    NEW.id,
    user_name,
    NEW.email,
    user_college,
    user_course,
    user_grad_year,
    NULL,
    NULL
  )
  ON CONFLICT (id) DO UPDATE SET
    course = COALESCE(EXCLUDED.course, public.users.course),
    graduation_year = COALESCE(EXCLUDED.graduation_year, public.users.graduation_year);
  
  RETURN NEW;
END;
$function$;