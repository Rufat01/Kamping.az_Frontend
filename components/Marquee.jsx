const ITEMS = [
  "⛺ 200+ Kamp Yeri",
  "🏔️ Azərbaycanın hər guşəsi",
  "⭐ 4.8 Ortalama reytinq",
  "🌲 Təbiətlə üz-üzə",
  "🏕️ Glamping mövcuddur",
  "📍 GPS koordinatları",
  "🔒 Təhlükəsiz ödəniş",
  "💚 Ekoloji turizm",
];

export default function Marquee() {
  const doubled = [...ITEMS, ...ITEMS];

  return (
    <div className="py-6 bg-forest-800 overflow-hidden border-y border-forest-700">
      <div className="flex gap-12 animate-marquee whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="text-white/70 text-sm font-medium tracking-wide shrink-0"
          >
            {item}
            <span className="mx-6 text-forest-600">—</span>
          </span>
        ))}
      </div>
    </div>
  );
}
