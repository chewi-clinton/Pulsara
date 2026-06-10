const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

async function request(path, options) {
  const isAdmin = path.startsWith("/api/admin/") && !path.endsWith("/auth/login/") && !path.endsWith("/auth/refresh/");

  const buildHeaders = (token) => ({
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
  return res.json();
}

export const api = {
  services: {
    smm: (params) => {
      const qs = params ? "?" + new URLSearchParams(params).toString() : "";
      return request(`/api/services/smm/${qs}`);
    },
    smmDetail: (id) => request(`/api/services/smm/${id}/`),
    otp: (params) => {
      const qs = params ? "?" + new URLSearchParams(params).toString() : "";
      return request(`/api/services/otp/${qs}`);
    },
    otpDetail: (id) => request(`/api/services/otp/${id}/`),
  },
  orders: {
    createSmm: (body) =>
      request("/api/orders/smm/", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    createOtp: (body) =>
      request("/api/orders/otp/", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    getSmm: (orderId) =>
      request(`/api/orders/smm/${orderId}/`),
    getOtp: (orderId) =>
      request(`/api/orders/otp/${orderId}/`),
    cancelOtp: (orderId) =>
      request(`/api/orders/otp/${orderId}/cancel/`, {
        method: "POST",
      }),
  },
  auth: {
    login: (email, password) =>
      request("/api/admin/auth/login/", {
        method: "POST",
        body: JSON.stringify({ username: email, password }),
      }),
    register: (name, email, password) =>
      request("/api/auth/register/", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      }),
  },
  admin: {
    dashboard: () => request("/api/admin/dashboard/"),
    orders: (params) => {
      const qs = params ? "?" + new URLSearchParams(params).toString() : "";
      return request(`/api/admin/orders/${qs}`);
    },
    orderDetail: (orderId) =>
      request(`/api/admin/orders/${orderId}/`),
    refundOrder: (orderId) =>
      request(`/api/admin/orders/${orderId}/refund/`, { method: "POST" }),
    retryOrder: (orderId) =>
      request(`/api/admin/orders/${orderId}/retry/`, { method: "POST" }),
    smmServices: () => request("/api/admin/services/smm/"),
    updateSmmService: (id, body) =>
      request(`/api/admin/services/smm/${id}/`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    syncSmmServices: () =>
      request("/api/admin/services/smm/sync/", { method: "POST" }),
    otpServices: () => request("/api/admin/services/otp/"),
    updateOtpService: (id, body) =>
      request(`/api/admin/services/otp/${id}/`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    syncOtpServices: () =>
      request("/api/admin/services/otp/sync/", { method: "POST" }),
    analytics: (period = "30d") =>
      request(`/api/admin/analytics/?period=${period}`),
    getSettings: () => request("/api/admin/settings/"),
    saveSettings: (body) =>
      request("/api/admin/settings/", {
        method: "POST",
        body: JSON.stringify(body),
      }),
  },
};
