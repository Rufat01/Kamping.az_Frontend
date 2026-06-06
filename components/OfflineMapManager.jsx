"use client";
import { useState, useEffect } from "react";
import { Download, Trash2, Wifi, WifiOff, CheckCircle, Loader } from "lucide-react";
import localforage from "localforage";
import { getMarkersLastSync, syncMarkersOffline } from "../lib/offlineData";

const REGIONS = [
  { id: "sheki", name: "Şəki", bounds: [[41.1, 47.0], [41.5, 47.8]], zoom: [10, 14] },
  { id: "qebele", name: "Qəbələ", bounds: [[40.8, 47.6], [41.2, 48.4]], zoom: [10, 14] },
  { id: "goygol", name: "Göygöl", bounds: [[40.4, 46.2], [40.8, 46.8]], zoom: [10, 14] },
  { id: "lerik", name: "Lerik", bounds: [[38.6, 48.2], [39.0, 48.8]], zoom: [10, 14] },
  { id: "lenkaran", name: "Lənkəran", bounds: [[38.5, 48.5], [39.0, 49.0]], zoom: [10, 14] },
  { id: "ismayilli", name: "İsmayıllı", bounds: [[40.6, 48.0], [41.0, 48.6]], zoom: [10, 14] },
];

// Tile sayını hesabla
function countTiles(bounds, minZoom, maxZoom) {
  let count = 0;
  for (let z = minZoom; z <= maxZoom; z++) {
    const [minLat, minLng] = bounds[0];
    const [maxLat, maxLng] = bounds[1];
    const minX = Math.floor((minLng + 180) / 360 * Math.pow(2, z));
    const maxX = Math.floor((maxLng + 180) / 360 * Math.pow(2, z));
    const minY = Math.floor((1 - Math.log(Math.tan(maxLat * Math.PI / 180) + 1 / Math.cos(maxLat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, z));
    const maxY = Math.floor((1 - Math.log(Math.tan(minLat * Math.PI / 180) + 1 / Math.cos(minLat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, z));
    count += (maxX - minX + 1) * (maxY - minY + 1);
  }
  return count;
}

// MB təxmini (hər tile ~15KB)
function estimateSize(count) {
  const mb = (count * 15) / 1024;
  return mb < 1 ? `${Math.round(count * 15)} KB` : `~${mb.toFixed(0)} MB`;
}

export default function OfflineMapManager() {
  const [downloaded, setDownloaded] = useState({});
  const [downloading, setDownloading] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const [lastSync, setLastSync] = useState(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    window.addEventListener("online", () => setIsOnline(true));
    window.addEventListener("offline", () => setIsOnline(false));

    // Yüklənmiş regionları oxu
    localforage.getItem("offline-regions").then((data) => {
      if (data) setDownloaded(data);
    });

    getMarkersLastSync().then((date) => {
    if (date) setLastSync(new Date(date).toLocaleString("az-AZ"));
  });


  }, []);

  const handleDownload = async (region) => {
    if (!isOnline) return;
    setDownloading(region.id);
    setProgress(0);

    const [minZoom, maxZoom] = region.zoom;
    const tiles = [];

    // Bütün tile URL-lərini hesabla
    for (let z = minZoom; z <= maxZoom; z++) {
      const [minLat, minLng] = region.bounds[0];
      const [maxLat, maxLng] = region.bounds[1];
      const minX = Math.floor((minLng + 180) / 360 * Math.pow(2, z));
      const maxX = Math.floor((maxLng + 180) / 360 * Math.pow(2, z));
      const minY = Math.floor((1 - Math.log(Math.tan(maxLat * Math.PI / 180) + 1 / Math.cos(maxLat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, z));
      const maxY = Math.floor((1 - Math.log(Math.tan(minLat * Math.PI / 180) + 1 / Math.cos(minLat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, z));
      for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
          tiles.push({ z, x, y });
        }
      }
    }

    const total = tiles.length;
    let done = 0;
    const BATCH = 5;

    // Tile-ları batch-batch yüklə
    for (let i = 0; i < tiles.length; i += BATCH) {
      const batch = tiles.slice(i, i + BATCH);
      await Promise.all(
        batch.map(async ({ z, x, y }) => {
          const url = `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;
          const key = `tile_${z}_${x}_${y}`;
          try {
            const res = await fetch(url);
            if (res.ok) {
              const blob = await res.blob();
              await localforage.setItem(key, blob);
            }
          } catch {}
          done++;
          setProgress(Math.round((done / total) * 100));
        })
      );
    }

    // Yüklənmiş region qeyd et
    const updated = {
      ...downloaded,
      [region.id]: {
        name: region.name,
        date: new Date().toLocaleDateString("az-AZ"),
        size: estimateSize(total),
        tileCount: total,
      },
    };
    await localforage.setItem("offline-regions", updated);
    setDownloaded(updated);
    setDownloading(null);
  };

  const handleDelete = async (regionId) => {
    const region = REGIONS.find((r) => r.id === regionId);
    if (!region) return;

    const [minZoom, maxZoom] = region.zoom;
    for (let z = minZoom; z <= maxZoom; z++) {
      const [minLat, minLng] = region.bounds[0];
      const [maxLat, maxLng] = region.bounds[1];
      const minX = Math.floor((minLng + 180) / 360 * Math.pow(2, z));
      const maxX = Math.floor((maxLng + 180) / 360 * Math.pow(2, z));
      const minY = Math.floor((1 - Math.log(Math.tan(maxLat * Math.PI / 180) + 1 / Math.cos(maxLat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, z));
      const maxY = Math.floor((1 - Math.log(Math.tan(minLat * Math.PI / 180) + 1 / Math.cos(minLat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, z));
      for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
          await localforage.removeItem(`tile_${z}_${x}_${y}`);
        }
      }
    }

    const updated = { ...downloaded };
    delete updated[regionId];
    await localforage.setItem("offline-regions", updated);
    setDownloaded(updated);
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden"
      style={{ boxShadow: "0 8px 30px -5px rgba(45,74,51,0.12)" }}>

      {/* Header */}
      <div className="px-6 py-4 border-b border-dashed border-[#E8E5D8] flex items-center justify-between"
        style={{ background: "#FAF6F0" }}>
        <div>
          <p className="text-[#A0613B] text-xs font-bold uppercase tracking-[0.25em]">
            Offline Xəritə
          </p>
          <h2 className="font-display text-xl font-bold text-[#1F2D24]">
            Regionları yüklə
          </h2>
        </div>
        <div className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${
          isOnline ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
        }`}>
          {isOnline
            ? <><Wifi className="w-3.5 h-3.5" /> Online</>
            : <><WifiOff className="w-3.5 h-3.5" /> Offline</>
          }
        </div>
      </div>

      {/* Region siyahısı */}
      <div className="divide-y divide-dashed divide-[#E8E5D8]">
        {REGIONS.map((region) => {
          const tileCount = countTiles(region.bounds, region.zoom[0], region.zoom[1]);
          const isDownloaded = !!downloaded[region.id];
          const isDownloading = downloading === region.id;

          return (
            <div key={region.id} className="px-6 py-4 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-[#1F2D24] text-base">{region.name}</p>
                <p className="text-[#4A6B4F]/60 text-xs mt-0.5">
                  {isDownloaded
                    ? `${downloaded[region.id].size} · ${downloaded[region.id].date}`
                    : `${estimateSize(tileCount)} · ${tileCount} tile`}
                </p>

                {/* Progress bar */}
                {isDownloading && (
                  <div className="mt-2">
                    <div className="h-1.5 bg-[#E8E5D8] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${progress}%`, background: "#2D4A33" }}
                      />
                    </div>
                    <p className="text-[10px] text-[#4A6B4F]/60 mt-1">{progress}% yüklənir...</p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {isDownloaded ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <button
                      onClick={() => handleDelete(region.id)}
                      className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </>
                ) : isDownloading ? (
                  <Loader className="w-5 h-5 text-[#2D4A33] animate-spin" />
                ) : (
                  <button
                    onClick={() => handleDownload(region)}
                    disabled={!isOnline}
                    className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition-all active:scale-95 disabled:opacity-40"
                    style={{ background: "#2D4A33", color: "#FAF6F0" }}
                  >
                    <Download className="w-3.5 h-3.5" />
                    Yüklə
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div className="px-6 py-4 border-t border-dashed border-[#E8E5D8] flex items-center justify-between"
  style={{ background: "#FAF6F0" }}>
  <p className="text-[#4A6B4F]/50 text-xs">
    {lastSync ? `Son yenilənmə: ${lastSync}` : "Hələ sinxronizasiya edilməyib"}
  </p>
  <button
    onClick={async () => {
      if (!isOnline) return;
      setSyncing(true);
      try {
        await syncMarkersOffline(process.env.NEXT_PUBLIC_API_URL);
        const date = await getMarkersLastSync();
        setLastSync(new Date(date).toLocaleString("az-AZ"));
      } finally {
        setSyncing(false);
      }
    }}
    disabled={!isOnline || syncing}
    className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl disabled:opacity-40 transition-all"
    style={{ background: "#2D4A33", color: "#FAF6F0" }}
  >
    {syncing
      ? <><Loader className="w-3 h-3 animate-spin" /> Sinxronizasiya...</>
      : <><Download className="w-3 h-3" /> Yenilə</>
    }
  </button>
</div>
    </div>
  );
}