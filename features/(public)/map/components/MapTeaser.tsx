import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

export default function MapTeaser() {
  return (
    <section className="relative py-20 lg:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden" style={{ background: "#2D4A33" }}>

      {/* Topographic line patterns */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.07]" preserveAspectRatio="none" viewBox="0 0 1200 600">
        <path d="M0,150 Q300,100 600,140 T1200,130" stroke="#FAF6F0" strokeWidth="1" fill="none" />
        <path d="M0,200 Q300,160 600,200 T1200,190" stroke="#FAF6F0" strokeWidth="1" fill="none" />
        <path d="M0,250 Q300,220 600,260 T1200,250" stroke="#FAF6F0" strokeWidth="1" fill="none" />
        <path d="M0,300 Q300,280 600,320 T1200,310" stroke="#FAF6F0" strokeWidth="1" fill="none" />
        <path d="M0,350 Q300,340 600,380 T1200,370" stroke="#FAF6F0" strokeWidth="1" fill="none" />
        <path d="M0,400 Q300,400 600,440 T1200,430" stroke="#FAF6F0" strokeWidth="1" fill="none" />
        <path d="M0,450 Q300,460 600,500 T1200,490" stroke="#FAF6F0" strokeWidth="1" fill="none" />
      </svg>

      <div className="relative max-w-7xl mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left — text */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Compass className="w-5 h-5 text-[#D4A574]" strokeWidth={1.5} />
              <span className="text-[#D4A574] text-xs font-bold uppercase tracking-[0.25em]">
                Naviqasiya
              </span>
            </div>
            <h2 className="font-display font-bold text-[#FAF6F0] leading-[0.92] mb-6"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}>
              Bir <em className="text-[#D4A574]">xəritədən</em><br />
              bütün məkanlar
            </h2>
            <p className="text-[#FAF6F0]/50 text-base sm:text-lg leading-relaxed mb-8 max-w-md">
            Azərbaycanın hər guşəsində 200+ kamp nöqtəsi. Interaktiv xəritə ilə ən yaxın macəranı tap.
            </p>

            <div className="flex items-center gap-4 mb-10">
              <Link href="/map"
                className="inline-flex items-center gap-3 bg-[#D4A574] hover:bg-[#C49060] text-[#1F2D24] font-bold text-sm px-7 py-4 rounded-2xl transition-all active:scale-95 shadow-xl">
                Xəritəni aç
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-6 pt-8 border-t border-[#FAF6F0]/10">
              {[
                ["8", "Region"],
                ["200+", "Məkan"],
                ["GPS", "Naviqasiya"],
              ].map(([n, l]) => (
                <div key={l}>
                  <div className="font-display text-2xl font-bold text-[#D4A574]">{n}</div>
                  <div className="text-[#FAF6F0]/40 text-xs uppercase tracking-widest mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — vintage map illustration */}
          <div className="relative">
            <div className="relative aspect-square rounded-3xl overflow-hidden"
              style={{ background: "#FAF6F0" }}>

              {/* Map image */}
              <img
                src="https://images.unsplash.com/photo-1589519160732-57fc498494f8?w=900&q=80"
                alt="Azerbaycan xeritesi"
                className="absolute inset-0 w-full h-full object-cover opacity-30"
              />

              {/* Vintage paper texture */}
              <div className="absolute inset-0" style={{
                background: "radial-gradient(circle at 50% 50%, transparent 60%, rgba(160,97,59,0.15) 100%)"
              }} />

              {/* Compass rose decoration */}
              <div className="absolute top-6 right-6 w-20 h-20 opacity-40">
                <svg viewBox="0 0 100 100" fill="none">
                  <circle cx="50" cy="50" r="45" stroke="#2D4A33" strokeWidth="1" />
                  <circle cx="50" cy="50" r="38" stroke="#2D4A33" strokeWidth="0.5" />
                  <path d="M50 8 L46 50 L54 50 Z" fill="#A0613B" />
                  <path d="M50 92 L46 50 L54 50 Z" fill="#2D4A33" />
                  <path d="M8 50 L50 46 L50 54 Z" fill="#2D4A33" />
                  <path d="M92 50 L50 46 L50 54 Z" fill="#2D4A33" />
                  <text x="50" y="20" textAnchor="middle" fontSize="8" fill="#2D4A33" fontWeight="bold">N</text>
                </svg>
              </div>

              {/* Pins — illustrated style */}
              {[
                { top: "30%", left: "55%", label: "Şəki" },
                { top: "45%", left: "38%", label: "Göygöl" },
                { top: "70%", left: "73%", label: "Qəbələ" },
                { top: "36%", left: "20%", label: "Naxçıvan" },
                { top: "58%", left: "62%", label: "Lənkəran" },
              ].map((pin, i) => (
                <div key={pin.label} className="absolute" style={{ top: pin.top, left: pin.left }}>
                  <div className="relative flex flex-col items-center" style={{ transform: "translate(-50%, -100%)" }}>
                    <svg className="w-6 h-8" viewBox="0 0 24 32" fill="none">
                      <path d="M12 0 C18 0, 24 6, 24 12 C24 20, 12 32, 12 32 C12 32, 0 20, 0 12 C0 6, 6 0, 12 0 Z"
                        fill="#A0613B" />
                      <circle cx="12" cy="12" r="4" fill="#FAF6F0" />
                    </svg>
                    <span className="absolute -bottom-5 text-[10px] font-bold text-[#2D4A33] whitespace-nowrap font-display">
                      {pin.label}
                    </span>
                  </div>
                </div>
              ))}

              {/* Decorative dotted route */}
              <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 400 400" fill="none">
                <path d="M80 145 Q200 200 220 175 T250 235 T290 280 T160 280"
                  stroke="#2D4A33" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
              </svg>

              {/* Bottom label */}
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <p className="font-display text-xs font-bold text-[#2D4A33]/50 tracking-widest uppercase">
                  Azərbaycan kamp xəritəsi
                </p>
              </div>
            </div>

            {/* Floating leaf decoration */}
            <svg className="absolute -top-4 -left-4 w-16 h-16 opacity-50 animate-float-slow" viewBox="0 0 64 64" fill="none">
              <path d="M32 8 C40 16, 48 28, 32 56 C16 28, 24 16, 32 8 Z" fill="#D4A574" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
