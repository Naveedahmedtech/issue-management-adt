import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div
            onClick={toggleTheme}
            className="fixed bottom-6 right-6 z-50 bg-surface border border-border text-text-primary p-3 rounded-full shadow-lg hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all cursor-pointer"
            aria-label="Toggle Theme"
        >
            {theme === 'dark' ? (
                <FaSun className="w-5 h-5" />
            ) : (
                <FaMoon className="w-5 h-5" />
            )}
        </div>
    );
};

export default ThemeToggle;