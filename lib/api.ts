import type {
  Listing,
  MapListing,
  MapLocation,
  Tour,
  RegisterData,
  LoginData,
  ContactFormData,
  ReservationData,
  User,
} from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function apiFetch<T = unknown>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API xətası: ${res.status} — ${endpoint}`);
  return res.json() as Promise<T>;
}

// ── Auth ───────────────────────────────────────────────
export const auth = {
  register: (data: RegisterData) =>
    apiFetch<unknown>("/api/v1/auth/register/", {
      method: "POST",
      body: JSON.stringify({
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        password2: data.password_confirm,
        role: data.role,
      }),
    }),

  login: (data: LoginData) =>
    apiFetch<{ access: string; refresh: string }>("/api/v1/auth/login/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  refresh: (refresh: string) =>
    apiFetch<{ access: string }>("/api/v1/auth/refresh/", {
      method: "POST",
      body: JSON.stringify({ refresh }),
    }),

  me: (token: string) =>
    apiFetch<User>("/api/v1/auth/me/", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  changePassword: (data: { old_password: string; new_password: string }, token: string) =>
    apiFetch<unknown>("/api/v1/auth/change-password/", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    }),
};

// ── Listings ───────────────────────────────────────────
export async function getListings(searchParams: Record<string, string> = {}): Promise<Listing[]> {
  const query = new URLSearchParams(searchParams).toString();
  const res = await fetch(
    `${API_URL}/api/v1/listings/${query ? `?${query}` : ""}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error("Elanları yükləmək alınmadı");
  return res.json() as Promise<Listing[]>;
}

export async function getListing(id: number | string): Promise<Listing> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/listings/${id}/`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error("Elan tapılmadı");
  return res.json() as Promise<Listing>;
}

// ── Reservations ───────────────────────────────────────
export const reservations = {
  myReservations: (token: string) =>
    apiFetch<unknown[]>("/api/v1/reservations/my/", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  create: (data: ReservationData, token: string) =>
    apiFetch<unknown>("/api/v1/reservations/", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    }),

  cancel: (id: number | string, token: string) =>
    apiFetch<unknown>(`/api/v1/reservations/${id}/cancel/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }),

  incoming: (token: string) =>
    apiFetch<unknown[]>("/api/v1/reservations/incoming/", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  updateStatus: (id: number | string, status: string, token: string) =>
    apiFetch<unknown>(`/api/v1/reservations/incoming/${id}/`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    }),
};

// ── Map Locations ──────────────────────────────────────
export const mapLocations = {
  list: (params: Record<string, string> = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== "" && v != null))
    ).toString();
    return apiFetch<MapLocation[]>(`/api/v1/map/locations/${query ? `?${query}` : ""}`, {
      cache: "no-store",
    });
  },

  detail: (id: number | string) =>
    apiFetch<MapLocation>(`/api/v1/map/locations/${id}/`, { next: { revalidate: 60 } }),
};

// ── Xəritə üçün elan məlumatları ─────────────────────────
export async function getListingsMap(): Promise<MapListing[]> {
  const res = await fetch(`${API_URL}/api/v1/listings/map/`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Xəritə elanlarını yükləmək alınmadı");
  return res.json() as Promise<MapListing[]>;
}

// ── Contact ────────────────────────────────────────────
export async function sendContactMessage(data: ContactFormData): Promise<unknown> {
  const res = await fetch(`${API_URL}/api/v1/contact/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw json;
  return json;
}

// ── Tours ──────────────────────────────────────────────
export async function getTours(params: Record<string, string> = {}): Promise<Tour[]> {
  const query = new URLSearchParams(params).toString();
  return apiFetch<Tour[]>(`/api/v1/posts/${query ? `?${query}` : ""}`);
}

export async function getTour(id: number | string): Promise<Tour> {
  const res = await fetch(
    `${API_URL}/api/v1/posts/${id}/`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error("Tur tapılmadı");
  return res.json() as Promise<Tour>;
}

// ── Owner Listings (CRUD) ──────────────────────────────
export const ownerListings = {
  myListings: (token: string) =>
    apiFetch<Listing[]>("/api/v1/listings/my/", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }),

  create: (data: Record<string, unknown>, token: string) =>
    apiFetch<Listing>("/api/v1/listings/", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    }),

  update: (id: number | string, data: Record<string, unknown>, token: string) =>
    apiFetch<Listing>(`/api/v1/listings/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    }),

  delete: async (id: number | string, token: string): Promise<void> => {
    const res = await fetch(`${API_URL}/api/v1/listings/${id}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Silmə xətası: ${res.status}`);
  },
};
