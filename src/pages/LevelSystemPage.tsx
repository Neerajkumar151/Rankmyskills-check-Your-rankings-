import { motion } from 'framer-motion';
import type { Page } from '@/lib/constants';
import { levelClassification, staggerContainer, fadeInUp } from '@/lib/constants';
import { InfoPageLayout } from '@/components/layout/InfoPageLayout';

export const LevelSystemPage = ({ onNavigate }: { onNavigate: (page: Page) => void }) => {

    // Expanded descriptions for a more premium, fleshed-out feel
    const levelDetails = [
        "The beginning of your journey. At this stage, you are familiarizing yourself with programming syntax and basic loops. Focus on solving simple implementation problems to build confidence.",
        "You've grasped the fundamentals and are beginning to recognize common problem patterns. You can solve ad-hoc problems and basic arrays/strings manipulation. Practice consistency.",
        "A solid milestone. You understand standard Data Structures like Stacks, Queues, and basic Trees. You are starting to tackle problems that require logical leaps and multiple steps.",
        "You are a formidable competitive programmer. Algorithms like DFS/BFS, advanced sorting, and basic Dynamic Programming are in your toolkit. You consistently clear early contest problems.",
        "Your problem-solving speed and accuracy are exceptional. You are optimizing for time/space complexity and commanding advanced topics like Graphs, segment trees, and complex DP.",
        "A master of algorithms. You can dissect highly obscure problems, optimize memory to the byte, and write bug-free code under extreme pressure. Highly respected in the community.",
        "The absolute elite. You are among the top fraction of a percent globally. Complex mathematics, heavy combinatorics, and advanced geometric algorithms are second nature to you.",
        "An algorithmic deity. Unparalleled intuition. You invent novel approaches to unsolved problems and consistently rank at the absolute pinnacle of global world-class competitions."
    ];

    return (
        <InfoPageLayout onNavigate={onNavigate}>
            <main className="flex-1 max-w-5xl mx-auto px-6 pt-16 pb-20 relative z-10 w-full">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-20 text-center max-w-3xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 text-xs font-semibold tracking-wide uppercase mb-6 border border-indigo-500/20">
                        Progression System
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 tracking-tight text-balance">
                        The Journey to Master.
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed text-balance">
                        Discover the eight distinct tiers of competitive programming. Your rank is an evolving testament to your dedication, forged by solving thousands of complex algorithms.
                    </p>
                </motion.div>

                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid gap-6 md:gap-8"
                >
                    {levelClassification.map((level, i) => (
                        <motion.div
                            variants={fadeInUp}
                            key={i}
                            className="group relative bg-card/40 backdrop-blur-md border border-border/50 rounded-[2rem] p-8 md:p-10 shadow-sm transition-all duration-500 hover:shadow-2xl hover:bg-card/80 hover:-translate-y-1 overflow-hidden"
                        >
                            {/* Hover Ambient Glow */}
                            <div className={`absolute -inset-px opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${level.color}`} />

                            <div className="relative flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
                                {/* Left Side: Rank Badge */}
                                <div className="flex flex-col items-center justify-center shrink-0 w-32 h-32 rounded-3xl bg-background/50 border border-white/5 shadow-inner relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                    <div className={`absolute inset-0 opacity-20 ${level.color}`} />
                                    <img
                                        src={level.badge}
                                        alt={`${level.name} badge`}
                                        className="w-22 h-22 object-contain drop-shadow-2xl relative z-10"
                                    />
                                </div>

                                {/* Right Side: Content */}
                                <div className="flex-1">
                                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-4">
                                        <h3 className={`text-3xl font-bold tracking-tight ${level.textColor}`}>{level.name}</h3>
                                        <div className="inline-flex items-center rounded-full bg-background/50 border border-white/5 px-3 py-1 text-xs font-mono font-medium text-muted-foreground">
                                            {level.range} Score
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                                        {levelDetails[i]}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </main>
        </InfoPageLayout>
    );
};
