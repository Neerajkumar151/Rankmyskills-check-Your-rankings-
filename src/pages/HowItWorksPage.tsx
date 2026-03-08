import { UserPlus, ShieldCheck, RefreshCw, Zap, CheckCircle2 } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import type { Page } from '@/lib/constants';
import { InfoPageLayout } from '@/components/layout/InfoPageLayout';

export const HowItWorksPage = ({ onNavigate }: { onNavigate: (page: Page) => void }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const yBackground = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

    const steps = [
        {
            title: "Connect & Initialize",
            subtitle: "Step 01",
            icon: UserPlus,
            color: "from-blue-500 to-cyan-500",
            glowColor: "bg-blue-500/20",
            iconColor: "text-blue-400",
            borderColor: "border-blue-500/20",
            content: "Your journey starts with a simple registration using your college email. Once inside, you link your competitive programming profiles. We seamlessly support LeetCode, Codeforces, CodeChef, and GeeksforGeeks. By providing your exact usernames, you initialize our backend trackers to prepare for your data ingress.",
            features: ["Supports 4 Major Platforms", "Under 60 Seconds Setup", "Secure College Verification"]
        },
        {
            title: "Identity Verification",
            subtitle: "Step 02",
            icon: ShieldCheck,
            color: "from-violet-500 to-purple-500",
            glowColor: "bg-violet-500/20",
            iconColor: "text-violet-400",
            borderColor: "border-violet-500/20",
            content: "To maintain absolute leaderboard integrity, we enforce strict identity verification. RankMySkills generates unique cryptographic tokens for each platform. Simply paste these tokens into your platform profile's bio or location field. Our automated web scrapers and API integrations will instantly verify ownership, preventing impersonations entirely.",
            features: ["Cryptographic Unique Tokens", "Automated Bio Parsing", "Immutable Integrity Check"]
        },
        {
            title: "Real-time Synchronization",
            subtitle: "Step 03",
            icon: RefreshCw,
            color: "from-emerald-500 to-teal-500",
            glowColor: "bg-emerald-500/20",
            iconColor: "text-emerald-400",
            borderColor: "border-emerald-500/20",
            content: "Once verified, hit 'Sync Data'. Our proprietary ingestion engine fetches your latest contests, ratings, and problem volumes across all platforms simultaneously. The data runs through our weighted non-linear scoring algorithm to compute your unified Global Engineer Score, catapulting you onto the global and college leaderboards.",
            features: ["Concurrent Data Fetching", "Dynamic Score Calculation", "Instant Leaderboard Placement"]
        }
    ];

    return (
        <InfoPageLayout
            onNavigate={onNavigate}
            ambientGradientClasses="bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.08),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03),transparent_60%)]"
        >
            <main className="flex-1 max-w-6xl mx-auto px-6 pt-16 pb-24 relative z-10 w-full" ref={containerRef}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-24 text-center max-w-3xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 text-xs font-semibold tracking-wide uppercase mb-6 border border-indigo-500/20">
                        Operational Flow
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 tracking-tight text-balance">
                        The Architecture of Competition.
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed text-balance">
                        Explore the intricate lifecycle of your data. Discover how we seamlessly connect the world's top coding platforms to orchestrate a unified engineering leaderboard.
                    </p>
                </motion.div>

                {/* Timeline Layout */}
                <div className="relative space-y-24 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        const isEven = index % 2 === 0;

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.7, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
                                className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active`}
                            >
                                {/* Center Timeline UI marker */}
                                <div className="absolute left-0 md:left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center">
                                    <div className={`absolute w-full h-full rounded-full opacity-20 group-hover:opacity-60 transition-opacity duration-700 blur-md ${step.glowColor}`} />
                                    <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${step.color} shadow-[0_0_0_4px_rgba(255,255,255,0.05)] z-10`} />
                                </div>

                                {/* Content Box */}
                                <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-4rem)] ${isEven ? 'md:mr-16' : 'md:ml-16'} relative`}>
                                    <div className="bg-card/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 hover:bg-card/60 hover:border-white/10 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl overflow-hidden relative">

                                        {/* Ambient Core Glow */}
                                        <div className={`absolute -top-32 -right-32 w-64 h-64 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none ${step.glowColor}`} />

                                        <div className="flex items-center gap-4 mb-6">
                                            <div className={`w-14 h-14 rounded-2xl bg-background/50 border flex items-center justify-center flex-shrink-0 ${step.borderColor}`}>
                                                <Icon className={`w-6 h-6 ${step.iconColor}`} />
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-1">{step.subtitle}</div>
                                                <h3 className="text-2xl font-bold tracking-tight text-foreground">{step.title}</h3>
                                            </div>
                                        </div>

                                        <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                                            {step.content}
                                        </p>

                                        <div className="space-y-3">
                                            {step.features.map((feature, fIndex) => (
                                                <div key={fIndex} className="flex items-center gap-3 text-sm font-medium text-foreground/80">
                                                    <CheckCircle2 className={`w-4 h-4 ${step.iconColor}`} />
                                                    {feature}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Closing Callout */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mt-32 max-w-4xl mx-auto relative rounded-3xl overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-50 z-0" />
                    <div className="bg-card/40 backdrop-blur-2xl border border-white/10 p-12 md:p-16 text-center relative z-10 flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mb-6 border border-indigo-500/30">
                            <Zap className="w-8 h-8 text-indigo-400" />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">Ready to quantify your skills?</h2>
                        <p className="text-lg text-muted-foreground mb-8 max-w-xl text-balance">Join the competitive tier-list today. See exactly where you stand against the world's most disciplined algorithm engineers.</p>
                        <button
                            onClick={() => onNavigate('register')}
                            className="bg-foreground text-background font-semibold px-8 py-4 rounded-full hover:scale-105 transition-transform duration-300 shadow-xl"
                        >
                            Get Started Instantly
                        </button>
                    </div>
                </motion.div>
            </main>
        </InfoPageLayout>
    );
};
