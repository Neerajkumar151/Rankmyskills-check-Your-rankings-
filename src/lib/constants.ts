// Types
export type Page = 'landing' | 'login' | 'register' | 'forgot-password' | 'dashboard' | 'portfolio' | 'global-leaderboard' | 'college-leaderboard' | 'edit-profile' | 'score-formula' | 'level-system' | 'faq' | 'how-it-works';
export type DashboardPage = 'home' | 'portfolio' | 'global-leaderboard' | 'college-leaderboard' | 'edit-profile';

export const levelClassification = [
    { name: 'Beginner', range: '0 - 3,000', color: 'bg-gray-400', textColor: 'text-gray-500', badge: '/beginner.png' },
    { name: 'Learner', range: '3,000 - 12,000', color: 'bg-blue-500', textColor: 'text-blue-500', badge: '/learner.png' },
    { name: 'Intermediate', range: '12,000 - 20,000', color: 'bg-orange-500', textColor: 'text-orange-500', badge: '/intermediate.png' },
    { name: 'Strong', range: '20,000 - 30,000', color: 'bg-green-500', textColor: 'text-green-500', badge: '/strong.png' },
    { name: 'Advanced', range: '30,000 - 60,000', color: 'bg-purple-500', textColor: 'text-purple-500', badge: '/advanced.png' },
    { name: 'Expert', range: '60,000 - 90,000', color: 'bg-pink-500', textColor: 'text-pink-500', badge: '/expert.png' },
    { name: 'Elite', range: '90,000 - 1,20,000', color: 'bg-yellow-500', textColor: 'text-yellow-500', badge: '/elite.png' },
    { name: 'God', range: '1,20,000+', color: 'bg-red-600', textColor: 'text-red-600', badge: '/god.png' },
];

export const colleges = [
    'GL BAJAJ INSTITUTE OF TECHNOLOGY AND MANAGEMENT, GREATER NOIDA',
    'GL BAJAJ INSTITUTE OF MANAGEMENT, GREATER NOIDA',
    'ITS ENGINEERING COLLEGE',
    'JIIT NOIDA',
    'NIET, Gr. Noida',
];

export const courses = ['BTECH', 'BCA', 'BE', 'MTECH', 'MCA', 'ME'];
export const graduationYears = ['2026', '2027', '2028', '2029', '2030'];

export function getLevel(score: number): string {
    if (score >= 120000) return 'God';
    if (score >= 90000) return 'Elite';
    if (score >= 60000) return 'Expert';
    if (score >= 30000) return 'Advanced';
    if (score >= 20000) return 'Strong';
    if (score >= 12000) return 'Intermediate';
    if (score >= 3000) return 'Learner';
    return 'Beginner';
}

// Animation variants
export const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
};

export const staggerContainer = {
    animate: { transition: { staggerChildren: 0.08 } }
};
