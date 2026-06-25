import { apiFetch, API_URL } from "@/lib/api/client";
import type { Listing, ListingImage, MapListing, PaginatedResponse, Tour } from "@/types";

export async function getListings(searchParams: Record<string, string> = {}): Promise<Listing[]> {
  const query = new URLSearchParams(searchParams).toString();
  const res = await fetch(
    `${API_URL}/api/v1/listings/${query ? `?${query}` : ""}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error("Elanları yükləmək alınmadı");
  const data = await res.json();
  if (Array.isArray(data)) return data as Listing[];
  return (data as PaginatedResponse<Listing>).results;
}

export async function getListing(id: number | string): Promise<Listing> {
  const res = await fetch(
    `${API_URL}/api/v1/listings/${id}/`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error("Elan tapılmadı");
  return res.json() as Promise<Listing>;
}

export async function getListingsMap(): Promise<MapListing[]> {
  const res = await fetch(`${API_URL}/api/v1/listings/map/`, { cache: "no-store" });
  if (!res.ok) throw new Error("Xəritə elanlarını yükləmək alınmadı");
  return res.json() as Promise<MapListing[]>;
}

export const ownerListings = {
  myListings: (token: string) =>
    apiFetch<Listing[]>("/api/v1/posts/my/", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }),

  getOne: (id: number | string, token: string) =>
    apiFetch<Tour>(`/api/v1/posts/my/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }),

  create: (data: Record<string, unknown>, token: string) => {
    console.log("[ownerListings.create] payload:", data);
    return apiFetch<Listing>("/api/v1/posts/my/", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
  },

  update: (id: number | string, data: Record<string, unknown>, token: string) =>
    apiFetch<Listing>(`/api/v1/posts/my/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    }),

  uploadImage: (listingId: number | string, file: File, isCover: boolean, token: string) => {
    const fd = new FormData();
    fd.append("image", file);
    fd.append("is_cover", String(isCover));
    return apiFetch<ListingImage>(`/api/v1/posts/my/${listingId}/images/`, {
      method: "POST",
      body: fd,
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  deleteImage: async (listingId: number | string, imageId: number, token: string): Promise<void> => {
    const res = await fetch(`${API_URL}/api/v1/posts/my/${listingId}/images/${imageId}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Şəkil silmə xətası: ${res.status}`);
  },

  delete: async (id: number | string, token: string): Promise<void> => {
    const res = await fetch(`${API_URL}/api/v1/posts/my/${id}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Silmə xətası: ${res.status}`);
  },
};
