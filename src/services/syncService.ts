import { supabase } from '@/integrations/supabase/client';

export interface SyncResult {
  success: boolean;
  message: string;
  stats?: Array<{ platform: string; rating: number; problems_solved: number; max_rating: number }>;
  globalScore?: number;
  errors?: string[];
}

/**
 * Sync platform data by calling the server-side edge function.
 * All platform fetching happens server-side for speed and reliability.
 */
export async function syncPlatformData(userId: string): Promise<SyncResult> {
  try {
    const { data, error } = await supabase.functions.invoke('sync-data', {
      body: { userId },
    });

    if (error) {
      console.error('Sync edge function error:', error);
      return { success: false, message: error.message || 'Sync failed. Please try again.' };
    }

    if (!data) {
      return { success: false, message: 'No response from sync service.' };
    }

    return data as SyncResult;
  } catch (err: any) {
    console.error('Sync error:', err);
    return { success: false, message: err?.message || 'An unexpected error occurred.' };
  }
}
