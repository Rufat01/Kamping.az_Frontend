const ITEMS = [
  "Meşə cığırları",
  "Dağ yamacları",
  "Göl kənarları",
  "Ulduzlu Gecələr",
  "Tonqal Səsi",
  "Şəhər susqunluğu",
  "Təbii Mənzərələr",
  "Macera",
];

export default function Marquee() {
  const doubled = [...ITEMS, ...ITEMS];
  return (
    <div className="overflow-hidden py-4 border-y border-[#E8E5D8]" style={{ background: "#FAF6F0" }}>
      <div className="flex gap-12 animate-marquee whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="text-[#2D4A33]/60 text-xs font-semibold uppercase tracking-[0.2em] shrink-0 flex items-center gap-4 font-display">
            {item}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="opacity-50">
              <path d="M8 2 C10 4, 12 7, 8 14 C4 7, 6 4, 8 2 Z" fill="#D4A574" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}
