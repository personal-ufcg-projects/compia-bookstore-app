// src/lib/api.ts
// Cliente HTTP tipado para o backend.
// Troca o VITE_API_URL em .env.local para apontar pro backend.

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(error?.error ?? `HTTP ${res.status}`);
  }

  // 204 No Content
  if (res.status === 204) return undefined as unknown as T;

  return res.json();
}

// ─── Types (espelham o schema Prisma) ───────────────────────────────────────

export type ProductFormat = "Fisico" | "Ebook" | "Kit";
export type ProductCategory =
  | "Inteligencia_Artificial"
  | "Blockchain"
  | "Ciberseguranca"
  | "Machine_Learning"
  | "Data_Science";

export type OrderStatus = "Processando" | "Em_transito" | "Entregue" | "Cancelado";

export interface Product {
  id: string;
  title: string;
  author: string;
  price: number;
  originalPrice?: number | null;
  format: ProductFormat;
  category: ProductCategory;
  imageUrl: string;
  inStock: boolean;
  stockCount: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  priceAtTime: number;
  product?: Product;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface Stats {
  totalProducts: number;
  ordersThisMonth: number;
  revenueThisMonth: number;
  growth: string | null;
  ordersByStatus: Record<OrderStatus, number>;
  recentLogs: ActivityLog[];
}

export interface ActivityLog {
  id: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: string;
  createdAt: string;
}

// ─── Products ────────────────────────────────────────────────────────────────

export interface ProductFilters {
  category?: ProductCategory;
  format?: ProductFormat;
  search?: string;
  inStock?: boolean;
}

export const productsApi = {
  list: (filters?: ProductFilters) => {
    const params = new URLSearchParams();
    if (filters?.category) params.set("category", filters.category);
    if (filters?.format) params.set("format", filters.format);
    if (filters?.search) params.set("search", filters.search);
    if (filters?.inStock !== undefined) params.set("inStock", String(filters.inStock));
    const qs = params.toString();
    return request<Product[]>(`/api/products${qs ? `?${qs}` : ""}`);
  },

  get: (id: string) => request<Product>(`/api/products/${id}`),

  create: (data: Omit<Product, "id" | "createdAt" | "updatedAt">) =>
    request<Product>("/api/products", { method: "POST", body: JSON.stringify(data) }),

  update: (id: string, data: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>) =>
    request<Product>(`/api/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  delete: (id: string) => request<void>(`/api/products/${id}`, { method: "DELETE" }),
};

// ─── Orders ──────────────────────────────────────────────────────────────────

export interface CreateOrderPayload {
  customerName: string;
  customerEmail: string;
  items: { productId: string; quantity: number }[];
}

export interface OrdersListResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
}

export const ordersApi = {
  list: (params?: { status?: OrderStatus; page?: number; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set("status", params.status);
    if (params?.page) qs.set("page", String(params.page));
    if (params?.limit) qs.set("limit", String(params.limit));
    return request<OrdersListResponse>(`/api/orders?${qs.toString()}`);
  },

  get: (id: string) => request<Order>(`/api/orders/${id}`),

  create: (data: CreateOrderPayload) =>
    request<Order>("/api/orders", { method: "POST", body: JSON.stringify(data) }),

  updateStatus: (id: string, status: OrderStatus) =>
    request<Order>(`/api/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};

// ─── Stats ───────────────────────────────────────────────────────────────────

export const statsApi = {
  get: () => request<Stats>("/api/stats"),
};
