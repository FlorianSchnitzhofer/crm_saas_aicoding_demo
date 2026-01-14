import { useState, useEffect } from "react";
import type { Deal } from "@/types/api";
import { apiClient } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { DollarSign, Target, TrendingUp, Users } from "lucide-react";
import { LoadingState } from "../Common/LoadingState";
import { Alert, AlertDescription } from "@/app/components/ui/alert";

export function InsightsView() {
  const [deals, setDeals] = useState<Deal[]>([]);
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
      setError(err instanceof Error ? err.message : "Failed to load insights");
    } finally {
      setIsLoading(false);
    }
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

  const totalValue = deals.reduce((sum, deal) => sum + deal.value.amount, 0);
  const wonDeals = deals.filter((d) => d.status === "won");
  const wonValue = wonDeals.reduce((sum, deal) => sum + deal.value.amount, 0);
  const conversionRate =
    deals.length > 0
      ? ((wonDeals.length / deals.length) * 100).toFixed(1)
      : "0";

  const stats = [
    {
      title: "Total Pipeline Value",
      value: `$${totalValue.toLocaleString()}`,
      icon: DollarSign,
      description: "Across all stages",
      trend: "+12.5%",
    },
    {
      title: "Deals in Pipeline",
      value: deals.length.toString(),
      icon: Target,
      description: "Active opportunities",
      trend: "+3",
    },
    {
      title: "Closed Deals",
      value: `$${wonValue.toLocaleString()}`,
      icon: TrendingUp,
      description: "This month",
      trend: "+8.2%",
    },
    {
      title: "Conversion Rate",
      value: `${conversionRate}%`,
      icon: Users,
      description: "Lead to close",
      trend: "+2.1%",
    },
  ];

  // Group deals by stage for distribution
  const dealsByStage = deals.reduce((acc, deal) => {
    acc[deal.stage_id] = (acc[deal.stage_id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Group deals by owner for top performers
  const dealsByOwner = deals.reduce((acc, deal) => {
    if (!acc[deal.owner_id]) {
      acc[deal.owner_id] = { count: 0, value: 0 };
    }
    acc[deal.owner_id].count++;
    acc[deal.owner_id].value += deal.value.amount;
    return acc;
  }, {} as Record<string, { count: number; value: number }>);

  const topOwners = Object.entries(dealsByOwner)
    .sort(([, a], [, b]) => b.value - a.value)
    .slice(0, 3);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <Icon className="w-4 h-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500">{stat.description}</p>
                  <span className="text-xs font-medium text-green-600">
                    {stat.trend}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Deals by Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(dealsByStage).map(([stageId, count]) => {
                const percentage =
                  deals.length > 0 ? (count / deals.length) * 100 : 0;

                return (
                  <div key={stageId}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium capitalize">
                        {stageId}
                      </span>
                      <span className="text-sm text-gray-600">
                        {count} deals
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topOwners.map(([ownerId, data], index) => (
                <div
                  key={ownerId}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{ownerId}</p>
                      <p className="text-xs text-gray-500">
                        {data.count} deals
                      </p>
                    </div>
                  </div>
                  <div className="text-sm font-semibold">
                    ${data.value.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
