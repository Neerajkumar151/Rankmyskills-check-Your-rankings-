import { motion } from 'framer-motion';
import type { Page } from '@/lib/constants';
import { InfoPageLayout } from '@/components/layout/InfoPageLayout';

export const ScoreFormulaPage = ({ onNavigate }: { onNavigate: (page: Page) => void }) => {
    return (
        <InfoPageLayout onNavigate={onNavigate}>
            <main className="flex-1 max-w-4xl mx-auto px-6 pt-16 pb-24 relative z-10 w-full">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-16 text-center"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 text-xs font-semibold tracking-wide uppercase mb-6 border border-indigo-500/20">
                        Under the Hood
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 tracking-tight">
                        The Algorithm.
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
                        How we process, evaluate, and dynamically weight millions of data points to generate your unified Global Engineer Score.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-card/40 backdrop-blur-md border border-border/50 rounded-[2rem] p-8 sm:p-12 shadow-2xl relative overflow-hidden"
                >
                    {/* Decorative Top Line */}
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-50" />

                    <div className="prose prose-invert max-w-none">
                        <h3 className="text-2xl font-bold tracking-tight text-foreground mb-4">Core Principles</h3>
                        <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                            RankMySkills evaluates engineering prowess across multiple dimensions. To normalize extreme rating variances between platforms and prevent single-platform bias, we utilize a non-linear scaling algorithm (square root normalization). This creates a balanced, equitable Global Score that rewards both peak algorithmic performance on competitive sites and long-term consistency across practice platforms. All values are scaled by a factor of 1000 for granularity.
                        </p>

                        <div className="bg-background/80 rounded-2xl p-6 sm:p-8 border border-white/5 font-mono text-sm sm:text-base md:text-lg shadow-inner mb-10 overflow-x-auto leading-relaxed">
                            <span className="text-indigo-400 font-bold">const</span> <span className="text-foreground">GlobalScore</span> <span className="text-foreground">=</span> Math.<span className="text-blue-400">round</span>( (<br />
                            &nbsp;&nbsp;&nbsp;&nbsp;(<span className="text-orange-400">0.35</span> <span className="text-foreground">*</span> Math.<span className="text-blue-400">sqrt</span>(<span className="text-red-400">Codeforces.Rating</span>)) <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-foreground">+</span> (<span className="text-orange-400">0.30</span> <span className="text-foreground">*</span> Math.<span className="text-blue-400">sqrt</span>(<span className="text-yellow-500">LeetCode.Rating</span>)) <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-foreground">+</span> (<span className="text-orange-400">0.15</span> <span className="text-foreground">*</span> Math.<span className="text-blue-400">sqrt</span>(<span className="text-stone-400">CodeChef.Rating</span>)) <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-foreground">+</span> (<span className="text-orange-400">0.10</span> <span className="text-foreground">*</span> Math.<span className="text-blue-400">sqrt</span>(<span className="text-emerald-400">GFG.CodingScore</span>)) <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-foreground">+</span> (<span className="text-orange-400">0.10</span> <span className="text-foreground">*</span> Math.<span className="text-blue-400">sqrt</span>(<span className="text-purple-400">TotalProblemsSolved</span>)) <br />
                            ) <span className="text-foreground">*</span> <span className="text-orange-400">1000</span> );
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold tracking-tight text-foreground mb-4">Weight Breakdown</h3>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="bg-background/50 border border-white/5 p-5 rounded-xl">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-500 flex items-center justify-center font-bold border border-red-500/20">35%</div>
                                        <h4 className="font-bold text-foreground">Codeforces</h4>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">Carries the highest weight due to its rigorous mathematical standards, strict time constraints, and globally recognized Elo system reflecting immense algorithmic problem-solving speed.</p>
                                </div>

                                <div className="bg-background/50 border border-white/5 p-5 rounded-xl">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-yellow-500/20 text-yellow-500 flex items-center justify-center font-bold border border-yellow-500/20">30%</div>
                                        <h4 className="font-bold text-foreground">LeetCode</h4>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">The industry standard proxy for technical interviews and data structure fluency. High weight rewards consistency in solving standard interview-oriented algorithmic challenges.</p>
                                </div>

                                <div className="bg-background/50 border border-white/5 p-5 rounded-xl">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-stone-500/20 text-stone-400 flex items-center justify-center font-bold border border-white/10">15%</div>
                                        <h4 className="font-bold text-foreground">CodeChef</h4>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">Crucial for developing endurance and deep logical formulation. Evaluates performance in long challenges, lunchtime variations, and consistent competitive participation.</p>
                                </div>

                                <div className="bg-background/50 border border-white/5 p-5 rounded-xl">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold border border-emerald-500/20">10%</div>
                                        <h4 className="font-bold text-foreground">GeeksforGeeks</h4>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">Rewards mastery of foundational computer science concepts, vast array of practice problems, and long-term consistency in building coding fundamentals step-by-step.</p>
                                </div>

                                <div className="bg-background/50 border border-white/5 p-5 rounded-xl md:col-span-2">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold border border-purple-500/20">10%</div>
                                        <h4 className="font-bold text-foreground">Total Problems Solved</h4>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">A global accumulator metric. By combining the total volume of solved problems across all connected platforms, we reward sheer dedication, daily practice, and the grind required to truly master software engineering.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>
        </InfoPageLayout>
    );
};
