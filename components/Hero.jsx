"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, MapPin, Users, Compass } from "lucide-react";

const CITIES = ["Şəki", "Qəbələ", "Göygöl", "Lerik", "Lənkəran", "Naxçıvan", "İsmayıllı", "Lahıc"];
const TYPES = [
  { value: "", label: "Hamısı" },
  { value: "tent_site", label: "Çadır" },
  { value: "bungalow", label: "Bunqalo" },
  { value: "glamping", label: "Qlampinq" },
  { value: "house", label: "Ev" },
];

export default function Hero() {
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [guests, setGuests] = useState(1);

  return (
    <section className="relative min-h-screen overflow-hidden" style={{ background: "#1A3A2E" }}>

      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1920&q=85"
          alt="Azerbaycan Tebiet"
          className="w-full h-full object-cover"
        />
        {/* Layered overlays */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(180deg, rgba(26,58,46,0.4) 0%, rgba(26,58,46,0.3) 40%, rgba(26,58,46,0.85) 100%)"
        }} />
        {/* Sunset glow */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 70% 30%, rgba(212,165,116,0.25) 0%, transparent 50%)"
        }} />
      </div>

      {/* Decorative floating leaves — subtle, organic */}
      <svg className="absolute top-24 left-6 w-12 h-12 opacity-20 animate-float-slow" viewBox="0 0 64 64" fill="none">
        <path d="M32 8 C40 16, 48 28, 32 56 C16 28, 24 16, 32 8 Z" fill="#D4A574" />
        <path d="M32 8 L32 56" stroke="#1A3A2E" strokeWidth="1" opacity="0.3" />
      </svg>
      <svg className="absolute top-40 right-12 w-10 h-10 opacity-15 animate-float" viewBox="0 0 64 64" fill="none">
        <path d="M32 8 C40 16, 48 28, 32 56 C16 28, 24 16, 32 8 Z" fill="#FAF6F0" />
      </svg>
      <svg className="absolute bottom-48 left-12 w-14 h-14 opacity-10 animate-float-slow" viewBox="0 0 64 64" fill="none" style={{ transform: "rotate(45deg)" }}>
        <path d="M32 8 C40 16, 48 28, 32 56 C16 28, 24 16, 32 8 Z" fill="#D4A574" />
      </svg>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto w-full pt-24 pb-16">

        {/* Compass mark */}
        <div className="flex items-center gap-3 mb-6 animate-fade-in">
          <Compass className="w-5 h-5 text-[#D4A574] animate-rotation" strokeWidth={1.5} />
          <span className="text-[#D4A574] text-xs font-semibold tracking-[0.25em] uppercase">
            41.3°N · 47.7°E · Azərbaycan
          </span>
        </div>

        {/* Headline — center stage */}
        <h1 className="font-display font-bold text-[#FAF6F0] leading-[0.95] tracking-tight mb-6"
          style={{ fontSize: "clamp(3rem, 8.5vw, 8rem)" }}>
          Təbiətin<br />
          <span className="inline-block relative">
            <span style={{ color: "#D4A574", fontStyle: "italic" }}>nəfəsini</span>
            {/* underline swoosh */}
            <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 300 12" preserveAspectRatio="none">
              <path d="M0,8 Q75,2 150,6 T300,4" stroke="#D4A574" strokeWidth="2" fill="none" opacity="0.6" />
            </svg>
          </span><br />
          al
        </h1>

        <p className="text-[#FAF6F0]/60 text-base sm:text-lg max-w-md leading-relaxed mb-10 font-light">
        Meşə cığırlarında, dağ ətəklərində, göl kənarında... Azərbaycanda 200+ unikal kamp məkanı sizi gözləyir.
          
        </p>

        {/* Search — organic, paper-like */}
        <div className="relative max-w-3xl">
          {/* Paper backdrop */}
          <div className="absolute inset-0 rounded-3xl transform rotate-[-0.5deg]"
            style={{ background: "#FAF6F0", boxShadow: "0 20px 60px -10px rgba(0,0,0,0.3)" }} />

          <div className="relative bg-[#FAF6F0] rounded-3xl p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row gap-2">

              {/* City */}
              <div className="flex-1 flex items-center gap-2.5 hover:bg-[#E8E5D8]/50 transition-colors rounded-2xl px-4 py-3">
                <MapPin className="w-4 h-4 text-[#4A6B4F] shrink-0" strokeWidth={1.5} />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-[#4A6B4F] uppercase tracking-widest mb-0.5">Yer</p>
                  <select value={city} onChange={e => setCity(e.target.value)}
                    className="w-full bg-transparent text-[#1F2D24] text-sm font-semibold focus:outline-none cursor-pointer">
                    <option value="">Hər yer</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Divider — dotted nature feel */}
              <div className="hidden sm:flex flex-col justify-center px-1">
                <div className="w-px h-10 border-l border-dashed border-[#E8E5D8]" />
              </div>

              {/* Type */}
              <div className="flex-1 flex items-center gap-2.5 hover:bg-[#E8E5D8]/50 transition-colors rounded-2xl px-4 py-3">
                <span className="text-base shrink-0">🏕️</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-[#4A6B4F] uppercase tracking-widest mb-0.5">Təcrübə</p>
                  <select value={type} onChange={e => setType(e.target.value)}
                    className="w-full bg-transparent text-[#1F2D24] text-sm font-semibold focus:outline-none cursor-pointer">
                    {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="hidden sm:flex flex-col justify-center px-1">
                <div className="w-px h-10 border-l border-dashed border-[#E8E5D8]" />
              </div>

              {/* Guests */}
              <div className="flex items-center gap-2.5 hover:bg-[#E8E5D8]/50 transition-colors rounded-2xl px-4 py-3">
                <Users className="w-4 h-4 text-[#4A6B4F] shrink-0" strokeWidth={1.5} />
                <div>
                  <p className="text-[10px] font-bold text-[#4A6B4F] uppercase tracking-widest mb-0.5">Qrup</p>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setGuests(Math.max(1, guests - 1))}
                      className="w-5 h-5 rounded-full border border-[#4A6B4F]/30 text-[#4A6B4F] text-xs flex items-center justify-center hover:bg-[#4A6B4F]/10 transition-colors">
                      −
                    </button>
                    <span className="text-sm font-bold text-[#1F2D24] w-4 text-center">{guests}</span>
                    <button onClick={() => setGuests(Math.min(20, guests + 1))}
                      className="w-5 h-5 rounded-full border border-[#4A6B4F]/30 text-[#4A6B4F] text-xs flex items-center justify-center hover:bg-[#4A6B4F]/10 transition-colors">
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <Link href={`/listings?city=${city}&listing_type=${type}&guests=${guests}`}
                className="flex items-center justify-center gap-2 text-white font-bold px-6 py-3 rounded-2xl transition-all active:scale-95 whitespace-nowrap text-sm shadow-lg"
                style={{ background: "#2D4A33" }}>
                <Search className="w-4 h-4" />
                <span>Macəra</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats line */}
        <div className="flex flex-wrap items-center gap-6 sm:gap-10 mt-10 text-[#FAF6F0]/40">
          {[
            ["200+", "məkan"],
            ["2400+", "macəra"],
            ["4.8★", "reytinq"],
          ].map(([n, l]) => (
            <div key={l} className="flex items-baseline gap-2">
              <span className="font-display text-2xl sm:text-3xl font-bold text-[#FAF6F0]">{n}</span>
              <span className="text-xs uppercase tracking-widest">{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom curved divider — hill silhouette */}
      <svg className="absolute bottom-0 left-0 w-full pointer-events-none" viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ height: "60px" }}>
        <path d="M0,80 Q240,40 480,60 T960,55 T1440,70 L1440,120 L0,120 Z" fill="#FAF6F0" />
      </svg>
    </section>
  );
}
