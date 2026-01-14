import { useState, useEffect } from "react";
import type { Activity } from "@/types/api";
import { apiClient } from "@/services/api";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Calendar, Clock } from "lucide-react";
import { LoadingState } from "../Common/LoadingState";
import { Alert, AlertDescription } from "@/app/components/ui/alert";

export function ActivitiesView() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.getActivities();
      setActivities(response.data);
    } catch (err) {
      console.error("Failed to load activities:", err);
      setError(err instanceof Error ? err.message : "Failed to load activities");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleComplete = async (activity: Activity) => {
    try {
      const newStatus = activity.status === "completed" ? "planned" : "completed";
      await apiClient.updateActivity(activity.id, { status: newStatus });
      loadActivities();
    } catch (err) {
      console.error("Failed to update activity:", err);
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

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg border border-gray-200 divide-y">
        {activities.map((activity) => (
          <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start gap-4">
              <Checkbox
                checked={activity.status === "completed"}
                onCheckedChange={() => handleToggleComplete(activity)}
                className="mt-1"
              />

              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      {activity.subject}
                    </h3>
                    {activity.deal_id && (
                      <p className="text-sm text-gray-600">
                        Deal: {activity.deal_id}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Badge variant="outline" className="capitalize">
                      {activity.type}
                    </Badge>
                    <Badge
                      variant={
                        activity.status === "completed" ? "default" : "secondary"
                      }
                    >
                      {activity.status}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(activity.due_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>
                      {new Date(activity.due_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <Button variant="outline" size="sm">
                Edit
              </Button>
            </div>
          </div>
        ))}

        {activities.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No activities scheduled
          </div>
        )}
      </div>
    </div>
  );
}
