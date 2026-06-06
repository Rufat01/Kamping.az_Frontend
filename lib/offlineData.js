import localforage from "localforage";

const MARKERS_KEY = "offline-markers";
const MARKERS_DATE_KEY = "offline-markers-date";

// Markerləri backend-dən yüklə və IndexedDB-yə saxla
export async function syncMarkersOffline(apiUrl) {
  try {
    const res = await fetch(`${apiUrl}/api/v1/listings/map/`);
    if (!res.ok) throw new Error("fetch failed");
    const data = await res.json();
    await localforage.setItem(MARKERS_KEY, data);
    await localforage.setItem(MARKERS_DATE_KEY, new Date().toISOString());
    return data;
  } catch (err) {
    throw err;
  }
}

// Offline marker-ləri oxu
export async function getOfflineMarkers() {
  return await localforage.getItem(MARKERS_KEY);
}

// Son sinxronizasiya tarixi
export async function getMarkersLastSync() {
  return await localforage.getItem(MARKERS_DATE_KEY);
}

// Online yoxsa offline marker-ləri qaytar
export async function getMarkers(apiUrl) {
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