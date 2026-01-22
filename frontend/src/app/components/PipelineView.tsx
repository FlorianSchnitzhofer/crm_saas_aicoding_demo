import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { DealCard } from './DealCard';
import { useState } from 'react';
import { DealDialog } from './DealDialog';

interface Deal {
  id: string;
  name: string;
  value: number;
  company: string;
  owner: string;
  closeDate: string;
  stage: string;
  probability: number;
  description: string;
}

interface PipelineViewProps {
  deals: Deal[];
  onAddDeal: (deal: Omit<Deal, 'id'>) => void;
  onEditDeal: (deal: Deal) => void;
}

export function PipelineView({ deals, onAddDeal, onEditDeal }: PipelineViewProps) {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [selectedStage, setSelectedStage] = useState<string>('qualified');

  const stages = [
    { id: 'qualified', label: t('qualified') },
    { id: 'contact', label: t('contact') },
    { id: 'demo', label: t('demo') },
    { id: 'proposal', label: t('proposal') },
    { id: 'negotiation', label: t('negotiation') },
    { id: 'won', label: t('won') },
  ];

  const getDealsByStage = (stageId: string) => {
    return deals.filter((deal) => deal.stage === stageId);
  };

  const getStageTotal = (stageId: string) => {
    return getDealsByStage(stageId).reduce((sum, deal) => sum + deal.value, 0);
  };

  const handleAddDeal = (stageId?: string) => {
    setSelectedDeal(null);
    setSelectedStage(stageId || 'qualified');
    setIsDialogOpen(true);
  };

  const handleSave = (deal: any) => {
    if ('id' in deal && deal.id) {
      onEditDeal(deal as Deal);
    } else {
      const newDeal = {
        ...deal,
        stage: selectedStage,
      };
      onAddDeal(newDeal);
    }
  };

  return (
    <div className="flex-1 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('deals')}</h2>
        <button
          onClick={() => handleAddDeal()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {t('addDeal')}
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const stageDeals = getDealsByStage(stage.id);
          const total = getStageTotal(stage.id);

          return (
            <div key={stage.id} className="flex-shrink-0 w-80">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {stage.label}
                  </h3>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {stageDeals.length}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  ${total.toLocaleString()}
                </p>
              </div>

              <div className="space-y-3 min-h-[200px]">
                {stageDeals.length > 0 ? (
                  stageDeals.map((deal) => <DealCard key={deal.id} deal={deal} />)
                ) : (
                  <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">
                    {t('noDeals')}
                  </div>
                )}
              </div>

              <button
                onClick={() => handleAddDeal(stage.id)}
                className="w-full mt-3 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                {t('addDeal')}
              </button>
            </div>
          );
        })}
      </div>

      <DealDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
        deal={selectedDeal}
      />
    </div>
  );
}