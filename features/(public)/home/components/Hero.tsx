"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, MapPin, Users, ChevronDown, Check, Compass, X } from "lucide-react";

const CITIES = [
  { value: "Şəki", label: "Şəki" },
  { value: "Qəbələ", label: "Qəbələ" },
  { value: "Göygöl", label: "Göygöl" },
  { value: "Lerik", label: "Lerik" },
  { value: "Lənkəran", label: "Lənkəran" },
  { value: "Naxçıvan", label: "Naxçıvan" },
  { value: "İsmayıllı", label: "İsmayıllı" },
  { value: "Lahıc", label: "Lahıc" },
  { value: "Xınalıq", label: "Xınalıq" },
  { value: "Şahdağ", label: "Şahdağ" },
];

const TYPES = [
  { value: "", label: "Hamısı", emoji: "🗺️" },
  { value: "tent_site", label: "Çadır yeri", emoji: "⛺" },
  { value: "bungalow", label: "Bunqalo", emoji: "🏡" },
  { value: "glamping", label: "Qlampinq", emoji: "🏕️" },
  { value: "house", label: "Ev", emoji: "🏠" },
];

function Dropdown({ value, onChange, options, placeholder, icon: Icon }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative flex-1 min-w-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2.5 hover:bg-[#E8E5D8]/50 transition-colors rounded-2xl px-4 py-3 text-left"
      >
        <Icon className="w-4 h-4 text-[#4A6B4F] shrink-0" strokeWidth={1.5} />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-[#4A6B4F] uppercase tracking-widest mb-0.5">
            {placeholder}
          </p>
          <p className="text-[#1F2D24] text-sm font-semibold truncate">
            {selected
              ? (selected.emoji ? `${selected.emoji} ${selected.label}` : selected.label)
              : "Seçin..."}
          </p>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-[#4A6B4F]/50 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown menu */}
      {open && (
        <div
          className="absolute top-full left-0 mt-2 bg-white rounded-2xl overflow-hidden"
          style={{
            zIndex: 9999,
            width: "max(100%, 200px)",
            boxShadow: "0 20px 40px -10px rgba(45,74,51,0.2), 0 4px 15px -5px rgba(0,0,0,0.1)"
          }}
        >
          {/* Clear option if value is set */}
          {value && (
            <button
              type="button"
              onClick={() => { onChange(""); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#FAF6F0] transition-colors text-left border-b border-[#E8E5D8]"
            >
              <X className="w-3.5 h-3.5 text-[#A0613B]" />
              <span className="text-[#A0613B] text-sm font-semibold">Seçimi sıfırla</span>
            </button>
          )}

          <div className="py-1 max-h-52 overflow-y-auto">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left ${
                    isSelected
                      ? "bg-[#2D4A33]/5 text-[#2D4A33]"
                      : "hover:bg-[#FAF6F0] text-[#1F2D24]"
                  }`}
                >
                  {opt.emoji && <span className="text-base w-5 shrink-0">{opt.emoji}</span>}
                  <span className="text-sm font-medium flex-1">{opt.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#2D4A33] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Hero() {
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [guests, setGuests] = useState(1);

  return (
    <section className="relative min-h-screen" style={{ background: "#1A3A2E" }}>

      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1920&q=85"
          alt="Azerbaycan Tebiet"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(180deg, rgba(26,58,46,0.4) 0%, rgba(26,58,46,0.3) 40%, rgba(26,58,46,0.85) 100%)"
        }} />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 70% 30%, rgba(212,165,116,0.25) 0%, transparent 50%)"
        }} />
      </div>

      {/* Floating leaves */}
      <svg className="absolute top-24 left-6 w-12 h-12 opacity-20 animate-float-slow pointer-events-none" viewBox="0 0 64 64" fill="none">
        <path d="M32 8 C40 16, 48 28, 32 56 C16 28, 24 16, 32 8 Z" fill="#D4A574" />
      </svg>
      <svg className="absolute top-40 right-12 w-10 h-10 opacity-15 animate-float pointer-events-none" viewBox="0 0 64 64" fill="none">
        <path d="M32 8 C40 16, 48 28, 32 56 C16 28, 24 16, 32 8 Z" fill="#FAF6F0" />
      </svg>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto w-full pt-24 pb-16">

        {/* Compass mark */}
        <div className="flex items-center gap-3 mb-6">
          <Compass className="w-5 h-5 text-[#D4A574] animate-rotation" strokeWidth={1.5} />
          <span className="text-[#D4A574] text-xs font-semibold tracking-[0.25em] uppercase">
            41.3°N · 47.7°E · Azərbaycan
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display font-bold text-[#FAF6F0] leading-[0.95] tracking-tight mb-6"
          style={{ fontSize: "clamp(3rem, 8.5vw, 8rem)" }}>
          Təbiətin<br />
          <span className="inline-block relative">
            <span style={{ color: "#D4A574", fontStyle: "italic" }}>nəfəsini</span>
            <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 300 12" preserveAspectRatio="none">
              <path d="M0,8 Q75,2 150,6 T300,4" stroke="#D4A574" strokeWidth="2" fill="none" opacity="0.6" />
            </svg>
          </span><br />
          al
        </h1>

        {/* <p className="text-[#FAF6F0]/60 text-base sm:text-lg max-w-md leading-relaxed mb-10 font-light">
          200+ unikal kamp məkanı. Rezervasiya qeydiyyatsızdır.
        </p> */}

        {/* Search card */}
        <div className="relative max-w-3xl">
          <div className="absolute inset-0 rounded-3xl transform rotate-[-0.5deg]"
            style={{ background: "#FAF6F0", boxShadow: "0 20px 60px -10px rgba(0,0,0,0.3)" }} />

          <div className="relative bg-[#FAF6F0] rounded-3xl p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row gap-2">

              {/* City custom dropdown */}
              <Dropdown
                value={city}
                onChange={setCity}
                options={CITIES}
                placeholder="Yer"
                icon={MapPin}
              />

              <div className="hidden sm:flex flex-col justify-center px-1">
                <div className="w-px h-10 border-l border-dashed border-[#E8E5D8]" />
              </div>

              {/* Type custom dropdown */}
              <Dropdown
                value={type}
                onChange={setType}
                options={TYPES}
                placeholder="Təcrübə"
                icon={({ className, strokeWidth }) => <span className="text-base">🏕️</span>}
              />

              <div className="hidden sm:flex flex-col justify-center px-1">
                <div className="w-px h-10 border-l border-dashed border-[#E8E5D8]" />
              </div>

              {/* Guests */}
              <div className="flex items-center gap-2.5 hover:bg-[#E8E5D8]/50 transition-colors rounded-2xl px-4 py-3">
                <Users className="w-4 h-4 text-[#4A6B4F] shrink-0" strokeWidth={1.5} />
                <div>
                  <p className="text-[10px] font-bold text-[#4A6B4F] uppercase tracking-widest mb-0.5">Qrup</p>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setGuests(Math.max(1, guests - 1))}
                      className="w-5 h-5 rounded-full border border-[#4A6B4F]/30 text-[#4A6B4F] text-xs flex items-center justify-center hover:bg-[#4A6B4F]/10 transition-colors select-none">
                      −
                    </button>
                    <span className="text-sm font-bold text-[#1F2D24] w-4 text-center select-none">{guests}</span>
                    <button type="button" onClick={() => setGuests(Math.min(20, guests + 1))}
                      className="w-5 h-5 rounded-full border border-[#4A6B4F]/30 text-[#4A6B4F] text-xs flex items-center justify-center hover:bg-[#4A6B4F]/10 transition-colors select-none">
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Search */}
              <Link href={`/listings?city=${city}&listing_type=${type}&guests=${guests}`}
                className="flex items-center justify-center gap-2 text-white font-bold px-6 py-3 rounded-2xl transition-all active:scale-95 whitespace-nowrap text-sm shadow-lg"
                style={{ background: "#2D4A33" }}>
                <Search className="w-4 h-4" />
                <span>Axtar</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-6 sm:gap-10 mt-10 text-[#FAF6F0]/40">
          {[["200+", "məkan"], ["2400+", "macəra"], ["4.8★", "reytinq"]].map(([n, l]) => (
            <div key={l} className="flex items-baseline gap-2">
              <span className="font-display text-2xl sm:text-3xl font-bold text-[#FAF6F0]">{n}</span>
              <span className="text-xs uppercase tracking-widest">{l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
