// API Types based on OpenAPI specification
export type DealStatus = "open" | "won" | "lost";
export type DealPriority = "low" | "medium" | "high" | "urgent";
export type ActivityType = "call" | "meeting" | "email" | "task";
export type ActivityStatus = "planned" | "completed" | "canceled";
export type UserRole = "admin" | "manager" | "rep";

export interface Money {
  amount: number;
  currency: string; // ISO 4217
}

export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface User extends BaseEntity {
  email: string;
  name: string;
  role: UserRole;
}

export interface Pipeline extends BaseEntity {
  name: string;
  is_default: boolean;
}

export interface Stage extends BaseEntity {
  name: string;
  pipeline_id: string;
  order: number;
  win_probability?: number;
}

export interface DealNextActivity {
  due_at?: string;
  type?: ActivityType;
}

export interface Deal extends BaseEntity {
  title: string;
  value: Money;
  status: DealStatus;
  stage_id: string;
  pipeline_id: string;
  owner_id: string;
  organization_id?: string | null;
  contact_id?: string | null;
  priority?: DealPriority;
  labels?: string[];
  next_activity?: DealNextActivity;
  last_updated_by?: string;
}

export interface DealSummary {
  id: string;
  title: string;
  value: Money;
  status: DealStatus;
  owner_id: string;
  organization_id?: string;
  contact_id?: string;
  priority?: DealPriority;
  labels?: string[];
  next_activity?: DealNextActivity;
  updated_at: string;
}

export interface Contact extends BaseEntity {
  name: string;
  email?: string;
  phone?: string;
  organization_id?: string | null;
}

export interface Organization extends BaseEntity {
  name: string;
  domain?: string;
  industry?: string;
  owner_id?: string;
}

export interface Activity extends BaseEntity {
  deal_id?: string | null;
  contact_id?: string | null;
  type: ActivityType;
  subject: string;
  due_at: string;
  status: ActivityStatus;
  owner_id: string;
}

export interface Note extends BaseEntity {
  deal_id?: string | null;
  body: string;
  created_by?: string;
}

export interface File extends BaseEntity {
  deal_id?: string | null;
  note_id?: string | null;
  file_name: string;
  content_type: string;
  size_bytes: number;
  storage_key?: string;
}

// API Request/Response Types
export interface PaginatedResponse<T> {
  data: T[];
  next_cursor?: string | null;
  total_count?: number;
}

export interface KanbanStage {
  stage: Stage;
  deals: DealSummary[];
  next_cursor?: string | null;
}

export interface PipelineKanban {
  pipeline: Pipeline;
  stages: KanbanStage[];
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface DealCreate {
  title: string;
  value: Money;
  pipeline_id: string;
  stage_id: string;
  organization_id?: string;
  contact_id?: string;
  owner_id: string;
  priority?: DealPriority;
  labels?: string[];
}

export interface DealUpdate {
  title?: string;
  value?: Money;
  stage_id?: string;
  owner_id?: string;
  priority?: DealPriority;
  status?: DealStatus;
  labels?: string[];
  next_activity?: DealNextActivity;
}

export interface DealMove {
  to_stage_id: string;
  position?: number;
}

export interface ActivityCreate {
  deal_id?: string;
  contact_id?: string;
  type: ActivityType;
  subject: string;
  due_at: string;
  owner_id: string;
}

export interface NoteCreate {
  deal_id?: string;
  body: string;
  created_by?: string;
}

export interface ContactCreate {
  name: string;
  email?: string;
  phone?: string;
  organization_id?: string;
}

export interface APIError {
  type: string;
  title: string;
  status: number;
  detail: string;
  code: string;
  instance?: string;
}

// Filter types
export interface DealFilters {
  stage_id?: string;
  owner_id?: string;
  label?: string;
  status?: DealStatus;
  value_min?: number;
  value_max?: number;
  updated_from?: string;
  updated_to?: string;
  next_activity_from?: string;
  next_activity_to?: string;
  sort?: string;
}
