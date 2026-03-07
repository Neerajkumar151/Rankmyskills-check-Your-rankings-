import { motion } from 'framer-motion';
import { Sparkles, Users, GraduationCap, Code2, Star } from 'lucide-react';
import { LiquidButton } from '@/components/ui/liquid-glass-button';
import { AnimatedShaderBG } from '@/components/ui/animated-shader-bg';
import { AnimatedTooltip } from '@/components/ui/animated-tooltip';
import { fadeInUp, staggerContainer, type Page } from '@/lib/constants';
import { useAuth } from '@/context/AuthProvider';

export const HeroSection = ({ onNavigate }: { onNavigate: (page: Page) => void }) => {
    const { isAuthenticated } = useAuth();

    const people = [
        {
            id: 1,
            name: "John Doe",
            designation: "Software Engineer",
            image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
        },
        {
            id: 2,
            name: "Robert Johnson",
            designation: "Product Manager",
            image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
        },
        {
            id: 3,
            name: "Jane Smith",
            designation: "Data Scientist",
            image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
        },
        {
            id: 4,
            name: "Emily Davis",
            designation: "UX Designer",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
        },
        {
            id: 5,
            name: "Tyler Durden",
            designation: "Soap Developer",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80",
        },
        {
            id: 6,
            name: "Dora",
            designation: "The Explorer",
            image: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3534&q=80",
        },
    ];

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden pt-20 pb-16">
            {/* Gradient mesh background */}
            <div className="absolute inset-0 gradient-mesh" />

            {/* Animated Shader Background */}
            <div className="absolute inset-0 z-[2]">
                <AnimatedShaderBG />
            </div>

            {/* Floating orbs - Optimized with Radial Gradients instead of expensive CSS Blurs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[15%] left-[10%] w-[500px] h-[500px] rounded-full animate-float" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(99,102,241,0) 70%)' }} />
                <div className="absolute bottom-[10%] right-[10%] w-[450px] h-[450px] rounded-full animate-float-delayed" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, rgba(139,92,246,0) 70%)' }} />
                <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(232,121,249,0.08) 0%, rgba(232,121,249,0) 70%)' }} />
            </div>

            {/* Noise overlay */}
            <div className="absolute inset-0 noise-bg pointer-events-none" />

            <div className="relative z-10 w-full mx-auto px-6 sm:px-10 lg:px-16 xl:px-24 pointer-events-none">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left: Text content */}
                    <motion.div variants={staggerContainer} initial="initial" animate="animate">
                        {/* Badge */}
                        <motion.div variants={fadeInUp} className="mb-8">
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/[0.08] dark:bg-indigo-500/[0.12] text-indigo-600 dark:text-indigo-400 text-[13px] font-medium border border-indigo-500/[0.12] dark:border-indigo-400/[0.15] backdrop-blur-sm">
                                <Sparkles className="w-3.5 h-3.5" />
                                The #1 platform for competitive programmers
                            </span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-extrabold text-foreground mb-6 leading-[0.92] tracking-[-0.03em]">
                            Your Skills,
                            <br />
                            <span className="text-gradient">Ranked.</span>
                        </motion.h1>

                        {/* Sub-headline */}
                        <motion.p variants={fadeInUp} className="text-base md:text-lg text-muted-foreground mb-10 max-w-lg leading-relaxed text-balance">
                            Connect your LeetCode, Codeforces & CodeChef profiles.
                            Get a unified Global Engineer Score.
                            Compete on live leaderboards with your college peers.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3 mb-12 pointer-events-auto">
                            <LiquidButton
                                onClick={() => onNavigate(isAuthenticated ? 'dashboard' : 'register')}
                                className="py-6 px-10 text-base"
                            >
                                {isAuthenticated ? 'Go to Dashboard' : 'Start Free — No CC Required'}
                                {/* <ArrowRight className="ml-2 w-5 h-5" /> */}
                            </LiquidButton>
                            <button
                                className="btn-shiny-glass"
                                onClick={() => {
                                    const el = document.getElementById('how-it-works');
                                    el?.scrollIntoView({ behavior: 'smooth' });
                                }}
                            >
                                <div className="btn-wrap">
                                    <p>
                                        <span>See How It Works</span>
                                        <span>See How It Works</span>
                                    </p>
                                </div>
                            </button>
                        </motion.div>

                        {/* Social proof */}
                        <motion.div variants={fadeInUp} className="flex items-center gap-4">
                            <div className="flex pointer-events-auto">
                                <AnimatedTooltip items={people} />
                            </div>
                            <div>
                                <div className="flex items-center gap-1 mb-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <p className="text-muted-foreground text-xs font-medium">Loved by <span className="text-foreground font-semibold">10,000+</span> students</p>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right: Dashboard preview image */}
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="relative hidden lg:block"
                    >
                        <div className="relative">
                            {/* Glow behind image */}
                            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-purple-500/20 rounded-3xl blur-2xl" />

                            {/* Dashboard preview */}
                            <div className="relative rounded-2xl overflow-hidden border border-border/40 shadow-2xl shadow-indigo-500/10">
                                <img
                                    src="/dashboard-preview.png"
                                    alt="RankMySkills Dashboard Preview"
                                    className="w-full h-auto"
                                />
                                {/* Slight overlay gradient at bottom */}
                                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background/60 to-transparent" />
                            </div>

                            {/* Floating stat card */}
                            <motion.div
                                className="absolute -bottom-6 -left-6 bg-card/90 backdrop-blur-xl rounded-2xl p-4 border border-border/60 shadow-xl"
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                                        <Code2 className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-foreground font-bold text-lg leading-none">1,247</p>
                                        <p className="text-muted-foreground text-[11px] font-medium">Problems Solved</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Floating rank card */}
                            <motion.div
                                className="absolute -top-4 -right-4 bg-card/90 backdrop-blur-xl rounded-2xl p-4 border border-border/60 shadow-xl"
                                animate={{ y: [0, -6, 0] }}
                                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">#1</span>
                                    </div>
                                    <div>
                                        <p className="text-foreground font-bold text-lg leading-none">Top Rank</p>
                                        <p className="text-muted-foreground text-[11px] font-medium">College Leaderboard</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* Stats row */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="mt-20 grid grid-cols-3 gap-4 max-w-3xl mx-auto pointer-events-auto"
                >
                    {[
                        { value: '10K+', label: 'Students', icon: Users },
                        { value: '500+', label: 'Colleges', icon: GraduationCap },
                        { value: '1M+', label: 'Problems Tracked', icon: Code2 },
                    ].map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <div key={i} className="text-center p-4 rounded-2xl bg-card/50 dark:bg-card/30 border border-border/40 backdrop-blur-sm group hover:border-indigo-500/20 transition-colors duration-300">
                                <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/[0.08] dark:bg-indigo-500/[0.12] mb-2 group-hover:scale-110 transition-transform duration-300">
                                    <Icon className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                                </div>
                                <p className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">{stat.value}</p>
                                <p className="text-muted-foreground text-[11px] mt-1 font-medium uppercase tracking-wider">{stat.label}</p>
                            </div>
                        );
                    })}
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div className="absolute bottom-6 left-1/2 -translate-x-1/2" animate={{ y: [0, 8, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
                <div className="w-5 h-8 rounded-full border border-muted-foreground/20 flex items-start justify-center p-1.5">
                    <motion.div
                        className="w-1 h-2 bg-muted-foreground/40 rounded-full"
                        animate={{ opacity: [0.4, 1, 0.4], y: [0, 4, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>
            </motion.div>
        </section>
    );
};
