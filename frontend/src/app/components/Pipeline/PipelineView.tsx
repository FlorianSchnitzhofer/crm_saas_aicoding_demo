import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import type { Deal, DealSummary, PipelineKanban } from "@/types/api";
import { apiClient } from "@/services/api";
import { KanbanColumn } from "./KanbanColumn";
import { DealDetailPanel } from "../DealDetail/DealDetailPanel";
import { LoadingState } from "../Common/LoadingState";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function PipelineView() {
  const [kanbanData, setKanbanData] = useState<PipelineKanban | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPipeline();
  }, []);

  const loadPipeline = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get default pipeline (you might want to make this configurable)
      const pipelinesResponse = await apiClient.getPipelines();
      const defaultPipeline = pipelinesResponse.data.find((p) => p.is_default) || pipelinesResponse.data[0];

      if (!defaultPipeline) {
        setError("No pipeline found");
        return;
      }

      const kanban = await apiClient.getPipelineKanban(defaultPipeline.id);
      setKanbanData(kanban);
    } catch (err) {
      console.error("Failed to load pipeline:", err);
      setError(err instanceof Error ? err.message : "Failed to load pipeline");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = async (dealId: string, newStageId: string) => {
    if (!kanbanData) return;

    try {
      // Optimistically update UI
      const updatedStages = kanbanData.stages.map((stage) => ({
        ...stage,
        deals: stage.deals.filter((d) => d.id !== dealId),
      }));

      const movedDeal = kanbanData.stages
        .flatMap((s) => s.deals)
        .find((d) => d.id === dealId);

      if (movedDeal) {
        const targetStageIndex = updatedStages.findIndex(
          (s) => s.stage.id === newStageId
        );
        if (targetStageIndex !== -1) {
          updatedStages[targetStageIndex].deals.push(movedDeal);
        }

        setKanbanData({
          ...kanbanData,
          stages: updatedStages,
        });

        // Make API call
        await apiClient.moveDeal(dealId, { to_stage_id: newStageId });
      }
    } catch (err) {
      console.error("Failed to move deal:", err);
      // Revert on error
      loadPipeline();
    }
  };

  const handleDealClick = async (dealSummary: DealSummary) => {
    try {
      const { deal } = await apiClient.getDeal(dealSummary.id);
      setSelectedDeal(deal);
    } catch (err) {
      console.error("Failed to load deal:", err);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!kanbanData) {
    return (
      <div className="p-6">
        <Alert>
          <AlertDescription>No pipeline data available</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-4">
          {kanbanData.stages.map((stageData) => (
            <KanbanColumn
              key={stageData.stage.id}
              stage={stageData.stage}
              deals={stageData.deals}
              onDealClick={handleDealClick}
              onDrop={handleDrop}
            />
          ))}
        </div>
      </div>

      <DealDetailPanel
        deal={selectedDeal}
        onClose={() => setSelectedDeal(null)}
        onUpdate={loadPipeline}
      />
    </DndProvider>
  );
}
