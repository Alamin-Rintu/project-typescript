import type { ItemsResponse, ItemDetailResponse, AuthResponse, FilterParams, Item } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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
}

export const api = new ApiService(API_BASE);
