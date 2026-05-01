import type {
  LoginRequest,
  LoginResponse,
  SetupAdminRequest,
  User,
  Domain,
  Database,
  Mailbox,
  BackupJob,
  ApiResponse,
  PaginatedResponse,
  CreateUserInput,
  UpdateUserInput,
} from "@hostpanel/types";

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  params?: Record<string, string>;
}

export class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = "/api/v1") {
    this.baseUrl = baseUrl;
  }

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const { method = "GET", body, headers = {}, params } = options;

    const url = new URL(`${this.baseUrl}${path}`, window.location.origin);
    if (params) {
      Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
    }

    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...headers,
    };

    if (this.token) {
      requestHeaders["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(url.toString(), {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Request failed" }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.request("/auth/login", { method: "POST", body: data });
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.request("/auth/logout", { method: "POST" });
  }

  async setup(data: SetupAdminRequest): Promise<ApiResponse<LoginResponse>> {
    return this.request("/auth/setup", { method: "POST", body: data });
  }

  async me(): Promise<ApiResponse<User>> {
    return this.request("/auth/me");
  }

  // Users
  async getUsers(page = 1, limit = 20): Promise<ApiResponse<PaginatedResponse<User>>> {
    return this.request("/users", { params: { page: String(page), limit: String(limit) } });
  }

  async getUser(id: string): Promise<ApiResponse<User>> {
    return this.request(`/users/${id}`);
  }

  async createUser(data: CreateUserInput): Promise<ApiResponse<User>> {
    return this.request("/users", { method: "POST", body: data });
  }

  async updateUser(id: string, data: UpdateUserInput): Promise<ApiResponse<User>> {
    return this.request(`/users/${id}`, { method: "PATCH", body: data });
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return this.request(`/users/${id}`, { method: "DELETE" });
  }

  // Domains
  async getDomains(page = 1, limit = 20): Promise<ApiResponse<PaginatedResponse<Domain>>> {
    return this.request("/domains", { params: { page: String(page), limit: String(limit) } });
  }

  async getDomain(id: string): Promise<ApiResponse<Domain>> {
    return this.request(`/domains/${id}`);
  }

  async createDomain(data: Partial<Domain>): Promise<ApiResponse<Domain>> {
    return this.request("/domains", { method: "POST", body: data });
  }

  async updateDomain(id: string, data: Partial<Domain>): Promise<ApiResponse<Domain>> {
    return this.request(`/domains/${id}`, { method: "PATCH", body: data });
  }

  async deleteDomain(id: string): Promise<ApiResponse<void>> {
    return this.request(`/domains/${id}`, { method: "DELETE" });
  }

  // Databases
  async getDatabases(page = 1, limit = 20): Promise<ApiResponse<PaginatedResponse<Database>>> {
    return this.request("/databases", { params: { page: String(page), limit: String(limit) } });
  }

  async getDatabase(id: string): Promise<ApiResponse<Database>> {
    return this.request(`/databases/${id}`);
  }

  async createDatabase(data: Partial<Database>): Promise<ApiResponse<Database>> {
    return this.request("/databases", { method: "POST", body: data });
  }

  async deleteDatabase(id: string): Promise<ApiResponse<void>> {
    return this.request(`/databases/${id}`, { method: "DELETE" });
  }

  // Mail
  async getMailboxes(domainId: string, page = 1, limit = 20): Promise<ApiResponse<PaginatedResponse<Mailbox>>> {
    return this.request(`/mail/${domainId}/mailboxes`, { params: { page: String(page), limit: String(limit) } });
  }

  async createMailbox(domainId: string, data: Partial<Mailbox>): Promise<ApiResponse<Mailbox>> {
    return this.request(`/mail/${domainId}/mailboxes`, { method: "POST", body: data });
  }

  async deleteMailbox(domainId: string, mailboxId: string): Promise<ApiResponse<void>> {
    return this.request(`/mail/${domainId}/mailboxes/${mailboxId}`, { method: "DELETE" });
  }

  // Backups
  async getBackups(page = 1, limit = 20): Promise<ApiResponse<PaginatedResponse<BackupJob>>> {
    return this.request("/backups", { params: { page: String(page), limit: String(limit) } });
  }

  async createBackup(data: Partial<BackupJob>): Promise<ApiResponse<BackupJob>> {
    return this.request("/backups", { method: "POST", body: data });
  }

  async deleteBackup(id: string): Promise<ApiResponse<void>> {
    return this.request(`/backups/${id}`, { method: "DELETE" });
  }

  // Health
  async health(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return this.request("/health");
  }
}