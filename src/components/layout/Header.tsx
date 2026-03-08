import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthProvider';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import type { Page } from '@/lib/constants';

export const Header = memo(({ onNavigate }: { onNavigate: (page: Page) => void }) => {
    const { isAuthenticated } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/40">
            <div className="mx-auto px-6 sm:px-10 lg:px-16 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3 group cursor-pointer hover:opacity-80 transition-opacity" onClick={() => onNavigate('landing')}>
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow duration-300 overflow-hidden">
                        <img
                            src="/logo.jpeg"
                            alt="RankMySkills"
                            className="w-full h-full object-cover mix-blend-screen"
                        />
                    </div>
                    <span className="text-foreground font-semibold text-lg tracking-tight">RankMySkills</span>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-2">
                    <ThemeToggle />
                    {isAuthenticated ? (
                        <>
                            <Button variant="ghost" className="text-muted-foreground hover:text-foreground text-sm font-medium" onClick={() => onNavigate('dashboard')}>
                                Dashboard
                            </Button>
                            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-full px-5 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300" onClick={() => onNavigate('edit-profile')}>
                                My Profile
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="ghost" className="text-muted-foreground hover:text-foreground text-sm font-medium" onClick={() => onNavigate('login')}>
                                Login
                            </Button>
                            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-full px-5 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300" onClick={() => onNavigate('register')}>
                                Get Started
                            </Button>
                        </>
                    )}
                </div>

                {/* Mobile Navigation Toggle */}
                <div className="md:hidden flex items-center gap-4">
                    <ThemeToggle />
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 text-foreground hover:bg-muted/50 rounded-md transition-colors"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Menu Dropdown */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden overflow-hidden bg-background/95 backdrop-blur-xl border-b border-border shadow-2xl"
                    >
                        <div className="px-6 py-4 flex flex-col gap-3">
                            {isAuthenticated ? (
                                <>
                                    <Button variant="ghost" className="w-full justify-center text-muted-foreground hover:text-foreground text-base" onClick={() => { setIsMenuOpen(false); onNavigate('dashboard'); }}>
                                        Dashboard
                                    </Button>
                                    <Button className="w-full justify-center bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md py-6 text-base" onClick={() => { setIsMenuOpen(false); onNavigate('edit-profile'); }}>
                                        My Profile
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button variant="ghost" className="w-full justify-center text-muted-foreground hover:text-foreground text-base" onClick={() => { setIsMenuOpen(false); onNavigate('login'); }}>
                                        Login
                                    </Button>
                                    <Button className="w-full justify-center bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md py-6 text-base" onClick={() => { setIsMenuOpen(false); onNavigate('register'); }}>
                                        Get Started
                                    </Button>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
});
