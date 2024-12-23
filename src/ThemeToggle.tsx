import { useTheme } from './context/ThemeContext';

const ThemeToggleButton = () => {
    const { toggleTheme } = useTheme();

    return (
        <button onClick={toggleTheme} className="p-2 bg-background rounded text-text">
            Toggle Theme
        </button>
    );
};


export default ThemeToggleButton;
