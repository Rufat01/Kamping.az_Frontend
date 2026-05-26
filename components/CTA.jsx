import Link from "next/link";
import { Tent, ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative rounded-3xl overflow-hidden">
        {/* BG image */}
        <img
          src="https://images.unsplash.com/photo-1487730116645-74489c95b41b?w=1400&q=85"
          alt="Kamp tonqalı"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950/90 via-forest-950/70 to-transparent" />

        {/* Content */}
        <div className="relative z-10 px-8 sm:px-14 py-16 sm:py-20 max-w-2xl">
          <span className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/30 text-amber-400 text-sm font-semibold px-3 py-1.5 rounded-full mb-6">
            <Tent className="w-3.5 h-3.5" />
            Sahibkarsınız?
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5">
            Öz kamp yerinizi paylaşın
          </h2>
          <p className="text-white/65 text-lg leading-relaxed mb-8">
            Azərbaycanda ən böyük kamp platformasında yerinizi tanıdın. 
            Qeydiyyat tamamilə pulsuzdur, elanlarınızı dərhal yayımlayın.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/register?role=owner"
              className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-forest-900 font-bold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-2xl hover:shadow-amber-500/30 active:scale-95"
            >
              Pulsuz qeydiyyat
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200"
            >
              Daha ətraflı
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
