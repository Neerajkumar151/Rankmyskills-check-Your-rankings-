-- Grant table-level privileges on platform_stats to authenticated role
-- This fixes "permission denied for table platform_stats" error
GRANT SELECT, INSERT, UPDATE, DELETE ON public.platform_stats TO authenticated;
GRANT SELECT ON public.platform_stats TO anon;

-- Also ensure service_role has full access (for Edge Functions)
GRANT ALL ON public.platform_stats TO service_role;
