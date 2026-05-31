"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useState, useRef } from "react";
import { Search, X } from "lucide-react";

const TYPES = [
  { value: "", label: "Hamısı" },
  { value: "tent_site", label: "⛺ Çadır" },
  { value: "glamping", label: "🏕️ Glamping" },
  { value: "bungalow", label: "🏡 Bungalo" },
  { value: "house", label: "🏠 Ev" },
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

  // URL-i yenilə
  const updateFilter = useCallback((key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, router, pathname]);

  // Axtarış — real-time debounce (400ms)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateFilter("search", searchInput);
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [searchInput]);

  // Axtarış düyməsi — dərhal
  const handleSearchSubmit = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    updateFilter("search", searchInput);
  };

  // Bütün filterləri sıfırla
  const clearAll = useCallback(() => {
    setSearchInput("");
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  const activeCount = [currentType, currentCity, currentMinPrice, currentMaxPrice, currentGuests, currentSearch]
    .filter(Boolean).length;

  return (
    <div className="bg-white border-b border-forest-100 sticky top-16 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">

        {/* Axtarış — tam genişlik, üstdə */}
        <div className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400" />
            <input
              type="text"
              placeholder="Elan axtar..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-forest-200 rounded-xl focus:outline-none focus:border-forest-400 bg-forest-50/50"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-forest-300 hover:text-forest-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {/* Axtarış düyməsi */}
          <button
            onClick={handleSearchSubmit}
            className="flex items-center gap-2 bg-forest-800 hover:bg-forest-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all active:scale-95"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Axtar</span>
          </button>
        </div>

        {/* Filterlər — horizontal scroll mobiledə */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">

          {/* Növ */}
          <div className="flex items-center gap-1 shrink-0">
            {TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => updateFilter("listing_type", t.value)}
                className={`whitespace-nowrap text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${
                  currentType === t.value
                    ? "bg-forest-800 text-white shadow-sm"
                    : "bg-forest-50 text-forest-600 hover:bg-forest-100 border border-forest-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="w-px h-5 bg-forest-200 shrink-0" />

          {/* Şəhər */}
          <select
            value={currentCity}
            onChange={(e) => updateFilter("city", e.target.value)}
            className="shrink-0 text-xs border border-forest-200 rounded-xl px-3 py-1.5 bg-forest-50/50 focus:outline-none focus:border-forest-400 text-forest-700 cursor-pointer"
          >
            <option value="">Bütün şəhərlər</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Qiymət */}
          <div className="flex items-center gap-1 shrink-0">
            <input
              type="number"
              placeholder="Min ₼"
              defaultValue={currentMinPrice}
              onBlur={(e) => updateFilter("min_price", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && updateFilter("min_price", e.target.value)}
              className="w-20 text-xs border border-forest-200 rounded-xl px-3 py-1.5 bg-forest-50/50 focus:outline-none focus:border-forest-400"
            />
            <span className="text-forest-300 text-xs shrink-0">—</span>
            <input
              type="number"
              placeholder="Max ₼"
              defaultValue={currentMaxPrice}
              onBlur={(e) => updateFilter("max_price", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && updateFilter("max_price", e.target.value)}
              className="w-20 text-xs border border-forest-200 rounded-xl px-3 py-1.5 bg-forest-50/50 focus:outline-none focus:border-forest-400"
            />
          </div>

          {/* Qonaq */}
          <select
            value={currentGuests}
            onChange={(e) => updateFilter("guests", e.target.value)}
            className="shrink-0 text-xs border border-forest-200 rounded-xl px-3 py-1.5 bg-forest-50/50 focus:outline-none focus:border-forest-400 text-forest-700 cursor-pointer"
          >
            <option value="">Qonaq sayı</option>
            {["1","2","3","4","5","6","8","10"].map((g) => (
              <option key={g} value={g}>{g}+ nəfər</option>
            ))}
          </select>

          {/* Sıfırla */}
          {activeCount > 0 && (
            <button
              onClick={clearAll}
              className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl transition-all border border-red-100"
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