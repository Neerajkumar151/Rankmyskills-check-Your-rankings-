import { memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, CheckCircle2, Zap, TrendingUp, Award, BarChart3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthProvider';
import { LevelBadge } from '@/components/common/LevelBadge';
import { getLevel, levelClassification } from '@/lib/constants';
import { useUserPlatformStats } from '@/hooks/useUserPlatformStats';

const platformColors: Record<string, string> = {
  leetcode: 'from-amber-500 to-orange-600',
  codeforces: 'from-blue-500 to-cyan-600',
  codechef: 'from-orange-500 to-red-600',
  gfg: 'from-green-500 to-emerald-600',
};

const platformLabels: Record<string, string> = {
  leetcode: 'LeetCode',
  codeforces: 'Codeforces',
  codechef: 'CodeChef',
  gfg: 'GeeksforGeeks',
};

export const DashboardHome = memo(() => {
  const { profile, user, platformAccounts } = useAuth();
  const { platformStats } = useUserPlatformStats(user?.id);

  const globalScore = useMemo(() => Math.round(Number(platformStats[0]?.global_score) || 0), [platformStats]);

  const verifiedAccounts = platformAccounts.filter((account) => account.verified);
  const level = getLevel(globalScore);
  const totalSolved = platformStats.reduce((sum, stat) => sum + (Number(stat.problems_solved) || 0), 0);
  const maxRating = platformStats.reduce((max, stat) => Math.max(max, Number(stat.max_rating) || 0), 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back, {profile?.name?.split(' ')[0] || 'User'} 👋</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card className="bg-card border-border overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <Avatar className="w-20 h-20 border-4 border-white/20 shadow-xl">
                  <AvatarImage src={profile?.profile_image_url || undefined} />
                  <AvatarFallback className="bg-white/20 text-white text-2xl font-bold backdrop-blur-sm">
                    {profile?.name?.split(' ').map((n) => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-1">
                    <h2 className="text-2xl font-bold text-white">{profile?.name || 'User'}</h2>
                    <LevelBadge level={level} />
                  </div>
                  <p className="text-white/70 flex items-center justify-center md:justify-start gap-2 text-sm">
                    <Building2 className="w-4 h-4" />
                    {profile?.college || 'No college set'}
                  </p>
                  {profile?.bio && <p className="text-white/60 text-sm mt-2 max-w-lg">{profile.bio}</p>}
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-center min-w-[140px] border border-white/10">
                  <p className="text-white/60 text-xs font-medium uppercase tracking-wider mb-1">Global Score</p>
                  <p className="text-4xl font-mono font-bold text-white">{globalScore}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 divide-x divide-border">
              <div className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span className="text-muted-foreground text-xs font-medium">Platforms</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{verifiedAccounts.length}</p>
              </div>
              <div className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <BarChart3 className="w-4 h-4 text-green-500" />
                  <span className="text-muted-foreground text-xs font-medium">Total Solved</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{totalSolved}</p>
              </div>
              <div className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  <span className="text-muted-foreground text-xs font-medium">Max Rating</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{maxRating}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
          <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-500" /> Connected Platforms
          </h3>
          <div className="space-y-2">
            <AnimatePresence>
              {verifiedAccounts.length > 0 ? (
                verifiedAccounts.map((account, index) => {
                  const stat = platformStats.find((entry) => entry.platform === account.platform);
                  const colors = platformColors[account.platform] || 'from-gray-500 to-gray-600';

                  return (
                    <motion.div
                      key={account.platform}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.08 }}
                    >
                      <Card className="bg-card border-border hover:border-blue-500/30 transition-colors">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${colors} flex items-center justify-center shadow-sm`}>
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="text-foreground font-semibold text-sm">{platformLabels[account.platform] || account.platform}</p>
                              <p className="text-muted-foreground text-xs">@{account.username}</p>
                            </div>
                          </div>
                          <div className="flex gap-4 text-sm">
                            <div className="text-center">
                              <p className="text-muted-foreground text-[10px] uppercase">Rating</p>
                              <p className="text-foreground font-mono font-semibold text-sm">{stat ? (stat.rating ?? 0) : '--'}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-muted-foreground text-[10px] uppercase">Solved</p>
                              <p className="text-foreground font-mono font-semibold text-sm">{stat ? (stat.problems_solved ?? 0) : '--'}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })
              ) : (
                <Card className="bg-card border-border border-dashed">
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground text-sm">No verified platforms yet. Go to Edit Profile to add & verify platforms.</p>
                  </CardContent>
                </Card>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <h3 className="text-lg font-semibold text-foreground mb-3">Level Classification</h3>
          <Card className="bg-card border-border">
            <CardContent className="p-3">
              <div className="space-y-1">
                {levelClassification.map((classification) => {
                  const isCurrent = classification.name === level;

                  return (
                    <motion.div
                      key={classification.name}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${isCurrent ? 'bg-blue-500/10 border border-blue-500/20 shadow-sm' : 'hover:bg-accent/50'}`}
                      animate={isCurrent ? { scale: [1, 1.01, 1] } : {}}
                      transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-2.5 h-2.5 rounded-full ${classification.color}`} />
                        <span className={`text-sm font-medium ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}>{classification.name}</span>
                        {isCurrent && <span className="text-[10px] bg-blue-500/20 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded font-medium">YOU</span>}
                      </div>
                      <span className="text-muted-foreground text-xs font-mono">{classification.range}</span>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
});
