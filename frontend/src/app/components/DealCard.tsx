import { MoreVertical, DollarSign, Calendar, User } from 'lucide-react';

interface Deal {
  id: string;
  name: string;
  value: number;
  company: string;
  owner: string;
  closeDate: string;
}

interface DealCardProps {
  deal: Deal;
}

export function DealCard({ deal }: DealCardProps) {
  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4 mb-3 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-medium text-gray-900 dark:text-white">{deal.name}</h3>
        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <DollarSign className="w-4 h-4" />
          <span className="font-semibold text-gray-900 dark:text-white">
            ${deal.value.toLocaleString()}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Building2 className="w-4 h-4" />
          <span>{deal.company}</span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <User className="w-4 h-4" />
          <span>{deal.owner}</span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>{deal.closeDate}</span>
        </div>
      </div>
    </div>
  );
}

function Building2({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  );
}
