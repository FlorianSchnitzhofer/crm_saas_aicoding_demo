import { useState, useEffect } from "react";
import type { Deal, DealPriority, DealStatus } from "@/types/api";
import { apiClient } from "@/services/api";
import { Badge } from "@/app/components/ui/badge";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { DollarSign, Calendar, Building2 } from "lucide-react";
import { DealDetailPanel } from "../DealDetail/DealDetailPanel";
import { LoadingState } from "../Common/LoadingState";
import { Alert, AlertDescription } from "@/app/components/ui/alert";

const priorityConfig: Record<DealPriority, { label: string; color: string }> = {
  low: { label: "Low", color: "text-gray-600" },
  medium: { label: "Medium", color: "text-yellow-600" },
  high: { label: "High", color: "text-red-600" },
  urgent: { label: "Urgent", color: "text-red-700" },
};

const statusConfig: Record<DealStatus, { label: string; color: string }> = {
  open: { label: "Open", color: "bg-blue-100 text-blue-700" },
  won: { label: "Won", color: "bg-green-100 text-green-700" },
  lost: { label: "Lost", color: "bg-gray-100 text-gray-700" },
};

export function DealsView() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.getDeals();
      setDeals(response.data);
    } catch (err) {
      console.error("Failed to load deals:", err);
      setError(err instanceof Error ? err.message : "Failed to load deals");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDealClick = async (deal: Deal) => {
    setSelectedDeal(deal);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <div className="p-6">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deal
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organization
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {deals.map((deal) => (
                <tr
                  key={deal.id}
                  onClick={() => handleDealClick(deal)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="font-medium text-gray-900">
                        {deal.title}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-gray-900 font-semibold">
                      <DollarSign className="w-4 h-4" />
                      {deal.value.amount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Building2 className="w-4 h-4" />
                      {deal.organization_id || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={statusConfig[deal.status].color}>
                      {statusConfig[deal.status].label}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    {deal.priority && (
                      <Badge
                        variant="secondary"
                        className={priorityConfig[deal.priority].color}
                      >
                        {priorityConfig[deal.priority].label}
                      </Badge>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                          {deal.owner_id.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-600">
                        {deal.owner_id}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {new Date(deal.created_at).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {deals.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No deals found
            </div>
          )}
        </div>
      </div>

      <DealDetailPanel
        deal={selectedDeal}
        onClose={() => setSelectedDeal(null)}
        onUpdate={loadDeals}
      />
    </>
  );
}
