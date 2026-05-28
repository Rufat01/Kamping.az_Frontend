"use client";
import { useEffect, useRef, useState } from "react";
import { MapPin, Navigation, X, Star, Users } from "lucide-react";

const TYPE_EMOJI = {
  tent_site: "⛺", glamping: "🏕️", bungalow: "🏡",
  camp: "⛺", 
  house: "🏠", water: "💧",
  parking: "🅿️", entrance: "🚪", other: "📍",
};

const FILTERS = [
  { value: "", label: "Hamısı" },
  { value: "camp", label: "⛺ Kamp" },
  { value: "glamping", label: "🏕️ Glamping" },
  { value: "bungalow", label: "🏡 Bungalo" },
  { value: "house", label: "🏠 Ev" },
];

export default function MapClient({ locations = [], listingLocations = [] }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [selected, setSelected] = useState(null);
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
      listing_rating: parseFloat(l.rating) || 0,
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

      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      if (mapRef.current._leaflet_id) {
        return;
      }


      const map = L.map(mapRef.current).setView([40.4093, 47.5769], 7);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
      setMapReady(true);

      // Render-dən sonra ölçünü təzələ
      setTimeout(() => map.invalidateSize(), 100);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

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
          html: `<div style="background:#1B4332;border:2.5px solid ${borderColor};border-radius:50% 50% 50% 0;width:38px;height:38px;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 3px 10px rgba(0,0,0,0.25);"><span style="transform:rotate(45deg);font-size:17px;line-height:1;">${emoji}</span></div>`,
          className: "",
          iconSize: [38, 38],
          iconAnchor: [19, 38],
        });

        const marker = L.marker([lat, lng], { icon }).addTo(map);
        marker.on("click", () => setSelected(loc));
        markersRef.current.push(marker);
      });
    });
  }, [mapReady, filtered]);

  const handleNavigate = (loc) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${loc.latitude},${loc.longitude}`,
      "_blank"
    );
  };

  return (
    <>
      {/* Xəritə — birbaşa body səviyyəsində, heç bir wrapper yox */}
      <div
        ref={mapRef}
        style={{
          position: "fixed",
          top: 64,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100%",
        }}
      />

      {/* Filter bar — xəritənin üstündə */}
      <div
        style={{
          position: "fixed",
          top: 80,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
        }}
        className="flex gap-2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-2 border border-forest-100"
      >
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`whitespace-nowrap text-xs font-semibold px-4 py-2 rounded-xl transition-all ${filter === f.value
                ? "bg-forest-800 text-white"
                : "text-forest-600 hover:bg-forest-50"
              }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Məkan sayı */}
      <div
        style={{ position: "fixed", top: 140, left: 16, zIndex: 1000 }}
        className="bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-md border border-forest-100"
      >
        <span className="text-xs font-semibold text-forest-700">
          {filtered.length} məkan
        </span>
      </div>

      {/* Seçilmiş məkan paneli */}
      {selected && (
        <div
          style={{ position: "fixed", top: 80, right: 16, zIndex: 1000, width: 320 }}
          className="bg-white rounded-2xl shadow-2xl border border-forest-100 overflow-hidden"
        >
          {selected.cover_image_url ? (
            <div className="relative h-44 overflow-hidden">
              <img
                src={selected.cover_image_url}
                alt={selected.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/40 to-transparent" />
            </div>
          ) : (
            <div className="h-24 bg-forest-50 flex items-center justify-center text-4xl">
              {TYPE_EMOJI[selected.location_type] || "📍"}
            </div>
          )}

          <button
            onClick={() => setSelected(null)}
            className="absolute top-3 right-3 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
          >
            <X className="w-3.5 h-3.5 text-forest-700" />
          </button>

          <div className="p-4">
            <span className="inline-block bg-forest-50 text-forest-700 text-xs font-semibold px-2.5 py-1 rounded-full mb-2">
              {selected.location_type_display || selected.location_type}
            </span>
            <h3 className="font-display text-lg font-bold text-forest-900 mb-1 leading-tight">
              {selected.title}
            </h3>
            {selected.city && (
              <div className="flex items-center gap-1 text-forest-500 text-sm mb-3">
                <MapPin className="w-3.5 h-3.5" />
                <span>{selected.city}</span>
              </div>
            )}
            <div className="flex flex-wrap gap-3 mb-4">
              {selected.listing_rating > 0 && (
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-forest-800">{selected.listing_rating}</span>
                </div>
              )}
              {selected.listing_price && (
                <div className="text-sm font-semibold text-forest-800">
                  ₼{selected.listing_price}
                  <span className="text-forest-400 font-normal">/gecə</span>
                </div>
              )}
              {selected.max_guests && (
                <div className="flex items-center gap-1 text-forest-500 text-sm">
                  <Users className="w-3.5 h-3.5" />
                  <span>{selected.max_guests} nəfər</span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleNavigate(selected)}
                className="flex-1 flex items-center justify-center gap-2 bg-forest-800 hover:bg-forest-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-all active:scale-95"
              >
                <Navigation className="w-4 h-4" />
                Naviqasiya
              </button>
              {selected.listing_id && selected.source === "listing" && (
                <a
                  href={`/listings/${selected.listing_id}`}
                  className="flex-1 flex items-center justify-center bg-amber-500 hover:bg-amber-400 text-forest-900 text-sm font-semibold py-2.5 rounded-xl transition-all active:scale-95"
                >
                  Elana bax
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
