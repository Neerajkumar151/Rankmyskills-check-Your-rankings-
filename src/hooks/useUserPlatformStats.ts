import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PlatformStat {
  id: string;
  user_id: string;
  platform: string;
  username: string;
  rating: number | null;
  problems_solved: number | null;
  max_rating: number | null;
  global_score: number | null;
  last_synced_at: string | null;
  updated_at: string | null;
  created_at: string | null;
}

const STATS_CACHE_PREFIX = 'rms_platform_stats_v1_';

function getStatsCacheKey(userId: string) {
  return `${STATS_CACHE_PREFIX}${userId}`;
}

function readCachedStats(userId: string): PlatformStat[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(getStatsCacheKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PlatformStat[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCachedStats(userId: string, stats: PlatformStat[]) {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(getStatsCacheKey(userId), JSON.stringify(stats));
  } catch {
    // Ignore cache failures.
  }
}

export function useUserPlatformStats(userId?: string) {
  const [platformStats, setPlatformStats] = useState<PlatformStat[]>([]);
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);

  const fetchStats = useCallback(
    async ({ silent = false, retries = 1 }: { silent?: boolean; retries?: number } = {}) => {
      if (!userId) {
        setPlatformStats([]);
        setStatsError(null);
        return [] as PlatformStat[];
      }

      if (!silent) setIsStatsLoading(true);

      let attempt = 0;
      let lastError: string | null = null;

      while (attempt <= retries) {
        const { data, error } = await supabase.from('platform_stats').select('*').eq('user_id', userId);

        if (error) {
          lastError = error.message;
          attempt += 1;
          continue;
        }

        const nextStats = (data as PlatformStat[]) || [];

        if (nextStats.length > 0) {
          setPlatformStats(nextStats);
          writeCachedStats(userId, nextStats);
          setStatsError(null);
          if (!silent) setIsStatsLoading(false);
          return nextStats;
        }

        const cached = readCachedStats(userId);

        // If we have cached stats, keep them instead of flashing to empty on transient zero-row reads.
        if (cached.length > 0 && attempt < retries) {
          attempt += 1;
          continue;
        }

        if (cached.length > 0) {
          setPlatformStats(cached);
          setStatsError('Using cached stats while live data syncs.');
          if (!silent) setIsStatsLoading(false);
          return cached;
        }

        setPlatformStats([]);
        setStatsError(null);
        if (!silent) setIsStatsLoading(false);
        return [];
      }

      const cached = readCachedStats(userId);

      if (cached.length > 0) {
        setPlatformStats(cached);
        setStatsError(lastError ? `Using cached stats: ${lastError}` : null);
        if (!silent) setIsStatsLoading(false);
        return cached;
      }

      setStatsError(lastError || 'Failed to load stats.');
      if (!silent) setIsStatsLoading(false);
      return [] as PlatformStat[];
    },
    [userId],
  );

  useEffect(() => {
    if (!userId) {
      setPlatformStats([]);
      setStatsError(null);
      return;
    }

    const cached = readCachedStats(userId);
    if (cached.length > 0) {
      setPlatformStats(cached);
    }

    void fetchStats({ silent: cached.length > 0, retries: 2 });
  }, [userId, fetchStats]);

  return {
    platformStats,
    isStatsLoading,
    statsError,
    refreshStats: () => fetchStats({ silent: false, retries: 1 }),
  };
}
