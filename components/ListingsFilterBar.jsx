"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useState, useRef } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";

const TYPES = [
  { value: "", label: "Hamısı", emoji: "✦" },
  { value: "tent_site", label: "Cadir", emoji: "⛺" },
  { value: "glamping", label: "Glamping", emoji: "🏕️" },
  { value: "bungalow", label: "Bungalo", emoji: "🏡" },
  { value: "house", label: "Ev", emoji: "🏠" },
];

const CITIES = [
  "Şəki", "Qəbələ", "Göygöl", "Lerik",
  "Lənkəran", "Naxçıvan", "İsmayıllı", "Lahıc",
];

export default function ListingsFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentType = searchParams.get("listing_type") || "";
  const currentCity = searchParams.get("city") || "";
  const currentMinPrice = searchParams.get("min_price") || "";
  const currentMaxPrice = searchParams.get("max_price") || "";
  const currentGuests = searchParams.get("guests") || "";
  const currentSearch = searchParams.get("search") || "";

  const [searchInput, setSearchInput] = useState(currentSearch);
  const debounceRef = useRef(null);

  const updateFilter = useCallback((key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, router, pathname]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateFilter("search", searchInput);
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [searchInput]);

  const handleSearchSubmit = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    updateFilter("search", searchInput);
  };

  const clearAll = useCallback(() => {
    setSearchInput("");
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  const activeCount = [currentType, currentCity, currentMinPrice, currentMaxPrice, currentGuests, currentSearch]
    .filter(Boolean).length;

  return (
    <div className="sticky top-16 z-40 border-b" style={{ background: "#FAF6F0", borderColor: "#E8E5D8" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

        {/* Search row */}
        <div className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A6B4F]" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Mekan adi, seher və ya açar söz..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
              className="w-full pl-11 pr-10 py-3 text-sm rounded-2xl bg-white border border-[#E8E5D8] focus:outline-none focus:border-[#4A6B4F] text-[#1F2D24] placeholder:text-[#4A6B4F]/50 transition-colors"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#E8E5D8] hover:bg-[#D4A574]/30 flex items-center justify-center transition-colors"
              >
                <X className="w-3 h-3 text-[#4A6B4F]" />
              </button>
            )}
          </div>

          <button
            onClick={handleSearchSubmit}
            className="flex items-center gap-2 text-white font-bold text-sm px-5 sm:px-6 py-3 rounded-2xl transition-all active:scale-95 hover:shadow-lg"
            style={{ background: "#2D4A33" }}
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Axtar</span>
          </button>
        </div>

        {/* Filter chips row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">

          {/* Type chips */}
          <div className="flex items-center gap-1.5 shrink-0">
            {TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => updateFilter("listing_type", t.value)}
                className={`flex items-center gap-1.5 whitespace-nowrap text-xs font-bold px-3.5 py-2 rounded-full transition-all ${
                  currentType === t.value
                    ? "text-white shadow-md"
                    : "bg-white text-[#4A6B4F] border border-[#E8E5D8] hover:border-[#4A6B4F]"
                }`}
                style={currentType === t.value ? { background: "#2D4A33" } : {}}
              >
                <span>{t.emoji}</span>
                {t.label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-[#E8E5D8] shrink-0 mx-1" />

          {/* City */}
          <select
            value={currentCity}
            onChange={(e) => updateFilter("city", e.target.value)}
            className="shrink-0 text-xs font-semibold border border-[#E8E5D8] rounded-full px-4 py-2 bg-white focus:outline-none focus:border-[#4A6B4F] text-[#4A6B4F] cursor-pointer hover:border-[#4A6B4F] transition-colors"
          >
            <option value="">📍 Bütün şəhərlər</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Price */}
          <div className="flex items-center gap-1 shrink-0 bg-white border border-[#E8E5D8] rounded-full px-3 py-1.5 hover:border-[#4A6B4F] transition-colors">
            <span className="text-[10px] font-bold text-[#4A6B4F]/60 uppercase tracking-wider pr-1">₼</span>
            <input
              type="number"
              placeholder="Min"
              defaultValue={currentMinPrice}
              onBlur={(e) => updateFilter("min_price", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && updateFilter("min_price", e.target.value)}
              className="w-14 text-xs font-semibold bg-transparent focus:outline-none text-[#1F2D24]"
            />
            <span className="text-[#4A6B4F]/30 text-xs">—</span>
            <input
              type="number"
              placeholder="Max"
              defaultValue={currentMaxPrice}
              onBlur={(e) => updateFilter("max_price", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && updateFilter("max_price", e.target.value)}
              className="w-14 text-xs font-semibold bg-transparent focus:outline-none text-[#1F2D24]"
            />
          </div>

          {/* Guests */}
          <select
            value={currentGuests}
            onChange={(e) => updateFilter("guests", e.target.value)}
            className="shrink-0 text-xs font-semibold border border-[#E8E5D8] rounded-full px-4 py-2 bg-white focus:outline-none focus:border-[#4A6B4F] text-[#4A6B4F] cursor-pointer hover:border-[#4A6B4F] transition-colors"
          >
            <option value="">👥 Qonaq sayı</option>
            {["1","2","3","4","5","6","8","10"].map((g) => (
              <option key={g} value={g}>{g}+ nəfər</option>
            ))}
          </select>

          {/* Clear */}
          {activeCount > 0 && (
            <button
              onClick={clearAll}
              className="shrink-0 flex items-center gap-1.5 text-xs font-bold text-white px-4 py-2 rounded-full transition-all hover:shadow-md"
              style={{ background: "#A0613B" }}
            >
              <X className="w-3 h-3" />
              Sıfırla ({activeCount})
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
