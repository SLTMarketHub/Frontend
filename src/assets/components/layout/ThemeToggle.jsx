import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../layout/Button';
import { cn } from '../../utils/utils';

export const ThemeToggle = ({ className }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={cn(
        'relative h-10 w-10 rounded-full transition-colors hover:bg-gray-200 dark:hover:bg-gray-700',
        className
      )}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <Sun
        className={cn(
          'h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0',
          isDark ? 'text-gray-400' : 'text-yellow-500'
        )}
      />
      <Moon
        className={cn(
          'absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100',
          isDark ? 'text-blue-300' : 'text-gray-600'
        )}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;