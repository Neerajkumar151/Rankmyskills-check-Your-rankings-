import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthProvider';
import { getLevel } from '@/lib/constants';

export interface LeaderboardEntry {
  userId: string;
  name: string;
  college: string;
  course: string;
  graduationYear: string;
  avatar: string | null;
  globalScore: number;
  collegeScore: number;
  codeforces: number | string;
  leetcode: number | string;
  codechef: number | string;
  gfg: number | string;
  level: string;
  rank: number;
  createdAt: number;
}

export function useLeaderboard(type: 'global' | 'college') {
  const { profile, user } = useAuth();
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [allEntries, setAllEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [myRank, setMyRank] = useState<LeaderboardEntry | null>(null);
  const [filters, setFilters] = useState({
    graduationYear: 'all',
    course: 'all',
    college: 'all',
    sortBy: type === 'global' ? 'globalScore' : 'collegeScore',
  });

  // Dynamic filter options derived from actual data
  const dynamicFilterOptions = useMemo(() => {
    const colleges = new Set<string>();
    const courses = new Set<string>();
    const years = new Set<string>();
    for (const e of allEntries) {
      if (e.college) colleges.add(e.college);
      if (e.course) courses.add(e.course);
      if (e.graduationYear) years.add(e.graduationYear);
    }
    return {
      colleges: Array.from(colleges).sort(),
      courses: Array.from(courses).sort(),
      graduationYears: Array.from(years).sort(),
    };
  }, [allEntries]);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      const [usersRes, statsRes] = await Promise.all([
        supabase.from('users').select('*'),
        supabase.from('platform_stats').select('*'),
      ]);

      const users = usersRes.data;
      const stats = statsRes.data;
      if (!users) { setLoading(false); return; }

      const userStatsMap: Record<string, Record<string, any>> = {};
      if (stats) {
        for (const s of stats) {
          if (!userStatsMap[s.user_id]) userStatsMap[s.user_id] = {};
          userStatsMap[s.user_id][s.platform] = s;
        }
      }

      let entries: LeaderboardEntry[] = users.map((u: any) => {
        const userStats = userStatsMap[u.id] || {};
        const cf = Number(userStats['codeforces']?.rating) || 0;
        const lc = Number(userStats['leetcode']?.rating) || 0;
        const cc = Number(userStats['codechef']?.rating) || 0;
        const gfg = Number(userStats['gfg']?.rating) || 0;

        const firstStat = Object.values(userStats)[0] as any;
        const globalScore = firstStat ? Math.round(Number(firstStat.global_score) || 0) : 0;
        const collegeScore = globalScore;

        return {
          userId: u.id,
          name: u.name || 'Unknown',
          college: u.college || '',
          course: u.course || '',
          graduationYear: u.graduation_year || '',
          avatar: u.profile_image_url,
          globalScore,
          collegeScore,
          codeforces: cf || 0,
          leetcode: lc || 0,
          codechef: cc || 0,
          gfg: gfg || 0,
          level: getLevel(globalScore),
          rank: 0,
          createdAt: new Date(u.created_at || 0).getTime(),
        };
      });

      // For college leaderboard, filter by user's college
      if (type === 'college' && profile?.college) {
        entries = entries.filter((e) => e.college === profile.college);
      }

      // Store all entries for dynamic filter options (before applying filters)
      setAllEntries(entries);

      // Apply filters
      if (filters.college !== 'all') entries = entries.filter((e) => e.college === filters.college);
      if (filters.course !== 'all') entries = entries.filter((e) => e.course === filters.course);
      if (filters.graduationYear !== 'all') entries = entries.filter((e) => e.graduationYear === filters.graduationYear);

      // Sort by primary key descending, then by account age ascending (older first)
      const sortKey = filters.sortBy as keyof LeaderboardEntry;
      entries.sort((a, b) => {
        const aVal = Number(a[sortKey]) || 0;
        const bVal = Number(b[sortKey]) || 0;
        if (bVal !== aVal) {
          return bVal - aVal;
        }
        return a.createdAt - b.createdAt;
      });
      entries = entries.map((e, i) => ({ ...e, rank: i + 1 }));

      const myEntry = entries.find((e) => e.userId === user?.id);
      setMyRank(myEntry || null);

      setData(entries);
    } catch (err) {
      console.error('Leaderboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [type, profile?.college, user?.id, filters]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return { data, loading, filters, setFilters, refresh: fetchLeaderboard, myRank, dynamicFilterOptions };
}
