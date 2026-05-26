import { Search, CalendarCheck, Tent, Smile } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    number: "01",
    title: "Axtar",
    desc: "Şəhər, tarix və qonaq sayına görə uyğun kamp yerini tap. Xəritə və ya siyahı görünüşündən istifadə et.",
  },
  {
    icon: CalendarCheck,
    number: "02",
    title: "Rezervasiya et",
    desc: "Bəyəndiyini seç, tarixi müəyyənləşdir, təhlükəsiz ödəniş et. Sahibkar 24 saat ərzində təsdiq edəcək.",
  },
  {
    icon: Tent,
    number: "03",
    title: "Hazırlaş",
    desc: "Rezervasiya təsdiqləndi. İndi sadəcə çantanı götür, yola düş. Bütün detallar emaildə olacaq.",
  },
  {
    icon: Smile,
    number: "04",
    title: "Zövq al",
    desc: "Unudulmaz bir təcrübə yaşa. Geri qayıdanda rəyini paylaş, başqalarına da kömək et.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-amber-600 text-sm font-semibold uppercase tracking-widest">
          Necə işləyir?
        </span>
        <h2 className="font-display text-4xl sm:text-5xl font-bold text-forest-900 mt-2 leading-tight">
          4 addımda kamp macərası
        </h2>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={i} className="relative group">
              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[calc(50%+32px)] right-[-calc(50%-32px)] h-px bg-forest-200 z-0" />
              )}

              <div className="relative z-10 flex flex-col items-center text-center">
                {/* Icon circle */}
                <div className="w-20 h-20 rounded-2xl bg-forest-50 border-2 border-forest-100 group-hover:border-forest-300 group-hover:bg-forest-100 transition-all duration-300 flex items-center justify-center mb-5 relative">
                  <Icon className="w-8 h-8 text-forest-700" strokeWidth={1.5} />
                  {/* Number badge */}
                  <span className="absolute -top-2.5 -right-2.5 w-6 h-6 bg-amber-500 text-forest-900 text-xs font-bold rounded-full flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold text-forest-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-forest-500 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
