import { Star, Quote } from "lucide-react";

const REVIEWS = [
  {
    name: "Aytən Məmmədova", location: "Bakı", rating: 5,
    text: "Qəbələdə ki dağ çadırı inanılmaz idi. Sahibkar çox qonaqpərvər idi, hər şey tərtiblə hazırlanmışdı.",
    listing: "Qəbələ Dağ Çadırı",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
  },
  {
    name: "Rauf Həsənov", location: "Gəncə", rating: 5,
    text: "Ailəmlə Şəkidəki bungaloda 3 gecə qaldıq. Uşaqlar meşəni çox sevdilər, biz isə sakitliyi tapdıq.",
    listing: "Şəki Bungalo",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
  },
  {
    name: "Nigar Aliyeva", location: "Sumqayıt", rating: 5,
    text: "Glamping deyəndə elit yer gözləyirdim, amma əlavə olaraq müstəsna təbiət mənzərəsi də aldım. Ulduzlu gece...",
    listing: "Göygöl Glamping",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
  },
];

export default function Testimonials() {
  return (
    <section className="relative py-20 lg:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden" style={{ background: "#1A3A2E" }}>

      {/* Subtle dotted texture */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: "radial-gradient(circle, #FAF6F0 1px, transparent 1px)",
        backgroundSize: "20px 20px"
      }} />

      {/* Decorative leaves */}
      <svg className="absolute top-16 right-20 w-32 h-32 opacity-[0.06] hidden lg:block" viewBox="0 0 64 64" fill="none" style={{ transform: "rotate(20deg)" }}>
        <path d="M32 8 C40 16, 48 28, 32 56 C16 28, 24 16, 32 8 Z" fill="#D4A574" />
      </svg>
      <svg className="absolute bottom-16 left-12 w-28 h-28 opacity-[0.05] hidden lg:block" viewBox="0 0 64 64" fill="none" style={{ transform: "rotate(-30deg)" }}>
        <path d="M32 8 C40 16, 48 28, 32 56 C16 28, 24 16, 32 8 Z" fill="#FAF6F0" />
      </svg>

      <div className="relative max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-8 h-px bg-[#D4A574]" />
            <span className="text-[#D4A574] text-xs font-bold uppercase tracking-[0.25em]">
              Macəra günlükləri
            </span>
            <div className="w-8 h-px bg-[#D4A574]" />
          </div>
          <h2 className="font-display font-bold text-[#FAF6F0] leading-[0.92]"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}>
            Onlar <em className="text-[#D4A574]">yaşadılar</em>...
          </h2>
        </div>

        {/* Reviews */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {REVIEWS.map((r, i) => {
            const rotations = [-1, 1, -0.5];
            return (
              <div key={i}
                className="relative bg-[#FAF6F0] p-7 lg:p-8 rounded-2xl transition-all duration-300 hover:!rotate-0 hover:-translate-y-2"
                style={{
                  transform: `rotate(${rotations[i]}deg)`,
                  boxShadow: "0 10px 30px -5px rgba(0,0,0,0.2)"
                }}>

                {/* Quote mark */}
                <Quote className="absolute -top-3 -left-2 w-10 h-10 text-[#D4A574] fill-[#D4A574]" />

                {/* Stars */}
                <div className="flex gap-0.5 mb-4 pt-4">
                  {Array.from({ length: r.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-[#D4A574] text-[#D4A574]" />
                  ))}
                </div>

                {/* Quote text */}
                <p className="text-[#1F2D24] text-base leading-relaxed mb-6 font-light italic">
                  {r.text}
                </p>

                {/* Listing tag */}
                <div className="inline-block bg-[#E8E5D8]/60 text-[#2D4A33] text-xs font-bold px-3 py-1 rounded-full mb-4 border border-dashed border-[#4A6B4F]/30">
                  {r.listing}
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-dashed border-[#E8E5D8]">
                  <img src={r.avatar} alt={r.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#D4A574]" />
                  <div>
                    <p className="font-display font-bold text-[#1F2D24] text-sm">{r.name}</p>
                    <p className="text-[#4A6B4F]/70 text-xs">{r.location}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 lg:gap-8 pt-12 border-t border-[#FAF6F0]/10">
          {[
            ["200+", "Kamp yeri"],
            ["2,400+", "Macəra"],
            ["4.8★", "Reytinq"],
            ["98%", "Məmnuniyyət"],
          ].map(([v, l]) => (
            <div key={l} className="text-center">
              <div className="font-display text-3xl sm:text-4xl font-bold text-[#D4A574] mb-1">{v}</div>
              <div className="text-[#FAF6F0]/40 text-xs uppercase tracking-widest">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
