import type {
  AuthTokens,
  PaginatedResponse,
  Deal,
  DealCreate,
  DealUpdate,
  DealMove,
  DealFilters,
  Contact,
  ContactCreate,
  Activity,
  ActivityCreate,
  Note,
  NoteCreate,
  User,
  Pipeline,
  PipelineKanban,
  Organization,
  File,
  APIError,
} from "@/types/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1";

class APIClient {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    // Load tokens from localStorage
    this.accessToken = localStorage.getItem("access_token");
    this.refreshToken = localStorage.getItem("refresh_token");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.accessToken && !endpoint.includes("/auth/")) {
      headers["Authorization"] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle rate limiting headers
    const rateLimit = {
      limit: response.headers.get("X-RateLimit-Limit"),
      remaining: response.headers.get("X-RateLimit-Remaining"),
      reset: response.headers.get("X-RateLimit-Reset"),
    };

    if (!response.ok) {
      if (response.status === 401 && this.refreshToken) {
        // Try to refresh token
        await this.refresh();
        // Retry the original request
        return this.request<T>(endpoint, options);
      }

      const error: APIError = await response.json();
      throw new Error(error.detail || "API Error");
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return null as T;
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string): Promise<AuthTokens> {
    const tokens = await this.request<AuthTokens>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    this.setTokens(tokens);
    return tokens;
  }

  async refresh(): Promise<AuthTokens> {
    if (!this.refreshToken) {
      throw new Error("No refresh token available");
    }

    const tokens = await this.request<AuthTokens>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refresh_token: this.refreshToken }),
    });

    this.setTokens(tokens);
    return tokens;
  }

  logout() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }

  private setTokens(tokens: AuthTokens) {
    this.accessToken = tokens.access_token;
    this.refreshToken = tokens.refresh_token;
    localStorage.setItem("access_token", tokens.access_token);
    localStorage.setItem("refresh_token", tokens.refresh_token);
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  // Users
  async getUsers(
    cursor?: string,
    limit: number = 50
  ): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams();
    if (cursor) params.append("cursor", cursor);
    params.append("limit", limit.toString());

    return this.request<PaginatedResponse<User>>(
      `/users?${params.toString()}`
    );
  }

  async getUser(userId: string): Promise<User> {
    return this.request<User>(`/users/${userId}`);
  }

  // Pipelines
  async getPipelines(
    cursor?: string,
    limit: number = 50
  ): Promise<PaginatedResponse<Pipeline>> {
    const params = new URLSearchParams();
    if (cursor) params.append("cursor", cursor);
    params.append("limit", limit.toString());

    return this.request<PaginatedResponse<Pipeline>>(
      `/pipelines?${params.toString()}`
    );
  }

  async getPipeline(pipelineId: string): Promise<Pipeline> {
    return this.request<Pipeline>(`/pipelines/${pipelineId}`);
  }

  async getPipelineKanban(
    pipelineId: string,
    stageLimit: number = 25,
    stageCursor?: string
  ): Promise<PipelineKanban> {
    const params = new URLSearchParams();
    params.append("stage_limit", stageLimit.toString());
    if (stageCursor) params.append("stage_cursor", stageCursor);

    return this.request<PipelineKanban>(
      `/pipelines/${pipelineId}/kanban?${params.toString()}`
    );
  }

  // Deals
  async getDeals(
    filters: DealFilters = {},
    cursor?: string,
    limit: number = 50
  ): Promise<PaginatedResponse<Deal>> {
    const params = new URLSearchParams();
    if (cursor) params.append("cursor", cursor);
    params.append("limit", limit.toString());

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    return this.request<PaginatedResponse<Deal>>(
      `/deals?${params.toString()}`
    );
  }

  async getDeal(dealId: string): Promise<{ deal: Deal; etag: string }> {
    const response = await fetch(`${API_BASE_URL}/deals/${dealId}`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch deal");
    }

    const etag = response.headers.get("ETag") || "";
    const deal = await response.json();

    return { deal, etag };
  }

  async createDeal(data: DealCreate): Promise<Deal> {
    return this.request<Deal>("/deals", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateDeal(
    dealId: string,
    data: DealUpdate,
    etag?: string
  ): Promise<Deal> {
    const headers: HeadersInit = {};
    if (etag) {
      headers["If-Match"] = etag;
    }

    return this.request<Deal>(`/deals/${dealId}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(data),
    });
  }

  async moveDeal(
    dealId: string,
    data: DealMove,
    etag?: string
  ): Promise<Deal> {
    const headers: HeadersInit = {};
    if (etag) {
      headers["If-Match"] = etag;
    }

    return this.request<Deal>(`/deals/${dealId}/move`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
  }

  async deleteDeal(dealId: string): Promise<void> {
    return this.request<void>(`/deals/${dealId}`, {
      method: "DELETE",
    });
  }

  // Contacts
  async getContacts(
    cursor?: string,
    limit: number = 50
  ): Promise<PaginatedResponse<Contact>> {
    const params = new URLSearchParams();
    if (cursor) params.append("cursor", cursor);
    params.append("limit", limit.toString());

    return this.request<PaginatedResponse<Contact>>(
      `/contacts?${params.toString()}`
    );
  }

  async getContact(contactId: string): Promise<Contact> {
    return this.request<Contact>(`/contacts/${contactId}`);
  }

  async createContact(data: ContactCreate): Promise<Contact> {
    return this.request<Contact>("/contacts", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Organizations
  async getOrganizations(
    cursor?: string,
    limit: number = 50
  ): Promise<PaginatedResponse<Organization>> {
    const params = new URLSearchParams();
    if (cursor) params.append("cursor", cursor);
    params.append("limit", limit.toString());

    return this.request<PaginatedResponse<Organization>>(
      `/organizations?${params.toString()}`
    );
  }

  async getOrganization(orgId: string): Promise<Organization> {
    return this.request<Organization>(`/organizations/${orgId}`);
  }

  // Activities
  async getActivities(
    cursor?: string,
    limit: number = 50
  ): Promise<PaginatedResponse<Activity>> {
    const params = new URLSearchParams();
    if (cursor) params.append("cursor", cursor);
    params.append("limit", limit.toString());

    return this.request<PaginatedResponse<Activity>>(
      `/activities?${params.toString()}`
    );
  }

  async createActivity(data: ActivityCreate): Promise<Activity> {
    return this.request<Activity>("/activities", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateActivity(
    activityId: string,
    data: Partial<ActivityCreate>
  ): Promise<Activity> {
    return this.request<Activity>(`/activities/${activityId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  // Notes
  async getNotes(
    cursor?: string,
    limit: number = 50
  ): Promise<PaginatedResponse<Note>> {
    const params = new URLSearchParams();
    if (cursor) params.append("cursor", cursor);
    params.append("limit", limit.toString());

    return this.request<PaginatedResponse<Note>>(`/notes?${params.toString()}`);
  }

  async createNote(data: NoteCreate): Promise<Note> {
    return this.request<Note>("/notes", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Files
  async getFiles(
    cursor?: string,
    limit: number = 50
  ): Promise<PaginatedResponse<File>> {
    const params = new URLSearchParams();
    if (cursor) params.append("cursor", cursor);
    params.append("limit", limit.toString());

    return this.request<PaginatedResponse<File>>(`/files?${params.toString()}`);
  }

  async uploadFile(file: globalThis.File, dealId: string): Promise<File> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("deal_id", dealId);

    const headers: HeadersInit = {};
    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(`${API_BASE_URL}/files`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error("File upload failed");
    }

    return response.json();
  }

  async getFileDownloadUrl(fileId: string): Promise<{ download_url: string }> {
    return this.request<{ download_url: string }>(
      `/files/${fileId}/download`
    );
  }

  // Search
  async search(
    query: string,
    cursor?: string,
    limit: number = 50
  ): Promise<PaginatedResponse<any>> {
    const params = new URLSearchParams();
    params.append("q", query);
    if (cursor) params.append("cursor", cursor);
    params.append("limit", limit.toString());

    return this.request<PaginatedResponse<any>>(`/search?${params.toString()}`);
  }
}

export const apiClient = new APIClient();
