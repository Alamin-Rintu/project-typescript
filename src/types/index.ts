export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt?: string;
}

export interface Review {
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Item {
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  price: number;
  location: string;
  images: string[];
  rating: number;
  reviews: Review[];
  userId: string;
  userName: string;
  date: string;
  views: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ItemsResponse {
  items: Item[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ItemDetailResponse {
  item: Item;
  relatedItems: Item[];
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface Category {
  name: string;
  count: number;
  image: string;
}

export interface DashboardStats {
  totalItems: number;
  totalUsers: number;
  totalCategories: number;
  totalViews: number;
}

export interface Booking {
  _id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  propertyLocation: string;
  userId: string;
  userName: string;
  userEmail: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: "confirmed" | "pending" | "cancelled";
  createdAt: string;
}

export interface FilterParams {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: string;
  sortOrder?: number;
  page?: number;
  limit?: number;
}
