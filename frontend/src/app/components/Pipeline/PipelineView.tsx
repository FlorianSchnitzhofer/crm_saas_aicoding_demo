import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Deal, DealStage, mockDeals } from "@/data/mockData";
import { KanbanColumn } from "./KanbanColumn";
import { DealDetailPanel } from "../DealDetail/DealDetailPanel";

const stages: DealStage[] = [
  "lead",
  "qualified",
  "proposal",
  "negotiation",
  "closed",
];

export function PipelineView() {
  const [deals, setDeals] = useState<Deal[]>(mockDeals);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  const handleDrop = (dealId: string, newStage: DealStage) => {
    setDeals((prevDeals) =>
      prevDeals.map((deal) =>
        deal.id === dealId ? { ...deal, stage: newStage } : deal
      )
    );
  };

  const getDealsByStage = (stage: DealStage) => {
    return deals.filter((deal) => deal.stage === stage);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-4">
          {stages.map((stage) => (
            <KanbanColumn
              key={stage}
              stage={stage}
              deals={getDealsByStage(stage)}
              onDealClick={setSelectedDeal}
              onDrop={handleDrop}
            />
          ))}
        </div>
      </div>

      <DealDetailPanel
        deal={selectedDeal}
        onClose={() => setSelectedDeal(null)}
      />
    </DndProvider>
  );
}
