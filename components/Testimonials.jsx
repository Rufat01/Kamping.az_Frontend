import { Star, Quote } from "lucide-react";

const REVIEWS = [
  {
    name: "Aytən Məmmədova",
    location: "Bakı",
    avatar: "AM",
    rating: 5,
    text: "Qəbələdəki dağ çadırı inanılmaz idi. Hər şey tərtiblə hazırlanmışdı, sahibkar çox qonaqpərvər insandır. Mütləq geri qayıdacağam.",
    listing: "Qəbələ Dağ Çadırı",
  },
  {
    name: "Rauf Həsənov",
    location: "Gəncə",
    avatar: "RH",
    rating: 5,
    text: "Ailəmlə Şəkidəki bungaloda 3 gecə qaldıq. Uşaqlar meşəni çox sevdilər, biz isə sakitliyi. Kamping.az-ı hər kəsə tövsiyə edirəm.",
    listing: "Şəki Bağlarında Bungalo",
  },
  {
    name: "Nigar Əliyeva",
    location: "Sumqayıt",
    avatar: "NƏ",
    rating: 5,
    text: "Glamping deyəndə lüksü gözləyirdim, amma əlavə olaraq müstəsna bir təbiət mənzərəsi də aldım. Çox mükəmməl bir gecə idi.",
    listing: "Göygöl Meşəsində Glamping",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 lg:py-28 bg-forest-900">
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">
            İstifadəçi rəyləri
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mt-2 leading-tight">
            Onlar artıq yaşadılar
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((review, i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-7 flex flex-col gap-5 hover:bg-white/8 transition-colors"
            >
              {/* Quote icon */}
              <Quote className="w-8 h-8 text-amber-400/50" />

              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Text */}
              <p className="text-white/75 text-sm leading-relaxed flex-1">
                "{review.text}"
              </p>

              {/* Footer */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-forest-900 text-xs font-bold shrink-0">
                  {review.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-semibold text-sm">{review.name}</div>
                  <div className="text-white/40 text-xs">{review.location}</div>
                </div>
                <div className="text-right">
                  <div className="text-white/30 text-xs line-clamp-1">{review.listing}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { value: "200+", label: "Kamp yeri" },
            { value: "2,400+", label: "Rezervasiya" },
            { value: "4.8★", label: "Ortalama reytinq" },
            { value: "98%", label: "Məmnuniyyət" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-4xl font-bold text-amber-400 mb-1">
                {stat.value}
              </div>
              <div className="text-white/50 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
