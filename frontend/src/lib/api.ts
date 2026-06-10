const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const isAdmin = path.startsWith("/api/admin/") && !path.endsWith("/auth/login/") && !path.endsWith("/auth/refresh/");

  const buildHeaders = (token?: string | null): HeadersInit => ({
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.headers ?? {}),
  });

  let res = await fetch(path, { ...options, headers: buildHeaders(isAdmin ? getToken() : null) });

  if (res.status === 401 && isAdmin) {
    const refresh = typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null;
    if (refresh) {
      const refreshRes = await fetch("/api/admin/auth/refresh/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });
      if (refreshRes.ok) {
        const { access } = await refreshRes.json();
        localStorage.setItem("access_token", access);
        res = await fetch(path, { ...options, headers: buildHeaders(access) });
      } else {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        if (typeof window !== "undefined") window.location.href = "/admin/login";
        throw new Error("Session expired. Please log in again.");
      }
    }
  }

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      detail = body.detail ?? detail;
    } catch {}
    throw new Error(detail);
  }
  return res.json() as Promise<T>;
}

export const api = {
  services: {
    smm: (params?: Record<string, string>) => {
      const qs = params ? "?" + new URLSearchParams(params).toString() : "";
      return request<SMMService[]>(`/api/services/smm/${qs}`);
    },
    smmDetail: (id: number) => request<SMMService>(`/api/services/smm/${id}/`),
    otp: (params?: Record<string, string>) => {
      const qs = params ? "?" + new URLSearchParams(params).toString() : "";
      return request<OTPService[]>(`/api/services/otp/${qs}`);
    },
    otpDetail: (id: number) => request<OTPService>(`/api/services/otp/${id}/`),
  },
  orders: {
    createSmm: (body: CreateSMMOrderBody) =>
      request<CreateOrderResponse>("/api/orders/smm/", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    createOtp: (body: CreateOTPOrderBody) =>
      request<CreateOrderResponse>("/api/orders/otp/", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    getSmm: (orderId: string) =>
      request<SMMOrderStatus>(`/api/orders/smm/${orderId}/`),
    getOtp: (orderId: string) =>
      request<OTPOrderStatus>(`/api/orders/otp/${orderId}/`),
    cancelOtp: (orderId: string) =>
      request<{ detail: string }>(`/api/orders/otp/${orderId}/cancel/`, {
        method: "POST",
      }),
  },
  auth: {
    login: (email: string, password: string) =>
      request<{ access: string; refresh: string }>("/api/admin/auth/login/", {
        method: "POST",
        body: JSON.stringify({ username: email, password }),
      }),
    register: (name: string, email: string, password: string) =>
      request<{ detail: string }>("/api/auth/register/", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      }),
  },
  admin: {
    dashboard: () => request<AdminDashboardData>("/api/admin/dashboard/"),
    orders: (params?: Record<string, string>) => {
      const qs = params ? "?" + new URLSearchParams(params).toString() : "";
      return request<AdminOrderListResponse>(`/api/admin/orders/${qs}`);
    },
    orderDetail: (orderId: string) =>
      request<AdminOrderDetail>(`/api/admin/orders/${orderId}/`),
    refundOrder: (orderId: string) =>
      request<{ detail: string }>(`/api/admin/orders/${orderId}/refund/`, { method: "POST" }),
    retryOrder: (orderId: string) =>
      request<{ detail: string }>(`/api/admin/orders/${orderId}/retry/`, { method: "POST" }),
    smmServices: () => request<AdminSMMService[]>("/api/admin/services/smm/"),
    updateSmmService: (id: number, body: Partial<AdminSMMServiceUpdate>) =>
      request<AdminSMMService>(`/api/admin/services/smm/${id}/`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    syncSmmServices: () =>
      request<{ detail: string }>("/api/admin/services/smm/sync/", { method: "POST" }),
    otpServices: () => request<AdminOTPService[]>("/api/admin/services/otp/"),
    updateOtpService: (id: number, body: Partial<AdminOTPServiceUpdate>) =>
      request<AdminOTPService>(`/api/admin/services/otp/${id}/`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    syncOtpServices: () =>
      request<{ detail: string }>("/api/admin/services/otp/sync/", { method: "POST" }),
    analytics: (period: "7d" | "30d" | "90d" | "all" = "30d") =>
      request<AdminAnalyticsData>(`/api/admin/analytics/?period=${period}`),
    getSettings: () => request<AdminSettings>("/api/admin/settings/"),
    saveSettings: (body: Partial<AdminSettingsPayload>) =>
      request<{ detail: string }>("/api/admin/settings/", {
        method: "POST",
        body: JSON.stringify(body),
      }),
  },
};

// ── Types ──────────────────────────────────────────────────────────────────────

export interface SMMService {
  id: number;
  name: string;
  platform: string;
  category: string;
  sell_per_1000: string;
  min_quantity: number;
  max_quantity: number;
  description: string | null;
}

export interface OTPService {
  id: number;
  platform: string;
  country_code: string;
  country_name: string;
  sell_price: string;
  is_active: boolean;
}

export interface CreateSMMOrderBody {
  service_id: number;
  target_url: string;
  quantity: number;
  payment_method: "cryptomus" | "flutterwave";
  customer_email?: string;
}

export interface CreateOTPOrderBody {
  service_id: number;
  platform?: string;
  payment_method: "cryptomus" | "flutterwave";
  customer_email?: string;
}

export interface CreateOrderResponse {
  order_id: string;
  amount: string;
  payment_method: string;
  /** Present when payment_method === "cryptomus" */
  payment?: {
    uuid: string;
    url: string;
    expires_at: number;
  };
  /** Present when payment_method === "flutterwave" */
  redirect_url?: string;
}

export interface SMMOrderStatus {
  order_id: string;
  status: string;
  service_name: string;
  target_url: string;
  quantity: number;
  sell_price: string;
  payment_method: string;
  created_at: string;
}

export interface OTPOrderStatus {
  order_id: string;
  status: string;
  phone_number: string | null;
  platform: string;
  country: string;
  otp_code: string | null;
  expires_at: string | null;
  seconds_remaining: number | null;
  sell_price: string;
  payment_method: string;
}

// ── Admin Types ────────────────────────────────────────────────────────────────

export interface AdminOrderItem {
  order_id: string;
  type: "smm" | "otp";
  status: string;
  amount: string;
  payment_method: string;
  created_at: string;
  customer_email: string;
  service_name: string;
}

export interface AdminDashboardData {
  total_revenue: string;
  total_orders: number;
  active_otp_sessions: number;
  gross_profit: string;
  recent_orders: AdminOrderItem[];
}

export interface AdminOrderListResponse {
  count: number;
  page: number;
  page_size: number;
  results: AdminOrderItem[];
}

export interface AdminOrderDetail extends AdminOrderItem {
  cost: string;
  platform?: string;
  target_url?: string;
  quantity?: number;
  provider_order_id?: string;
  phone_number?: string;
  otp_code?: string;
  provider?: string;
  provider_session_id?: string;
  country_code?: string;
  payment_ref?: string;
  expires_at?: string | null;
}

export interface AdminSMMService {
  id: number;
  name: string;
  platform: string;
  category: string;
  cost_per_1000: string;
  sell_per_1000: string;
  min_quantity: number;
  max_quantity: number;
  is_active: boolean;
  description: string;
  synced_at: string | null;
}

export interface AdminSMMServiceUpdate {
  name: string;
  description: string;
  is_active: boolean;
  sell_per_1000: string;
}

export interface AdminOTPService {
  id: number;
  platform: string;
  country_code: string;
  country_name: string;
  provider: string;
  cost_price: string;
  sell_price: string;
  is_active: boolean;
  synced_at: string | null;
}

export interface AdminOTPServiceUpdate {
  sell_price: string;
  is_active: boolean;
}

export interface AdminAnalyticsData {
  period: string;
  stats: {
    total_revenue: string;
    total_orders: number;
    avg_order_value: string;
    smm_revenue: string;
    otp_revenue: string;
  };
  daily: Array<{ date: string; smm: number; otp: number }>;
  top_services: Array<{ name: string; orders: number; revenue: string }>;
}

export interface AdminSettings {
  smmfollowers_api_key: boolean;
  smspool_api_key: boolean;
  fivesim_api_key: boolean;
  cryptomus_merchant_id: boolean;
  cryptomus_payment_key: boolean;
  flutterwave_public_key: boolean;
  flutterwave_secret_key: boolean;
  flutterwave_webhook_hash: boolean;
}

export interface AdminSettingsPayload {
  smmfollowers_api_key: string;
  smspool_api_key: string;
  fivesim_api_key: string;
  cryptomus_merchant_id: string;
  cryptomus_payment_key: string;
  flutterwave_public_key: string;
  flutterwave_secret_key: string;
  flutterwave_webhook_hash: string;
}
