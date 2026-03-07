import { memo } from 'react';
import { useTheme } from '@/context/ThemeProvider';

export const ThemeToggle = memo(() => {
    const { theme, toggleTheme } = useTheme();
    // Assuming dark mode is when checked.
    const isDark = theme === 'dark';

    return (
        <label className="theme-switch" aria-label="Toggle theme">
            <input
                type="checkbox"
                checked={isDark}
                onChange={toggleTheme}
                className="sr-only"
            />
            <span className="slider"></span>
        </label>
    );
});
