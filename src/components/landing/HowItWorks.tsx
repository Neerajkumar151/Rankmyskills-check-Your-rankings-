import { motion } from 'framer-motion';
import { Info, UserPlus, ShieldCheck, RefreshCw, ArrowRight } from 'lucide-react';

export const HowItWorks = () => {
    const howItWorks = [
        {
            step: '01',
            title: 'Create Account',
            description: 'Sign up with your college email and add your coding platform usernames. It takes less than 60 seconds.',
            icon: UserPlus,
            detail: 'Supports LeetCode, Codeforces, CodeChef & GFG'
        },
        {
            step: '02',
            title: 'Verify Profiles',
            description: 'Verify ownership of your accounts by adding a unique code to your profile. This ensures no one can impersonate you.',
            icon: ShieldCheck,
            detail: 'One-time verification, takes ~2 minutes'
        },
        {
            step: '03',
            title: 'Sync & Compete',
            description: 'Click Sync Data to fetch your live ratings. Your Global Engineer Score updates instantly and you appear on leaderboards.',
            icon: RefreshCw,
            detail: 'Real-time sync, auto-calculated ranking'
        },
    ];

    return (
        <section id="how-it-works" className="py-28 md:py-36 px-6 relative overflow-hidden">
            {/* Subtle background */}
            <div className="absolute inset-0 bg-secondary/40 dark:bg-secondary/20" />

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div className="text-center mb-20" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                    <p className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-4">How it works</p>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-5 tracking-[-0.02em]">Three simple steps.</h2>
                    <p className="text-muted-foreground text-lg text-balance max-w-lg mx-auto">From zero to ranked in under 5 minutes. No complex setup, no credit card required.</p>
                </motion.div>

                {/* Steps with connecting line */}
                <div className="grid md:grid-cols-3 gap-6 relative">
                    {/* Connecting line (desktop only) */}
                    <div className="hidden md:block absolute top-[3.5rem] left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-[2px] bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-purple-500/20" />

                    {howItWorks.map((item, i) => {
                        const Icon = item.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15, duration: 0.5 }}
                                className="relative bg-card rounded-2xl p-8 border border-border/60 hover:border-indigo-500/20 dark:hover:border-indigo-400/15 hover:shadow-lg hover:shadow-indigo-500/[0.04] transition-all duration-300 group"
                            >
                                {/* Step number + icon row */}
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/[0.08] dark:bg-indigo-500/[0.12] flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative">
                                        <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                        {/* Step badge */}
                                        <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white text-[10px] font-bold flex items-center justify-center shadow-lg">{i + 1}</span>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-foreground mb-2 tracking-tight">{item.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{item.description}</p>

                                {/* Detail tag */}
                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/[0.06] dark:bg-indigo-500/[0.10] text-indigo-600 dark:text-indigo-400 text-[11px] font-medium">
                                    <ArrowRight className="w-3 h-3" />
                                    {item.detail}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Score Formula Card */}
                <motion.div
                    className="mt-16 relative"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="bg-card rounded-2xl border border-border/60 overflow-hidden">
                        <div className="grid md:grid-cols-2">
                            {/* Left: formula info */}
                            <div className="p-8 md:p-10">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-500/[0.08] dark:bg-indigo-500/[0.12] flex items-center justify-center flex-shrink-0">
                                        <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground tracking-tight">How Your Score Is Calculated</h3>
                                </div>
                                <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
                                    Your Global Engineer Score is a weighted composite of your ratings across all connected platforms. It uses a square-root normalization to fairly compare different rating scales.
                                </p>
                                <code className="block bg-background dark:bg-background/50 rounded-xl px-5 py-4 text-sm font-mono text-foreground border border-border/60 mb-4">
                                    (0.35×√CF + 0.30×√LC + 0.25×√CC + 0.10×√TotalSolved) × 1000
                                </code>
                                <p className="text-muted-foreground text-xs tracking-wide">
                                    <span className="font-medium">CF</span> = Codeforces · <span className="font-medium">LC</span> = LeetCode · <span className="font-medium">CC</span> = CodeChef
                                </p>
                            </div>

                            {/* Right: platforms image */}
                            <div className="relative bg-gradient-to-br from-indigo-500/[0.04] to-violet-500/[0.04] dark:from-indigo-500/[0.06] dark:to-violet-500/[0.06] p-8 flex items-center justify-center">
                                <img
                                    src="/platforms-connected.png"
                                    alt="Connected Platforms"
                                    className="w-full max-w-xs rounded-xl opacity-90"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
