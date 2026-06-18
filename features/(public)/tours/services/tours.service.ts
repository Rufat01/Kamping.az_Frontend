import { apiFetch, API_URL } from "@/lib/api/client";
import type { Tour } from "@/types";

export async function getTours(params: Record<string, string> = {}): Promise<Tour[]> {
  const query = new URLSearchParams(params).toString();
  return apiFetch<Tour[]>(`/api/v1/posts/${query ? `?${query}` : ""}`);
}

export async function getTour(id: number | string): Promise<Tour> {
  const res = await fetch(`${API_URL}/api/v1/posts/${id}/`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error("Tur tapılmadı");
  return res.json() as Promise<Tour>;
}
