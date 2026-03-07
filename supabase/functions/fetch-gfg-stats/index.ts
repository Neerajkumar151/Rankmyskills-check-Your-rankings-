import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const USERNAME_REGEX = /^[a-zA-Z0-9_\-\.]{1,40}$/;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Authenticate the user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user: authUser }, error: authError } = await userClient.auth.getUser();
    if (authError || !authUser) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let username: string | null = null;

    if (req.method === 'POST') {
      const body = await req.json().catch(() => ({}));
      username = body.username;
    } else {
      const url = new URL(req.url);
      username = url.searchParams.get('username');
    }

    if (!username) {
      return new Response(JSON.stringify({ error: 'Username is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate username format
    if (!USERNAME_REGEX.test(username)) {
      return new Response(JSON.stringify({ error: 'Invalid username format' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GFG moved profiles from /user/ to /profile/
    const gfgUrl = `https://www.geeksforgeeks.org/profile/${encodeURIComponent(username)}`;
    const response = await fetch(gfgUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: `GFG responded with ${response.status}`, data: null }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const html = await response.text();

    // Check for 404 / not found
    const notFoundMatch = html.match(/Whoops, that page is gone/i) || html.match(/class="profile_not_found"/i);
    if (notFoundMatch) {
      return new Response(JSON.stringify({ error: 'User does not exist', data: null }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

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

    return new Response(JSON.stringify({ score, solved }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
