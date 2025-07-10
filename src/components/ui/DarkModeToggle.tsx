import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Moon, Sun, Laptop } from 'lucide-react';

export const DarkModeToggle: React.FC = () => {
  const { isDarkMode, toggleDarkMode, theme, setTheme } = useTheme();

  return (
    <div className="relative">
      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        aria-pressed={isDarkMode}
        role="switch"
      >
        {isDarkMode ? (
          <Sun className="h-5 w-5 text-yellow-300" aria-hidden="true" />
        ) : (
          <Moon className="h-5 w-5 text-gray-700" aria-hidden="true" />
        )}
        <span className="sr-only">
          {isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        </span>
      </button>
      
      {/* Accessible dropdown for more theme options */}
      <button
        onClick={() => {
          const menu = document.getElementById('theme-menu');
          if (menu) {
            menu.classList.toggle('hidden');
          }
        }}
        className="ml-1 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        aria-label="More theme options"
        aria-expanded="false"
        aria-controls="theme-menu"
      >
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      
      <div 
        id="theme-menu" 
        className="hidden absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10"
        role="menu"
      >
        <div className="py-1" role="none">
          <button
            className={`w-full text-left px-4 py-2 text-sm ${theme === 'light' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-100' : 'text-gray-700 dark:text-gray-200'} hover:bg-gray-100 dark:hover:bg-gray-700`}
            onClick={() => setTheme('light')}
            role="menuitem"
            tabIndex={0}
          >
            <span className="flex items-center">
              <Sun className="w-4 h-4 mr-3 text-yellow-500" aria-hidden="true" />
              Light Mode
            </span>
          </button>
          <button
            className={`w-full text-left px-4 py-2 text-sm ${theme === 'dark' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-100' : 'text-gray-700 dark:text-gray-200'} hover:bg-gray-100 dark:hover:bg-gray-700`}
            onClick={() => setTheme('dark')}
            role="menuitem"
            tabIndex={0}
          >
            <span className="flex items-center">
              <Moon className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-300" aria-hidden="true" />
              Dark Mode
            </span>
          </button>
          <button
            className={`w-full text-left px-4 py-2 text-sm ${theme === 'auto' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-100' : 'text-gray-700 dark:text-gray-200'} hover:bg-gray-100 dark:hover:bg-gray-700`}
            onClick={() => setTheme('auto')}
            role="menuitem"
            tabIndex={0}
          >
            <span className="flex items-center">
              <Laptop className="w-4 h-4 mr-3 text-blue-500" aria-hidden="true" />
              System Preference
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
  );
};