import localforage from "localforage";
import type { MapListing } from "../types";

const MARKERS_KEY = "offline-markers";
const MARKERS_DATE_KEY = "offline-markers-date";

export async function syncMarkersOffline(apiUrl: string): Promise<MapListing[]> {
  try {
    const res = await fetch(`${apiUrl}/api/v1/listings/map/`);
    if (!res.ok) throw new Error("fetch failed");
    const data: MapListing[] = await res.json();
    await localforage.setItem(MARKERS_KEY, data);
    await localforage.setItem(MARKERS_DATE_KEY, new Date().toISOString());
    return data;
  } catch (err) {
    throw err;
  }
}

export async function getOfflineMarkers(): Promise<MapListing[] | null> {
  return localforage.getItem<MapListing[]>(MARKERS_KEY);
}

export async function getMarkersLastSync(): Promise<string | null> {
  return localforage.getItem<string>(MARKERS_DATE_KEY);
}

export async function getMarkers(apiUrl: string): Promise<{ data: MapListing[]; source: "online" | "offline" }> {
  if (navigator.onLine) {
    try {
      const data = await syncMarkersOffline(apiUrl);
      return { data, source: "online" };
    } catch {
      // Online-dan alınmadı, offline-dan cəhd et
    }
  }
  const data = await getOfflineMarkers();
  return { data: data || [], source: "offline" };
}
