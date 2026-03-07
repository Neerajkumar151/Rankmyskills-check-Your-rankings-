import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { Edit3, Code2, Trophy, Award, User, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthProvider';
import { ProfileForm } from '@/components/ProfileForm';
import { VerificationModal } from '@/components/VerificationModal';
import { getLevel } from '@/lib/constants';
import { LevelBadge } from '@/components/common/LevelBadge';
import { useUserPlatformStats } from '@/hooks/useUserPlatformStats';
import { levelClassification } from '@/lib/constants';

export const EditProfile = memo(() => {
  const { profile, platformAccounts, upsertPlatformAccount, refreshPlatformAccounts, user } = useAuth();
  const { platformStats } = useUserPlatformStats(user?.id);

  const [platformUsernames, setPlatformUsernames] = useState<Record<string, string>>({});
  const [verificationModal, setVerificationModal] = useState<{ isOpen: boolean; platform: 'leetcode' | 'codechef' | 'codeforces' | 'gfg'; username: string }>({
    isOpen: false,
    platform: 'leetcode',
    username: '',
  });

  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    const usernames: Record<string, string> = {};
    platformAccounts.forEach((account) => {
      usernames[account.platform] = account.username;
    });
    setPlatformUsernames(usernames);
  }, [platformAccounts]);

  const platforms: Array<{ id: 'leetcode' | 'codechef' | 'codeforces' | 'gfg'; name: string; icon: typeof Code2; prefix: string; placeholder: string }> = [
    { id: 'leetcode', name: 'LeetCode', icon: Code2, prefix: 'https://leetcode.com/u/', placeholder: 'username' },
    { id: 'codechef', name: 'CodeChef', icon: Trophy, prefix: 'https://www.codechef.com/users/', placeholder: 'username' },
    { id: 'codeforces', name: 'Codeforces', icon: Award, prefix: 'https://codeforces.com/profile/', placeholder: 'handle' },
    { id: 'gfg', name: 'GeeksforGeeks', icon: User, prefix: 'https://www.geeksforgeeks.org/user/', placeholder: 'username' },
  ];

  const handleUsernameChange = useCallback(
    (platform: string, username: string) => {
      setPlatformUsernames((prev) => ({ ...prev, [platform]: username }));

      if (debounceTimers.current[platform]) clearTimeout(debounceTimers.current[platform]);

      if (username.trim()) {
        debounceTimers.current[platform] = setTimeout(async () => {
          await upsertPlatformAccount(platform, username.trim());
        }, 800);
      }
    },
    [upsertPlatformAccount],
  );

  const handleVerify = (platform: 'leetcode' | 'codechef' | 'codeforces' | 'gfg') => {
    const username = platformUsernames[platform];
    if (!username) return;
    setVerificationModal({ isOpen: true, platform, username });
  };

  const getAccountStatus = (platformId: string) => platformAccounts.find((account) => account.platform === platformId);
  const globalScore = Math.round(Number(platformStats[0]?.global_score) || 0);
  const level = getLevel(globalScore);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Edit3 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-3xl font-bold text-foreground">Edit Profile</h1>
        </div>
        <p className="text-muted-foreground">Update your personal information and platform usernames</p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row flex-wrap items-center justify-between space-y-0">
          <CardTitle className="text-foreground text-lg">Personal Information</CardTitle>
          {level && (
            <div className="flex items-center gap-4 bg-transparent mt-4 sm:mt-0">
              <img
                src={levelClassification.find((c) => c.name === level)?.badge}
                alt={level}
                className="w-20 h-20 rounded-xl object-contain drop-shadow-lg"
              />
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground uppercase font-semibold tracking-widest mb-0.5">Rank</span>
                <span className={`text-xl font-bold ${levelClassification.find((c) => c.name === level)?.textColor}`}>
                  {level}
                </span>
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <ProfileForm />
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-lg">Coding Platform Usernames</CardTitle>
          <p className="text-muted-foreground text-sm">Connect your coding platforms to track your progress</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            const account = getAccountStatus(platform.id);
            const isVerified = account?.verified || false;

            return (
              <div key={platform.id} className="space-y-2">
                <Label className="text-foreground flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {platform.name} Username
                  {isVerified && (
                    <Badge className="bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/30 ml-2">
                      <Check className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </Label>
                <div className="flex gap-3">
                  <div className="flex-1 flex">
                    <div className="bg-secondary px-3 py-2 rounded-l-lg text-muted-foreground text-sm flex items-center border border-border border-r-0">{platform.prefix}</div>
                    <Input
                      value={platformUsernames[platform.id] || ''}
                      onChange={(event) => handleUsernameChange(platform.id, event.target.value)}
                      placeholder={platform.placeholder}
                      className="rounded-l-none bg-secondary border-border text-foreground flex-1"
                    />
                  </div>
                  <Button
                    variant="outline"
                    className={
                      isVerified
                        ? 'border-green-200 dark:border-green-500/30 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-500/10'
                        : 'border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10'
                    }
                    onClick={() => handleVerify(platform.id)}
                    disabled={!platformUsernames[platform.id]}
                  >
                    {isVerified ? 'Re-verify' : 'Verify'}
                  </Button>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-lg">Read-Only Information</CardTitle>
          <p className="text-muted-foreground text-sm">The following information cannot be changed directly:</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-muted-foreground">College:</span>
            <span className="text-foreground font-medium uppercase">{profile?.college || 'Not set'}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-muted-foreground">Email:</span>
            <span className="text-foreground">{profile?.email || 'Not set'}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-muted-foreground">Global Engineer Score:</span>
            <div className="flex items-center gap-2">
              <LevelBadge level={level} />
              <span className="text-blue-600 dark:text-blue-400 font-bold font-mono">{globalScore.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-muted-foreground">College Engineer Score:</span>
            <span className="text-foreground font-bold font-mono">{globalScore > 0 ? globalScore.toLocaleString() : 'N/A'}</span>
          </div>
          <p className="text-muted-foreground text-xs mt-2">To change your college, please contact an administrator.</p>
        </CardContent>
      </Card>

      <VerificationModal
        isOpen={verificationModal.isOpen}
        onClose={() => setVerificationModal((prev) => ({ ...prev, isOpen: false }))}
        platform={verificationModal.platform}
        username={verificationModal.username}
        onVerified={async () => {
          await refreshPlatformAccounts();
        }}
      />
    </motion.div>
  );
});
