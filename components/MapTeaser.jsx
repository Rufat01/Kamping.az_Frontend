import Link from "next/link";
import { Map, Navigation } from "lucide-react";

const PINS = [
  { top: "28%", left: "55%", label: "Şəki", price: "₼60" },
  { top: "42%", left: "38%", label: "Göygöl", price: "₼85" },
  { top: "55%", left: "62%", label: "Qəbələ", price: "₼30" },
  { top: "70%", left: "72%", label: "Lənkəran", price: "₼25" },
  { top: "35%", left: "20%", label: "Naxçıvan", price: "₼45" },
];

export default function MapTeaser() {
  return (
    <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-forest-900 rounded-3xl overflow-hidden relative">
        {/* Content */}
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-0">
          {/* Text side */}
          <div className="lg:w-2/5 p-10 lg:p-16">
            <span className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 text-sm font-semibold px-3 py-1.5 rounded-full mb-6">
              <Map className="w-3.5 h-3.5" />
              İnteraktiv Xəritə
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white leading-tight mb-5">
              Azərbaycanı xəritədən kəşf et
            </h2>
            <p className="text-white/60 text-lg leading-relaxed mb-8">
              Bütün kamp yerlərini Azərbaycan xəritəsində görün. 
              Markerə klikləyin, məkanı tanıyın, rezervasiya edin.
            </p>
            <Link
              href="/map"
              className="inline-flex items-center gap-2.5 bg-amber-500 hover:bg-amber-400 text-forest-900 font-bold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-amber-500/30 active:scale-95"
            >
              <Navigation className="w-4 h-4" />
              Xəritəyə keç
            </Link>
          </div>

          {/* Map visual side */}
          <div className="lg:w-3/5 relative h-72 sm:h-80 lg:h-auto lg:min-h-[420px] w-full">
            {/* Map background image */}
            <img
              src="https://images.unsplash.com/photo-1589519160732-57fc498494f8?w=900&q=80"
              alt="Azərbaycan xəritəsi"
              className="w-full h-full object-cover opacity-30"
            />
            {/* Green tint overlay */}
            <div className="absolute inset-0 bg-forest-800/60" />

            {/* Animated pins */}
            {PINS.map((pin, i) => (
              <div
                key={pin.label}
                className="absolute flex flex-col items-center gap-1"
                style={{
                  top: pin.top,
                  left: pin.left,
                  animationDelay: `${i * 0.3}s`,
                }}
              >
                {/* Pulse ring */}
                <div
                  className="absolute w-10 h-10 rounded-full bg-amber-400/20 animate-ping"
                  style={{ animationDuration: "2.5s", animationDelay: `${i * 0.4}s` }}
                />
                {/* Pin */}
                <div className="relative z-10 bg-amber-400 text-forest-900 text-xs font-bold px-2.5 py-1 rounded-full shadow-lg shadow-amber-400/40 whitespace-nowrap cursor-pointer hover:scale-110 transition-transform">
                  {pin.price}
                </div>
                <div className="w-0.5 h-3 bg-amber-400/60" />
                <span className="text-white/70 text-xs font-medium">{pin.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
