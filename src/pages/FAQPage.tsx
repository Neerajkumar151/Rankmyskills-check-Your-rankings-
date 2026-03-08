import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import type { Page } from '@/lib/constants';
import { InfoPageLayout } from '@/components/layout/InfoPageLayout';

export const FAQPage = ({ onNavigate }: { onNavigate: (page: Page) => void }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        {
            q: 'How does the unified Global Engineer Score work?',
            a: "Our proprietary algorithm dynamically pulls your live rating from LeetCode, Codeforces, and GeeksforGeeks. Instead of simple addition, we normalize these scores using a weighted bell curve that accounts for problem density, contest difficulty, and consistency streaks. This ensures a Codeforces Expert and a LeetCode Guardian are evaluated on an even, global playing field."
        },
        {
            q: 'Is RankMySkills completely free?',
            a: 'Yes! The core platform is 100% free for all students. We believe competitive programming analytics should be freely accessible to help you secure better tech placements. Tracking, global logic, and the portfolio generator will remain free forever.'
        },
        {
            q: 'How frequently does my profile data synchronize?',
            a: 'To optimize server loads while maintaining accuracy, our systems automatically perform a background sync of your connected platforms every 24 hours. However, if you recently solved a major problem or won a contest, you can manually trigger an instant sync via the "Sync Data" button on your Dashboard.'
        },
        {
            q: 'How do I compete on my specific College Leaderboard?',
            a: 'During the registration process, you will be prompted to select your enrolled University from our verified dropdown list. Once selected, your profile is immediately injected into your dedicated College Leaderboard. If your college is missing, you can request it via our support email.'
        },
        {
            q: 'Can recruiters see my RankMySkills profile?',
            a: 'Absolutely. We designed the "Portfolio" tab specifically for this. It acts as a beautifully formatted, undeniable cryptographic proof-of-work for your algorithms skillset. You can generate a public link to share directly with technical recruiters or drop it on your resume.'
        }
    ];

    return (
        <InfoPageLayout onNavigate={onNavigate}>
            <main className="flex-1 max-w-4xl mx-auto px-6 pt-16 pb-24 relative z-10 w-full">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-16 text-center"
                >
                    <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 tracking-tight">
                        We're here to <span className="text-muted-foreground">help.</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
                        Find answers to common questions about our algorithms, data syncing, and how to get the most out of your engineering profile.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="space-y-4 max-w-3xl mx-auto"
                >
                    {faqs.map((faq, i) => {
                        const isOpen = openIndex === i;
                        return (
                            <motion.div
                                key={i}
                                className={`rounded-[2rem] border transition-all duration-500 overflow-hidden ${isOpen ? 'bg-card/60 backdrop-blur-xl border-indigo-500/20 shadow-2xl shadow-indigo-500/5' : 'bg-transparent border-border/40 hover:border-white/10'}`}
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : i)}
                                    className="w-full flex items-center justify-between p-6 md:p-8 text-left outline-none"
                                >
                                    <span className={`text-lg md:text-xl font-semibold tracking-tight pr-8 transition-colors ${isOpen ? 'text-foreground' : 'text-foreground/80'}`}>
                                        {faq.q}
                                    </span>
                                    <div className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-500 ${isOpen ? 'bg-indigo-500 text-white border-transparent rotate-45' : 'bg-transparent border-border/60 text-muted-foreground'}`}>
                                        <Plus className="w-4 h-4" />
                                    </div>
                                </button>
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                        >
                                            <div className="px-6 md:px-8 pb-8 pt-2 text-muted-foreground text-base md:text-lg leading-relaxed text-balance">
                                                {faq.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </main>
        </InfoPageLayout>
    );
};
