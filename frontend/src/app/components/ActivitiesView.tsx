interface Activity {
  id: string;
  subject: string;
  status: string;
  dueDate: string;
  ownerName: string;
}

interface ActivitiesViewProps {
  activities: Activity[];
}

export function ActivitiesView({ activities }: ActivitiesViewProps) {
  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Activities</h2>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900/40">
            <tr>
              <th className="text-left p-3">Subject</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Due</th>
              <th className="text-left p-3">Owner</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity.id} className="border-t border-gray-200 dark:border-gray-700">
                <td className="p-3">{activity.subject}</td>
                <td className="p-3">{activity.status}</td>
                <td className="p-3">{activity.dueDate || '-'}</td>
                <td className="p-3">{activity.ownerName || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
