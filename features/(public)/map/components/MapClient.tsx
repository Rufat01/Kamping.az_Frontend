"use client";
import { useEffect, useRef, useState } from "react";
import { MapPin, Navigation, X, Star, Users } from "lucide-react";

const TYPE_EMOJI = {
  tent_site: "⛺", glamping: "🏕️", bungalow: "🏡",
  camp: "⛺", house: "🏠", water: "💧",
  parking: "🅿️", entrance: "🚪", other: "📍",
};

const FILTERS = [
  { value: "", label: "Hamısı" },
  { value: "camp", label: "⛺ Kamp" },
  { value: "tent_site", label: "⛺ Çadır" },
  { value: "glamping", label: "🏕️ Glamping" },
  { value: "bungalow", label: "🏡 Bungalo" },
  { value: "house", label: "🏠 Ev" },
];

interface WazeButtonProps {
  toLat: number;
  toLng: number;
  fromLat: number;
  fromLng: number;
}

function WazeButton({ toLat, toLng, fromLat, fromLng }: WazeButtonProps) {
  const handleWaze = (e) => {
    e.preventDefault();
    const deepLink = `waze://?ll=${toLat},${toLng}&from=${fromLat},${fromLng}&navigate=yes`;
    const webLink = `https://waze.com/ul?ll=${toLat},${toLng}&from=${fromLat},${fromLng}&navigate=yes&zoom=17`;

    // Mobile-da native Waze cəhd et, 1.5s sonra web-ə keç
    const timeout = setTimeout(() => {
      window.open(webLink, "_blank");
    }, 1500);

    window.addEventListener("blur", () => clearTimeout(timeout), { once: true });
    window.location.href = deepLink;
  };

  return (
    <button
      onClick={handleWaze}
      className="flex items-center gap-2 font-bold text-white text-xs px-4 py-2.5 rounded-xl transition-all active:scale-95 hover:opacity-90 whitespace-nowrap"
      style={{ background: "#33CCFF" }}
    >
      <svg width="16" height="16" viewBox="0 0 56 56" fill="none">
        <circle cx="28" cy="28" r="28" fill="white" fillOpacity="0.2" />
        <path d="M28 8C17 8 8 17 8 28c0 5.5 2.2 10.5 5.8 14.1L12 48l6.2-1.7C20.5 47.4 24.1 48 28 48c11 0 20-9 20-20S39 8 28 8z" fill="white" />
        <circle cx="22" cy="30" r="3" fill="#33CCFF" />
        <circle cx="34" cy="30" r="3" fill="#33CCFF" />
        <path d="M20 36c1.5 2 4.5 4 8 4s6.5-2 8-4" stroke="#33CCFF" strokeWidth="2" strokeLinecap="round" />
      </svg>
      Waze ilə get
    </button>
  );
}

import type { MapLocation, MapListing } from "@/types";

interface MapClientProps {
  locations?: MapLocation[];
  listingLocations?: MapListing[];
}

export default function MapClient({ locations = [], listingLocations = [] }: MapClientProps) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const routeLayerRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const [selectedPos, setSelectedPos] = useState({ x: 0, y: 0 });
  const [routeInfo, setRouteInfo] = useState(null);
  const [filter, setFilter] = useState("");
  const [mapReady, setMapReady] = useState(false);

  const allLocations = [
    ...listingLocations.map((l) => ({
      id: l.id, title: l.title,
      location_type: l.listing_type,
      location_type_display: l.listing_type_display,
      latitude: parseFloat(l.latitude),
      longitude: parseFloat(l.longitude),
      cover_image_url: l.cover_image,
      listing_id: l.id,
      listing_price: l.price_per_night,
      listing_rating: l.rating || 0,
      max_guests: l.max_guests,
      city: l.city,
      source: "listing",
    })),
    ...locations.map((l) => ({
      ...l,
      latitude: parseFloat(l.latitude),
      longitude: parseFloat(l.longitude),
      source: "admin",
    })),
  ];

  const filtered = filter
    ? allLocations.filter((l) => l.location_type === filter)
    : allLocations;

  // 1. Xəritəni qur
  useEffect(() => {
    if (mapInstanceRef.current) return;
    if (!mapRef.current) return;

    import("leaflet").then((L) => {
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      if (mapRef.current._leaflet_id) return;

      const map = L.map(mapRef.current).setView([40.4093, 47.5769], 7);

      const createOfflineTileLayer = async () => {
        const localforage = (await import("localforage")).default;

        const OfflineTileLayer = L.TileLayer.extend({
          createTile(coords, done) {
            const tile = document.createElement("img");
            tile.alt = "";
            tile.setAttribute("role", "presentation");

            const self = this;

            // Tile tapılmadıqda parent tile-ı kəs və böyüt
            const tryTile = async (z, x, y) => {
              const key = `tile_${z}_${x}_${y}`;
              const blob = await localforage.getItem(key);

              if (blob) {
                const url = URL.createObjectURL(blob as Blob);

                if (z === coords.z) {
                  // Dəqiq tile tapıldı
                  tile.onload = () => { URL.revokeObjectURL(url); done(null, tile); };
                  tile.onerror = () => done(new Error("error"), tile);
                  tile.src = url;
                } else {
                  // Parent tile — Canvas ilə kəs və böyüt
                  const img = new Image();
                  img.onload = () => {
                    URL.revokeObjectURL(url);
                    const canvas = document.createElement("canvas");
                    canvas.width = 256;
                    canvas.height = 256;
                    const ctx = canvas.getContext("2d");
                    const zDiff = coords.z - z;
                    const factor = Math.pow(2, zDiff);
                    const srcSize = 256 / factor;
                    const srcX = (coords.x % factor) * srcSize;
                    const srcY = (coords.y % factor) * srcSize;
                    ctx.drawImage(img, srcX, srcY, srcSize, srcSize, 0, 0, 256, 256);
                    tile.onload = () => done(null, tile);
                    tile.src = canvas.toDataURL();
                  };
                  img.onerror = () => done(new Error("error"), tile);
                  img.src = url;
                }
              } else if (!navigator.onLine && z > 8) {
                // Offline — bir zoom aşağı cəhd et
                await tryTile(z - 1, Math.floor(x / 2), Math.floor(y / 2));
              } else {
                // Online — normal yüklə
                const onlineUrl = self.getTileUrl(coords);
                tile.onload = () => done(null, tile);
                tile.onerror = () => done(new Error("error"), tile);
                tile.src = onlineUrl;
              }
            };

            tryTile(coords.z, coords.x, coords.y).catch(() => {
              const onlineUrl = self.getTileUrl(coords);
              tile.onload = () => done(null, tile);
              tile.onerror = () => done(new Error("error"), tile);
              tile.src = onlineUrl;
            });

            return tile;
          }
        });

        new (OfflineTileLayer as new (url: string, options: object) => L.TileLayer)("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap",
          maxZoom: 19,
        }).addTo(map);
      };
      createOfflineTileLayer();

      map.on("click", () => setSelected(null));
      mapInstanceRef.current = map;
      setTimeout(() => map.invalidateSize(), 100);
      setMapReady(true);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 2. Markerlər
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;
    import("leaflet").then((L) => {
      const map = mapInstanceRef.current;
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      filtered.forEach((loc) => {
        const lat = loc.latitude;
        const lng = loc.longitude;
        if (!lat || !lng || isNaN(lat) || isNaN(lng)) return;
        const emoji = TYPE_EMOJI[loc.location_type] || "📍";
        const borderColor = loc.source === "listing" ? "#f59e0b" : "#4ade80";
        const icon = L.divIcon({
          html: `<div style="background:#1B4332;border:2.5px solid ${borderColor};border-radius:50% 50% 50% 0;width:36px;height:36px;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 3px 10px rgba(0,0,0,0.25);"><span style="transform:rotate(45deg);font-size:16px;line-height:1;">${emoji}</span></div>`,
          className: "",
          iconSize: [36, 36],
          iconAnchor: [18, 36],
        });
        const marker = L.marker([lat, lng], { icon }).addTo(map);
        marker.on("click", (e) => {
          L.DomEvent.stopPropagation(e);
          const point = map.latLngToContainerPoint([lat, lng]);
          setSelectedPos({ x: point.x, y: point.y });
          setSelected(loc);
          setRouteInfo(null);

          if (routeLayerRef.current) {
            map.removeLayer(routeLayerRef.current);
            routeLayerRef.current = null;
          }

        });
        markersRef.current.push(marker);
      });
    });
  }, [mapReady, filtered]);

  // 3. Live location
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;
    if (!navigator.geolocation) return;
    import("leaflet").then((L) => {
      const map = mapInstanceRef.current;
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          if (!mapInstanceRef.current) return;
          const { latitude: lat, longitude: lng } = pos.coords;
          if (map._userMarker) {
            map._userMarker.setLatLng([lat, lng]);
            map._userCircle.setLatLng([lat, lng]);
          } else {
            map._userMarker = L.marker([lat, lng], {
              icon: L.divIcon({
                html: `<div style="position:relative;width:20px;height:20px;"><div style="position:absolute;inset:0;background:#3b82f6;border:3px solid white;border-radius:50%;box-shadow:0 0 10px rgba(59,130,246,0.5);"></div><div style="position:absolute;inset:-8px;background:rgba(59,130,246,0.15);border-radius:50%;animation:livePulse 2s ease-out infinite;"></div></div>`,
                className: "",
                iconSize: [20, 20],
                iconAnchor: [10, 10],
              }),
              zIndexOffset: 1000,
            }).addTo(map);
            map._userCircle = L.circle([lat, lng], {
              radius: pos.coords.accuracy,
              color: "#3b82f6",
              fillColor: "#3b82f6",
              fillOpacity: 0.08,
              weight: 1,
            }).addTo(map);
            map._userMarker.bindPopup("📍 Siz buradasınız").openPopup();
          }
        },
        () => { },
        { enableHighAccuracy: true, maximumAge: 10000 }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    });
  }, [mapReady]);

  const getPanelStyle = (): React.CSSProperties => {
    const PANEL_W = 300;
    const PANEL_H = 320;
    const MARGIN = 12;
    const NAVBAR_H = 64;
    const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
    const vh = typeof window !== "undefined" ? window.innerHeight : 800;
    const isMobile = vw < 640;
    if (isMobile) {
      return { position: "fixed", left: MARGIN, right: MARGIN, bottom: MARGIN, zIndex: 900, width: "auto" };
    }
    let left = selectedPos.x + MARGIN;
    let top = selectedPos.y - PANEL_H / 2;
    if (left + PANEL_W > vw - MARGIN) left = selectedPos.x - PANEL_W - MARGIN;
    if (left < MARGIN) left = MARGIN;
    if (top < NAVBAR_H + MARGIN) top = NAVBAR_H + MARGIN;
    if (top + PANEL_H > vh - MARGIN) top = vh - PANEL_H - MARGIN;
    return { position: "fixed", left, top, width: PANEL_W, zIndex: 900 };
  };

  const handleNavigate = async (loc) => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (routeLayerRef.current) {
      map.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }

    const userMarker = map._userMarker;
    if (!userMarker) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${loc.latitude},${loc.longitude}`, "_blank");
      return;
    }

    setSelected(null);
    setRouteInfo({ loading: true });

    setRouteInfo({ loading: true });

    const { lat: fromLat, lng: fromLng } = userMarker.getLatLng();
    const toLat = loc.latitude;
    const toLng = loc.longitude;
    const cacheKey = `route_${fromLat.toFixed(4)}_${fromLng.toFixed(4)}_${toLat}_${toLng}`;
    const localforage = (await import("localforage")).default;

    const drawRoute = async (coords, distance, duration, fromCache = false) => {
      const L = (await import("leaflet")).default;
      routeLayerRef.current = L.polyline(coords, {
        color: "#2D4A33",
        weight: 5,
        opacity: 0.85,
        lineCap: "round",
        lineJoin: "round",
      }).addTo(map);
      map.fitBounds(routeLayerRef.current.getBounds(), { padding: [60, 60] });
      setRouteInfo({ distance, duration, fromCache, toLat, toLng, fromLat, fromLng });
    };

    try {
      const res = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?overview=full&geometries=geojson`
      );
      const data = await res.json();
      if (data.routes?.length > 0) {
        const coords = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
        const distance = (data.routes[0].distance / 1000).toFixed(1);
        const duration = Math.round(data.routes[0].duration / 60);
        await localforage.setItem(cacheKey, { coords, distance, duration });
        await drawRoute(coords, distance, duration, false);
      }
    } catch {
      const cached = await localforage.getItem<{ coords: number[][]; distance: string; duration: number }>(cacheKey);
      if (cached) {
        await drawRoute(cached.coords, cached.distance, cached.duration, true);
      } else {
        setRouteInfo({ noCache: true });
      }
    }
  };

  const clearRoute = () => {
    if (routeLayerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }
    setRouteInfo(null);
  };

  return (
    <>
      {/* Xəritə */}
      <div ref={mapRef} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, width: "100%" }} />

      {/* Filter bar */}
      <div
        style={{ position: "fixed", top: 64, left: "50%", transform: "translateX(-50%)", zIndex: 900 }}
        className="flex gap-1 bg-white/95 backdrop-blur-sm rounded-xl shadow-md px-1.5 py-1.5 border border-stone-200 max-w-[95vw] overflow-x-auto"
      >
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`whitespace-nowrap text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${filter === f.value ? "bg-[#2D4A33] text-white" : "text-stone-600 hover:bg-stone-100"
              }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Məkan sayı */}
      <div
        style={{ position: "fixed", top: 116, left: 12, zIndex: 900 }}
        className="bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1.5 shadow-sm border border-stone-200"
      >
        <span className="text-xs font-semibold text-stone-600">{filtered.length} məkan</span>
      </div>

      {/* Seçilmiş məkan paneli */}
      {selected && (
        <div style={getPanelStyle()} className="bg-white rounded-2xl shadow-2xl border border-stone-100 overflow-hidden">
          {selected.cover_image_url ? (
            <div className="relative h-36 overflow-hidden">
              <img src={selected.cover_image_url} alt={selected.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          ) : (
            <div className="h-20 bg-stone-50 flex items-center justify-center text-3xl">
              {TYPE_EMOJI[selected.location_type] || "📍"}
            </div>
          )}
          <button
            onClick={() => { setSelected(null); clearRoute(); }}
            className="absolute top-2.5 right-2.5 w-7 h-7 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
          >
            <X className="w-3.5 h-3.5 text-stone-700" />
          </button>
          <div className="p-4">
            <span className="inline-block bg-stone-50 text-stone-700 text-xs font-semibold px-2.5 py-1 rounded-full mb-2 border border-stone-200">
              {selected.location_type_display || selected.location_type}
            </span>
            <h3 className="font-display text-base font-bold text-[#1F2D24] mb-1 leading-tight">{selected.title}</h3>
            {selected.city && (
              <div className="flex items-center gap-1 text-stone-500 text-xs mb-3">
                <MapPin className="w-3 h-3" />
                <span>{selected.city}</span>
              </div>
            )}
            <div className="flex flex-wrap gap-2 mb-3">
              {selected.listing_rating > 0 && (
                <div className="flex items-center gap-1 text-xs">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-stone-700">{selected.listing_rating}</span>
                </div>
              )}
              {selected.listing_price && (
                <div className="text-xs font-semibold text-stone-700">
                  ₼{selected.listing_price}<span className="text-stone-400 font-normal">/gecə</span>
                </div>
              )}
              {selected.max_guests && (
                <div className="flex items-center gap-1 text-stone-500 text-xs">
                  <Users className="w-3 h-3" />
                  <span>{selected.max_guests} nəfər</span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleNavigate(selected)}
                className="flex-1 flex items-center justify-center gap-1.5 text-white text-xs font-semibold py-2.5 rounded-xl transition-all active:scale-95"
                style={{ background: "#2D4A33" }}
              >
                <Navigation className="w-3.5 h-3.5" />
                Naviqasiya
              </button>
              {selected.listing_id && selected.source === "listing" && (
                <a
                  href={`/listings/${selected.listing_id}`}
                  className="flex-1 flex items-center justify-center bg-amber-500 hover:bg-amber-400 text-stone-900 text-xs font-semibold py-2.5 rounded-xl transition-all active:scale-95"
                >
                  Elana bax
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Marşrut info paneli */}
      {routeInfo && (
        <div
          style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 900, boxShadow: "0 8px 30px -5px rgba(45,74,51,0.2)" }}
          className="bg-white rounded-2xl px-5 py-3 flex items-center gap-3"
        >
          {routeInfo.loading ? (
            // Loading
            <div className="flex items-center gap-3 py-1">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{ background: "#2D4A33", animationDelay: `${i * 0.15}s`, animationDuration: "0.8s" }}
                  />
                ))}
              </div>
              <p className="text-sm font-semibold text-[#1F2D24]">Marşrut hesablanır...</p>
            </div>
          ) : routeInfo.noCache ? (
            // Cache yoxdur
            <div className="flex items-center gap-3">
              <div>
                <p className="font-display text-sm font-bold text-[#A0613B]">Marşrut tapılmadı</p>
                <p className="text-[#4A6B4F]/60 text-xs mt-0.5">Online ikən bu marşrutu bir dəfə açın</p>
              </div>
              <button onClick={clearRoute} className="w-7 h-7 rounded-full bg-[#FAF6F0] flex items-center justify-center ml-2">
                <X className="w-3.5 h-3.5 text-[#4A6B4F]" />
              </button>
            </div>
          ) : (
            // Marşrut detalları + Waze
            <>
              {routeInfo.fromCache && (
                <span className="text-[10px] font-bold text-[#4A6B4F] bg-[#4A6B4F]/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                  Cache
                </span>
              )}
              <div className="text-center">
                <p className="font-display text-xl font-bold text-[#1F2D24]">{routeInfo.distance} km</p>
                <p className="text-[#4A6B4F]/60 text-xs">məsafə</p>
              </div>
              <div className="w-px h-8 bg-[#E8E5D8] shrink-0" />
              <div className="text-center">
                <p className="font-display text-xl font-bold text-[#1F2D24]">{routeInfo.duration} dəq</p>
                <p className="text-[#4A6B4F]/60 text-xs">vaxt</p>
              </div>
              <div className="w-px h-8 bg-[#E8E5D8] shrink-0" />
              <WazeButton
                toLat={routeInfo.toLat}
                toLng={routeInfo.toLng}
                fromLat={routeInfo.fromLat}
                fromLng={routeInfo.fromLng}
              />
              <button onClick={clearRoute} className="w-7 h-7 rounded-full bg-[#FAF6F0] flex items-center justify-center shrink-0">
                <X className="w-3.5 h-3.5 text-[#4A6B4F]" />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
