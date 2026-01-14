import { useDrop } from "react-dnd";
import type { Stage, DealSummary } from "@/types/api";
import { DealCard } from "./DealCard";
import { motion } from "motion/react";

interface KanbanColumnProps {
  stage: Stage;
  deals: DealSummary[];
  onDealClick: (deal: DealSummary) => void;
  onDrop: (dealId: string, newStageId: string) => void;
}

export function KanbanColumn({
  stage,
  deals,
  onDealClick,
  onDrop,
}: KanbanColumnProps) {
  const [{ isOver }, drop] = useDrop({
    accept: "DEAL",
    drop: (item: { id: string; stage_id: string }) => {
      if (item.stage_id !== stage.id) {
        onDrop(item.id, stage.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const totalValue = deals.reduce((sum, deal) => sum + deal.value.amount, 0);

  return (
    <div className="flex-shrink-0 w-80">
      <div className="bg-gray-50 rounded-lg p-4 h-full flex flex-col">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-gray-900">{stage.name}</h3>
            <span className="text-sm text-gray-500">{deals.length}</span>
          </div>
          <div className="text-sm text-gray-600">
            ${totalValue.toLocaleString()}
          </div>
        </div>

        <motion.div
          ref={drop}
          className={`flex-1 space-y-3 min-h-[400px] rounded-lg transition-colors ${
            isOver ? "bg-blue-50 border-2 border-blue-300" : ""
          }`}
          layout
        >
          {deals.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-sm text-gray-400">
              Drop deals here
            </div>
          ) : (
            deals.map((deal) => (
              <DealCard
                key={deal.id}
                deal={deal}
                onClick={() => onDealClick(deal)}
              />
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
}
