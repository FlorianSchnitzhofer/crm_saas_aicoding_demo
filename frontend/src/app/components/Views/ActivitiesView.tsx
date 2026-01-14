import { mockActivities } from "@/data/mockData";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Calendar, Clock } from "lucide-react";

export function ActivitiesView() {
  return (
    <div className="p-6">
      <div className="bg-white rounded-lg border border-gray-200 divide-y">
        {mockActivities.map((activity) => (
          <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start gap-4">
              <Checkbox
                checked={activity.completed}
                className="mt-1"
              />

              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      {activity.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {activity.description}
                    </p>
                  </div>
                  <Badge variant="outline" className="ml-4">
                    {activity.type}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(activity.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>
                      {new Date(activity.date).toLocaleTimeString([], {
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

        {mockActivities.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No activities scheduled
          </div>
        )}
      </div>
    </div>
  );
}
