import { Moon, Sun, Globe } from 'lucide-react';

interface HeaderProps {
  theme: 'light' | 'dark';
  language: 'en' | 'de';
  onThemeChange: () => void;
  onLanguageChange: (lang: 'en' | 'de') => void;
}

export function Header({ theme, language, onThemeChange, onLanguageChange }: HeaderProps) {
  return (
    <header className="h-16 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <input
          type="search"
          placeholder="Search..."
          className="w-96 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="flex items-center gap-3">
        {/* Language Toggle */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => onLanguageChange('en')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              language === 'en'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => onLanguageChange('de')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              language === 'de'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            DE
          </button>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={onThemeChange}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
          JD
        </div>
      </div>
    </header>
  );
}
