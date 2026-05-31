import Link from "next/link";
import { Tent, ArrowLeft, MapPin } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F9F5EE] flex flex-col items-center justify-center px-4 text-center">
      
      {/* Animasiyalı ağac/çadır illüstrasiya */}
      <div className="relative mb-8">
        <div className="text-8xl animate-bounce">⛺</div>
        <div className="absolute -top-2 -right-4 text-3xl animate-pulse">🌲</div>
        <div className="absolute -top-2 -left-4 text-3xl animate-pulse delay-300">🌲</div>
      </div>

      {/* 404 */}
      <div className="font-display text-[120px] sm:text-[160px] font-bold text-forest-900/10 leading-none select-none -mb-6">
        404
      </div>

      <h1 className="font-display text-3xl sm:text-4xl font-bold text-forest-900 mb-3">
        Yolu itirdiniz?
      </h1>
      <p className="text-forest-500 text-lg max-w-md mx-auto mb-10 leading-relaxed">
        Axtardığınız səhifə mövcud deyil və ya köçürülüb. 
        Tezliklə xidmətinizdə olacağıq — hələlik geri qayıdaq!
      </p>

      {/* Düymələr */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 bg-forest-800 hover:bg-forest-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          Ana səhifəyə qayıt
        </Link>
        <Link
          href="/listings"
          className="flex items-center justify-center gap-2 bg-white border border-forest-200 hover:border-forest-400 text-forest-800 font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 active:scale-95"
        >
          <MapPin className="w-4 h-4" />
          Məkanları kəşf et
        </Link>
      </div>

      {/* Logo */}
      <div className="mt-16 flex items-center gap-2 opacity-40">
        <Tent className="w-4 h-4 text-forest-800" />
        <span className="font-display text-sm font-bold text-forest-800">
          Kamping<span className="text-amber-500">.az</span>
        </span>
      </div>
    </div>
  );
}