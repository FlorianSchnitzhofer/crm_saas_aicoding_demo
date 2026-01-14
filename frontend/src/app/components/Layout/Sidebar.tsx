import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Target,
  Users,
  CheckSquare,
  BarChart3,
  Settings,
} from "lucide-react";
import { cn } from "@/app/components/ui/utils";

const navItems = [
  { path: "/", label: "Pipeline", icon: LayoutDashboard },
  { path: "/deals", label: "Deals", icon: Target },
  { path: "/contacts", label: "Contacts", icon: Users },
  { path: "/activities", label: "Activities", icon: CheckSquare },
  { path: "/insights", label: "Insights", icon: BarChart3 },
  { path: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 border-r border-gray-200 bg-white h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-900">CRM</h1>
        <p className="text-sm text-gray-500 mt-1">Sales Management</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              John Doe
            </p>
            <p className="text-xs text-gray-500 truncate">Sales Manager</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
