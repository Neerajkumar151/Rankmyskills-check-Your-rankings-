import { memo } from 'react';

export const RankMedal = memo(({ rank }: { rank: number }) => {
    if (rank === 1) return <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center text-yellow-900 font-bold text-sm shadow-lg">🥇</div>;
    if (rank === 2) return <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-gray-800 font-bold text-sm shadow-lg">🥈</div>;
    if (rank === 3) return <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">🥉</div>;
    return <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground font-medium text-sm">#{rank}</div>;
});
