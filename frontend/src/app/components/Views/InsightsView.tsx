import { mockDeals } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { DollarSign, Target, TrendingUp, Users } from "lucide-react";

export function InsightsView() {
  const totalValue = mockDeals.reduce((sum, deal) => sum + deal.value, 0);
  const closedDeals = mockDeals.filter((d) => d.stage === "closed");
  const closedValue = closedDeals.reduce((sum, deal) => sum + deal.value, 0);
  const conversionRate =
    mockDeals.length > 0
      ? ((closedDeals.length / mockDeals.length) * 100).toFixed(1)
      : 0;

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
      value: mockDeals.length.toString(),
      icon: Target,
      description: "Active opportunities",
      trend: "+3",
    },
    {
      title: "Closed Deals",
      value: `$${closedValue.toLocaleString()}`,
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
              {["lead", "qualified", "proposal", "negotiation", "closed"].map(
                (stage) => {
                  const stageDeals = mockDeals.filter((d) => d.stage === stage);
                  const percentage =
                    mockDeals.length > 0
                      ? (stageDeals.length / mockDeals.length) * 100
                      : 0;

                  return (
                    <div key={stage}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium capitalize">
                          {stage}
                        </span>
                        <span className="text-sm text-gray-600">
                          {stageDeals.length} deals
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
                }
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["John Doe", "Jane Smith", "Mike Brown"].map((owner, index) => {
                const ownerDeals = mockDeals.filter(
                  (d) => d.owner.name === owner
                );
                const ownerValue = ownerDeals.reduce(
                  (sum, deal) => sum + deal.value,
                  0
                );

                return (
                  <div
                    key={owner}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{owner}</p>
                        <p className="text-xs text-gray-500">
                          {ownerDeals.length} deals
                        </p>
                      </div>
                    </div>
                    <div className="text-sm font-semibold">
                      ${ownerValue.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
