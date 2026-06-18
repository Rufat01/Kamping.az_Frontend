const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export { API_URL };

export async function apiFetch<T = unknown>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API xətası: ${res.status} — ${endpoint}`);
  return res.json() as Promise<T>;
}
