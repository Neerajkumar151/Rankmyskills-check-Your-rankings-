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
  leetcode: 'from-white-100 to-white-600',
  codeforces: 'from-white-100 to-white-600',
  codechef: 'from-white-100 to-white-600',
  gfg: 'from-white-100 to-white-600',
};

const platformLogos: Record<string, React.ReactElement> = {
  leetcode: <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAACgklEQVR4nGNgIBH4GEtyGWrJvFNTU/lvbyx5goGawMJChlNPQ/azurrafxDWVFP4TTPD1dRU/zubSi2miuEqKgzsepqyH2GGg7CtkdQ2ahr+CdlwL2uZvVQzXFcD1fCWNM3/L9db/3ux2vjw//3yHJQZrokaLI0pmv9fbbCB45drTV/dWmzGR475bLoaciiGp/orvXm5xmj/i9Um919tsEa25MXLVVo8JBou+wHZcDcL6UPICp6v0i97tR7JkjWmz/6v0mIjy3AvK5kj2BQ+X2WY+3K91T+4Jav1Gwiarq8p+xrZcD9bmeP41L9Yo5/2cp3Vv5frLf8+X21sjtdwRxOJJciGBzjInCboIgYGhrurjPn/L9LjJqhQQ1X+F8xwd0vZ2wxUBmyqqirQIkD5/8w0Bi5kyS0bNjhu3rjh/eaNG/4Tgf9s3rBhDorpHBwcsiIiwv9BWE9N5A+67cuWLN60ZNHC/8TjBb/QzWAU5uf4z87O9p+fl/1/ko+QG4oFyxaZL5o/787C+fMeE4MXL144GSOMLDS5P4AsAGFLTe5fnUnCUhQGOypwNeGLEOBjB1sAwra6PD/rQ7kkCOm7OUu28eZs+WqiLHEy5FvIzYViyY/KCG5xXOrvzpY7/HyJ/H8QvjNTNp0oSxz1eZYjW2Kjy/0jN5RHFF3dvblyJ2GGg/CN2bLhRFkA9okBz0pkS+z0eH6c6pbRAcndmCkpcm+ezFVkw2/Pkp3LQCpw1udejWzJ2Ymy/x4vlPvxdLHcP2TDb82WXUSy4TDgasy7UlqU43+wDd//Z4sRhoLwM0oNh4Ebs6Sd7s6Tu/F4gdwfkCWPF8n9vT9P9uH12TJRxBgAABE1rBTkH+ppAAAAAElFTkSuQmCC" alt="LeetCode" className="w-7 h-7 object-contain" />,
  codeforces: <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAw0lEQVR4nO2VQQqDMBBFXZlrKHgFh+6KyZWEXqDpDcx11GuIhyhOFrqaEkttY7NpmYWLfHjwCcM8skmSJIYjmcFb1kxLbpAcrmcNaj5B816+Scw0swny3fIXxxBQKwrq05q69LLieisKPkGfjtQL2jEwCgSFOJzgfj4VtoLayvKyUkHtztgEVsFoFZCHLAdOAYWIgi1RQP8LOrEEBPOvzzVKWPbLUcLsbqA9ybNffQHqrw/HoDeDqtSfEtdRgTcTk4TyANaBm3IkpesMAAAAAElFTkSuQmCC" alt="Codeforces" className="w-7 h-7 object-contain" />,
  codechef: <img src="https://cdn.brandfetch.io/idM2-b7Taf/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1767029469434" alt="CodeChef" className="w-7 h-7 object-contain mix-blend-darken dark:mix-blend-screen dark:invert" />,
  gfg: <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAD10lEQVR4nO1YTYgdRRDuaMSAiIKKQUUP4kUETVY9KDqZ6pmqdhVvuYgK/h38uyshPjwtnkIUhcW3U/U2/qCiB6MoKgYUQRFU8BD/iKDJxd8kmyUuxF2pyZvdntk3Oz1ZwSfMBwPvUdVV39fTXV09xnTo0KFDhw4dOvw7sEJL+sSS3gzPw4VW6HFgfBeE9lvGn0HoMAj+AkJfWqYMJL0l2hdtPNV8E9MTZ8SZm9RYVuirYezDw1z7NXfC+JhyUU4Fv0YBVvAoCP618n+tB7+xjK4teSUOjN+G5DjJBY+2EOA9THMgNBULTqSz6VnJdHIOCF5vmZ4BxgXPd1ev1zutifj2V7efrmOXyTEugNDTNnPXaew8xyC51go+BUzHRnEKFgCMXySD5NLaWRScAKFD3tt42SyZDXX+KhAYX1mZHDwIGW2tjd+fvEyX1ikJyF/vwJ5X61yMGbgtIDjvjdtR5wuMT3jLYj7l9Jqm+NGLt51vmb5vJ4BpcRunNzYF98Y96Qk4MWpWdVmA4N+egF5o/HwDMy0GC9Ddb1rghv7tZ5fXK75d9QGhd/x9pWvdtIAVei9YQJLhHW2C52MZXyotwRl3ZWFLZ9OrylWFXmgbP2a6K1hAtMdd0jYBCN3vk9T6vWxj3OHbYsF72se/9eJGAeuBVqRK7f6gsFmmD0uVZOC2mHEDnDy5vfMDf1i2MR3wbW7GXWDGDRFHm8plmI4VNr/M5gJ2uzPNuCHaF22sHv+FrXJiL62nf1qFsH5nfB/zvxdQlCgQfKtq1L5FN6cJwLBv8Wv9d4VNf/u2tforHxFPbrZMr40g/qZyLjkn/eSiCvkT2h2aQFjBuytJdhU2ENxdFufuDI0bcXSucintIZ7cPJoE09yyI+MfoUlykozvr4ylRb/WxzN4td/LaFvRJrYV+tOb2CNrOOKPnoBfg8lntLXUqDHtXeXjLVH1VVEmNL7Q717sA/WOTJ97jr+FXgst06fe7M/F4i6v+iVZckXlPPhEx4bk0NXgxf+s3lGwP6qOr3lBEZoprf0M763zTxgfKO8T7Ifc4vxzBISm6x0F49Jmy+imOl9t+LRtLhFi2tlIRrBXLha0d1VF8UUPXFSuYC5qSEBT3oDjOkvA7r5kQKSXd51hy7incgtbAKaHm8h7Ih4pzyrOW8HZYWynuTTn8O0e92Z/qjn6ktlgB+4h3e1hhwl+pJ2oaYn8hsb4cUgO/dSSCD7YKoF2jJbxUcv4hn4HAqGfdKZUGDB9DYzPWqZtZp0AwRiYnhvGPJLnyHNpTnxd39ZYdq8dOnTo0KFDhw7mv8c/hXdKvMBwaFwAAAAASUVORK5CYII=" alt="GeeksforGeeks" className="w-7 h-7 object-contain" />,
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

      <div className="grid lg:grid-cols-[5fr_7fr] gap-6">
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
                        <CardContent className="p-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${colors} flex items-center justify-center shadow-sm overflow-hidden`}>
                              {platformLogos[account.platform] ?? <CheckCircle2 className="w-4 h-4 text-white" />}
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
                      className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all ${isCurrent ? 'bg-blue-500/10 border border-blue-500/20 shadow-sm' : 'hover:bg-accent/50'}`}
                      animate={isCurrent ? { scale: [1, 1.01, 1] } : {}}
                      transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={classification.badge}
                          alt={classification.name}
                          className="w-16 h-16 rounded-md object-cover shrink-0 shadow-sm"
                        />
                        <span className={`text-sm font-medium ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}>{classification.name}</span>
                        {isCurrent && <span className="text-[10px] bg-blue-500/20 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded font-medium">YOU</span>}
                      </div>
                      <span className="text-muted-foreground text-sm font-mono">{classification.range}</span>
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
