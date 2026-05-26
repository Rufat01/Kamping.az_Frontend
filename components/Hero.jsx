"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, MapPin, Calendar, Users, ChevronDown } from "lucide-react";

const CITIES = ["Şəki","Qəbələ","Göygöl","Lerik","Lənkəran","Naxçıvan","İsmayıllı","Lahıc","Xınalıq","Şahdağ"];
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
  const [phase, setPhase] = useState("hidden"); 
  // phases: hidden → zipper-opening → revealing → done

  useEffect(() => {
    // Qısa gözləmə — brauzerin render etməsinə imkan ver
    const t1 = setTimeout(() => setPhase("zipper-opening"), 400);
    // Zipper animasiyası 1.8s sürsün, sonra hero reveal başlasın
    const t2 = setTimeout(() => setPhase("revealing"), 2000);
    // Hər şey bitdi
    const t3 = setTimeout(() => setPhase("done"), 3200);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  const zipperOpen = phase === "zipper-opening" || phase === "revealing" || phase === "done";
  const heroVisible = phase === "revealing" || phase === "done";
  const overlayGone = phase === "done";

  return (
    <>
      {/* ── Zipper Overlay ── */}
      {!overlayGone && (
        <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">

          {/* Sol panel */}
          <div
            className="absolute inset-y-0 left-0 bg-forest-950 transition-transform ease-in-out"
            style={{
              width: "50%",
              transitionDuration: "1.6s",
              transitionDelay: "0.1s",
              transform: zipperOpen ? "translateX(-100%)" : "translateX(0%)",
            }}
          >
            {/* Ağac toxuması */}
            <div className="absolute inset-0"
              style={{
                backgroundImage:`repeating-linear-gradient(
                  90deg, transparent, transparent 3px,
                  rgba(255,255,255,0.015) 3px, rgba(255,255,255,0.015) 4px
                ), repeating-linear-gradient(
                  0deg, transparent, transparent 60px,
                  rgba(255,255,255,0.02) 60px, rgba(255,255,255,0.02) 61px
                )`
              }}
            />
            {/* Sağ kənar — zipper dişi kənarı */}
            <div className="absolute right-0 inset-y-0 w-1 bg-amber-500/40" />
          </div>

          {/* Sağ panel */}
          <div
            className="absolute inset-y-0 right-0 bg-[#0f2a1e] transition-transform ease-in-out"
            style={{
              width: "50%",
              transitionDuration: "1.6s",
              transitionDelay: "0.1s",
              transform: zipperOpen ? "translateX(100%)" : "translateX(0%)",
            }}
          >
            <div className="absolute inset-0"
              style={{
                backgroundImage:`repeating-linear-gradient(
                  90deg, transparent, transparent 3px,
                  rgba(255,255,255,0.015) 3px, rgba(255,255,255,0.015) 4px
                ), repeating-linear-gradient(
                  0deg, transparent, transparent 60px,
                  rgba(255,255,255,0.02) 60px, rgba(255,255,255,0.02) 61px
                )`
              }}
            />
            <div className="absolute left-0 inset-y-0 w-1 bg-amber-500/40" />
          </div>

          {/* Zipper dişləri — mərkəzdə, açılmadan əvvəl görünür */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
            style={{ opacity: zipperOpen ? 0 : 1 }}
          >
            {/* Diş sütunu */}
            <div className="flex flex-col gap-1.5">
              {Array.from({ length: 32 }).map((_, i) => (
                <div key={i} className="flex gap-1 items-center">
                  <div className="w-3 h-2.5 rounded-sm bg-amber-500/60" />
                  <div className="w-1 h-3 bg-amber-400/30" />
                  <div className="w-3 h-2.5 rounded-sm bg-amber-500/60" />
                </div>
              ))}
            </div>
          </div>


          {/* Zipper çəkici — mərkəzdə aşağı-yuxarı bounce */}
          <div
            className="absolute left-1/2 -translate-x-1/2 transition-all duration-700"
            style={{
              top: zipperOpen ? "-60px" : "50%",
              marginTop: zipperOpen ? "0" : "-12px",
              opacity: zipperOpen ? 0 : 1,
            }}
          >
            <div className="flex flex-col items-center gap-0.5 animate-bounce">
              <div className="w-6 h-4 bg-amber-500 rounded-sm shadow-lg" />
              <div
                className="w-0 h-0"
                style={{
                  borderLeft: "10px solid transparent",
                  borderRight: "10px solid transparent",
                  borderTop: "8px solid #f59e0b",
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1800&q=85"
            alt="Azərbaycan Təbiəti"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-forest-950/70 via-forest-900/50 to-forest-950/80" />
        </div>

        {/* Content — zipper açıldıqca arxadan önə gəlir */}
        <div
          className="relative z-10 w-full flex flex-col items-center px-4 transition-all ease-out"
          style={{
            transitionDuration: "1.4s",
            transitionDelay: heroVisible ? "0s" : "0s",
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "scale(1) translateY(0px)" : "scale(1.06) translateY(20px)",
            filter: heroVisible ? "blur(0px)" : "blur(6px)",
          }}
        >
          {/* Badge */}
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Azərbaycanda 200+ kamp məkanı
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] tracking-tight mb-6 text-center max-w-5xl">
            Təbiətin qoynunda{" "}
            <span className="text-amber-400 italic">istirahət et</span>
          </h1>

          <p className="text-white/70 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed text-center">
            Azərbaycanda ən gözəl kamp yerlərini, glamping otaqlarını və
            bungalolarını kəşf edin. Unudulmaz bir macəra sizi gözləyir.
          </p>

          {/* Search Box */}
          <div className="max-w-3xl w-full mx-auto">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2 shadow-2xl shadow-forest-950/40 border border-white/30">
              <div className="flex flex-col sm:flex-row gap-2">

                <div className="flex-1 flex items-center gap-3 bg-[#F9F5EE]/60 hover:bg-[#F9F5EE]/90 transition-colors rounded-xl px-4 py-3">
                  <MapPin className="w-4 h-4 text-forest-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <label className="block text-xs font-semibold text-forest-800/60 uppercase tracking-wider mb-0.5">Şəhər</label>
                    <select value={city} onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-transparent text-forest-900 text-sm font-medium focus:outline-none cursor-pointer">
                      <option value="">Hər yer</option>
                      {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex-1 flex items-center gap-3 bg-[#F9F5EE]/60 hover:bg-[#F9F5EE]/90 transition-colors rounded-xl px-4 py-3">
                  <Calendar className="w-4 h-4 text-forest-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <label className="block text-xs font-semibold text-forest-800/60 uppercase tracking-wider mb-0.5">Növ</label>
                    <select value={type} onChange={(e) => setType(e.target.value)}
                      className="w-full bg-transparent text-forest-900 text-sm font-medium focus:outline-none cursor-pointer">
                      {LISTING_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-[#F9F5EE]/60 hover:bg-[#F9F5EE]/90 transition-colors rounded-xl px-4 py-3">
                  <Users className="w-4 h-4 text-forest-600 shrink-0" />
                  <div>
                    <label className="block text-xs font-semibold text-forest-800/60 uppercase tracking-wider mb-0.5">Qonaq</label>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setGuests(Math.max(1, guests - 1))}
                        className="w-5 h-5 rounded-full border border-forest-300 text-forest-600 flex items-center justify-center text-xs hover:bg-forest-100 transition-colors">−</button>
                      <span className="text-sm font-semibold text-forest-900 w-4 text-center">{guests}</span>
                      <button onClick={() => setGuests(Math.min(20, guests + 1))}
                        className="w-5 h-5 rounded-full border border-forest-300 text-forest-600 flex items-center justify-center text-xs hover:bg-forest-100 transition-colors">+</button>
                    </div>
                  </div>
                </div>

                <Link href={`/listings?city=${city}&listing_type=${type}&guests=${guests}`}
                  className="flex items-center justify-center gap-2 bg-forest-800 hover:bg-forest-700 text-white font-semibold px-7 py-3 rounded-xl transition-all duration-200 hover:shadow-lg active:scale-95 whitespace-nowrap">
                  <Search className="w-4 h-4" />
                  <span>Axtar</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator — yalnız done fazasında */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/40 transition-opacity duration-700"
          style={{ opacity: phase === "done" ? 1 : 0 }}
        >
          <span className="text-xs tracking-widest uppercase">Kəşf et</span>
          <ChevronDown size={16} className="animate-bounce" />
        </div>
      </section>
    </>
  );
}