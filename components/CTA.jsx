import Link from "next/link";
import { ArrowRight, Tent } from "lucide-react";

export default function CTA() {
  return (
    <section className="relative py-20 lg:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden" style={{ background: "#FAF6F0" }}>

      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-[40px] overflow-hidden" style={{ minHeight: 480 }}>

          {/* Background image — sunset campfire */}
          <img
            src="https://images.unsplash.com/photo-1487730116645-74489c95b41b?w=1600&q=85"
            alt="Sunset kamp"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Sunset gradient overlay */}
          <div className="absolute inset-0" style={{
            background: "linear-gradient(135deg, rgba(45,74,51,0.95) 0%, rgba(45,74,51,0.7) 40%, rgba(160,97,59,0.4) 100%)"
          }} />

          {/* Floating sun */}
          <div className="absolute top-12 right-12 w-24 h-24 rounded-full opacity-40 blur-2xl"
            style={{ background: "#D4A574" }} />

          {/* Decorative pine trees — bottom silhouette */}
          <svg className="absolute bottom-0 left-0 w-full opacity-30 pointer-events-none" viewBox="0 0 1440 100" preserveAspectRatio="none">
            <path d="M0,100 L0,80 L60,40 L80,60 L120,30 L150,70 L200,45 L240,75 L280,35 L320,65 L360,40 L400,70 L440,45 L480,75 L520,40 L580,80 L640,50 L700,75 L760,35 L820,65 L880,40 L920,70 L980,45 L1040,75 L1100,40 L1160,70 L1220,50 L1280,80 L1340,55 L1400,75 L1440,60 L1440,100 Z"
              fill="#1A3A2E" />
          </svg>

          {/* Content */}
          <div className="relative z-10 p-10 sm:p-14 lg:p-20 h-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">

            <div className="flex-1 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-[#FAF6F0]/15 backdrop-blur border border-[#D4A574]/40 text-[#D4A574] text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-widest">
                <Tent className="w-3 h-3" />
                Sahibkarsiniz?
              </div>

              <h2 className="font-display font-bold text-[#FAF6F0] leading-[0.92] mb-5"
                style={{ fontSize: "clamp(2.5rem, 5.5vw, 5rem)" }}>
                Oz mecanini<br />
                <em className="text-[#D4A574]">paylas</em>
              </h2>

              <p className="text-[#FAF6F0]/70 text-base sm:text-lg leading-relaxed max-w-md mb-8">
                Azerbaycanda en sevilen kamp platformasinda yer al. Qeydiyyat pulsuzdur, komissiya seffafdir.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/register?role=owner"
                  className="inline-flex items-center justify-center gap-2 bg-[#D4A574] hover:bg-[#C49060] text-[#1F2D24] font-bold text-sm px-7 py-4 rounded-2xl transition-all active:scale-95 hover:shadow-2xl">
                  Pulsuz qeydiyyat
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/about"
                  className="inline-flex items-center justify-center bg-[#FAF6F0]/10 hover:bg-[#FAF6F0]/20 backdrop-blur border border-[#FAF6F0]/20 text-[#FAF6F0] font-semibold text-sm px-7 py-4 rounded-2xl transition-all">
                  Daha etrafli
                </Link>
              </div>
            </div>

            {/* Right side — decorative stats card */}
            <div className="bg-[#FAF6F0]/10 backdrop-blur-md border border-[#FAF6F0]/15 rounded-3xl p-7 lg:p-8 max-w-xs">
              <p className="text-[#D4A574] text-xs font-bold uppercase tracking-widest mb-5">
                Sahibkarlar uchun
              </p>
              <div className="space-y-5">
                {[
                  ["✓", "Pulsuz qeydiyyat"],
                  ["✓", "Tehlukesiz odenis"],
                  ["✓", "24/7 dəstək"],
                  ["✓", "Geniş auditoriya"],
                ].map(([icon, text]) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#D4A574]/20 flex items-center justify-center text-[#D4A574] text-xs font-bold">
                      {icon}
                    </div>
                    <span className="text-[#FAF6F0]/90 text-sm font-medium">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
