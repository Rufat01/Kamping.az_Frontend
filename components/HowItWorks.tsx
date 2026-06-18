import { Search, CalendarCheck, Tent, Smile } from "lucide-react";

const STEPS = [
  { icon: Search, num: "01", title: "Macəranı Tap", desc: "Şəhər, tarix ve qrup sayına görə uyğun yerini seç." },
  { icon: CalendarCheck, num: "02", title: "Bron Et", desc: "Təhlükəsiz ödəniş et, sahibkar 24 saat ərzində təsdiq edir." },
  { icon: Tent, num: "03", title: "Hazırlaş", desc: "Çantanı götür, yola çıx. Bütün detallar sənin emailində olacaq." },
  { icon: Smile, num: "04", title: "Zövq al", desc: "Təbiətin qoynunda unudulmaz vaxt keçir. Rəyini paylaş." },
];

export default function HowItWorks() {
  return (
    <section className="relative py-20 lg:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden" style={{ background: "#FAF6F0" }}>

      {/* Background mountain silhouette */}
      <svg className="absolute bottom-0 left-0 w-full opacity-[0.04] pointer-events-none" viewBox="0 0 1440 200" preserveAspectRatio="none">
        <path d="M0,200 L0,140 L150,80 L300,120 L450,40 L600,90 L750,30 L900,100 L1050,60 L1200,110 L1440,50 L1440,200 Z" fill="#2D4A33" />
      </svg>

      <div className="relative max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-8 h-px bg-[#D4A574]" />
            <span className="text-[#A0613B] text-xs font-bold uppercase tracking-[0.25em]">
              Yol xəritəsi
            </span>
            <div className="w-8 h-px bg-[#D4A574]" />
          </div>
          <h2 className="font-display font-bold text-[#1F2D24] leading-[0.92]"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}>
            4 addımda <em className="text-[#4A6B4F]">macəra</em>
          </h2>
        </div>

        {/* Steps — winding trail layout */}
        <div className="relative">
          {/* Dotted trail line — desktop only */}
          <svg className="hidden lg:block absolute top-12 left-0 w-full pointer-events-none" viewBox="0 0 1200 100" preserveAspectRatio="none" style={{ height: "80px" }}>
            <path d="M100,40 Q300,80 500,30 T900,50 T1100,40"
              stroke="#D4A574" strokeWidth="2" strokeDasharray="6 6" fill="none" opacity="0.5" />
          </svg>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 relative">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="relative group text-center lg:text-left">

                  {/* Number circle */}
                  <div className="relative inline-flex mb-6">
                    <div className="absolute inset-0 rounded-full opacity-20 group-hover:opacity-40 transition-opacity blur-md"
                      style={{ background: "#D4A574" }} />
                    <div className="relative w-20 h-20 rounded-full flex items-center justify-center transition-all group-hover:scale-110"
                      style={{ background: "#FAF6F0", border: "2px solid #4A6B4F" }}>
                      <Icon className="w-7 h-7 text-[#2D4A33]" strokeWidth={1.5} />
                    </div>
                    {/* Number badge */}
                    <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md"
                      style={{ background: "#A0613B" }}>
                      {i + 1}
                    </div>
                  </div>

                  <h3 className="font-display text-xl font-bold text-[#1F2D24] mb-2">{step.title}</h3>
                  <p className="text-[#4A6B4F]/70 text-sm leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
