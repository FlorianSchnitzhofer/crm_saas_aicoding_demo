import { useTranslation } from 'react-i18next';
import { TrendingUp, DollarSign, Briefcase, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const monthlyData = [
  { month: 'Jan', value: 45000 },
  { month: 'Feb', value: 52000 },
  { month: 'Mar', value: 48000 },
  { month: 'Apr', value: 61000 },
  { month: 'May', value: 55000 },
  { month: 'Jun', value: 67000 },
];

const stageData = [
  { stage: 'Qualified', count: 12 },
  { stage: 'Contact', count: 8 },
  { stage: 'Demo', count: 15 },
  { stage: 'Proposal', count: 6 },
  { stage: 'Negotiation', count: 4 },
  { stage: 'Won', count: 9 },
];

export function DashboardView() {
  const { t } = useTranslation();

  const stats = [
    {
      label: t('totalValue'),
      value: '$328,000',
      change: '+12.5%',
      icon: DollarSign,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      label: t('totalDeals'),
      value: '54',
      change: '+8.2%',
      icon: Briefcase,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      label: t('winRate'),
      value: '67%',
      change: '+5.1%',
      icon: Target,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      label: t('avgDealSize'),
      value: '$6,074',
      change: '+3.8%',
      icon: TrendingUp,
      color: 'text-orange-600 dark:text-orange-400',
      bg: 'bg-orange-50 dark:bg-orange-900/20',
    },
  ];

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('dashboard')}</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className="text-green-600 dark:text-green-400 text-sm font-medium">
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {stat.value}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Monthly Revenue
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#F9FAFB',
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: '#3B82F6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Deals by Stage Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Deals by Stage
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="stage" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#F9FAFB',
                }}
              />
              <Bar dataKey="count" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Activities
        </h3>
        <div className="space-y-4">
          {[
            { action: 'Deal won', detail: 'Acme Corp - $25,000', time: '2 hours ago' },
            { action: 'New contact added', detail: 'John Smith - Tech Solutions', time: '4 hours ago' },
            { action: 'Demo scheduled', detail: 'Global Inc - Tomorrow at 2 PM', time: '6 hours ago' },
            { action: 'Proposal sent', detail: 'StartUp Ltd - $15,000', time: '1 day ago' },
          ].map((activity, index) => (
            <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0">
              <div className="w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">{activity.action}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{activity.detail}</p>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
