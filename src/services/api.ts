import type { ItemsResponse, ItemDetailResponse, AuthResponse, FilterParams, Item } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL as string

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("wayfarer_token");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Request failed" }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async register(name: string, email: string, password: string, role?: string): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, role }),
    });
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async getProfile(): Promise<{ user: { id: string; name: string; email: string; role: string; createdAt: string } }> {
    return this.request("/auth/profile");
  }

  /**
   * Ensures the user has a valid Express JWT token stored.
   * The app uses dual auth: Better Auth (Next.js) for session + Express JWT for API calls.
   * This syncs the Express JWT so admin API calls work.
   */
  async ensureExpressToken(user: { name?: string | null; email?: string | null; id?: string | null; role?: string | null }): Promise<boolean> {
    if (!user?.email) return false;

    const name = user.name || "Wayfarer User";
    const email = user.email;
    const password = email + "-wayfarer-2026";
    const targetRole = user.role || "user";

    // Check if existing token has the correct role
    const existingToken = this.getToken();
    const storedRole = localStorage.getItem("wayfarer_role");
    if (existingToken && storedRole === targetRole) {
      return true;
    }

    // Register is now idempotent — it creates new users or updates existing ones' roles
    try {
      const res = await this.register(name, email, password, targetRole);
      localStorage.setItem("wayfarer_token", res.token);
      localStorage.setItem("wayfarer_role", targetRole);
      return true;
    } catch {
      // Fallback to login if register fails
      try {
        const log = await this.login(email, password);
        localStorage.setItem("wayfarer_token", log.token);
        if (log.user?.role) {
          localStorage.setItem("wayfarer_role", log.user.role);
        }
        return true;
      } catch {
        console.error("Failed to sync Express auth for user:", email);
        return false;
      }
    }
  }

  // Items endpoints
  async getItems(params: FilterParams = {}): Promise<ItemsResponse> {
    const query = new URLSearchParams();
    if (params.search) query.set("search", params.search);
    if (params.category) query.set("category", params.category);
    if (params.minPrice !== undefined) query.set("minPrice", String(params.minPrice));
    if (params.maxPrice !== undefined) query.set("maxPrice", String(params.maxPrice));
    if (params.minRating !== undefined) query.set("minRating", String(params.minRating));
    if (params.sortBy) query.set("sortBy", params.sortBy);
    if (params.sortOrder !== undefined) query.set("sortOrder", String(params.sortOrder));
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));

    const qs = query.toString();
    return this.request<ItemsResponse>(`/items${qs ? `?${qs}` : ""}`);
  }

  async getItem(id: string): Promise<ItemDetailResponse> {
    return this.request<ItemDetailResponse>(`/items/${id}`);
  }

  async createItem(item: Partial<Item>): Promise<{ message: string; itemId: string }> {
    return this.request("/items", {
      method: "POST",
      body: JSON.stringify(item),
    });
  }

  async deleteItem(id: string): Promise<{ message: string }> {
    return this.request(`/items/${id}`, {
      method: "DELETE",
    });
  }

  async getMyItems(): Promise<{ items: Item[] }> {
    return this.request("/items/my-items");
  }

  async getCategories(): Promise<{ categories: string[] }> {
    return this.request("/items/categories");
  }

  async getStats(): Promise<{ totalItems: number; totalCategories: number }> {
    return this.request("/items/stats");
  }

  // Booking endpoints
  async createBooking(data: {
    propertyId: string;
    propertyTitle: string;
    propertyImage?: string;
    propertyLocation?: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    totalPrice: number;
  }): Promise<{ message: string; bookingId: string }> {
    return this.request("/bookings", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getMyBookings(): Promise<{ bookings: import("@/types").Booking[] }> {
    return this.request("/bookings/my-bookings");
  }

  async getBookingStats(): Promise<{
    totalBookings: number;
    confirmedBookings: number;
    totalRevenue: number;
  }> {
    return this.request("/bookings/stats");
  }

  async updateBookingStatus(id: string, status: "confirmed" | "pending" | "cancelled"): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/bookings/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  // Admin endpoints
  async getAdminStats(): Promise<{
    totalBookings: number;
    confirmedBookings: number;
    totalRevenue: number;
    totalUsers: number;
    totalItems: number;
  }> {
    return this.request("/admin/stats");
  }

  async getAllBookingsAdmin(page = 1, limit = 20): Promise<{
    bookings: import("@/types").Booking[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    return this.request(`/admin/bookings?page=${page}&limit=${limit}`);
  }

  async getAllUsers(page = 1, limit = 50): Promise<{
    users: Array<{
      id: string;
      name: string;
      email: string;
      role: string;
      createdAt: string;
    }>;
    total: number;
    page: number;
    totalPages: number;
  }> {
    return this.request(`/admin/users?page=${page}&limit=${limit}`);
  }
}

export const api = new ApiService(API_BASE);
