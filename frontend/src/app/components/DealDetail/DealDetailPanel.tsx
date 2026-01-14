import { useState } from "react";
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
import { Deal, stageConfig, priorityConfig, mockActivities } from "@/data/mockData";
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
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";
import { Separator } from "@/app/components/ui/separator";

interface DealDetailPanelProps {
  deal: Deal | null;
  onClose: () => void;
}

export function DealDetailPanel({ deal, onClose }: DealDetailPanelProps) {
  const [note, setNote] = useState("");
  const [activityTitle, setActivityTitle] = useState("");

  if (!deal) return null;

  const handleAddNote = () => {
    if (note.trim()) {
      // In a real app, this would save to backend
      console.log("Adding note:", note);
      setNote("");
    }
  };

  const handleScheduleActivity = () => {
    if (activityTitle.trim()) {
      console.log("Scheduling activity:", activityTitle);
      setActivityTitle("");
    }
  };

  const relatedActivities = mockActivities.filter((a) => a.dealId === deal.id);

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
                ${deal.value.toLocaleString()}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Building2 className="w-4 h-4" />
                <span>Company</span>
              </div>
              <div className="text-lg font-semibold">{deal.company}</div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <User className="w-4 h-4" />
                <span>Owner</span>
              </div>
              <div className="flex items-center gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="text-xs">
                    {deal.owner.avatar}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{deal.owner.name}</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Flag className="w-4 h-4" />
                <span>Priority</span>
              </div>
              <Badge variant="secondary" className={priorityConfig[deal.priority].color}>
                {priorityConfig[deal.priority].label}
              </Badge>
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
            <Select defaultValue={deal.stage}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(stageConfig).map(([key, value]) => (
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
                      {new Date(deal.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Stage</span>
                    <Badge className={stageConfig[deal.stage].color}>
                      {stageConfig[deal.stage].label}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Expected Close</span>
                    <span className="font-medium">Jan 31, 2026</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Next Activity</h4>
                {deal.nextActivity ? (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-sm">
                        {deal.nextActivity.title}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {deal.nextActivity.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(deal.nextActivity.date).toLocaleString()}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No upcoming activities</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Schedule New Activity</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Activity title..."
                    value={activityTitle}
                    onChange={(e) => setActivityTitle(e.target.value)}
                  />
                  <Button onClick={handleScheduleActivity}>Schedule</Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium">Activity Timeline</h4>
                {relatedActivities.length > 0 ? (
                  <div className="space-y-3">
                    {relatedActivities.map((activity) => (
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
                                {activity.title}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {activity.description}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(activity.date).toLocaleString()}
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
                <div className="space-y-3">
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-medium text-sm">John Doe</span>
                      <span className="text-xs text-gray-500">2 days ago</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Had a great call with the client. They're interested in
                      the enterprise package.
                    </p>
                  </div>
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-medium text-sm">Jane Smith</span>
                      <span className="text-xs text-gray-500">5 days ago</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Sent initial proposal. Awaiting feedback.
                    </p>
                  </div>
                </div>
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
                <div className="space-y-2">
                  <div className="p-3 border border-gray-200 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium">Proposal.pdf</p>
                        <p className="text-xs text-gray-500">2.4 MB</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                  <div className="p-3 border border-gray-200 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium">Contract_Draft.docx</p>
                        <p className="text-xs text-gray-500">1.8 MB</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
