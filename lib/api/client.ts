const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export { API_URL };

function normalizeUrls<T>(data: T): T {
  if (typeof data === "string") {
    return data.replace(/^http:\/\/(?!localhost)/g, "https://") as unknown as T;
  }
  if (Array.isArray(data)) return data.map(normalizeUrls) as unknown as T;
  if (data && typeof data === "object") {
    return Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, normalizeUrls(v)])
    ) as unknown as T;
  }
  return data;
}

export async function apiFetch<T = unknown>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API xətası: ${res.status} — ${endpoint}`);
  const data = await res.json() as T;
  return normalizeUrls(data);
}
