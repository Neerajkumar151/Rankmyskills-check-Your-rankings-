import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/constants';


export const PlatformsSection = () => {
    const platforms = [
        {
            name: 'LeetCode',
            // Official LeetCode Orange/Yellow logo
            icon: () => <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAACgklEQVR4nGNgIBH4GEtyGWrJvFNTU/lvbyx5goGawMJChlNPQ/azurrafxDWVFP4TTPD1dRU/zubSi2miuEqKgzsepqyH2GGg7CtkdQ2ahr+CdlwL2uZvVQzXFcD1fCWNM3/L9db/3ux2vjw//3yHJQZrokaLI0pmv9fbbCB45drTV/dWmzGR475bLoaciiGp/orvXm5xmj/i9Um919tsEa25MXLVVo8JBou+wHZcDcL6UPICp6v0i97tR7JkjWmz/6v0mIjy3AvK5kj2BQ+X2WY+3K91T+4Jav1Gwiarq8p+xrZcD9bmeP41L9Yo5/2cp3Vv5frLf8+X21sjtdwRxOJJciGBzjInCboIgYGhrurjPn/L9LjJqhQQ1X+F8xwd0vZ2wxUBmyqqirQIkD5/8w0Bi5kyS0bNjhu3rjh/eaNG/4Tgf9s3rBhDorpHBwcsiIiwv9BWE9N5A+67cuWLN60ZNHC/8TjBb/QzWAU5uf4z87O9p+fl/1/ko+QG4oFyxaZL5o/787C+fMeE4MXL144GSOMLDS5P4AsAGFLTe5fnUnCUhQGOypwNeGLEOBjB1sAwra6PD/rQ7kkCOm7OUu28eZs+WqiLHEy5FvIzYViyY/KCG5xXOrvzpY7/HyJ/H8QvjNTNp0oSxz1eZYjW2Kjy/0jN5RHFF3dvblyJ2GGg/CN2bLhRFkA9okBz0pkS+z0eH6c6pbRAcndmCkpcm+ezFVkw2/Pkp3LQCpw1udejWzJ2Ymy/x4vlPvxdLHcP2TDb82WXUSy4TDgasy7UlqU43+wDd//Z4sRhoLwM0oNh4Ebs6Sd7s6Tu/F4gdwfkCWPF8n9vT9P9uH12TJRxBgAABE1rBTkH+ppAAAAAElFTkSuQmCC" alt="Leetcode Logo" className="w-6 h-6 object-contain" />,
            description: 'Track contest ratings, problems solved, and acceptance rate from the world\'s largest coding interview platform.',
            stats: '3,500+ Problems',
            color: 'from-amber-400 to-orange-500',
            bg: 'bg-amber-500/[0.06] dark:bg-amber-500/[0.10]',
            border: 'border-amber-500/10',
        },
        {
            name: 'Codeforces',
            icon: () => <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAw0lEQVR4nO2VQQqDMBBFXZlrKHgFh+6KyZWEXqDpDcx11GuIhyhOFrqaEkttY7NpmYWLfHjwCcM8skmSJIYjmcFb1kxLbpAcrmcNaj5B816+Scw0swny3fIXxxBQKwrq05q69LLieisKPkGfjtQL2jEwCgSFOJzgfj4VtoLayvKyUkHtztgEVsFoFZCHLAdOAYWIgi1RQP8LOrEEBPOvzzVKWPbLUcLsbqA9ybNffQHqrw/HoDeDqtSfEtdRgTcTk4TyANaBm3IkpesMAAAAAElFTkSuQmCC" alt="Codeforces Logo" className="w-6 h-6 object-contain" />,
            description: 'Sync your competitive programming rating, max rating, and contest history from Codeforces.',
            stats: 'Live Ratings',
            color: 'from-blue-400 to-cyan-500',
            bg: 'bg-blue-500/[0.06] dark:bg-blue-500/[0.10]',
            border: 'border-blue-500/10',
        },
        {
            name: 'CodeChef',
            // Codechef official Brown chef cap logo approximation
            icon: () => <img src="https://cdn.brandfetch.io/idM2-b7Taf/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1767029469434" alt="CodeChef Logo" className="w-8 h-8 object-contain mix-blend-darken dark:mix-blend-screen dark:invert" />,
            description: 'Import your CodeChef rating, stars, and division from monthly coding contests.',
            stats: 'Monthly Contests',
            color: 'from-orange-400 to-red-500',
            bg: 'bg-orange-500/[0.06] dark:bg-orange-500/[0.10]',
            border: 'border-orange-500/10',
        },
        {
            name: 'GeeksforGeeks',
            // Official GFG Green Logo
            icon: () => <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAD10lEQVR4nO1YTYgdRRDuaMSAiIKKQUUP4kUETVY9KDqZ6pmqdhVvuYgK/h38uyshPjwtnkIUhcW3U/U2/qCiB6MoKgYUQRFU8BD/iKDJxd8kmyUuxF2pyZvdntk3Oz1ZwSfMBwPvUdVV39fTXV09xnTo0KFDhw4dOvw7sEJL+sSS3gzPw4VW6HFgfBeE9lvGn0HoMAj+AkJfWqYMJL0l2hdtPNV8E9MTZ8SZm9RYVuirYezDw1z7NXfC+JhyUU4Fv0YBVvAoCP618n+tB7+xjK4teSUOjN+G5DjJBY+2EOA9THMgNBULTqSz6VnJdHIOCF5vmZ4BxgXPd1ev1zutifj2V7efrmOXyTEugNDTNnPXaew8xyC51go+BUzHRnEKFgCMXySD5NLaWRScAKFD3tt42SyZDXX+KhAYX1mZHDwIGW2tjd+fvEyX1ikJyF/vwJ5X61yMGbgtIDjvjdtR5wuMT3jLYj7l9Jqm+NGLt51vmb5vJ4BpcRunNzYF98Y96Qk4MWpWdVmA4N+egF5o/HwDMy0GC9Ddb1rghv7tZ5fXK75d9QGhd/x9pWvdtIAVei9YQJLhHW2C52MZXyotwRl3ZWFLZ9OrylWFXmgbP2a6K1hAtMdd0jYBCN3vk9T6vWxj3OHbYsF72se/9eJGAeuBVqRK7f6gsFmmD0uVZOC2mHEDnDy5vfMDf1i2MR3wbW7GXWDGDRFHm8plmI4VNr/M5gJ2uzPNuCHaF22sHv+FrXJiL62nf1qFsH5nfB/zvxdQlCgQfKtq1L5FN6cJwLBv8Wv9d4VNf/u2tforHxFPbrZMr40g/qZyLjkn/eSiCvkT2h2aQFjBuytJdhU2ENxdFufuDI0bcXSucintIZ7cPJoE09yyI+MfoUlykozvr4ylRb/WxzN4td/LaFvRJrYV+tOb2CNrOOKPnoBfg8lntLXUqDHtXeXjLVH1VVEmNL7Q717sA/WOTJ97jr+FXgst06fe7M/F4i6v+iVZckXlPPhEx4bk0NXgxf+s3lGwP6qOr3lBEZoprf0M763zTxgfKO8T7Ifc4vxzBISm6x0F49Jmy+imOl9t+LRtLhFi2tlIRrBXLha0d1VF8UUPXFSuYC5qSEBT3oDjOkvA7r5kQKSXd51hy7incgtbAKaHm8h7Ih4pzyrOW8HZYWynuTTn8O0e92Z/qjn6ktlgB+4h3e1hhwl+pJ2oaYn8hsb4cUgO/dSSCD7YKoF2jJbxUcv4hn4HAqGfdKZUGDB9DYzPWqZtZp0AwRiYnhvGPJLnyHNpTnxd39ZYdq8dOnTo0KFDhw7mv8c/hXdKvMBwaFwAAAAASUVORK5CYII=" alt="GeeksforGeeks Logo" className="w-8 h-8 object-contain" />,
            description: 'Pull your coding score, problems solved, and institution rank from GFG Practice.',
            stats: 'Coding Score',
            color: 'from-green-400 to-emerald-500',
            bg: 'bg-green-500/[0.06] dark:bg-green-500/[0.10]',
            border: 'border-green-500/10',
        },
    ];

    return (
        <section className="py-28 md:py-36 px-6 relative">
            <div className="max-w-7xl mx-auto">
                <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                    <p className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-4">Integrations</p>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-5 tracking-[-0.02em]">All your platforms.<br />One dashboard.</h2>
                    <p className="text-muted-foreground text-lg text-balance max-w-lg mx-auto">
                        We support the 4 biggest competitive programming platforms. More coming soon.
                    </p>
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                >
                    {platforms.map((platform, i) => (
                        <motion.div
                            key={i}
                            variants={fadeInUp}
                            className={`relative ${platform.bg} rounded-2xl p-7 border ${platform.border} hover:shadow-lg transition-all duration-300 group`}
                            whileHover={{ y: -4, transition: { duration: 0.25 } }}
                        >
                            {/* Platform exact colored logo */}
                            <div className="mb-6 flex items-center group-hover:scale-110 transition-transform duration-300">
                                <platform.icon />
                            </div>

                            <h3 className="text-lg font-bold text-foreground mb-2 tracking-tight">{platform.name}</h3>
                            <p className="text-muted-foreground text-[13px] leading-relaxed mb-4">{platform.description}</p>

                            {/* Stat badge */}
                            <span className="inline-block px-3 py-1 rounded-full bg-background/80 dark:bg-background/50 text-[11px] font-semibold text-foreground border border-border/40">
                                {platform.stats}
                            </span>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};
