import { memo } from 'react';
import { Badge } from '@/components/ui/badge';

export const LevelBadge = memo(({ level }: { level: string }) => {
    const colors: Record<string, string> = {
        'Beginner': 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-500/20 dark:text-gray-400 dark:border-gray-500/30',
        'Learner': 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30',
        'Intermediate': 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/30',
        'Strong': 'bg-green-50 text-green-600 border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30',
        'Advanced': 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-500/30',
        'Expert': 'bg-pink-50 text-pink-600 border-pink-200 dark:bg-pink-500/20 dark:text-pink-400 dark:border-pink-500/30',
        'Elite': 'bg-yellow-50 text-yellow-600 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30',
        'God': 'bg-red-50 text-red-600 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30',
    };
    return <Badge variant="outline" className={`${colors[level] || colors['Beginner']} text-xs font-medium`}>{level}</Badge>;
});
