import Link from "next/link";
import { Compass, Heart, Leaf, Mountain, Tent, Users, MapPin, Sparkles, ArrowUpRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

export const metadata = {
  title: "Haqqimizda — Kamping.az",
  description: "Kamping.az hekayemiz, missiyamiz ve Azerbaycanin en gozal kamp yerlerini birlesdiren komanda.",
};

const VALUES = [
  {
    icon: Leaf,
    title: "Təbiətə Hörmət",
    desc: "Hər məkan ekoloji prinsiplərlə idarə olunur. İz buraxma, hər şeyi yerində qoy.",
  },
  {
    icon: Heart,
    title: "İcma Ruhu",
    desc: "Sahibkar və qonaq arasında etibar — bizim ən böyük dəyərimiz. Biz bir ailəyik.",
  },
  {
    icon: Mountain,
    title: "Real Macəra",
    desc: "Otel yox — gerçək təbiət təcrübəsi. Tonqalın yanı, ulduzlar altında yatmaq.",
  },
  {
    icon: Sparkles,
    title: "Keyfiyyət",
    desc: "Hər məkan komandamız tərəfindən yoxlanılır. Sənə yaxşılarını təqdim edirik.",
  },
];

const TIMELINE = [
  {
    year: "2024",
    title: "Hekayə başladı",
    desc: "Bir qrup macəra həvəskarı Azərbaycanın gizli kamp guşələrini daha asan tapılan etmək qərarını verdi.",
  },
  {
    year: "2025",
    title: "İlk 50 məkan",
    desc: "Şəki dağlarından Lənkəran sahillərinə — 50+ unikal məkan platformamıza qoşuldu.",
  },
  {
    year: "2026",
    title: "200+ macəra",
    desc: "Bu gün 200+ kamp yeri, 2400+ qonaq və böyüməyə davam edən bir icma.",
  },
];

export default function AboutPage() {
  return (
     <>
    <Navbar />
    <main style={{ background: "#FAF6F0" }} className="relative overflow-hidden">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-28 pb-20 lg:pb-28 px-4 sm:px-6 lg:px-8"
        style={{ background: "#1A3A2E" }}>

        {/* BG image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1800&q=85"
            alt=""
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(180deg, rgba(26,58,46,0.6) 0%, rgba(26,58,46,0.92) 100%)"
          }} />
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at 30% 40%, rgba(212,165,116,0.2) 0%, transparent 60%)"
          }} />
        </div>

        {/* Floating leaves */}
        <svg className="absolute top-32 right-12 w-16 h-16 opacity-30 animate-float-slow" viewBox="0 0 64 64" fill="none">
          <path d="M32 8 C40 16, 48 28, 32 56 C16 28, 24 16, 32 8 Z" fill="#D4A574" />
        </svg>
        <svg className="absolute bottom-32 left-10 w-12 h-12 opacity-25 animate-float" viewBox="0 0 64 64" fill="none" style={{ transform: "rotate(45deg)" }}>
          <path d="M32 8 C40 16, 48 28, 32 56 C16 28, 24 16, 32 8 Z" fill="#FAF6F0" />
        </svg>

        <div className="relative max-w-5xl mx-auto text-center">

          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-px w-10 bg-[#D4A574]" />
            <Compass className="w-5 h-5 text-[#D4A574]" strokeWidth={1.5} />
            <span className="text-[#D4A574] text-xs font-bold uppercase tracking-[0.25em]">
              Bizim Hekayəmiz
            </span>
            <Compass className="w-5 h-5 text-[#D4A574]" strokeWidth={1.5} />
            <div className="h-px w-10 bg-[#D4A574]" />
          </div>

          <h1 className="font-display font-bold text-[#FAF6F0] leading-[0.95] tracking-tight mb-6"
            style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}>
            Təbiət bizim<br />
            <span className="text-[#D4A574]">ev</span>imizdir
          </h1>

          <p className="text-[#FAF6F0]/65 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed font-light">
            Azərbaycanın gizli kamp güşələrini sənin macəranla birləşdiririk.
            Hər meşə cığır, hər dağ ətəyi, hər göl kənarı — bir hekayə. 
          </p>
        </div>

        {/* Bottom curve */}
        <svg className="absolute bottom-0 left-0 w-full pointer-events-none" viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ height: "50px" }}>
          <path d="M0,50 Q360,10 720,35 T1440,30 L1440,60 L0,60 Z" fill="#FAF6F0" />
        </svg>
      </section>

      {/* ── MISSION ── */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">

        {/* Decorative pine */}
        <svg className="absolute top-10 right-10 w-32 h-32 opacity-[0.05]" viewBox="0 0 100 100" fill="none">
          <path d="M50 10 L30 35 L40 35 L20 60 L35 60 L10 90 L90 90 L65 60 L80 60 L60 35 L70 35 Z" fill="#2D4A33" />
        </svg>

        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center">

            {/* Left — image collage */}
            <div className="lg:col-span-2 relative">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden"
                style={{ boxShadow: "0 20px 60px -15px rgba(45,74,51,0.25)", transform: "rotate(-1.5deg)" }}>
                <img
                  src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=700&q=85"
                  alt="Azerbaycan tebieti"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative leaf */}
              <svg className="absolute -top-6 -right-6 w-20 h-20 opacity-60 animate-float-slow" viewBox="0 0 64 64" fill="none">
                <path d="M32 8 C40 16, 48 28, 32 56 C16 28, 24 16, 32 8 Z" fill="#D4A574" />
              </svg>
              {/* Small accent card */}
              <div className="absolute -bottom-6 -right-4 bg-white rounded-2xl p-4 px-5 max-w-[200px]"
                style={{ boxShadow: "0 10px 30px -5px rgba(45,74,51,0.2)", transform: "rotate(3deg)" }}>
                <div className="flex items-center gap-2 mb-1">
                  <Tent className="w-4 h-4 text-[#A0613B]" strokeWidth={1.5} />
                  <span className="text-[#A0613B] text-xs font-bold uppercase tracking-widest">200+</span>
                </div>
                <p className="text-[#1F2D24] text-sm font-display font-bold leading-tight">
                  Unikal məkan Azərbaycanda
                </p>
              </div>
            </div>

            {/* Right — text */}
            <div className="lg:col-span-3">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-px bg-[#D4A574]" />
                <span className="text-[#A0613B] text-xs font-bold uppercase tracking-[0.25em]">
                  Missiyamız
                </span>
              </div>

              <h2 className="font-display font-bold text-[#1F2D24] leading-[0.95] mb-6"
                style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}>
                Təbiəti hamı<br />
                <em className="text-[#4A6B4F]">kəşf</em> etsin
              </h2>

              <div className="space-y-4 text-[#1F2D24]/80 text-base lg:text-lg leading-relaxed">
                <p>
                  Kamping.az 2024-cü ildə yaranıb — sadə bir məqsədlə: <strong className="text-[#1F2D24]">Azərbaycanın gizli kamp güşələrini hər kəs üçün əlçatan etmək.</strong>
                </p>
                <p className="font-light">
                  Bilirdik ki, ölkəmizdə yüzlərlə möhtəşəm meşə, dağ ətəyi və göl kənarı var — amma bunları tapmaq və rezervasiya etmək çətindi. Biz bunu dəyişdik.
                </p>
                <p className="font-light">
                  Bu gün platformamızda hər zövqə uyğun seçim var: pulsuz ictimai kamp yerlərindən elit qlampinq otaqlarına qədər. Hamısı bir yerdə.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 mt-8">
                <Link href="/listings"
                  className="inline-flex items-center gap-2 bg-[#2D4A33] hover:bg-[#1A3A2E] text-[#FAF6F0] font-bold text-sm px-6 py-3.5 rounded-2xl transition-all active:scale-95 hover:shadow-xl">
                  Məkanlara bax
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link href="/contact"
                  className="inline-flex items-center gap-2 bg-white border-2 border-dashed border-[#4A6B4F]/30 hover:border-[#2D4A33] text-[#1F2D24] font-bold text-sm px-6 py-3.5 rounded-2xl transition-all">
                  Bizimlə əlaqə
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAND ── */}
      <section className="relative overflow-hidden py-14 lg:py-16 px-4 sm:px-6 lg:px-8"
        style={{ background: "#2D4A33" }}>

        {/* Topography */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.06]" preserveAspectRatio="none" viewBox="0 0 1200 200">
          <path d="M0,50 Q300,30 600,60 T1200,50" stroke="#FAF6F0" strokeWidth="1" fill="none" />
          <path d="M0,90 Q300,70 600,100 T1200,90" stroke="#FAF6F0" strokeWidth="1" fill="none" />
          <path d="M0,130 Q300,110 600,140 T1200,130" stroke="#FAF6F0" strokeWidth="1" fill="none" />
        </svg>

        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 text-center">
            {[
              { value: "200+", label: "Kamp məkanı", icon: Tent },
              { value: "2,400+", label: "Macəra yaşandi", icon: Heart },
              { value: "8", label: "Region əhatə", icon: MapPin },
              { value: "4.8", label: "Ortalama reytinq", icon: Sparkles },
            ].map(({ value, label, icon: Icon }) => (
              <div key={label}>
                <Icon className="w-6 h-6 text-[#D4A574] mx-auto mb-3" strokeWidth={1.5} />
                <div className="font-display text-4xl sm:text-5xl font-bold text-[#FAF6F0] mb-1">{value}</div>
                <div className="text-[#FAF6F0]/40 text-xs uppercase tracking-widest font-semibold">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">

        <svg className="absolute top-32 left-8 w-14 h-14 opacity-[0.1] animate-float" viewBox="0 0 64 64" fill="none">
          <path d="M32 8 C40 16, 48 28, 32 56 C16 28, 24 16, 32 8 Z" fill="#D4A574" />
        </svg>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-8 h-px bg-[#D4A574]" />
              <span className="text-[#A0613B] text-xs font-bold uppercase tracking-[0.25em]">
                Dəyərlərimiz
              </span>
              <div className="w-8 h-px bg-[#D4A574]" />
            </div>
            <h2 className="font-display font-bold text-[#1F2D24] leading-[0.95]"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}>
              Nəyə <em className="text-[#4A6B4F]">inanırıq</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((value, i) => {
              const Icon = value.icon;
              const rotations = [-0.8, 0.6, -0.4, 0.7];
              return (
                <div key={i}
                  className="bg-white rounded-2xl p-7 transition-all duration-300 hover:!rotate-0 hover:-translate-y-2 hover:shadow-xl group"
                  style={{
                    transform: `rotate(${rotations[i]}deg)`,
                    boxShadow: "0 4px 20px -2px rgba(45,74,51,0.08)"
                  }}>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-colors group-hover:bg-[#D4A574]/20"
                    style={{ background: "#FAF6F0", border: "2px dashed #4A6B4F33" }}>
                    <Icon className="w-6 h-6 text-[#2D4A33]" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#1F2D24] mb-3">{value.title}</h3>
                  <p className="text-[#4A6B4F]/80 text-sm leading-relaxed">{value.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative" style={{ background: "#1A3A2E" }}>

        {/* Mountain silhouette bottom */}
        <svg className="absolute bottom-0 left-0 w-full opacity-[0.08] pointer-events-none" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,120 L0,80 L150,40 L300,70 L450,20 L600,60 L750,15 L900,55 L1050,30 L1200,65 L1440,25 L1440,120 Z" fill="#FAF6F0" />
        </svg>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-8 h-px bg-[#D4A574]" />
              <span className="text-[#D4A574] text-xs font-bold uppercase tracking-[0.25em]">
                Yolumuz
              </span>
              <div className="w-8 h-px bg-[#D4A574]" />
            </div>
            <h2 className="font-display font-bold text-[#FAF6F0] leading-[0.95]"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}>
              Hekayəmizin <em className="text-[#D4A574]">addımları</em>
            </h2>
          </div>

          <div className="relative">
            {/* Dashed connecting line */}
            <svg className="hidden lg:block absolute top-10 left-[10%] right-[10%] pointer-events-none" viewBox="0 0 1000 50" preserveAspectRatio="none" style={{ height: "50px" }}>
              <path d="M0,25 Q250,5 500,25 T1000,25"
                stroke="#D4A574" strokeWidth="2" strokeDasharray="6 6" fill="none" opacity="0.4" />
            </svg>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-6 relative">
              {TIMELINE.map((item, i) => (
                <div key={i} className="text-center">
                  {/* Year circle */}
                  <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 rounded-full blur-md opacity-30"
                      style={{ background: "#D4A574" }} />
                    <div className="relative w-20 h-20 rounded-full flex items-center justify-center font-display text-xl font-bold"
                      style={{ background: "#FAF6F0", color: "#2D4A33" }}>
                      {item.year}
                    </div>
                  </div>

                  <h3 className="font-display text-xl font-bold text-[#FAF6F0] mb-3">{item.title}</h3>
                  <p className="text-[#FAF6F0]/50 text-sm leading-relaxed max-w-xs mx-auto">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-[40px] overflow-hidden p-10 sm:p-16 lg:p-20"
            style={{ background: "#1A3A2E", minHeight: 320 }}>

            <img
              src="https://images.unsplash.com/photo-1487730116645-74489c95b41b?w=1600&q=85"
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0" style={{
              background: "linear-gradient(135deg, rgba(26,58,46,0.95) 0%, rgba(160,97,59,0.3) 100%)"
            }} />

            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-[#FAF6F0]/10 backdrop-blur border border-[#D4A574]/30 text-[#D4A574] text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-widest">
                <Compass className="w-3 h-3" />
                Macəra başlayır
              </div>

              <h2 className="font-display font-bold text-[#FAF6F0] leading-[0.92] mb-5"
                style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}>
                İlk macərana <em className="text-[#D4A574]">başla</em>
              </h2>
              <p className="text-[#FAF6F0]/60 text-base sm:text-lg mb-8 max-w-md mx-auto leading-relaxed">
                Çantanı götür, yola düş. Təbiətin qoynunda səni gözləyən hekayələr var.
              </p>

              <Link href="/listings"
                className="inline-flex items-center gap-2 bg-[#D4A574] hover:bg-[#C49060] text-[#1F2D24] font-bold text-sm px-8 py-4 rounded-2xl transition-all active:scale-95 hover:shadow-2xl">
                Məkanlara bax
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
    </>
  );
}
