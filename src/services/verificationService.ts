import { supabase } from '@/integrations/supabase/client';

export interface VerificationRequest {
  id: string;
  user_id: string;
  platform: string;
  username: string;
  code: string;
  expires_at: string;
  attempts: number;
  verified: boolean;
  created_at: string;
}

export interface VerificationResult {
  success: boolean;
  message: string;
  verified?: boolean;
}

// Platform configuration
export const PLATFORM_CONFIG = {
  leetcode: {
    name: 'LeetCode',
    icon: 'Code2',
    profileUrl: (username: string) => `https://leetcode.com/u/${username}`,
    editUrl: () => `https://leetcode.com/profile/`,
    instructions: 'Go to your LeetCode profile settings and paste the verification code in your "About Me" or "Summary" section.',
    fieldName: 'About Me / Summary',
    steps: [
      'Click the button below to open your LeetCode profile edit page',
      'Scroll to the "ReadMe" or "About Me" section',
      'Paste the verification code shown below',
      'Save your changes on LeetCode',
      'Come back here and click "Verify Profile"',
      'After verification, you can change your summary back to normal'
    ],
    color: 'yellow',
    headerColor: 'bg-yellow-500',
    buttonColor: 'bg-yellow-500 hover:bg-yellow-600',
  },
  codechef: {
    name: 'CodeChef',
    icon: 'Trophy',
    profileUrl: (username: string) => `https://www.codechef.com/users/${username}`,
    editUrl: () => `https://www.codechef.com/settings/profile`,
    instructions: 'Go to your CodeChef profile settings and temporarily add the verification code to your Full Name field.',
    fieldName: 'Full Name',
    steps: [
      'Click the button below to open your CodeChef settings',
      'Find the "Full Name" field (not username)',
      'Add the verification code to your "Full Name"',
      'Save your changes on CodeChef',
      'Come back here and click "Verify Profile"',
      'After verification, you can change your full name back to normal'
    ],
    color: 'orange',
    headerColor: 'bg-orange-500',
    buttonColor: 'bg-orange-500 hover:bg-orange-600',
  },
  codeforces: {
    name: 'Codeforces',
    icon: 'Award',
    profileUrl: (username: string) => `https://codeforces.com/profile/${username}`,
    editUrl: () => `https://codeforces.com/settings/social`,
    instructions: 'Go to your Codeforces settings (Social tab) and temporarily add the verification code to your First Name.',
    fieldName: 'First Name (Social tab)',
    steps: [
      'Click the button below to open Codeforces settings',
      'Go to the "Social" tab',
      'Add the verification code to your "First Name" field',
      'Save your changes on Codeforces',
      'Come back here and click "Verify Profile"',
      'After verification, you can change your name back to normal'
    ],
    color: 'blue',
    headerColor: 'bg-blue-500',
    buttonColor: 'bg-blue-500 hover:bg-blue-600',
  },
  gfg: {
    name: 'GeeksforGeeks',
    icon: 'User',
    profileUrl: (username: string) => `https://www.geeksforgeeks.org/profile/${username}`,
    editUrl: () => `https://www.geeksforgeeks.org/profile/`,
    instructions: 'Go to your GeeksforGeeks profile edit page and add the verification code to your "About Me" or "Short Bio" field.',
    fieldName: 'About Me / Short Bio',
    steps: [
      'Log in to GeeksforGeeks and click the button below',
      'Go to your profile edit section',
      'Add the verification code to your "About Me" or "Short Bio" field',
      'Save your changes on GeeksforGeeks',
      'Come back here and click "Verify Profile"',
      'After verification, you can change your bio back to normal'
    ],
    color: 'green',
    headerColor: 'bg-green-500',
    buttonColor: 'bg-green-500 hover:bg-green-600',
  },
};

// Generate token in format RMS-XXXXXX
function generateVerificationCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const array = new Uint8Array(6);
  crypto.getRandomValues(array);
  const code = Array.from(array).map(b => chars[b % chars.length]).join('');
  return `RMS-${code}`;
}

export async function createVerificationRequest(
  userId: string, platform: string, username: string
): Promise<{ request: VerificationRequest | null; error: Error | null; cooldownRemaining?: number }> {
  try {
    // Check cooldown
    const { data: existingRequests, error: fetchError } = await supabase
      .from('verification_requests').select('*')
      .eq('user_id', userId).eq('platform', platform).eq('verified', false)
      .order('created_at', { ascending: false }).limit(1);

    if (fetchError) return { request: null, error: fetchError };

    if (existingRequests && existingRequests.length > 0) {
      const lastRequest = existingRequests[0];
      const elapsed = Date.now() - new Date(lastRequest.created_at ?? '').getTime();
      const cooldownMs = 30000;
      if (elapsed < cooldownMs) {
        return { request: null, error: new Error('Please wait before generating a new code'), cooldownRemaining: Math.ceil((cooldownMs - elapsed) / 1000) };
      }
      if (new Date(lastRequest.expires_at) < new Date()) {
        await supabase.from('verification_requests').delete().eq('id', lastRequest.id);
      }
    }

    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const { data, error } = await supabase.from('verification_requests')
      .insert({ user_id: userId, platform, username, code, expires_at: expiresAt.toISOString(), attempts: 0, verified: false })
      .select().single();

    if (error) return { request: null, error };
    return { request: data as VerificationRequest, error: null };
  } catch (error) {
    return { request: null, error: error as Error };
  }
}

export async function getActiveVerificationRequest(
  userId: string, platform: string
): Promise<{ request: VerificationRequest | null; error: Error | null }> {
  try {
    const { data, error } = await supabase.from('verification_requests').select('*')
      .eq('user_id', userId).eq('platform', platform).eq('verified', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false }).limit(1).single();

    if (error && error.code !== 'PGRST116') return { request: null, error };
    return { request: data as VerificationRequest | null, error: null };
  } catch (error) {
    return { request: null, error: error as Error };
  }
}

export async function verifyPlatform(
  userId: string, platform: string, username: string, code: string
): Promise<VerificationResult> {
  try {
    const { data, error } = await supabase.functions.invoke('verify-platform', {
      body: { userId, platform, username, code },
    });

    if (error) {
      if (data && typeof data === 'object' && 'message' in data) {
        return { success: data.success || false, message: data.message };
      }
      return { success: false, message: error.message || 'Verification failed. Please try again.' };
    }
    if (!data) return { success: false, message: 'No response from verification service.' };
    return data as VerificationResult;
  } catch (error) {
    return { success: false, message: 'An unexpected error occurred. Please try again.' };
  }
}

export async function deleteVerificationRequest(requestId: string): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.from('verification_requests').delete().eq('id', requestId);
    return { error };
  } catch (error) {
    return { error: error as Error };
  }
}

export function getRemainingTime(expiresAt: string) {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return { minutes: 0, seconds: 0, totalSeconds: 0, isExpired: true };
  const totalSeconds = Math.floor(diff / 1000);
  return { minutes: Math.floor(totalSeconds / 60), seconds: totalSeconds % 60, totalSeconds, isExpired: false };
}

export function formatTimeRemaining(minutes: number, seconds: number): string {
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
