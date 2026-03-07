import { CheckCircle2, Share2 } from 'lucide-react';
import { FaLinkedin, FaGithub, FaWhatsapp, FaTwitter, FaInstagram, FaRegEnvelope } from 'react-icons/fa';
import { SiLeetcode, SiGeeksforgeeks } from 'react-icons/si';
import { useAuth } from '@/context/AuthProvider';
import type { Page } from '@/lib/constants';

export const Footer = ({ onNavigate }: { onNavigate: (page: Page) => void }) => {
    const { isAuthenticated } = useAuth();
    const year = new Date().getFullYear();

    const company = [
        { title: 'Global Leaderboard', action: () => onNavigate(isAuthenticated ? 'global-leaderboard' : 'register') },
        { title: 'College Leaderboard', action: () => onNavigate(isAuthenticated ? 'college-leaderboard' : 'register') },
        { title: 'Portfolio', action: () => onNavigate(isAuthenticated ? 'portfolio' : 'register') },
        { title: 'Dashboard', action: () => onNavigate(isAuthenticated ? 'dashboard' : 'register') },
    ];

    const resources = [
        { title: 'How It Works', action: () => { const el = document.getElementById('how-it-works'); el?.scrollIntoView({ behavior: 'smooth' }); } },
        { title: 'Score Formula', action: () => onNavigate('score-formula') },
        { title: 'Level System', action: () => onNavigate('level-system') },
        { title: 'FAQ', action: () => onNavigate('faq') },
    ];

    const supported = [
        { title: 'LeetCode' },
        { title: 'Codeforces' },
        { title: 'CodeChef' },
        { title: 'GeeksforGeeks' },
    ];



    return (
        <footer className="relative bg-card/10 mt-20">
            <div className="bg-[radial-gradient(35%_80%_at_30%_0%,rgba(99,102,241,0.08),transparent)] dark:bg-[radial-gradient(35%_80%_at_30%_0%,rgba(255,255,255,0.05),transparent)] mx-auto max-w-7xl md:border-x border-border/50">
                <div className="bg-border/50 absolute inset-x-0 h-px w-full" />
                <div className="grid max-w-7xl grid-cols-6 gap-8 p-8 md:p-12 lg:p-16">
                    <div className="col-span-6 flex flex-col gap-6 md:col-span-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 overflow-hidden">
                                <img
                                    src="/logo.jpeg"
                                    alt="RankMySkills Logo"
                                    className="w-full h-full object-cover mix-blend-screen"
                                />
                            </div>
                            <span className="text-foreground font-semibold text-base tracking-tight">RankMySkills</span>
                        </div>
                        <p className="text-muted-foreground font-mono text-sm max-w-sm text-balance">
                            The unified platform for tracking your competitive programming journey.
                        </p>
                        <div className="mt-4 flex">
                            <div className="tooltip-container">
                                <div className="tooltip9"></div>
                                <a href="https://www.linkedin.com/in/neerajkumar1517/" target="_blank" rel="noreferrer" className="tooltip1"><FaLinkedin className="size-5" /></a>
                                <a href="https://github.com/Neerajkumar151" target="_blank" rel="noreferrer" className="tooltip2"><FaGithub className="size-5" /></a>
                                <a href="https://wa.me/918448275790" target="_blank" rel="noreferrer" className="tooltip3"><FaWhatsapp className="size-5" /></a>
                                <a href="https://x.com/neerajkumar1715" target="_blank" rel="noreferrer" className="tooltip4"><FaTwitter className="size-5" /></a>
                                <a href="https://www.instagram.com/neeraj_kumar151743/" target="_blank" rel="noreferrer" className="tooltip5"><FaInstagram className="size-5" /></a>
                                <a href="mailto:thakurneerajkumar17@gmail.com" target="_blank" rel="noreferrer" className="tooltip6"><FaRegEnvelope className="size-5" /></a>
                                <a href="https://leetcode.com/u/neerajkumar17/" target="_blank" rel="noreferrer" className="tooltip7"><SiLeetcode className="size-5" /></a>
                                <a href="https://www.geeksforgeeks.org/profile/thakurneeraj1517?tab=activity" target="_blank" rel="noreferrer" className="tooltip8"><SiGeeksforgeeks className="size-5" /></a>
                                <span className="text pointer-events-none">
                                    <Share2 className="size-6" />
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-6 min-[400px]:col-span-2 md:col-span-1 w-full">
                        <span className="text-muted-foreground mb-3 inline-block font-mono text-xs uppercase tracking-wider">Platform</span>
                        <div className="flex flex-col gap-2">
                            {company.map(({ action, title }, i) => (
                                <button
                                    key={i}
                                    className="w-max py-1 text-sm text-muted-foreground duration-200 hover:text-foreground hover:underline text-left"
                                    onClick={action}
                                >
                                    {title}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="col-span-3 min-[400px]:col-span-2 md:col-span-1 w-full">
                        <span className="text-muted-foreground mb-3 inline-block font-mono text-xs uppercase tracking-wider">Resources</span>
                        <div className="flex flex-col gap-2">
                            {resources.map(({ action, title }, i) => (
                                <button
                                    key={i}
                                    className="w-max py-1 text-sm text-muted-foreground duration-200 hover:text-foreground hover:underline text-left"
                                    onClick={action}
                                >
                                    {title}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="col-span-3 min-[400px]:col-span-2 md:col-span-1 w-full">
                        <span className="text-muted-foreground mb-3 inline-block font-mono text-xs uppercase tracking-wider">Supported</span>
                        <div className="flex flex-col gap-2">
                            {supported.map(({ title }, i) => (
                                <div key={i} className="flex items-center gap-2 py-1 text-sm text-muted-foreground">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                    {title}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="bg-border/50 absolute inset-x-0 h-px w-full" />
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 pb-8 px-8 md:px-12 lg:px-16 text-muted-foreground font-thin text-sm">
                    <p className="text-center sm:text-left">
                        © <span className="font-semibold">{year}</span> RankMySkills. All rights reserved.
                    </p>
                    <p className="text-xs flex items-center gap-1.5 focus:outline-none">
                        Made with <span className="text-red-500">❤️</span> for competitive programmers
                    </p>
                </div>
            </div>
        </footer>
    );
};
