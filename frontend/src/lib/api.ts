async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
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
  payment_method: string;
}
