import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Page } from '@/lib/constants';
import { Footer } from '@/components/landing/Footer';

export const ScoreFormulaPage = ({ onNavigate }: { onNavigate: (page: Page) => void }) => {
    return (
        <div className="min-h-screen bg-background relative flex flex-col selection:bg-indigo-500/30">
            {/* Ambient Background Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.06),transparent_50%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.03),transparent_50%)] pointer-events-none" />

            <header className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-2xl border-b border-white/5 dark:border-white/5 transition-all">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <button
                        onClick={() => onNavigate('landing')}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 group text-sm font-medium"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span>Back</span>
                    </button>
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('landing')}>
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-xs tracking-tight">R</span>
                        </div>
                        <span className="text-foreground font-semibold tracking-tight text-sm">RankMySkills</span>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-4xl mx-auto px-6 pt-32 pb-24 relative z-10 w-full">
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
                            RankMySkills was built on the philosophy that true engineering prowess spans multiple disciplines. An algorithm expert on Codeforces should be evaluated on the same playing field as a dynamic programming master on LeetCode. Our algorithm normalizes platform variances to produce an equitable metric.
                        </p>

                        <div className="bg-background/80 rounded-2xl p-6 sm:p-8 border border-white/5 font-mono text-sm shadow-inner mb-8 overflow-x-auto">
                            <span className="text-indigo-400 font-bold">const</span> <span className="text-foreground">GlobalScore</span> = ( <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;(<span className="text-emerald-400">LeetCode.Rating</span> <span className="text-foreground">*</span> <span className="text-orange-400">0.40</span>) <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-foreground">+</span> (<span className="text-purple-400">Codeforces.Elo</span> <span className="text-foreground">*</span> <span className="text-orange-400">0.30</span>) <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-foreground">+</span> ((<span className="text-sky-400">GFG.Solved</span> <span className="text-foreground">/</span> <span className="text-sky-400">GFG.Total</span>) <span className="text-foreground">*</span> <span className="text-orange-400">0.30</span>) <br />
                            );
                        </div>

                        <ul className="space-y-4 text-muted-foreground text-lg mb-8">
                            <li className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5 border border-indigo-500/20 text-sm font-bold">1</div>
                                <span><strong className="text-foreground">LeetCode Weight (40%):</strong> Prioritized heavily as it is the industry standard proxy for technical interviews and data structure fluency.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 mt-0.5 border border-purple-500/20 text-sm font-bold">2</div>
                                <span><strong className="text-foreground">Codeforces Weight (30%):</strong> Reflects advanced mathematical logic and speed under contest pressures.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/20 text-sm font-bold">3</div>
                                <span><strong className="text-foreground">GeeksforGeeks Weight (30%):</strong> Rewards long-term consistency and total volume of solved problems across a wide array of conceptual topics.</span>
                            </li>
                        </ul>
                    </div>
                </motion.div>
            </main>

            <div className="relative z-20">
                <Footer onNavigate={onNavigate} />
            </div>
        </div>
    );
};
