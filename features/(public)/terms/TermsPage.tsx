"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

const SECTIONS = [
  { id: "intro",       label: "Giriş və Qəbul" },
  { id: "service",     label: "Xidmətin Təsviri" },
  { id: "account",     label: "Hesab Qeydiyyatı" },
  { id: "obligations", label: "İstifadəçi Öhdəlikləri" },
  { id: "prohibited",  label: "Qadağan Edilmiş Fəaliyyətlər" },
  { id: "content",     label: "Məzmun Siyasəti" },
  { id: "booking",     label: "Rezervasiya və Ödəniş" },
  { id: "ip",          label: "Əqli Mülkiyyət" },
  { id: "liability",   label: "Məsuliyyətin Məhdudlaşdırılması" },
  { id: "termination", label: "Hesabın Dayandırılması" },
  { id: "law",         label: "Tətbiq Edilən Hüquq" },
  { id: "changes",     label: "Şərtlərdə Dəyişikliklər" },
  { id: "contact",     label: "Əlaqə" },
];

export default function TermsPage() {
  const [activeId, setActiveId] = useState("intro");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const headings = document.querySelectorAll("[data-section]");
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    headings.forEach((el) => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <>
      <Navbar forceScrolled />
      <div style={{ background: "#F8F9FA", minHeight: "100vh" }}>

        {/* PAGE HEADER */}
        <div style={{ background: "#fff", borderBottom: "1px solid #DADCE0" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
            <nav className="flex items-center gap-1 text-sm mb-5" aria-label="Breadcrumb">
              <Link href="/" className="hover:underline" style={{ color: "#1967D2" }}>
                Kamping.az
              </Link>
              <ChevronRight className="w-4 h-4" style={{ color: "#5F6368" }} />
              <span style={{ color: "#5F6368" }}>İstifadə Şərtləri</span>
            </nav>
            <h1
              className="font-sans font-normal tracking-tight"
              style={{ color: "#202124", fontSize: "clamp(1.75rem, 4vw, 2.25rem)", lineHeight: 1.2 }}
            >
              İstifadə Şərtləri
            </h1>
            <p className="mt-2 text-sm" style={{ color: "#5F6368" }}>
              Son yenilənmə: 29 İyun 2026
            </p>
          </div>
        </div>

        {/* BODY */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex gap-10 lg:gap-16 items-start">

            {/* SIDEBAR */}
            <aside
              className="hidden lg:block flex-shrink-0 w-64"
              style={{ position: "sticky", top: "80px", alignSelf: "flex-start" }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-3"
                style={{ color: "#5F6368", letterSpacing: "0.08em" }}
              >
                Bu səhifədə
              </p>
              <nav>
                <ul className="space-y-0.5">
                  {SECTIONS.map(({ id, label }) => {
                    const isActive = activeId === id;
                    return (
                      <li key={id}>
                        <a
                          href={`#${id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                          }}
                          className="flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors"
                          style={{
                            color: isActive ? "#1967D2" : "#3C4043",
                            background: isActive ? "#E8F0FE" : "transparent",
                            fontWeight: isActive ? 500 : 400,
                          }}
                        >
                          {isActive && (
                            <span
                              className="w-0.5 h-4 rounded-full flex-shrink-0"
                              style={{ background: "#1967D2" }}
                            />
                          )}
                          {label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </aside>

            {/* MAIN CONTENT */}
            <article
              className="flex-1 min-w-0 bg-white rounded-lg"
              style={{ border: "1px solid #DADCE0" }}
            >
              <div
                className="divide-y"
                style={{ "--tw-divide-opacity": 1, borderColor: "#DADCE0" } as React.CSSProperties}
              >

                {/* 1. GİRİŞ */}
                <section id="intro" data-section className="px-8 py-10 scroll-mt-24">
                  <h2 className="text-xl font-medium mb-4" style={{ color: "#202124" }}>
                    Giriş və Qəbul
                  </h2>
                  <p className="text-sm leading-7 mb-4" style={{ color: "#3C4043" }}>
                    Bu İstifadə Şərtləri (<strong style={{ color: "#202124", fontWeight: 500 }}>"Şərtlər"</strong>){" "}
                    Kamping.az platforması ilə siz (<strong style={{ color: "#202124", fontWeight: 500 }}>"İstifadəçi"</strong>){" "}
                    arasındakı hüquqi müqaviləni təşkil edir. Platformamızdan istifadə etməklə,
                    qeydiyyatdan keçməklə və ya hesab yaratmaqla bu Şərtləri tam qəbul etmiş sayılırsınız.
                  </p>
                  <p className="text-sm leading-7" style={{ color: "#3C4043" }}>
                    Bu Şərtləri qəbul etmirsinizsə, platformadan istifadəni dayandırmanızı xahiş edirik.
                  </p>
                  <div
                    className="mt-5 rounded-lg px-5 py-4 text-sm leading-7"
                    style={{ background: "#E8F0FE", color: "#174EA6" }}
                  >
                    <strong style={{ fontWeight: 500 }}>Xidmət təminatçısı:</strong> Kamping.az,
                    Azərbaycan Respublikası, Bakı şəhəri.
                    Əlaqə: <a href="mailto:support@kamping.az" className="underline">support@kamping.az</a>
                  </div>
                </section>

                {/* 2. XİDMƏTİN TƏSVİRİ */}
                <section id="service" data-section className="px-8 py-10 scroll-mt-24">
                  <h2 className="text-xl font-medium mb-4" style={{ color: "#202124" }}>
                    Xidmətin Təsviri
                  </h2>
                  <p className="text-sm leading-7 mb-4" style={{ color: "#3C4043" }}>
                    Kamping.az Azərbaycandakı kamp yerlərini, qlampinq otaqlarını, bungalovları və
                    digər açıq hava məkanlarını birləşdirən rəqəmsal platformadır. Xidmətlərimiz
                    aşağıdakıları əhatə edir:
                  </p>
                  <ul className="space-y-3">
                    {[
                      ["Məkan axtarışı", "İstifadəçilərin kamp yerlərini kəşf etməsi, filtirləməsi və xəritədə görməsi"],
                      ["Rezervasiya", "Seçilmiş məkanlar üçün online rezervasiya və ödəniş imkanı"],
                      ["Elan yerləşdirmə", "Sahibkarların öz məkanlarını platformada nümayiş etdirməsi"],
                      ["Rəy sistemi", "İstifadəçilərin məkanlar haqqında rəy və reytinq bildirməsi"],
                    ].map(([term, def]) => (
                      <li key={term} className="flex gap-3 text-sm leading-6" style={{ color: "#3C4043" }}>
                        <span className="mt-2.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#1967D2" }} />
                        <span>
                          <strong style={{ color: "#202124", fontWeight: 500 }}>{term}:</strong>{" "}{def}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 text-sm leading-7" style={{ color: "#3C4043" }}>
                    Kamping.az bir pazar yeri platformasıdır. Sahibkarlar ilə istifadəçilər arasındakı
                    münasibətlərdə birbaşa tərəf deyilik; xidməti asanlaşdıran texnoloji vasitəçiyik.
                  </p>
                </section>

                {/* 3. HESAB QEYDİYYATI */}
                <section id="account" data-section className="px-8 py-10 scroll-mt-24">
                  <h2 className="text-xl font-medium mb-4" style={{ color: "#202124" }}>
                    Hesab Qeydiyyatı
                  </h2>
                  <p className="text-sm leading-7 mb-5" style={{ color: "#3C4043" }}>
                    Platformanın bəzi xüsusiyyətlərindən istifadə üçün hesab yaratmaq tələb olunur.
                    Qeydiyyat zamanı aşağıdakı öhdəlikləri qəbul edirsiniz:
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Doğru, dəqiq və tam məlumat təqdim etmək",
                      "Yalnız bir aktiv hesaba sahib olmaq",
                      "Hesab məlumatlarınızın məxfiliyini qorumaq",
                      "Hesabınızda baş verən bütün fəaliyyətə görə məsuliyyət daşımaq",
                      "Hesabınızın icazəsiz istifadəsini dərhal bizə bildirmək",
                    ].map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-6" style={{ color: "#3C4043" }}>
                        <span className="mt-2.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#1967D2" }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 text-sm leading-7" style={{ color: "#3C4043" }}>
                    Hesabınızı başqa şəxsə verməyiniz, icarəyə verməyiniz və ya satmanız qəti qadağandır.
                  </p>
                </section>

                {/* 4. İSTİFADƏÇİ ÖHDƏLİKLƏRİ */}
                <section id="obligations" data-section className="px-8 py-10 scroll-mt-24">
                  <h2 className="text-xl font-medium mb-4" style={{ color: "#202124" }}>
                    İstifadəçi Öhdəlikləri
                  </h2>
                  <p className="text-sm leading-7 mb-5" style={{ color: "#3C4043" }}>
                    Platformadan istifadə edərkən aşağıdakılara riayət etməyiniz tələb olunur:
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Azərbaycan Respublikasının qanunvericiliyinə tam riayət etmək",
                      "Digər istifadəçilərə, sahibkarlara və platforma işçilərinə hörmətlə yanaşmaq",
                      "Yalnız öz adınıza rezervasiya etmək və ya etdiyiniz rezervasiyaların məsuliyyətini daşımaq",
                      "Rəqəmsal saxtakarlıq, phishing və ya sosial mühəndislik cəhdlərindən çəkinmək",
                      "Platformanın normal işini pozan hər hansı fəaliyyətdən çəkinmək",
                    ].map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-6" style={{ color: "#3C4043" }}>
                        <span className="mt-2.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#1967D2" }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>

                {/* 5. QADAĞAN EDİLMİŞ FƏALİYYƏTLƏR */}
                <section id="prohibited" data-section className="px-8 py-10 scroll-mt-24">
                  <h2 className="text-xl font-medium mb-4" style={{ color: "#202124" }}>
                    Qadağan Edilmiş Fəaliyyətlər
                  </h2>
                  <p className="text-sm leading-7 mb-5" style={{ color: "#3C4043" }}>
                    Aşağıdakı fəaliyyətlər platformamızda qəti qadağandır:
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Saxta məkan elanları yerləşdirmək və ya yanlış məlumat vermək",
                      "Digər istifadəçiləri aldatmaq, həqiqi olmayan rəylər yazmaq",
                      "Platformanın texniki altyapısına müdaxilə, hacking, scraping cəhdləri",
                      "Spam, kütləvi mesaj göndərmək və ya platformanı reklam üçün sui-istifadə etmək",
                      "Başqa bir şəxsin şəxsiyyətinə bürünmək",
                      "Qeyri-qanuni məzmun paylaşmaq (müəllif hüquqlarını pozan, nifrət, zorakılıq və s.)",
                      "Platformanı rəqib bir xidmət qurmaq üçün istifadə etmək",
                    ].map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-6" style={{ color: "#3C4043" }}>
                        <span className="mt-2.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#EA4335" }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div
                    className="mt-5 rounded-lg px-5 py-4 text-sm leading-7"
                    style={{ background: "#FCE8E6", color: "#C5221F" }}
                  >
                    Bu qaydalara zidd hər hansı fəaliyyət hesabın dərhal bloklanması və hüquqi
                    tədbirlərin görülməsi ilə nəticələnə bilər.
                  </div>
                </section>

                {/* 6. MƏZMUN SİYASƏTİ */}
                <section id="content" data-section className="px-8 py-10 scroll-mt-24">
                  <h2 className="text-xl font-medium mb-4" style={{ color: "#202124" }}>
                    Məzmun Siyasəti
                  </h2>
                  <p className="text-sm leading-7 mb-4" style={{ color: "#3C4043" }}>
                    Platforma daxilində paylaşdığınız məzmun (şəkillər, rəylər, elan məlumatları) üçün
                    aşağıdakı qaydalar tətbiq olunur:
                  </p>
                  <ul className="space-y-3 mb-5">
                    {[
                      "Paylaşdığınız məzmunun müəllif hüquqları sizə məxsus olmalı və ya icazəniz olmalıdır",
                      "Rəylər real təcrübəyə əsaslanmalıdır; saxta rəylər silinəcək",
                      "Elan şəkilləri həmin məkana aid, gerçək fotoşəkillər olmalıdır",
                      "Şəxsi məlumat (başqasının telefonu, ünvanı) paylaşmaq qadağandır",
                    ].map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-6" style={{ color: "#3C4043" }}>
                        <span className="mt-2.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#1967D2" }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm leading-7" style={{ color: "#3C4043" }}>
                    Platforma qaydalarına uymayan məzmunu xəbərdarlıq etmədən silmək hüququnu
                    saxlayırıq. Paylaşdığınız məzmunun platformada istifadəsinə (göstərilməsi, axtarışda
                    çıxması) razılıq vermiş sayılırsınız.
                  </p>
                </section>

                {/* 7. REZERVASİYA VƏ ÖDƏNİŞ */}
                <section id="booking" data-section className="px-8 py-10 scroll-mt-24">
                  <h2 className="text-xl font-medium mb-4" style={{ color: "#202124" }}>
                    Rezervasiya və Ödəniş
                  </h2>
                  <ul className="space-y-4">
                    {[
                      ["Rezervasiya müqaviləsi", "Rezervasiya tamamlandıqda siz ilə məkan sahibi arasında birbaşa müqavilə yaranır. Kamping.az bu müqavilənin tərəfi deyil."],
                      ["Ödəniş", "Ödənişlər platformanın ödəniş altyapısı vasitəsilə emal olunur. Ödəniş məlumatlarınız PCI DSS standartlarına uyğun qorunur."],
                      ["Ləğvetmə siyasəti", "Ləğvetmə şərtləri hər məkan üçün ayrıca göstərilir. Rezervasiya zamanı tətbiq edilən şərtlər əsas götürülür."],
                      ["Geri ödəmə", "Geri ödəmə hüququ məkan sahibinin ləğvetmə siyasətinə uyğun həyata keçirilir. Texniki xəta hallarında Kamping.az tam geri ödəmə təmin edir."],
                    ].map(([term, def]) => (
                      <li key={term} className="flex gap-3 text-sm leading-6" style={{ color: "#3C4043" }}>
                        <span className="mt-2.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#1967D2" }} />
                        <span>
                          <strong style={{ color: "#202124", fontWeight: 500 }}>{term}:</strong>{" "}{def}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* 8. ƏQLİ MÜLKİYYƏT */}
                <section id="ip" data-section className="px-8 py-10 scroll-mt-24">
                  <h2 className="text-xl font-medium mb-4" style={{ color: "#202124" }}>
                    Əqli Mülkiyyət
                  </h2>
                  <p className="text-sm leading-7 mb-4" style={{ color: "#3C4043" }}>
                    Kamping.az platformasının bütün hüquqları qorunur:
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Platforma dizaynı, loqo, brend adı, yazılım kodu Kamping.az-a məxsusdur",
                      "İstifadəçilər platformanın məzmununu kommersiya məqsədilə kopyalaya, paylaya bilməz",
                      "İstifadəçilərin öz yüklədiyi şəkil və məzmunun müəllif hüquqları istifadəçiyə aiddir",
                      "Platformanın adını, loqosunu icazəsiz istifadə etmək qadağandır",
                    ].map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-6" style={{ color: "#3C4043" }}>
                        <span className="mt-2.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#1967D2" }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>

                {/* 9. MƏSULİYYƏTİN MƏHDUDLAŞDIRILMASI */}
                <section id="liability" data-section className="px-8 py-10 scroll-mt-24">
                  <h2 className="text-xl font-medium mb-4" style={{ color: "#202124" }}>
                    Məsuliyyətin Məhdudlaşdırılması
                  </h2>
                  <p className="text-sm leading-7 mb-4" style={{ color: "#3C4043" }}>
                    Kamping.az aşağıdakı hallarda məsuliyyət daşımır:
                  </p>
                  <ul className="space-y-3 mb-5">
                    {[
                      "Məkan sahiblərinin verdiyi yanlış məlumatlardan yaranan zərərlər",
                      "Rezervasiya zamanı məkan sahibi ilə istifadəçi arasında yaranan mübahisələr",
                      "Platformanın müvəqqəti olaraq əlçatmaz olmasından yaranan zərərlər",
                      "Üçüncü tərəf xidmətlərindəki nasazlıqlar (internet, ödəniş sistemi və s.)",
                      "İstifadəçinin öz hərəkətlərindən yaranan birbaşa və ya dolayı zərərlər",
                    ].map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-6" style={{ color: "#3C4043" }}>
                        <span className="mt-2.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#1967D2" }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm leading-7" style={{ color: "#3C4043" }}>
                    Platforma xidmətləri <strong style={{ color: "#202124", fontWeight: 500 }}>"olduğu kimi"</strong> təqdim
                    olunur. Qanunvericiliyin icazə verdiyi həddə platformamızın ümumi məsuliyyəti
                    son 12 ay ərzində ödənilmiş xidmət haqqları ilə məhdudlaşır.
                  </p>
                </section>

                {/* 10. HESABIN DAYANDIRMASI */}
                <section id="termination" data-section className="px-8 py-10 scroll-mt-24">
                  <h2 className="text-xl font-medium mb-4" style={{ color: "#202124" }}>
                    Hesabın Dayandırılması
                  </h2>
                  <p className="text-sm leading-7 mb-4" style={{ color: "#3C4043" }}>
                    Hesabınız aşağıdakı hallarda müvəqqəti bloklanabilər və ya tamamilə silinə bilər:
                  </p>
                  <ul className="space-y-3 mb-5">
                    {[
                      "Bu Şərtlərin pozulması",
                      "Saxtakarlıq, aldatma və ya digər qanunsuz fəaliyyətlər",
                      "Başqa istifadəçilərə zərər verən hərəkətlər",
                      "Uzun müddət (12+ ay) aktiv olmayan hesablar — əvvəlcədən bildiriş göndərildikdən sonra",
                    ].map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-6" style={{ color: "#3C4043" }}>
                        <span className="mt-2.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#1967D2" }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm leading-7" style={{ color: "#3C4043" }}>
                    İstifadəçi istədiyi zaman hesabını özü silə bilər. Hesab silinməsi ilə
                    bağlı məlumatların saxlanma qaydaları üçün{" "}
                    <Link href="/privacy#retention" className="hover:underline" style={{ color: "#1967D2" }}>
                      Məxfilik Siyasətimizə
                    </Link>{" "}
                    baxın.
                  </p>
                </section>

                {/* 11. TƏTBİQ EDİLƏN HÜQUQ */}
                <section id="law" data-section className="px-8 py-10 scroll-mt-24">
                  <h2 className="text-xl font-medium mb-4" style={{ color: "#202124" }}>
                    Tətbiq Edilən Hüquq və Mübahisələrin Həlli
                  </h2>
                  <p className="text-sm leading-7 mb-4" style={{ color: "#3C4043" }}>
                    Bu Şərtlər <strong style={{ color: "#202124", fontWeight: 500 }}>Azərbaycan Respublikasının
                    qanunvericiliyinə</strong> uyğun olaraq tənzimlənir və şərh edilir.
                  </p>
                  <p className="text-sm leading-7" style={{ color: "#3C4043" }}>
                    Platformamızla bağlı yaranan hər hansı mübahisə ilk növbədə danışıqlar yolu ilə
                    həll edilməyə çalışılacaq. Razılıq əldə edilmədikdə mübahisə Bakı şəhəri
                    məhkəmələrinin yurisdiksiyasına uyğun olaraq həll ediləcək.
                  </p>
                </section>

                {/* 12. DƏYİŞİKLİKLƏR */}
                <section id="changes" data-section className="px-8 py-10 scroll-mt-24">
                  <h2 className="text-xl font-medium mb-4" style={{ color: "#202124" }}>
                    Şərtlərdə Dəyişikliklər
                  </h2>
                  <p className="text-sm leading-7" style={{ color: "#3C4043" }}>
                    Kamping.az bu Şərtləri istənilən vaxt yeniləmək hüququnu saxlayır. Əhəmiyyətli
                    dəyişikliklər olduqda istifadəçilər platforma daxilindəki bildiriş vasitəsilə
                    ən az <strong style={{ color: "#202124", fontWeight: 500 }}>7 gün</strong> əvvəl
                    məlumatlandırılacaq. Bildirişdən sonra platformadan istifadəni davam etdirməklə
                    yenilənmiş Şərtləri qəbul etmiş sayılırsınız.
                  </p>
                </section>

                {/* 13. ƏLAQƏ */}
                <section id="contact" data-section className="px-8 py-10 scroll-mt-24">
                  <h2 className="text-xl font-medium mb-4" style={{ color: "#202124" }}>
                    Əlaqə
                  </h2>
                  <p className="text-sm leading-7 mb-5" style={{ color: "#3C4043" }}>
                    Bu Şərtlərlə bağlı suallarınız üçün bizimlə əlaqə saxlayın:
                  </p>
                  <div
                    className="rounded-lg px-6 py-5 text-sm space-y-2"
                    style={{ background: "#F8F9FA", border: "1px solid #DADCE0" }}
                  >
                    <p style={{ color: "#3C4043" }}>
                      <strong style={{ color: "#202124", fontWeight: 500 }}>Kamping.az</strong>
                    </p>
                    <p style={{ color: "#3C4043" }}>Azərbaycan Respublikası, Bakı şəhəri</p>
                    <a
                      href="mailto:support@kamping.az"
                      className="inline-block hover:underline font-medium"
                      style={{ color: "#1967D2" }}
                    >
                      support@kamping.az
                    </a>
                  </div>
                </section>

              </div>
            </article>
          </div>

          <p className="mt-8 text-center text-xs" style={{ color: "#80868B" }}>
            © {new Date().getFullYear()} Kamping.az — Bütün hüquqlar qorunur
          </p>
        </div>
      </div>
    </>
  );
}
