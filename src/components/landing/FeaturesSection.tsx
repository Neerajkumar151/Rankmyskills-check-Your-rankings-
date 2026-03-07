import { motion } from 'framer-motion';
import { TrendingUp, Target, Award, BarChart3, Zap, Shield, ArrowUpRight } from 'lucide-react';
import { fadeInUp, staggerContainer } from '@/lib/constants';

export const FeaturesSection = () => {
    const features = [
        {
            icon: TrendingUp,
            title: 'Track Progress',
            description: 'Monitor your coding journey across LeetCode, Codeforces & CodeChef with unified analytics. See your growth over time.',
            color: 'from-blue-500 to-indigo-600',
            shadow: 'shadow-blue-500/20',
            tag: 'Analytics'
        },
        {
            icon: Target,
            title: 'Global Engineer Score',
            description: 'A single score combining all your platform ratings using our weighted formula. One number to define your coding prowess.',
            color: 'from-violet-500 to-purple-600',
            shadow: 'shadow-violet-500/20',
            tag: 'Core Feature'
        },
        {
            icon: Award,
            title: 'Verified Profiles',
            description: 'Prove your platform ownership with our secure verification system. No fakes, no impersonation — real skill only.',
            color: 'from-emerald-500 to-teal-600',
            shadow: 'shadow-emerald-500/20',
            tag: 'Security'
        },
        {
            icon: BarChart3,
            title: 'Live Leaderboards',
            description: 'Global and college-level rankings that auto-update as you solve more problems. See where you stand instantly.',
            color: 'from-amber-500 to-orange-600',
            shadow: 'shadow-amber-500/20',
            tag: 'Competition'
        },
        {
            icon: Zap,
            title: 'One-Click Sync',
            description: 'Instantly fetch your latest ratings and problem counts from all platforms with a single button click.',
            color: 'from-rose-500 to-pink-600',
            shadow: 'shadow-rose-500/20',
            tag: 'Speed'
        },
        {
            icon: Shield,
            title: 'Trusted by Peers',
            description: 'All data is verified and transparent. Build your reputation with a trusted, tamper-proof coding profile.',
            color: 'from-cyan-500 to-blue-600',
            shadow: 'shadow-cyan-500/20',
            tag: 'Trust'
        },
    ];

    return (
        <section className="py-28 md:py-36 px-6 relative">
            <div className="max-w-7xl mx-auto">
                <motion.div className="text-center mb-20" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                    <p className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-4">Features</p>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-5 tracking-[-0.02em]">Built for ambition.</h2>
                    <p className="text-muted-foreground text-lg max-w-xl mx-auto text-balance">
                        Every feature designed to help you grow as a competitive programmer and stand out.
                    </p>
                </motion.div>

                {/* Bento grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                >
                    {features.map((feature, i) => {
                        const Icon = feature.icon;
                        const isLarge = i < 2;
                        return (
                            <motion.div
                                key={i}
                                variants={fadeInUp}
                                className={`relative bg-card rounded-2xl border border-border/60 hover:border-indigo-500/20 dark:hover:border-indigo-400/15 transition-all duration-300 group card-shine cursor-default overflow-hidden ${isLarge ? 'lg:col-span-1 md:col-span-1 p-8 md:p-10' : 'p-7'}`}
                                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                            >
                                {/* Subtle background gradient on hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />

                                {/* Tag */}
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className={`${isLarge ? 'w-14 h-14' : 'w-11 h-11'} rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg ${feature.shadow} group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon className={`${isLarge ? 'w-6 h-6' : 'w-5 h-5'} text-white`} />
                                        </div>
                                        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            {feature.tag} <ArrowUpRight className="w-3 h-3" />
                                        </span>
                                    </div>

                                    <h3 className={`${isLarge ? 'text-xl' : 'text-base'} font-bold text-foreground mb-2 tracking-tight`}>{feature.title}</h3>
                                    <p className={`text-muted-foreground ${isLarge ? 'text-sm' : 'text-[13px]'} leading-relaxed`}>{feature.description}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
};
