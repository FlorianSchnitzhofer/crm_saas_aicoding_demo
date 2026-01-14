import { useDrag } from "react-dnd";
import { DollarSign, Calendar, ArrowUpRight } from "lucide-react";
import type { DealSummary, DealPriority } from "@/types/api";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";
import { motion } from "motion/react";

interface DealCardProps {
  deal: DealSummary;
  onClick: () => void;
}

const priorityConfig: Record<DealPriority, { label: string; color: string }> = {
  low: { label: "Low", color: "text-gray-600" },
  medium: { label: "Medium", color: "text-yellow-600" },
  high: { label: "High", color: "text-red-600" },
  urgent: { label: "Urgent", color: "text-red-700 font-bold" },
};

export function DealCard({ deal, onClick }: DealCardProps) {
  const [{ isDragging }, drag] = useDrag({
    type: "DEAL",
    item: { id: deal.id, stage_id: deal.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Generate initials for owner (you might want to fetch user data)
  const getOwnerInitials = (ownerId: string) => {
    return ownerId.substring(0, 2).toUpperCase();
  };

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
          {deal.value.currency} {deal.value.amount.toLocaleString()}
        </span>
      </div>

      {deal.organization_id && (
        <div className="text-sm text-gray-600 mb-3">{deal.organization_id}</div>
      )}

      <div className="flex items-center justify-between">
        <Avatar className="w-6 h-6">
          <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
            {getOwnerInitials(deal.owner_id)}
          </AvatarFallback>
        </Avatar>

        {deal.priority && (
          <Badge
            variant="secondary"
            className={priorityConfig[deal.priority].color}
          >
            {priorityConfig[deal.priority].label}
          </Badge>
        )}
      </div>

      {deal.next_activity && deal.next_activity.due_at && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Calendar className="w-3 h-3" />
            <span>
              {deal.next_activity.type || "Activity"} -{" "}
              {new Date(deal.next_activity.due_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      )}

      {deal.labels && deal.labels.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {deal.labels.slice(0, 2).map((label) => (
            <Badge key={label} variant="outline" className="text-xs">
              {label}
            </Badge>
          ))}
          {deal.labels.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{deal.labels.length - 2}
            </Badge>
          )}
        </div>
      )}
    </motion.div>
  );
}
