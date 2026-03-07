import { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { FolderOpen, RefreshCw, Shield, CheckCircle2, Loader2, Check, Info, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthProvider';
import { syncPlatformData } from '@/services/syncService';
import { useUserPlatformStats } from '@/hooks/useUserPlatformStats';
import type { Page } from '@/lib/constants';

const SYNC_COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes

export const Portfolio = memo(({ onNavigate }: { onNavigate: (page: Page) => void }) => {
  const { platformAccounts, user } = useAuth();
  const hasVerifiedPlatforms = platformAccounts.some((account) => account.verified);

  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [syncCooldown, setSyncCooldown] = useState(0);

  const { platformStats, refreshStats } = useUserPlatformStats(user?.id);

  useEffect(() => {
    const latestSync = platformStats.reduce((latest: string | null, stat) => {
      if (!stat.last_synced_at) return latest;
      if (!latest) return stat.last_synced_at;
      return new Date(stat.last_synced_at) > new Date(latest) ? stat.last_synced_at : latest;
    }, null);

    setLastSyncedAt(latestSync);

    if (!latestSync) {
      setSyncCooldown(0);
      return;
    }

    const elapsed = Date.now() - new Date(latestSync).getTime();
    if (elapsed < SYNC_COOLDOWN_MS) {
      setSyncCooldown(Math.ceil((SYNC_COOLDOWN_MS - elapsed) / 1000));
    } else {
      setSyncCooldown(0);
    }
  }, [platformStats]);

  useEffect(() => {
    if (syncCooldown <= 0) return;

    const interval = setInterval(() => {
      setSyncCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [syncCooldown]);

  const handleSync = async () => {
    if (!user) return;

    if (syncCooldown > 0) {
      const mins = Math.floor(syncCooldown / 60);
      const secs = syncCooldown % 60;
      toast.error('Sync cooldown active', { description: `Please wait ${mins}m ${secs}s before syncing again.` });
      return;
    }

    setIsSyncing(true);

    try {
      const result = await syncPlatformData(user.id);
      if (result.success) {
        toast.success('Data synced!', { description: result.message });
        await refreshStats();
      } else {
        toast.error('Sync failed', { description: result.message });
      }
    } catch (err: any) {
      toast.error('Sync failed', { description: err?.message || 'An unexpected error occurred.' });
    } finally {
      setIsSyncing(false);
    }
  };

  const formatCooldown = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <FolderOpen className="w-8 h-8 text-green-600 dark:text-green-400" />
            <h1 className="text-3xl font-bold text-foreground">Portfolio</h1>
          </div>
          <p className="text-muted-foreground">Your coding platform performance and achievements</p>
        </div>
        <div className="text-right">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSync} disabled={isSyncing || !hasVerifiedPlatforms || syncCooldown > 0}>
            {isSyncing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Syncing...
              </>
            ) : syncCooldown > 0 ? (
              <>
                <Clock className="w-4 h-4 mr-2" />
                {formatCooldown(syncCooldown)}
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Sync Data
              </>
            )}
          </Button>
          <p className="text-muted-foreground text-xs mt-1">Last synced: {lastSyncedAt ? new Date(lastSyncedAt).toLocaleString() : 'Never'}</p>
          {syncCooldown > 0 && <p className="text-yellow-600 dark:text-yellow-400 text-xs mt-1">Cooldown: 10 min between syncs</p>}
        </div>
      </div>

      {!hasVerifiedPlatforms ? (
        <Card className="bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/20">
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 text-yellow-600 dark:text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Verified Platforms</h3>
            <p className="text-muted-foreground mb-6">Verify your coding platform profiles to display stats here.</p>
            <div className="text-left max-w-md mx-auto mb-6">
              <p className="text-foreground font-semibold mb-2">How to verify:</p>
              <ol className="text-muted-foreground text-sm space-y-1 list-decimal list-inside">
                <li>Go to Edit Profile</li>
                <li>Add your platform usernames</li>
                <li>Click "Verify" next to each platform</li>
                <li>Follow the verification instructions</li>
              </ol>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => onNavigate('edit-profile')}>
              Go to Edit Profile
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {platformAccounts
            .filter((account) => account.verified)
            .map((account) => {
              const stat = platformStats.find((entry) => entry.platform === account.platform);

              return (
                <Card key={account.platform} className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-500/20 flex items-center justify-center">
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-foreground font-semibold capitalize">{account.platform}</h3>
                        <p className="text-muted-foreground text-sm">@{account.username}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-secondary rounded-lg p-3 text-center">
                        <p className="text-muted-foreground text-xs mb-1">Rating</p>
                        <p className="text-foreground font-mono font-semibold">{stat ? (stat.rating ?? 0) : '--'}</p>
                      </div>
                      <div className="bg-secondary rounded-lg p-3 text-center">
                        <p className="text-muted-foreground text-xs mb-1">Solved</p>
                        <p className="text-foreground font-mono font-semibold">{stat ? (stat.problems_solved ?? 0) : '--'}</p>
                      </div>
                      <div className="bg-secondary rounded-lg p-3 text-center">
                        <p className="text-muted-foreground text-xs mb-1">Score</p>
                        <p className="text-foreground font-mono font-semibold">{stat ? Math.round(Number(stat.global_score) || 0) : '--'}</p>
                      </div>
                    </div>
                    {stat?.last_synced_at && <p className="text-muted-foreground text-xs mt-3">Last synced: {new Date(stat.last_synced_at).toLocaleString()}</p>}
                  </CardContent>
                </Card>
              );
            })}
        </div>
      )}

      <Card className="bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <h3 className="text-lg font-semibold text-foreground">How It Works</h3>
          </div>
          <ul className="ml-8 space-y-2 text-muted-foreground text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> Add & verify your platform usernames in Edit Profile
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> Click "Sync Data" to fetch your latest ratings
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> Your Global Engineer Score is automatically calculated
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> Sync cooldown: 10 minutes between syncs
            </li>
          </ul>
          <code className="block bg-background rounded-lg px-4 py-3 text-xs font-mono text-foreground border border-border mt-4 ml-8">
            Score = (0.35×√CF + 0.30×√LC + 0.15×√CC + 0.10×√GFG + 0.10×√TotalSolved) × 1000
          </code>
        </CardContent>
      </Card>
    </motion.div>
  );
});
