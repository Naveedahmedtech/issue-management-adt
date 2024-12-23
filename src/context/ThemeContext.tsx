import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getSystemTheme = (): Theme => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    // const [theme, setTheme] = useState<Theme>(window.localStorage.getItem('theme') as Theme || getSystemTheme());
    // const [theme, setTheme] = useState<Theme>(window.localStorage.getItem('theme') as Theme || 'dark'); // Default to 'dark'
    const [theme, setTheme] = useState<Theme>(window.localStorage.getItem('theme') as Theme || getSystemTheme() || 'dark');



    useEffect(() => {
        const localTheme = window.localStorage.getItem('theme') as Theme | null;
        setTheme(localTheme || getSystemTheme());

        const themeChangeHandler = (e: MediaQueryListEvent) => {
            const newTheme = e.matches ? 'dark' : 'light';
            setTheme(newTheme);
            window.localStorage.setItem('theme', newTheme);
        };

        const mediaQueryList = window.matchMedia('(prefers-color-scheme: light)');
        mediaQueryList.addEventListener('change', themeChangeHandler);

        return () => mediaQueryList.removeEventListener('change', themeChangeHandler);
    }, []);

    const toggleTheme = useCallback(() => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        window.localStorage.setItem('theme', newTheme);
    }, [theme]);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
