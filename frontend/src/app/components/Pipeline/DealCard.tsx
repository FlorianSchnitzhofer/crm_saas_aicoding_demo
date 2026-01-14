import { useDrag } from "react-dnd";
import { DollarSign, Calendar, ArrowUpRight } from "lucide-react";
import { Deal, priorityConfig } from "@/data/mockData";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";
import { motion } from "motion/react";

interface DealCardProps {
  deal: Deal;
  onClick: () => void;
}

export function DealCard({ deal, onClick }: DealCardProps) {
  const [{ isDragging }, drag] = useDrag({
    type: "DEAL",
    item: { id: deal.id, stage: deal.stage },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <motion.div
      ref={drag}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-medium text-gray-900 text-sm flex-1 pr-2">
          {deal.title}
        </h3>
        <ArrowUpRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
      </div>

      <div className="flex items-center gap-2 mb-3">
        <DollarSign className="w-4 h-4 text-gray-500" />
        <span className="font-semibold text-gray-900">
          ${deal.value.toLocaleString()}
        </span>
      </div>

      <div className="text-sm text-gray-600 mb-3">{deal.company}</div>

      <div className="flex items-center justify-between">
        <Avatar className="w-6 h-6">
          <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
            {deal.owner.avatar}
          </AvatarFallback>
        </Avatar>

        <Badge
          variant="secondary"
          className={priorityConfig[deal.priority].color}
        >
          {priorityConfig[deal.priority].label}
        </Badge>
      </div>

      {deal.nextActivity && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Calendar className="w-3 h-3" />
            <span>{deal.nextActivity.title}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
