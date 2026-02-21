import { Moon, Sun } from 'lucide-react';

interface HeaderProps {
  theme: 'light' | 'dark';
  language: 'en' | 'de';
  currentUserInitials: string;
  onThemeChange: () => void;
  onLanguageChange: (lang: 'en' | 'de') => void;
  onSearchChange: (value: string) => void;
  onLogout: () => void;
}

export function Header({ theme, language, currentUserInitials, onThemeChange, onLanguageChange, onSearchChange, onLogout }: HeaderProps) {
  return (
    <header className="h-16 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <input
          type="search"
          placeholder="Search deals, contacts, companies..."
          onChange={(event) => onSearchChange(event.target.value)}
          className="w-96 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button onClick={() => onLanguageChange('en')} className={`px-3 py-1.5 rounded-md text-sm ${language === 'en' ? 'bg-white dark:bg-gray-600' : ''}`}>EN</button>
          <button onClick={() => onLanguageChange('de')} className={`px-3 py-1.5 rounded-md text-sm ${language === 'de' ? 'bg-white dark:bg-gray-600' : ''}`}>DE</button>
        </div>
        <button onClick={onThemeChange} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">{theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}</button>
        <button onClick={onLogout} className="text-xs px-2 py-1 border rounded">Logout</button>
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">{currentUserInitials}</div>
      </div>
    </header>
  );
}
