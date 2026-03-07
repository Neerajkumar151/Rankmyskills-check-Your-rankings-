import { memo } from 'react';
import { motion } from 'framer-motion';
import { Building2, Filter, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LevelBadge } from '@/components/common/LevelBadge';
import { RankMedal } from '@/components/common/RankMedal';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { useAuth } from '@/context/AuthProvider';

export const CollegeLeaderboard = memo(() => {
    const { profile } = useAuth();
    const { data, loading, filters, setFilters, myRank, dynamicFilterOptions } = useLeaderboard('college');

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <Building2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    <h1 className="text-3xl font-bold text-foreground">College Leaderboard</h1>
                </div>
                {profile?.college && <p className="text-muted-foreground text-sm">🏫 {profile.college}</p>}
                <p className="text-muted-foreground">Compare yourself with students in your college</p>
            </div>

            {/* Filters */}
            <Card className="bg-card border-border">
                <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground text-sm font-medium">FILTERS</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label className="text-muted-foreground text-xs mb-2 block">Graduation Year</Label>
                            <Select value={filters.graduationYear} onValueChange={(v) => setFilters({ ...filters, graduationYear: v })}>
                                <SelectTrigger className="bg-secondary border-border text-foreground"><SelectValue placeholder="All Years" /></SelectTrigger>
                                <SelectContent className="bg-card border-border">
                                    <SelectItem value="all" className="text-foreground">All Years</SelectItem>
                                    {dynamicFilterOptions.graduationYears.map((y) => <SelectItem key={y} value={y} className="text-foreground">{y}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="text-muted-foreground text-xs mb-2 block">Course</Label>
                            <Select value={filters.course} onValueChange={(v) => setFilters({ ...filters, course: v })}>
                                <SelectTrigger className="bg-secondary border-border text-foreground"><SelectValue placeholder="All Courses" /></SelectTrigger>
                                <SelectContent className="bg-card border-border">
                                    <SelectItem value="all" className="text-foreground">All Courses</SelectItem>
                                    {dynamicFilterOptions.courses.map((c) => <SelectItem key={c} value={c} className="text-foreground">{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="text-muted-foreground text-xs mb-2 block">Sort By</Label>
                            <Select value={filters.sortBy} onValueChange={(v) => setFilters({ ...filters, sortBy: v })}>
                                <SelectTrigger className="bg-secondary border-border text-foreground"><SelectValue placeholder="College Score" /></SelectTrigger>
                                <SelectContent className="bg-card border-border">
                                    <SelectItem value="collegeScore" className="text-foreground">College Score</SelectItem>
                                    <SelectItem value="codeforces" className="text-foreground">Codeforces</SelectItem>
                                    <SelectItem value="leetcode" className="text-foreground">LeetCode</SelectItem>
                                    <SelectItem value="codechef" className="text-foreground">CodeChef</SelectItem>
                                    <SelectItem value="gfg" className="text-foreground">GeeksforGeeks</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* YOUR RANK Card */}
            {myRank && (
                <Card className="bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-6">
                            <div className="text-center px-4">
                                <p className="text-muted-foreground text-xs font-medium uppercase">Your Rank</p>
                                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">#{myRank.rank}</p>
                            </div>
                            <div className="flex items-center gap-3 flex-1">
                                <Avatar className="w-10 h-10">
                                    <AvatarImage src={myRank.avatar || undefined} />
                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                                        {myRank.name?.split(' ').map((n: string) => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-foreground font-medium">{myRank.name}</p>
                                    <div className="flex items-center gap-2">
                                        <LevelBadge level={myRank.level} />
                                    </div>
                                </div>
                            </div>
                            <div className="hidden md:flex items-center gap-6 text-sm">
                                <div className="text-center">
                                    <p className="text-muted-foreground text-xs">College Score</p>
                                    <p className="text-blue-600 dark:text-blue-400 font-mono font-bold">{myRank.collegeScore.toLocaleString()}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-muted-foreground text-xs">GFG</p>
                                    <p className="text-foreground font-mono">{myRank.gfg}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-muted-foreground text-xs">Codeforces</p>
                                    <p className="text-foreground font-mono">{myRank.codeforces}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-muted-foreground text-xs">LeetCode</p>
                                    <p className="text-foreground font-mono">{myRank.leetcode}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-muted-foreground text-xs">CodeChef</p>
                                    <p className="text-foreground font-mono">{myRank.codechef}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Leaderboard Table */}
            <Card className="bg-card border-border overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" /><p className="text-muted-foreground mt-4">Loading leaderboard...</p></div>
                ) : data.length === 0 ? (
                    <div className="p-12 text-center"><p className="text-muted-foreground">No ranked users yet. Be the first to sync your data!</p></div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border bg-secondary/50">
                                    <th className="text-left p-4 text-muted-foreground font-medium text-sm">RANK</th>
                                    <th className="text-left p-4 text-muted-foreground font-medium text-sm">STUDENT</th>
                                    <th className="text-left p-4 text-muted-foreground font-medium text-sm">YEAR</th>
                                    <th className="text-left p-4 text-muted-foreground font-medium text-sm">COLLEGE SCORE</th>
                                    <th className="text-left p-4 text-muted-foreground font-medium text-sm">GFG</th>
                                    <th className="text-left p-4 text-muted-foreground font-medium text-sm">CODEFORCES</th>
                                    <th className="text-left p-4 text-muted-foreground font-medium text-sm">LEETCODE</th>
                                    <th className="text-left p-4 text-muted-foreground font-medium text-sm">CODECHEF</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((entry, index) => (
                                    <motion.tr key={entry.userId} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.03 }}
                                        className="border-b border-border hover:bg-accent/50 transition-colors">
                                        <td className="p-4"><RankMedal rank={entry.rank} /></td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="w-10 h-10">
                                                    <AvatarImage src={entry.avatar || undefined} />
                                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                                                        {entry.name?.split(' ').map((n: string) => n[0]).join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-foreground font-medium">{entry.name}</p>
                                                        <LevelBadge level={entry.level} />
                                                    </div>
                                                    <p className="text-muted-foreground text-xs uppercase">{entry.course || '-'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-muted-foreground text-sm">{entry.graduationYear || '-'}</td>
                                        <td className="p-4"><span className="text-blue-600 dark:text-blue-400 font-mono font-semibold">{entry.collegeScore.toLocaleString()}</span></td>
                                        <td className="p-4 text-foreground font-mono">{entry.gfg}</td>
                                        <td className="p-4 text-foreground font-mono">{entry.codeforces}</td>
                                        <td className="p-4 text-foreground font-mono">{entry.leetcode}</td>
                                        <td className="p-4 text-foreground font-mono">{entry.codechef}</td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </motion.div>
    );
});
