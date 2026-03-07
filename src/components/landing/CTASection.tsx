import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthProvider';
import { ArrowRight, Zap } from 'lucide-react';
import type { Page } from '@/lib/constants';

export const CTASection = ({ onNavigate }: { onNavigate: (page: Page) => void }) => {
    const { isAuthenticated } = useAuth();

    return (
        <section className="py-28 md:py-36 px-6 relative overflow-hidden">
            <div className="max-w-7xl mx-auto relative">
                <motion.div
                    className="relative rounded-3xl overflow-hidden"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 animate-gradient" />

                    {/* Decorative orbs */}
                    <div className="absolute top-[10%] right-[10%] w-[300px] h-[300px] bg-white/[0.06] rounded-full blur-[80px]" />
                    <div className="absolute bottom-[10%] left-[10%] w-[250px] h-[250px] bg-indigo-400/[0.10] rounded-full blur-[80px]" />
                    <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-violet-300/[0.06] rounded-full blur-[100px]" />

                    {/* Noise overlay */}
                    <div className="absolute inset-0 noise-bg pointer-events-none opacity-50" />

                    {/* Content */}
                    <div className="relative z-10 text-center py-16 md:py-24 px-8 md:px-16">
                        {/* Icon */}
                        <motion.div
                            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 mb-8"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Zap className="w-7 h-7 text-white" />
                        </motion.div>

                        <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-[-0.02em] leading-tight">
                            Ready to prove<br className="hidden sm:block" /> yourself?
                        </h2>
                        <p className="text-white/50 text-base md:text-lg mb-5 max-w-lg mx-auto text-balance leading-relaxed">
                            Join thousands of students already tracking their progress and climbing the ranks on RankMySkills.
                        </p>

                        {/* Trust badges */}
                        <div className="flex items-center justify-center gap-4 mb-10 text-white/40 text-xs font-medium">
                            <span>✓ Free forever</span>
                            <span className="w-1 h-1 rounded-full bg-white/20" />
                            <span>✓ No credit card</span>
                            <span className="w-1 h-1 rounded-full bg-white/20" />
                            <span>✓ Setup in 2 min</span>
                        </div>

                        <Button
                            size="lg"
                            className="bg-white text-indigo-700 hover:bg-white/90 px-10 py-7 text-base font-semibold rounded-full shadow-2xl shadow-black/20 hover:scale-[1.03] transition-all duration-300"
                            onClick={() => onNavigate(isAuthenticated ? 'dashboard' : 'register')}
                        >
                            {isAuthenticated ? 'Go to Dashboard' : 'Create Free Account'}
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
