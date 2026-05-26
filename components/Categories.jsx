import Link from "next/link";

const CATEGORIES = [
  {
    type: "tent_site",
    label: "Çadır Yeri",
    desc: "Təbiətin qoynunda klassik kamp",
    emoji: "⛺",
    color: "from-forest-700 to-forest-800",
    count: "84 məkan",
    img: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=600&q=80",
  },
  {
    type: "glamping",
    label: "Glamping",
    desc: "Lüks çadır təcrübəsi",
    emoji: "🏕️",
    color: "from-amber-600 to-amber-800",
    count: "42 məkan",
    img: "https://images.unsplash.com/photo-1516967124798-10656f7dca28?w=600&q=80",
  },
  {
    type: "bungalow",
    label: "Bungalo",
    desc: "Meşədə rahat bungalo",
    emoji: "🏡",
    color: "from-forest-600 to-forest-900",
    count: "53 məkan",
    img: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=600&q=80",
  },
  {
    type: "house",
    label: "Ev",
    desc: "Tam avadanlıqlı kənd evi",
    emoji: "🏠",
    color: "from-stone-600 to-stone-800",
    count: "31 məkan",
    img: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=600&q=80",
  },
];

export default function Categories() {
  return (
    <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
        <div>
          <span className="text-amber-600 text-sm font-semibold uppercase tracking-widest">
            Kateqoriyalar
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-forest-900 mt-2 leading-tight">
            Hansı növü seçirsiniz?
          </h2>
        </div>
        <Link
          href="/listings"
          className="text-forest-700 hover:text-forest-900 font-semibold text-sm underline underline-offset-4 decoration-forest-300 hover:decoration-forest-600 transition-all whitespace-nowrap"
        >
          Hamısına bax →
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {CATEGORIES.map((cat, i) => (
          <Link
            key={cat.type}
            href={`/listings?listing_type=${cat.type}`}
            className="group relative rounded-2xl overflow-hidden aspect-[3/4] img-zoom cursor-pointer"
          >
            {/* Background image */}
            <img
              src={cat.img}
              alt={cat.label}
              className="w-full h-full object-cover"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-forest-950/20 to-transparent" />

            {/* Count badge */}
            <div className="absolute top-3 right-3 bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs font-medium px-2.5 py-1 rounded-full">
              {cat.count}
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
              <div className="text-2xl mb-2">{cat.emoji}</div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-white leading-tight">
                {cat.label}
              </h3>
              <p className="text-white/60 text-xs sm:text-sm mt-1 leading-snug">
                {cat.desc}
              </p>
              <div className="mt-3 flex items-center gap-1 text-amber-400 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                Kəşf et <span>→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
