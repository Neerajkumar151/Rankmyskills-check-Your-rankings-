import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const USERNAME_REGEX = /^[a-zA-Z0-9_\-\.]{1,40}$/;
const SUPPORTED_PLATFORMS = ['leetcode', 'codechef', 'codeforces', 'gfg'];

async function fetchLeetCodeProfile(username: string): Promise<string | null> {
  try {
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Referer': 'https://leetcode.com' },
      body: JSON.stringify({
        query: `query userPublicProfile($username: String!) {
          matchedUser(username: $username) {
            profile { aboutMe realName }
          }
        }`,
        variables: { username },
      }),
    });
    if (!response.ok) return null;
    const data = await response.json();
    const profile = data?.data?.matchedUser?.profile;
    if (!profile) return null;
    return [profile.aboutMe || '', profile.realName || ''].join(' ');
  } catch {
    return null;
  }
}

async function fetchCodeforcesProfile(username: string): Promise<string | null> {
  try {
    const response = await fetch(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(username)}`);
    if (!response.ok) return null;
    const data = await response.json();
    if (data.status !== 'OK' || !data.result?.[0]) return null;
    const user = data.result[0];
    return [user.firstName || '', user.lastName || '', user.organization || ''].join(' ');
  } catch {
    return null;
  }
}

async function fetchHtmlProfile(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });
    clearTimeout(timeoutId);
    if (!response.ok) return null;
    const html = await response.text();
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  } catch {
    return null;
  }
}

async function fetchGfgProfile(username: string): Promise<string | null> {
  try {
    const response = await fetch(`https://www.geeksforgeeks.org/profile/${encodeURIComponent(username)}/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });
    if (!response.ok) return null;
    const html = await response.text();
    let textToSearch = html;
    const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/s);
    if (match && match[1]) {
      try {
        const jsonData = JSON.parse(match[1]);
        textToSearch += ' ' + JSON.stringify(jsonData);
      } catch { /* ignore */ }
    }
    return textToSearch;
  } catch {
    return null;
  }
}

async function fetchProfileContent(platform: string, username: string): Promise<string | null> {
  switch (platform) {
    case 'leetcode': return fetchLeetCodeProfile(username);
    case 'codeforces': return fetchCodeforcesProfile(username);
    case 'codechef': return fetchHtmlProfile(`https://www.codechef.com/users/${encodeURIComponent(username)}`);
    case 'gfg': return fetchGfgProfile(username);
    default: return null;
  }
}

async function supabaseQuery(
  method: string, table: string,
  params: { select?: string; filters?: Record<string, string>; body?: Record<string, unknown>; single?: boolean; upsertOnConflict?: string }
): Promise<{ data: any; error: any }> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  let url = `${supabaseUrl}/rest/v1/${table}`;
  const queryParams: string[] = [];
  if (params.select) queryParams.push(`select=${encodeURIComponent(params.select)}`);
  if (params.filters) {
    for (const [key, value] of Object.entries(params.filters)) queryParams.push(`${key}=${encodeURIComponent(value)}`);
  }
  if (queryParams.length > 0) url += '?' + queryParams.join('&');
  const headers: Record<string, string> = {
    'apikey': serviceRoleKey, 'Authorization': `Bearer ${serviceRoleKey}`, 'Content-Type': 'application/json',
  };
  if (params.single) headers['Accept'] = 'application/vnd.pgrst.object+json';
  if (params.upsertOnConflict) headers['Prefer'] = 'resolution=merge-duplicates';
  else if (method === 'POST') headers['Prefer'] = 'return=representation';
  if (method === 'PATCH') headers['Prefer'] = 'return=representation';
  try {
    const response = await fetch(url, { method, headers, body: params.body ? JSON.stringify(params.body) : undefined });
    if (!response.ok) {
      const errorText = await response.text();
      return { data: null, error: { message: errorText, status: response.status } };
    }
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
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

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user: authUser }, error: authError } = await userClient.auth.getUser();
    if (authError || !authUser) {
      return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const authenticatedUserId = authUser.id;

    const { userId, platform, username, code } = await req.json();

    if (!userId || !platform || !username || !code) {
      return new Response(JSON.stringify({ success: false, message: 'Missing required parameters' }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Ensure the authenticated user matches the requested userId
    if (authenticatedUserId !== userId) {
      return new Response(JSON.stringify({ success: false, message: 'Unauthorized: user mismatch' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!SUPPORTED_PLATFORMS.includes(platform)) {
      return new Response(JSON.stringify({ success: false, message: 'Invalid platform' }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate username format
    if (!USERNAME_REGEX.test(username)) {
      return new Response(JSON.stringify({ success: false, message: 'Invalid username format' }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch verification request
    const { data: verificationRequest, error: fetchError } = await supabaseQuery('GET', 'verification_requests', {
      select: '*',
      filters: { 'user_id': `eq.${userId}`, 'platform': `eq.${platform}`, 'code': `eq.${code}`, 'verified': `eq.false` },
      single: true,
    });

    if (fetchError || !verificationRequest) {
      return new Response(JSON.stringify({ success: false, message: 'Invalid verification code.' }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (new Date(verificationRequest.expires_at) < new Date()) {
      await supabaseQuery('DELETE', 'verification_requests', { filters: { 'id': `eq.${verificationRequest.id}` } });
      return new Response(JSON.stringify({ success: false, message: 'Verification code has expired.' }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (verificationRequest.attempts >= 3) {
      await supabaseQuery('DELETE', 'verification_requests', { filters: { 'id': `eq.${verificationRequest.id}` } });
      return new Response(JSON.stringify({ success: false, message: 'Maximum attempts reached. Generate a new code.' }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    await supabaseQuery('PATCH', 'verification_requests', {
      filters: { 'id': `eq.${verificationRequest.id}` },
      body: { attempts: verificationRequest.attempts + 1 },
    });

    const profileContent = await fetchProfileContent(platform, username);
    if (!profileContent) {
      return new Response(JSON.stringify({ success: false, message: `Could not fetch ${platform} profile. Check your username.` }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const codeFound = profileContent.includes(code);
    if (!codeFound) {
      const remainingAttempts = 3 - (verificationRequest.attempts + 1);

      // Check if there is an OLD code in the profile
      const hasOldCode = /RMS-[A-Z0-9]{6}/.test(profileContent);
      if (hasOldCode) {
        return new Response(JSON.stringify({
          success: false,
          message: `The code in your profile is old, please add this new code. ${remainingAttempts > 0 ? `${remainingAttempts} attempts remaining.` : ''}`,
        }), {
          status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({
        success: false,
        message: `Code not found on profile. ${remainingAttempts > 0 ? `${remainingAttempts} attempts remaining.` : ''}`,
      }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    await supabaseQuery('PATCH', 'verification_requests', {
      filters: { 'id': `eq.${verificationRequest.id}` },
      body: { verified: true },
    });

    const now = new Date().toISOString();
    await supabaseQuery('POST', 'platform_accounts', {
      body: { user_id: userId, platform, username, verified: true, verified_at: now },
      upsertOnConflict: 'user_id,platform',
    });

    return new Response(JSON.stringify({ success: true, message: 'Verification successful!', verified: true }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: 'An unexpected error occurred.' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
