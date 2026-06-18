const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ── Əsas fetch helper ──────────────────────────────────
async function apiFetch(endpoint, options = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API xətası: ${res.status} — ${endpoint}`);
  return res.json();
}

// ── Auth ───────────────────────────────────────────────
export const auth = {
  register: (data) =>
  apiFetch("/api/v1/auth/register/", {
    method: "POST",
    body: JSON.stringify({
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      password2: data.password_confirm, // ← backend password2 gözləyir
      role: data.role,
    }),
  }),

  login: (data) =>
    apiFetch("/api/v1/auth/login/", { method: "POST", body: JSON.stringify(data) }),

  refresh: (refresh) =>
    apiFetch("/api/v1/auth/refresh/", { method: "POST", body: JSON.stringify({ refresh }) }),

  me: (token) =>
    apiFetch("/api/v1/auth/me/", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  changePassword: (data, token) =>
    apiFetch("/api/v1/auth/change-password/", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    }),
};

// ── Listings ───────────────────────────────────────────
export async function getListings(searchParams = {}) {
  const query = new URLSearchParams(searchParams).toString();
  const res = await fetch(
    `${API_URL}/api/v1/listings/${query ? `?${query}` : ""}`,
    {
      // ISR: 60 saniyədən bir yenilənir, SEO + performans balansı
      next: { revalidate: 60 },
    }
  );
  if (!res.ok) throw new Error("Elanları yükləmək alınmadı");
  return res.json();
}


// Tək bir elan üçün
export async function getListing(id) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/listings/${id}/`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error("Elan tapılmadı");
  return res.json();
}




// ── Reservations ───────────────────────────────────────
export const reservations = {
  // İstifadəçinin öz rezervasiyaları
  myReservations: (token) =>
    apiFetch("/api/v1/reservations/my/", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  // Rezervasiya yarat
  create: (data, token) =>
    apiFetch("/api/v1/reservations/", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    }),

  // Rezervasiyanı ləğv et
  cancel: (id, token) =>
    apiFetch(`/api/v1/reservations/${id}/cancel/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }),

  // Sahibkar — gələn rezervasiyalar
  incoming: (token) =>
    apiFetch("/api/v1/reservations/incoming/", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  // Sahibkar — status yenilə
  updateStatus: (id, status, token) =>
    apiFetch(`/api/v1/reservations/incoming/${id}/`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    }),
};

// ── Map Locations ──────────────────────────────────────
export const mapLocations = {
  list: (params = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== "" && v != null))
    ).toString();
    return apiFetch(`/api/v1/map/locations/${query ? `?${query}` : ""}`, {
      cache: "no-store",
    });
  },

  detail: (id) =>
    apiFetch(`/api/v1/map/locations/${id}/`, { next: { revalidate: 60 } }),
};


// ── Xəritə üçün elan məlumatları ─────────────────────────
export async function getListingsMap() {
  const res = await fetch(`${API_URL}/api/v1/listings/map/`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Xəritə elanlarını yükləmək alınmadı");
  return res.json();
}

// ── Contact ────────────────────────────────────────────
export async function sendContactMessage(data) {
  const res = await fetch(`${API_URL}/api/v1/contact/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data), // artıq token data içindədir
  });
  const json = await res.json();
  if (!res.ok) throw json;
  return json;
}

// ── Tours ──────────────────────────────────────────────
export async function getTours(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiFetch(`/api/v1/posts/${query ? `?${query}` : ""}`);
}

export async function getTour(id) {
  const res = await fetch(
    `${API_URL}/api/v1/posts/${id}/`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error("Tur tapılmadı");
  return res.json();
}

// ── Owner Listings (CRUD) ──────────────────────────────
export const ownerListings = {
  myListings: (token) =>
    apiFetch("/api/v1/listings/my/", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }),

  create: (data, token) =>
    apiFetch("/api/v1/listings/", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    }),

  update: (id, data, token) =>
    apiFetch(`/api/v1/listings/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    }),

  delete: async (id, token) => {
    const res = await fetch(`${API_URL}/api/v1/listings/${id}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Silmə xətası: ${res.status}`);
  },
};