"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, MapPin, Calendar, Users, ChevronDown } from "lucide-react";

const CITIES = [
  "Şəki", "Qəbələ", "Göygöl", "Lerik", "Lənkəran",
  "Naxçıvan", "İsmayıllı", "Lahıc", "Xınalıq", "Şahdağ",
];

const LISTING_TYPES = [
  { value: "", label: "Hamısı" },
  { value: "tent_site", label: "Çadır yeri" },
  { value: "bungalow", label: "Bungalo" },
  { value: "glamping", label: "Glamping" },
  { value: "house", label: "Ev" },
];

export default function Hero() {
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [guests, setGuests] = useState(1);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1800&q=85"
          alt="Azərbaycan Təbiəti"
          className="w-full h-full object-cover"
        />
        {/* Multi-layer overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950/70 via-forest-900/50 to-forest-950/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950/30 via-transparent to-transparent" />
      </div>

      {/* Floating badge */}
      <div
        className="relative z-10 mb-6 animate-fade-up"
        style={{ animationDelay: "0.2s" }}
      >
        <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-full">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse-slow" />
          Azərbaycanın ən gözəl 200+ kamp məkanı
        </span>
      </div>

      {/* Headline */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <h1
          className="animate-fade-up font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] tracking-tight mb-6"
          style={{ animationDelay: "0.35s" }}
        >
          Təbiətin qoynunda{" "}
          <span className="text-amber-400 italic">istirahət et</span>
        </h1>
        <p
          className="animate-fade-up text-white/70 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ animationDelay: "0.5s" }}
        >
          Azərbaycanda ən gözəl kamp yerlərini, glamping otaqlarını və 
          bungalolarını kəşf edin. Unudulmaz bir macəra sizi gözləyir.
        </p>

        {/* Search Box */}
        <div
          className="animate-fade-up max-w-3xl mx-auto"
          style={{ animationDelay: "0.65s" }}
        >
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2 shadow-2xl shadow-forest-950/40 border border-white/30">
            <div className="flex flex-col sm:flex-row gap-2">
              {/* City */}
              <div className="flex-1 flex items-center gap-3 bg-cream/60 hover:bg-cream/90 transition-colors rounded-xl px-4 py-3 cursor-pointer group">
                <MapPin className="w-4 h-4 text-forest-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <label className="block text-xs font-semibold text-forest-800/60 uppercase tracking-wider mb-0.5">
                    Şəhər
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-transparent text-forest-900 text-sm font-medium focus:outline-none cursor-pointer"
                  >
                    <option value="">Hər yer</option>
                    {CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Type */}
              <div className="flex-1 flex items-center gap-3 bg-cream/60 hover:bg-cream/90 transition-colors rounded-xl px-4 py-3 cursor-pointer">
                <Calendar className="w-4 h-4 text-forest-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <label className="block text-xs font-semibold text-forest-800/60 uppercase tracking-wider mb-0.5">
                    Növ
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-transparent text-forest-900 text-sm font-medium focus:outline-none cursor-pointer"
                  >
                    {LISTING_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Guests */}
              <div className="flex items-center gap-3 bg-cream/60 hover:bg-cream/90 transition-colors rounded-xl px-4 py-3">
                <Users className="w-4 h-4 text-forest-600 shrink-0" />
                <div>
                  <label className="block text-xs font-semibold text-forest-800/60 uppercase tracking-wider mb-0.5">
                    Qonaq
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      className="w-5 h-5 rounded-full border border-forest-300 text-forest-600 flex items-center justify-center text-xs hover:bg-forest-100 transition-colors"
                    >−</button>
                    <span className="text-sm font-semibold text-forest-900 w-4 text-center">{guests}</span>
                    <button
                      onClick={() => setGuests(Math.min(20, guests + 1))}
                      className="w-5 h-5 rounded-full border border-forest-300 text-forest-600 flex items-center justify-center text-xs hover:bg-forest-100 transition-colors"
                    >+</button>
                  </div>
                </div>
              </div>

              {/* Search CTA */}
              <Link
                href={`/listings?city=${city}&listing_type=${type}&guests=${guests}`}
                className="flex items-center justify-center gap-2 bg-forest-800 hover:bg-forest-700 text-white font-semibold px-7 py-3 rounded-xl transition-all duration-200 hover:shadow-lg active:scale-95 whitespace-nowrap"
              >
                <Search className="w-4 h-4" />
                <span>Axtar</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/40 animate-bounce">
        <span className="text-xs tracking-widest uppercase">Kəşf et</span>
        <ChevronDown size={16} />
      </div>
    </section>
  );
}
