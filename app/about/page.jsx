import { Target, Heart, Leaf, Users, MapPin, Star } from "lucide-react";

// ── Demo data ──────────────────────────────────────────
const TEAM = [
  {
    name: "Əli Həsənov",
    role: "Qurucu & CEO",
    bio: "10 illik turizm təcrübəsi. Azərbaycanın hər guşəsini gəzmiş, kamp mədəniyyətini ölkəyə yaymaq üçün Kamping.az-ı qurub.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    socials: { linkedin: "#", instagram: "#" },
  },
  {
    name: "Nigar Quliyeva",
    role: "Məhsul rəhbəri",
    bio: "UX dizayn və məhsul strategiyası üzrə mütəxəssis. İstifadəçi təcrübəsini mərkəzə alan platforma qurmağı hədəfləyir.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    socials: { linkedin: "#", instagram: "#" },
  },
  {
    name: "Rauf Məmmədov",
    role: "Texniki direktor",
    bio: "Full-stack mühəndis. Platforma arxitekturasını və API inteqrasiyalarını idarə edir. Boş vaxtlarında dağ turizmini seçir.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    socials: { linkedin: "#", instagram: "#" },
  },
  {
    name: "Sevinc Əliyeva",
    role: "Sahibkar əlaqələri",
    bio: "200+ kamp sahibi ilə birbaşa əlaqə saxlayır. Onları platforma vasitəsilə daha çox qonağa çatdırmaq üçün çalışır.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    socials: { linkedin: "#", instagram: "#" },
  },
];

const VALUES = [
  {
    icon: Leaf,
    title: "Ekoloji məsuliyyət",
    desc: "Təbiəti qorumaq prioritetimizdir. Platforma vasitəsilə ekoloji turizmi təşviq edirik.",
  },
  {
    icon: Heart,
    title: "Yerli icmalar",
    desc: "Kamp sahiblərinin gəlirlərini artıraraq yerli iqtisadiyyata töhfə veririk.",
  },
  {
    icon: Target,
    title: "Keyfiyyətə sadiqlik",
    desc: "Hər elan yoxlanılır. İstifadəçilər yalnız etibarlı, keyfiyyətli məkanlara çatır.",
  },
  {
    icon: Users,
    title: "Cəmiyyət ruhu",
    desc: "Kamp həvəskarlarını bir araya gətirən, təcrübə paylaşımını dəstəkləyən bir platforma.",
  },
];

const STATS = [
  { value: "2022", label: "Quruluş ili" },
  { value: "200+", label: "Kamp yeri" },
  { value: "2,400+", label: "Xoşbəxt qonaq" },
  { value: "8", label: "Şəhər" },
];

// ── Page ───────────────────────────────────────────────
export const metadata = {
  title: "Haqqımızda — Kamping.az",
  description:
    "Kamping.az komandası, missiyamız və Azərbaycan kamp mədəniyyətinə töhfəmiz haqqında məlumat əldə edin.",
};

export default function AboutPage() {
  return (
    <main>

      {/* ── Hero ── */}
       
    <section className="relative min-h-[88vh] flex items-center overflow-hidden bg-[#f0ebe3] pt-24">

  {/* Yumşaq gradient blob-lar — arxa fon */}
  <div className="absolute inset-0 pointer-events-none">
    <div
      className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full opacity-40"
      style={{
        background: "radial-gradient(circle, #d4e8d8 0%, transparent 70%)",
      }}
    />
    <div
      className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-30"
      style={{
        background: "radial-gradient(circle, #c8dfc8 0%, transparent 70%)",
      }}
    />
    <div
      className="absolute top-[30%] left-[40%] w-[400px] h-[400px] rounded-full opacity-20"
      style={{
        background: "radial-gradient(circle, #f5d49a 0%, transparent 70%)",
      }}
    />
  </div>

  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

      {/* Sol — mətn */}
      <div>
        {/* Kiçik etiket */}
        <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-forest-100 text-forest-600 text-xs font-semibold px-4 py-2 rounded-full mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          Bakı, Azərbaycan · 2022
        </div>

        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-forest-900 leading-[1.05] mb-6">
          Təbiəti sevən<br />
          insanlar üçün<br />
          <span className="text-forest-600 italic font-normal">qurduq bunu.</span>
        </h1>

        <p className="text-forest-500 text-lg leading-relaxed max-w-md mb-10">
          Kamping.az — Azərbaycanın gözəl təbiətini hər kəsə
          əlçatan etmək üçün yaradılmış bir platformadır.
          Sadə, etibarlı, səmimi.
        </p>

        {/* Stats — pill şəklində */}
        <div className="flex flex-wrap gap-3">
          {[
            { n: "200+", l: "Kamp yeri" },
            { n: "2,400+", l: "Xoşbəxt qonaq" },
            { n: "4.8★", l: "Ortalama reytinq" },
          ].map((s) => (
            <div
              key={s.l}
              className="bg-white/80 backdrop-blur-sm border border-forest-100 rounded-2xl px-5 py-3"
            >
              <div className="font-display text-xl font-bold text-forest-900">{s.n}</div>
              <div className="text-forest-400 text-xs mt-0.5">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sağ — yumşaq mozaika */}
      <div className="hidden lg:grid grid-cols-2 gap-4 h-[480px]">

        {/* Böyük şəkil — sol */}
        <div className="row-span-2 rounded-3xl overflow-hidden img-zoom shadow-lg shadow-forest-900/8">
          <img
            src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80"
            alt="Kamp"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Kiçik şəkil — sağ yuxarı */}
        <div className="rounded-3xl overflow-hidden img-zoom shadow-lg shadow-forest-900/8">
          <img
            src="https://images.unsplash.com/photo-1533873984035-25970ab07461?w=400&q=80"
            alt="Glamping"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Məlumat kartı — sağ aşağı */}
        <div className="rounded-3xl bg-forest-800 p-6 flex flex-col justify-between shadow-lg">
          <div className="text-4xl">🌲</div>
          <div>
            <div className="font-display text-2xl font-bold text-white mb-1">
              Azərbaycan
            </div>
            <div className="text-white/50 text-sm leading-snug">
              Hər guşəsindən ən gözəl məkanlar
            </div>
          </div>
          <div className="flex gap-1 mt-3">
            {["Şəki","Qəbələ","Lerik"].map(c => (
              <span key={c} className="text-xs bg-white/10 text-white/70 px-2.5 py-1 rounded-full">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>





      {/* ── Stats ── */}
      <section className="bg-amber-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display text-4xl sm:text-5xl font-bold text-forest-900 mb-1">
                  {s.value}
                </div>
                <div className="text-forest-800/70 text-sm font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden aspect-[4/3] img-zoom">
              <img
                src="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800&q=80"
                alt="Kamp atəşi"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-2xl shadow-forest-900/15 p-5 max-w-[200px]">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-forest-900 text-sm">4.8 / 5</span>
              </div>
              <p className="text-forest-500 text-xs leading-snug">
                2,400+ istifadəçinin ortalama qiymətləndirməsi
              </p>
            </div>
          </div>

          {/* Text */}
          <div>
            <span className="text-amber-600 text-sm font-semibold uppercase tracking-widest">
              Missiyamız
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-forest-900 mt-3 mb-6 leading-tight">
              Niyə Kamping.az?
            </h2>
            <div className="space-y-4 text-forest-600 text-base leading-relaxed">
              <p>
                Azərbaycan qeyri-adi bir coğrafiyaya malikdir — Xəzər sahilindən 
                tutmuş Böyük Qafqazın zirvələrinə, Talış meşələrindən Naxçıvanın 
                səhrasına qədər hər guşəsi unikaldır.
              </p>
              <p>
                Amma bu gözəllikləri kəşf etmək həmişə asan olmurdu. Etibarlı 
                məlumat, keyfiyyətli məkanlar tapmaq çətin idi. Biz bu problemi 
                həll etmək üçün yola çıxdıq.
              </p>
              <p>
                Kamping.az yalnız bir rezervasiya platforması deyil — bu, 
                Azərbaycanda kamp mədəniyyətini inkişaf etdirmək üçün qurulan 
                bir hərəkatdır.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <MapPin className="w-5 h-5 text-amber-500 shrink-0" />
              <span className="text-forest-700 font-medium">
                Bakı, Azərbaycan — 2022-ci ildən
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-20 bg-forest-900/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-amber-600 text-sm font-semibold uppercase tracking-widest">
              Dəyərlərimiz
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-forest-900 mt-2 leading-tight">
              Bizi irəliyə aparan
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="bg-white rounded-2xl p-7 border border-forest-100 hover:border-forest-200 hover:shadow-lg hover:shadow-forest-900/6 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-forest-50 group-hover:bg-amber-50 rounded-xl flex items-center justify-center mb-5 transition-colors">
                    <Icon className="w-6 h-6 text-forest-700 group-hover:text-amber-600 transition-colors" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display text-lg font-bold text-forest-900 mb-2">
                    {v.title}
                  </h3>
                  <p className="text-forest-500 text-sm leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-amber-600 text-sm font-semibold uppercase tracking-widest">
            Komanda
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-forest-900 mt-2 leading-tight">
            Arxasındakı insanlar
          </h2>
          <p className="text-forest-500 mt-4 text-base leading-relaxed">
            Kiçik amma güclü bir komanda. Hər birimiz Azərbaycan təbiətini sevir
            və bu platformaya ürəklə inanırıq.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {TEAM.map((member) => (
            <div key={member.name} className="group text-center">
              {/* Avatar */}
              <div className="relative w-36 h-36 mx-auto mb-5">
                <div className="w-full h-full rounded-2xl overflow-hidden img-zoom border-4 border-white shadow-xl shadow-forest-900/10">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Amber accent corner */}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-amber-500 rounded-lg shadow-md" />
              </div>

              <h3 className="font-display text-xl font-bold text-forest-900 mb-1">
                {member.name}
              </h3>
              <div className="text-amber-600 text-sm font-semibold mb-3">
                {member.role}
              </div>
              <p className="text-forest-500 text-sm leading-relaxed px-2">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Join CTA ── */}
      <section className="py-20 bg-forest-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-5 leading-tight">
            Siz də bu hərəkata qoşulun
          </h2>
          <p className="text-white/60 text-lg mb-10 leading-relaxed">
            İstər kamp həvəskarı, istər kamp sahibi olun — Kamping.az sizin üçün 
            burada. Qeydiyyatdan keçin, Azərbaycanın gözəlliklərini kəşf edin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/register?role=visitor" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200">Məkanları kəşf et</a>
            <a href="/register?role=owner" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200">Sahibkar ol</a>
          </div>
        </div>
      </section>

    </main>
  );
}