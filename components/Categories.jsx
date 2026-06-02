import Link from "next/link";

const CATEGORIES = [
  {
    type: "tent_site", label: "Cadir Yeri", desc: "Klassik kamp tecrubesi",
    count: "84", emoji: "⛺",
    img: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=600&q=80",
  },
  {
    type: "glamping", label: "Glamping", desc: "Luxs cadir macerasi",
    count: "42", emoji: "🏕️",
    img: "https://images.unsplash.com/photo-1593053272490-e0ed6d6a42c5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z2xhbXBpbmd8ZW58MHx8MHx8fDA%3D",
  },
  {
    type: "bungalow", label: "Bungalo", desc: "Mese icherisinde",
    count: "53", emoji: "🏡",
    img: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=600&q=80",
  },
  {
    type: "house", label: "Kend Evi", desc: "Avadanliqli tam ev",
    count: "31", emoji: "🏠",
    img: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=600&q=80",
  },
];

export default function Categories() {
  return (
    <section className="relative py-20 lg:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden" style={{ background: "#FAF6F0" }}>

      {/* Decorative pine trees in background */}
      <svg className="absolute top-10 right-10 w-32 h-32 opacity-[0.06]" viewBox="0 0 100 100" fill="none">
        <path d="M50 10 L30 35 L40 35 L20 60 L35 60 L10 90 L90 90 L65 60 L80 60 L60 35 L70 35 Z" fill="#2D4A33" />
      </svg>
      <svg className="absolute bottom-20 left-10 w-24 h-24 opacity-[0.05]" viewBox="0 0 100 100" fill="none">
        <path d="M50 10 L30 35 L40 35 L20 60 L35 60 L10 90 L90 90 L65 60 L80 60 L60 35 L70 35 Z" fill="#2D4A33" />
      </svg>

      <div className="relative max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-px bg-[#D4A574]" />
              <span className="text-[#A0613B] text-xs font-bold uppercase tracking-[0.25em]">
                Tecrubeler
              </span>
            </div>
            <h2 className="font-display font-bold text-[#1F2D24] leading-[0.95]"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}>
              Hansi <em className="text-[#4A6B4F]">macerani</em><br />
              secersiniz?
            </h2>
          </div>
          <Link href="/listings"
            className="text-[#4A6B4F] hover:text-[#2D4A33] text-sm font-bold transition-colors flex items-center gap-2 group">
            <span className="underline underline-offset-4 decoration-2 decoration-[#D4A574]">Hamısına bax</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {/* Cards — staggered organic layout */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat.type}
              href={`/listings?listing_type=${cat.type}`}
              className="group relative block"
              style={{
                transform: i % 2 === 0 ? "translateY(0)" : "translateY(24px)",
              }}
            >
              {/* Image — rounded organic shape */}
              <div className="relative overflow-hidden mb-4 transition-all duration-500 group-hover:scale-[1.02]"
                style={{
                  borderRadius: "120px 120px 32px 32px",
                  aspectRatio: "3/4",
                  boxShadow: "0 20px 40px -15px rgba(45,74,51,0.2)"
                }}>
                <img src={cat.img} alt={cat.label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

                {/* Top overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />

                {/* Count badge */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#FAF6F0] text-[#2D4A33] text-xs font-bold px-3 py-1 rounded-full shadow">
                  {cat.count} mekan
                </div>

                {/* Emoji */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-4xl">
                  {cat.emoji}
                </div>
              </div>

              {/* Label */}
              <div className="text-center">
                <h3 className="font-display text-lg sm:text-xl font-bold text-[#1F2D24] mb-1 group-hover:text-[#A0613B] transition-colors">
                  {cat.label}
                </h3>
                <p className="text-[#4A6B4F]/70 text-xs sm:text-sm font-light">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
