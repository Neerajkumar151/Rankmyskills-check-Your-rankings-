-- Add unique constraint on (user_id, platform) for upsert support
ALTER TABLE public.platform_stats
ADD CONSTRAINT platform_stats_user_platform_unique UNIQUE (user_id, platform);
