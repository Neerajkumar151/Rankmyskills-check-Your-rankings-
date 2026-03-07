import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const USERNAME_REGEX = /^[a-zA-Z0-9_\-\.]{1,40}$/;

interface PlatformData {
  rating: number;
  problems_solved: number;
  max_rating: number;
}

async function fetchLeetCodeStats(username: string): Promise<PlatformData> {
  try {
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Referer': 'https://leetcode.com' },
      body: JSON.stringify({
        query: `query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            profile { ranking }
            submitStatsGlobal { acSubmissionNum { difficulty count } }
          }
          userContestRanking(username: $username) { rating }
        }`,
        variables: { username },
      }),
    });
    if (!response.ok) return { rating: 0, problems_solved: 0, max_rating: 0 };
    const data = await response.json();
    const user = data?.data?.matchedUser;
    if (!user) return { rating: 0, problems_solved: 0, max_rating: 0 };
    const allSolved = user.submitStatsGlobal?.acSubmissionNum?.find((s: any) => s.difficulty === 'All');
    const rating = Math.round(data?.data?.userContestRanking?.rating || 0);
    return { rating, problems_solved: allSolved?.count || 0, max_rating: rating };
  } catch {
    return { rating: 0, problems_solved: 0, max_rating: 0 };
  }
}

async function fetchCodeforcesStats(username: string): Promise<PlatformData> {
  try {
    const response = await fetch(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(username)}`);
    if (!response.ok) return { rating: 0, problems_solved: 0, max_rating: 0 };
    const data = await response.json();
    if (data.status !== 'OK' || !data.result?.[0]) return { rating: 0, problems_solved: 0, max_rating: 0 };
    const user = data.result[0];
    return { rating: user.rating || 0, problems_solved: 0, max_rating: user.maxRating || 0 };
  } catch {
    return { rating: 0, problems_solved: 0, max_rating: 0 };
  }
}

async function fetchCodeChefStats(username: string): Promise<PlatformData> {
  try {
    const response = await fetch(`https://www.codechef.com/users/${encodeURIComponent(username)}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    });
    if (!response.ok) return { rating: 0, problems_solved: 0, max_rating: 0 };
    const html = await response.text();
    const ratingMatch = html.match(/rating.*?(\d{3,4})/i);
    const rating = ratingMatch ? parseInt(ratingMatch[1]) : 0;
    const maxRatingMatch = html.match(/highest rating.*?(\d{3,4})/i);
    const maxRating = maxRatingMatch ? parseInt(maxRatingMatch[1]) : rating;
    const solvedMatch = html.match(/Total Problems Solved.*?(\d+)/i);
    const solved = solvedMatch ? parseInt(solvedMatch[1]) : 0;
    return { rating, problems_solved: solved, max_rating: maxRating };
  } catch {
    return { rating: 0, problems_solved: 0, max_rating: 0 };
  }
}

async function fetchGfgStats(username: string): Promise<PlatformData> {
  try {
    // GFG moved profiles from /user/ to /profile/
    const gfgUrl = `https://www.geeksforgeeks.org/profile/${encodeURIComponent(username)}`;
    const response = await fetch(gfgUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });
    if (!response.ok) return { rating: 0, problems_solved: 0, max_rating: 0 };
    const html = await response.text();

    // Try multiple patterns for coding score
    let score = 0;
    const scorePatterns = [
      /\\"codingScore\\":(\d+)/,
      /\\"score\\":(\d+)/,
      /Coding Score<\/[^>]+>\s*<[^>]+>(\d+)/i,
      /codingScore.*?(\d+)/i,
    ];
    for (const pat of scorePatterns) {
      const m = html.match(pat);
      if (m) { score = parseInt(m[1]); break; }
    }

    // Try multiple patterns for problems solved
    let solved = 0;
    const solvedPatterns = [
      /\\"total_problems_solved\\":(\d+)/,
      /\\"totalProblemsSolved\\":(\d+)/,
      /Problems Solved<\/[^>]+>\s*<[^>]+>(\d+)/i,
      /totalProblemsSolved.*?(\d+)/i,
      /Total Problems\s*:\s*(\d+)/i,
    ];
    for (const pat of solvedPatterns) {
      const m = html.match(pat);
      if (m) { solved = parseInt(m[1]); break; }
    }

    // Rating = coding score for ranking calculations
    return { rating: score, problems_solved: solved, max_rating: score };
  } catch (e) {
    console.error('GFG fetch error:', e);
    return { rating: 0, problems_solved: 0, max_rating: 0 };
  }
}

function calculateGlobalScore(stats: Record<string, PlatformData>): number {
  const cf = stats['codeforces']?.rating || 0;
  const lc = stats['leetcode']?.rating || 0;
  const cc = stats['codechef']?.rating || 0;
  const gfg = stats['gfg']?.rating || 0;
  const totalSolved = Object.values(stats).reduce((sum, s) => sum + (s.problems_solved || 0), 0);
  // Weights: CF=35%, LC=30%, CC=15%, GFG=10%, Solved=10% = 100%
  const score = (0.35 * Math.sqrt(cf) + 0.30 * Math.sqrt(lc) + 0.15 * Math.sqrt(cc) + 0.10 * Math.sqrt(gfg) + 0.10 * Math.sqrt(totalSolved)) * 1000;
  return Math.round(score * 100) / 100;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate the user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user: authUser }, error: authError } = await userClient.auth.getUser();
    if (authError || !authUser) {
      return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userId = authUser.id;

    // Fetch verified platform accounts using service role
    const accountsRes = await fetch(
      `${supabaseUrl}/rest/v1/platform_accounts?user_id=eq.${userId}&verified=eq.true&select=*`,
      { headers: { 'apikey': serviceRoleKey, 'Authorization': `Bearer ${serviceRoleKey}` } }
    );

    if (!accountsRes.ok) {
      return new Response(JSON.stringify({ success: false, message: 'Failed to fetch accounts' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const accounts = await accountsRes.json();
    if (!accounts || accounts.length === 0) {
      return new Response(JSON.stringify({ success: false, message: 'No verified platforms found.' }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate all usernames
    for (const account of accounts) {
      if (!USERNAME_REGEX.test(account.username)) {
        return new Response(JSON.stringify({ success: false, message: `Invalid username format for ${account.platform}` }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Fetch ALL platform stats in parallel
    const fetchPromises = accounts.map(async (account: any) => {
      let stats: PlatformData;
      switch (account.platform) {
        case 'leetcode': stats = await fetchLeetCodeStats(account.username); break;
        case 'codeforces': stats = await fetchCodeforcesStats(account.username); break;
        case 'codechef': stats = await fetchCodeChefStats(account.username); break;
        case 'gfg': stats = await fetchGfgStats(account.username); break;
        default: stats = { rating: 0, problems_solved: 0, max_rating: 0 };
      }
      return { platform: account.platform, username: account.username, stats };
    });

    const results = await Promise.all(fetchPromises);

    const allStats: Record<string, PlatformData> = {};
    for (const r of results) {
      allStats[r.platform] = r.stats;
    }

    const totalGlobalScore = calculateGlobalScore(allStats);

    // Upsert all platform stats in parallel
    const upsertPromises = results.map(async (r) => {
      // Check if exists
      const checkRes = await fetch(
        `${supabaseUrl}/rest/v1/platform_stats?user_id=eq.${userId}&platform=eq.${r.platform}&select=id`,
        { headers: { 'apikey': serviceRoleKey, 'Authorization': `Bearer ${serviceRoleKey}` } }
      );
      const existing = await checkRes.json();

      const payload = {
        user_id: userId,
        platform: r.platform,
        username: r.username,
        rating: r.stats.rating,
        problems_solved: r.stats.problems_solved,
        max_rating: r.stats.max_rating,
        global_score: totalGlobalScore,
        last_synced_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (existing && existing.length > 0) {
        const { user_id: _uid, ...updatePayload } = payload;
        await fetch(
          `${supabaseUrl}/rest/v1/platform_stats?user_id=eq.${userId}&platform=eq.${r.platform}`,
          {
            method: 'PATCH',
            headers: { 'apikey': serviceRoleKey, 'Authorization': `Bearer ${serviceRoleKey}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
            body: JSON.stringify(updatePayload),
          }
        );
      } else {
        await fetch(
          `${supabaseUrl}/rest/v1/platform_stats`,
          {
            method: 'POST',
            headers: { 'apikey': serviceRoleKey, 'Authorization': `Bearer ${serviceRoleKey}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
            body: JSON.stringify(payload),
          }
        );
      }
    });

    await Promise.all(upsertPromises);

    return new Response(JSON.stringify({
      success: true,
      message: 'Data synced successfully!',
      stats: results.map(r => ({ platform: r.platform, ...r.stats })),
      globalScore: totalGlobalScore,
    }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ success: false, message: `Sync failed: ${msg}` }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
