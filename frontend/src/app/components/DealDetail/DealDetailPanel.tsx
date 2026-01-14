import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/app/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import type { Deal, Activity, Note, DealPriority, DealStatus } from "@/types/api";
import { apiClient } from "@/services/api";
import {
  DollarSign,
  Building2,
  User,
  Calendar,
  Flag,
  Phone,
  Mail,
  FileText,
  Upload,
  Loader2,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";
import { Separator } from "@/app/components/ui/separator";

interface DealDetailPanelProps {
  deal: Deal | null;
  onClose: () => void;
  onUpdate?: () => void;
}

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

export function DealDetailPanel({ deal, onClose, onUpdate }: DealDetailPanelProps) {
  const [note, setNote] = useState("");
  const [activityTitle, setActivityTitle] = useState("");
  const [activityDate, setActivityDate] = useState("");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);

  useEffect(() => {
    if (deal) {
      loadActivities();
      loadNotes();
    }
  }, [deal?.id]);

  const loadActivities = async () => {
    if (!deal) return;
    setIsLoadingActivities(true);
    try {
      const response = await apiClient.getActivities();
      // Filter activities for this deal (API should ideally support filtering)
      setActivities(response.data.filter((a) => a.deal_id === deal.id));
    } catch (error) {
      console.error("Failed to load activities:", error);
    } finally {
      setIsLoadingActivities(false);
    }
  };

  const loadNotes = async () => {
    if (!deal) return;
    setIsLoadingNotes(true);
    try {
      const response = await apiClient.getNotes();
      // Filter notes for this deal
      setNotes(response.data.filter((n) => n.deal_id === deal.id));
    } catch (error) {
      console.error("Failed to load notes:", error);
    } finally {
      setIsLoadingNotes(false);
    }
  };

  const handleAddNote = async () => {
    if (!note.trim() || !deal) return;

    try {
      await apiClient.createNote({
        deal_id: deal.id,
        body: note,
      });
      setNote("");
      loadNotes();
    } catch (error) {
      console.error("Failed to add note:", error);
    }
  };

  const handleScheduleActivity = async () => {
    if (!activityTitle.trim() || !activityDate || !deal) return;

    try {
      await apiClient.createActivity({
        deal_id: deal.id,
        type: "task",
        subject: activityTitle,
        due_at: new Date(activityDate).toISOString(),
        owner_id: deal.owner_id,
      });
      setActivityTitle("");
      setActivityDate("");
      loadActivities();
      onUpdate?.();
    } catch (error) {
      console.error("Failed to schedule activity:", error);
    }
  };

  const handleStatusChange = async (newStatus: DealStatus) => {
    if (!deal) return;

    try {
      await apiClient.updateDeal(deal.id, { status: newStatus });
      onUpdate?.();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  if (!deal) return null;

  return (
    <Sheet open={!!deal} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl">{deal.title}</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <DollarSign className="w-4 h-4" />
                <span>Value</span>
              </div>
              <div className="text-lg font-semibold">
                {deal.value.currency} {deal.value.amount.toLocaleString()}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Building2 className="w-4 h-4" />
                <span>Organization</span>
              </div>
              <div className="text-lg font-semibold">
                {deal.organization_id || "N/A"}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <User className="w-4 h-4" />
                <span>Owner</span>
              </div>
              <div className="flex items-center gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="text-xs">
                    {deal.owner_id.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{deal.owner_id}</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Flag className="w-4 h-4" />
                <span>Priority</span>
              </div>
              {deal.priority && (
                <Badge variant="secondary" className={priorityConfig[deal.priority].color}>
                  {priorityConfig[deal.priority].label}
                </Badge>
              )}
            </div>
          </div>

          <Separator />

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Phone className="w-4 h-4 mr-2" />
              Call
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
            <Select value={deal.status} onValueChange={(v) => handleStatusChange(v as DealStatus)}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(statusConfig).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              <div>
                <h4 className="font-medium mb-2">Deal Information</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Created</span>
                    <span className="font-medium">
                      {new Date(deal.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <Badge className={statusConfig[deal.status].color}>
                      {statusConfig[deal.status].label}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Last Updated</span>
                    <span className="font-medium">
                      {new Date(deal.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Labels</h4>
                {deal.labels && deal.labels.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {deal.labels.map((label) => (
                      <Badge key={label} variant="outline">
                        {label}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No labels</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Schedule New Activity</Label>
                <div className="space-y-2">
                  <Input
                    placeholder="Activity title..."
                    value={activityTitle}
                    onChange={(e) => setActivityTitle(e.target.value)}
                  />
                  <Input
                    type="datetime-local"
                    value={activityDate}
                    onChange={(e) => setActivityDate(e.target.value)}
                  />
                  <Button onClick={handleScheduleActivity} className="w-full">
                    Schedule
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium">Activity Timeline</h4>
                {isLoadingActivities ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                  </div>
                ) : activities.length > 0 ? (
                  <div className="space-y-3">
                    {activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="p-3 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">
                                {activity.type}
                              </Badge>
                              <span className="font-medium text-sm">
                                {activity.subject}
                              </span>
                            </div>
                            <Badge
                              variant={
                                activity.status === "completed"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {activity.status}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(activity.due_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No activities yet</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="notes" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Add Note</Label>
                <Textarea
                  placeholder="Write a note..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={4}
                />
                <Button onClick={handleAddNote} className="w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  Add Note
                </Button>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium">Previous Notes</h4>
                {isLoadingNotes ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                  </div>
                ) : notes.length > 0 ? (
                  <div className="space-y-3">
                    {notes.map((note) => (
                      <div
                        key={note.id}
                        className="p-3 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className="font-medium text-sm">
                            {note.created_by || "Unknown"}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(note.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{note.body}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No notes yet</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="files" className="space-y-4 mt-4">
              <Button variant="outline" className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Upload File
              </Button>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium">Attached Files</h4>
                <p className="text-sm text-gray-500">
                  File management coming soon
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
