export type Priority = "high" | "medium" | "low";
export type DealStage = "lead" | "qualified" | "proposal" | "negotiation" | "closed";

export interface Contact {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  avatar: string;
}

export interface Activity {
  id: string;
  type: "call" | "email" | "meeting" | "note";
  title: string;
  description: string;
  date: string;
  completed: boolean;
  dealId?: string;
  contactId?: string;
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  company: string;
  stage: DealStage;
  priority: Priority;
  owner: {
    name: string;
    avatar: string;
  };
  nextActivity?: Activity;
  createdAt: string;
  contactId: string;
}

export interface Note {
  id: string;
  content: string;
  createdAt: string;
  author: string;
}

// Mock data
export const mockContacts: Contact[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.j@techcorp.com",
    company: "TechCorp Inc",
    phone: "+1 555-0101",
    avatar: "SJ",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "m.chen@innovate.io",
    company: "Innovate Solutions",
    phone: "+1 555-0102",
    avatar: "MC",
  },
  {
    id: "3",
    name: "Emma Williams",
    email: "emma@designhub.co",
    company: "DesignHub Co",
    phone: "+1 555-0103",
    avatar: "EW",
  },
  {
    id: "4",
    name: "David Park",
    email: "dpark@globaltech.com",
    company: "GlobalTech Systems",
    phone: "+1 555-0104",
    avatar: "DP",
  },
  {
    id: "5",
    name: "Lisa Anderson",
    email: "l.anderson@startupx.io",
    company: "StartupX",
    phone: "+1 555-0105",
    avatar: "LA",
  },
];

export const mockActivities: Activity[] = [
  {
    id: "a1",
    type: "call",
    title: "Follow-up call",
    description: "Discuss proposal details",
    date: "2026-01-15T10:00:00",
    completed: false,
    dealId: "1",
  },
  {
    id: "a2",
    type: "meeting",
    title: "Demo presentation",
    description: "Product demo for stakeholders",
    date: "2026-01-16T14:00:00",
    completed: false,
    dealId: "2",
  },
  {
    id: "a3",
    type: "email",
    title: "Send contract",
    description: "Final contract review",
    date: "2026-01-14T09:00:00",
    completed: true,
    dealId: "3",
  },
];

export const mockDeals: Deal[] = [
  {
    id: "1",
    title: "Enterprise Platform License",
    value: 85000,
    company: "TechCorp Inc",
    stage: "qualified",
    priority: "high",
    owner: {
      name: "John Doe",
      avatar: "JD",
    },
    nextActivity: mockActivities[0],
    createdAt: "2026-01-05",
    contactId: "1",
  },
  {
    id: "2",
    title: "Cloud Migration Project",
    value: 125000,
    company: "Innovate Solutions",
    stage: "proposal",
    priority: "high",
    owner: {
      name: "Jane Smith",
      avatar: "JS",
    },
    nextActivity: mockActivities[1],
    createdAt: "2026-01-08",
    contactId: "2",
  },
  {
    id: "3",
    title: "Design System Implementation",
    value: 45000,
    company: "DesignHub Co",
    stage: "negotiation",
    priority: "medium",
    owner: {
      name: "John Doe",
      avatar: "JD",
    },
    nextActivity: mockActivities[2],
    createdAt: "2026-01-10",
    contactId: "3",
  },
  {
    id: "4",
    title: "API Integration Package",
    value: 35000,
    company: "GlobalTech Systems",
    stage: "lead",
    priority: "low",
    owner: {
      name: "Jane Smith",
      avatar: "JS",
    },
    createdAt: "2026-01-12",
    contactId: "4",
  },
  {
    id: "5",
    title: "Consulting Services",
    value: 65000,
    company: "StartupX",
    stage: "qualified",
    priority: "medium",
    owner: {
      name: "Mike Brown",
      avatar: "MB",
    },
    createdAt: "2026-01-13",
    contactId: "5",
  },
  {
    id: "6",
    title: "Annual Support Contract",
    value: 28000,
    company: "TechCorp Inc",
    stage: "closed",
    priority: "low",
    owner: {
      name: "John Doe",
      avatar: "JD",
    },
    createdAt: "2025-12-15",
    contactId: "1",
  },
];

export const stageConfig: Record<DealStage, { label: string; color: string }> = {
  lead: { label: "Lead", color: "bg-gray-100 text-gray-700" },
  qualified: { label: "Qualified", color: "bg-blue-100 text-blue-700" },
  proposal: { label: "Proposal", color: "bg-purple-100 text-purple-700" },
  negotiation: { label: "Negotiation", color: "bg-orange-100 text-orange-700" },
  closed: { label: "Closed Won", color: "bg-green-100 text-green-700" },
};

export const priorityConfig: Record<Priority, { label: string; color: string }> = {
  high: { label: "High", color: "text-red-600" },
  medium: { label: "Medium", color: "text-yellow-600" },
  low: { label: "Low", color: "text-gray-600" },
};
