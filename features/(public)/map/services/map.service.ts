import { apiFetch } from "@/lib/api/client";
import type { MapLocation } from "@/types";

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
