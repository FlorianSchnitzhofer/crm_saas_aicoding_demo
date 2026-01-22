import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Building2, 
  Activity, 
  BarChart3, 
  Settings 
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const { t } = useTranslation();

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t('dashboard') },
    { id: 'deals', icon: Briefcase, label: t('deals') },
    { id: 'contacts', icon: Users, label: t('contacts') },
    { id: 'companies', icon: Building2, label: t('companies') },
    { id: 'activities', icon: Activity, label: t('activities') },
    { id: 'reports', icon: BarChart3, label: t('reports') },
    { id: 'settings', icon: Settings, label: t('settings') },
  ];

  return (
    <div className="w-64 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">CRM System</h1>
      </div>
      
      <nav className="flex-1 px-3">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg mb-1 transition-colors ${
              activeView === item.id
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
