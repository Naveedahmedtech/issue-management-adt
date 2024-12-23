import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="flex items-center justify-center space-x-2">
            <span className={`font-semibold ${theme === 'dark' ? 'text-text' : 'text-gray-700'}`}>
                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </span>
            <button
                onClick={toggleTheme}
                className={`relative w-16 h-6 rounded-full border transition-all duration-500 ease-in-out focus:outline-none ${theme === 'dark' ? 'bg-background border-primary' : 'bg-background border-border'
                    }`}
                aria-label="Toggle theme"
            >
                {/* Sliding button */}
                <div
                    className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full transition-transform duration-500 ease-in-out transform ${theme === 'dark'
                            ? 'translate-x-10  bg-hover shadow-md'
                            : 'translate-x-2 bg-background shadow-sm'
                        }`}
                ></div>
            </button>
        </div>
    );
};

export default ThemeToggle;
