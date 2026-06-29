"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

const SECTIONS = [
  { id: "intro",        label: "Giriş" },
  { id: "data",         label: "Topladığımız Məlumatlar" },
  { id: "usage",        label: "İstifadə Məqsədi" },
  { id: "cookies",      label: "Cookie və İzləmə" },
  { id: "third-party",  label: "Üçüncü Tərəf Xidmətləri" },
  { id: "security",     label: "Məlumatların Təhlükəsizliyi" },
  { id: "retention",    label: "Saxlanma Müddəti" },
  { id: "rights",       label: "İstifadəçi Hüquqları" },
  { id: "transfers",    label: "Beynəlxalq Ötürmə" },
  { id: "sharing",      label: "Məlumatların Paylaşılması" },
  { id: "changes",      label: "Siyasətdə Dəyişikliklər" },
  { id: "contact",      label: "Əlaqə" },
];

export default function PrivacyPage() {
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
              <span style={{ color: "#5F6368" }}>Məxfilik Siyasəti</span>
            </nav>
            <h1
              className="font-sans font-normal tracking-tight"
              style={{ color: "#202124", fontSize: "clamp(1.75rem, 4vw, 2.25rem)", lineHeight: 1.2 }}
            >
              Məxfilik Siyasəti
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
                    Giriş
                  </h2>
                  <p className="text-sm leading-7" style={{ color: "#3C4043" }}>
                    Bu Məxfilik Siyasəti <strong style={{ color: "#202124", fontWeight: 500 }}>Kamping.az</strong> platformasının
                    istifadəçilərinin şəxsi məlumatlarının necə toplandığını, istifadə edildiyini, qorundurğunu
                    və paylaşıldığını izah edir. Platformamızdan istifadə etməklə siz bu siyasətin şərtlərini
                    qəbul etmiş sayılırsınız.
                  </p>
                  <div
                    className="mt-5 rounded-lg px-5 py-4 text-sm leading-7"
                    style={{ background: "#E8F0FE", color: "#174EA6" }}
                  >
                    <strong style={{ fontWeight: 500 }}>Məlumat idarəçisi:</strong> Kamping.az, Azərbaycan Respublikası, Bakı şəhəri.
                    Əlaqə: <a href="mailto:support@kamping.az" className="underline">support@kamping.az</a>
                  </div>
                </section>

                {/* 2. TOPLANAN MƏLUMATLAR */}
                <section id="data" data-section className="px-8 py-10 scroll-mt-24">
                  <h2 className="text-xl font-medium mb-4" style={{ color: "#202124" }}>
                    Topladığımız Məlumatlar
                  </h2>
                  <p className="text-sm leading-7 mb-5" style={{ color: "#3C4043" }}>
                    Platformamızdan istifadə zamanı aşağıdakı məlumatlar toplana bilər:
                  </p>
                  <ul className="space-y-3">
                    {[
                      ["Telefon nömrəsi", "OTP (birdəfəlik kod) ilə hesab təsdiqləməsi üçün"],
                      ["Ad və soyad", "Profilin identifikasiyası üçün"],
                      ["E-poçt ünvanı", "İstəyə bağlı; bildiriş məqsədilə"],
                      ["Profil şəkli", "İstəyə bağlı; hesab şəxsiləşdirməsi üçün"],
                      ["Cihaz və brauzer məlumatları", "Platformanın düzgün işləməsi üçün"],
                      ["Təxmini IP ünvanı və texniki giriş qeydləri", "Təhlükəsizlik monitorinqi üçün"],
                    ].map(([term, def]) => (
                      <li key={term} className="flex gap-3 text-sm leading-6" style={{ color: "#3C4043" }}>
                        <span className="mt-2.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#1967D2" }} />
                        <span>
                          <strong style={{ color: "#202124", fontWeight: 500 }}>{term}</strong>
                          {" — "}
                          {def}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* 3. İSTİFADƏ MƏQSƏDİ */}
                <section id="usage" data-section className="px-8 py-10 scroll-mt-24">
                  <h2 className="text-xl font-medium mb-4" style={{ color: "#202124" }}>
                    Məlumatlardan İstifadə Məqsədi
                  </h2>
                  <p className="text-sm leading-7 mb-5" style={{ color: "#3C4043" }}>
                    Toplanan məlumatlar yalnız aşağıdakı məqsədlər üçün istifadə olunur:
                  </p>
                  <ul className="space-y-3">
                    {[
                      "İstifadəçi hesabının yaradılması və saxlanılması",
                      "OTP vasitəsilə təhlükəsiz girişin təmin edilməsi",
                      "Platformanın funksionallığının yaxşılaşdırılması",
                      "İstifadəçi dəstəyi xidmətinin göstərilməsi",
                      "Təhlükəsizlik pozuntularının və saxtakarlığın qarşısının alınması",
                    ].map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-6" style={{ color: "#3C4043" }}>
                        <span className="mt-2.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#1967D2" }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>

                {/* 4. COOKIE */}
                <section id="cookies" data-section className="px-8 py-10 scroll-mt-24">
                  <h2 className="text-xl font-medium mb-4" style={{ color: "#202124" }}>
                    Cookie və İzləmə Texnologiyaları
                  </h2>
                  <p className="text-sm leading-7 mb-5" style={{ color: "#3C4043" }}>
                    Platformamız aşağıdakı məqsədlər üçün cookie və oxşar texnologiyalardan istifadə edir:
                  </p>
                  <ul className="space-y-4 mb-6">
                    {[
                      ["Zəruri cookie-lər", "Platformanın işləməsi üçün mütləq lazımdır. Sessiyanın saxlanması, autentifikasiya."],
                      ["Funksional cookie-lər", "İstifadəçi seçimlərini (dil, region) yadda saxlayır."],
                      ["Analitik cookie-lər", "Firebase Analytics vasitəsilə anonim istifadə statistikası toplanır."],
                      ["Təhlükəsizlik cookie-ləri", "Google reCAPTCHA bot hücumlarının qarşısını almaq üçün cookie istifadə edir."],
                    ].map(([term, def]) => (
                      <li key={term} className="flex gap-3 text-sm leading-6" style={{ color: "#3C4043" }}>
                        <span className="mt-2.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#1967D2" }} />
                        <span>
                          <strong style={{ color: "#202124", fontWeight: 500 }}>{term}:</strong>
                          {" "}{def}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm leading-7" style={{ color: "#3C4043" }}>
                    Brauzerinizin parametrlərindən cookie-ləri idarə edə və ya silə bilərsiniz. Zəruri
                    cookie-lərin bloklanması platformanın düzgün işləməsinə mane ola bilər.
                  </p>
                </section>

                {/* 5. ÜÇÜNCÜ TƏRƏF */}
                <section id="third-party" data-section className="px-8 py-10 scroll-mt-24">
                  <h2 className="text-xl font-medium mb-4" style={{ color: "#202124" }}>
                    Üçüncü Tərəf Xidmətləri
                  </h2>
                  <p className="text-sm leading-7 mb-5" style={{ color: "#3C4043" }}>
                    Platformamızın işləməsi üçün aşağıdakı üçüncü tərəf xidmətlərindən istifadə edirik.
                    Hər birinin öz məxfilik siyasəti mövcuddur:
                  </p>
                  <ul className="space-y-4">
                    {[
                      ["Firebase Authentication (Google LLC)", "Telefon nömrəsi ilə autentifikasiya xidməti.", "https://firebase.google.com/support/privacy"],
                      ["Google reCAPTCHA (Google LLC)", "Bot və avtomatik sorğuların qarşısını alan təhlükəsizlik xidməti.", "https://policies.google.com/privacy"],
                      ["Firebase Analytics (Google LLC)", "Anonim istifadə statistikasının toplanması.", "https://firebase.google.com/support/privacy"],
                    ].map(([name, desc, link]) => (
                      <li key={name} className="flex gap-3 text-sm leading-6" style={{ color: "#3C4043" }}>
                        <span className="mt-2.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#1967D2" }} />
                        <span>
                          <strong style={{ color: "#202124", fontWeight: 500 }}>{name}:</strong>
                          {" "}{desc}{" "}
                          <a href={link} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: "#1967D2" }}>
                            Məxfilik siyasəti →
                          </a>
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* 6. TƏHLÜKƏSİZLİK */}
                <section id="security" data-section className="px-8 py-10 scroll-mt-24">
                  <h2 className="text-xl font-medium mb-4" style={{ color: "#202124" }}>
                    Məlumatların Təhlükəsizliyi
                  </h2>
                  <p className="text-sm leading-7" style={{ color: "#3C4043" }}>
                    Şəxsi məlumatlar müasir sənaye standartlarına uyğun şəkildə qorunur. İcazəsiz
                    girişin, dəyişdirilmənin, açıqlanmanın və ya məhv edilməsinin qarşısını almaq
                    üçün aşağıdakı tədbirlər görülür:
                  </p>
                  <ul className="mt-4 space-y-3">
                    {[
                      "Bütün məlumat ötürülməsi HTTPS/TLS şifrələməsi ilə qorunur",
                      "Autentifikasiya Firebase-in sənaye standartı altyapısı üzərindən aparılır",
                      "Parollar heç vaxt açıq mətn şəklində saxlanılmır",
                      "Şübhəli fəaliyyətlər avtomatik aşkar edilir",
                    ].map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-6" style={{ color: "#3C4043" }}>
                        <span className="mt-2.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#1967D2" }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div
                    className="mt-5 rounded-lg px-5 py-4 text-sm leading-7"
                    style={{ background: "#E8F0FE", color: "#174EA6" }}
                  >
                    Heç bir sistem 100% təhlükəsiz deyil. Hesabınızın güclü parol ilə
                    qorunmasını və şübhəli fəaliyyət aşkar etdikdə bizimlə əlaqə saxlamanızı tövsiyə edirik.
                  </div>
                </section>

                {/* 7. SAXLANMA MÜDDƏTİ */}
                <section id="retention" data-section className="px-8 py-10 scroll-mt-24">
                  <h2 className="text-xl font-medium mb-4" style={{ color: "#202124" }}>
                    Məlumatların Saxlanma Müddəti
                  </h2>
                  <p className="text-sm leading-7 mb-5" style={{ color: "#3C4043" }}>
                    Məlumatlarınızı yalnız zəruri olan müddət ərzində saxlayırıq:
                  </p>
                  <ul className="space-y-4">
                    {[
                      ["Hesab məlumatları", "Hesabınız aktiv olduğu müddət boyu saxlanılır. Hesabı silmək istədikdə bütün şəxsi məlumatlar 30 gün ərzində silinir."],
                      ["Texniki giriş qeydləri (loglar)", "Maksimum 90 gün saxlanılır, sonra avtomatik silinir."],
                      ["Analitik məlumatlar", "Anonim formada, xidmətin yaxşılaşdırılması üçün 24 ay saxlanıla bilər."],
                    ].map(([term, def]) => (
                      <li key={term} className="flex gap-3 text-sm leading-6" style={{ color: "#3C4043" }}>
                        <span className="mt-2.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#1967D2" }} />
                        <span>
                          <strong style={{ color: "#202124", fontWeight: 500 }}>{term}:</strong>
                          {" "}{def}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* 8. İSTİFADƏÇİ HÜQUQLARI */}
                <section id="rights" data-section className="px-8 py-10 scroll-mt-24">
                  <h2 className="text-xl font-medium mb-4" style={{ color: "#202124" }}>
                    İstifadəçi Hüquqları
                  </h2>
                  <p className="text-sm leading-7 mb-5" style={{ color: "#3C4043" }}>
                    Şəxsi məlumatlarınızla bağlı aşağıdakı hüquqlara sahibsiniz:
                  </p>
                  <ul className="space-y-4">
                    {[
                      ["Giriş hüququ", "Haqqınızda saxladığımız məlumatların surətini tələb edə bilərsiniz."],
                      ["Düzəliş hüququ", "Yanlış və ya natamam məlumatların düzəldilməsini tələb edə bilərsiniz."],
                      ["Silmə hüququ", "Hesabınızı və bütün şəxsi məlumatlarınızı silinməsini tələb edə bilərsiniz."],
                      ["Etiraz hüququ", "Müəyyən məlumat emalı əməliyyatlarına etiraz edə bilərsiniz."],
                      ["Portativlik hüququ", "Məlumatlarınızın maşınla oxunan formatda verilməsini tələb edə bilərsiniz."],
                    ].map(([term, def]) => (
                      <li key={term} className="flex gap-3 text-sm leading-6" style={{ color: "#3C4043" }}>
                        <span className="mt-2.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#1967D2" }} />
                        <span>
                          <strong style={{ color: "#202124", fontWeight: 500 }}>{term}:</strong>
                          {" "}{def}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 text-sm leading-7" style={{ color: "#3C4043" }}>
                    Bu hüquqları həyata keçirmək üçün{" "}
                    <a href="mailto:support@kamping.az" className="hover:underline" style={{ color: "#1967D2" }}>
                      support@kamping.az
                    </a>{" "}
                    ünvanına müraciət edin. Tələbinizə 30 iş günü ərzində cavab veriləcək.
                  </p>
                </section>

                {/* 9. BEYNƏLXALQ ÖTÜRMƏ */}
                <section id="transfers" data-section className="px-8 py-10 scroll-mt-24">
                  <h2 className="text-xl font-medium mb-4" style={{ color: "#202124" }}>
                    Beynəlxalq Məlumat Ötürülməsi
                  </h2>
                  <p className="text-sm leading-7" style={{ color: "#3C4043" }}>
                    İstifadə etdiyimiz bəzi texniki xidmətlər (Firebase, Google reCAPTCHA) Google LLC
                    tərəfindən idarə olunur və məlumatlar ABŞ daxindəki serverlərə ötürülə bilər.
                    Google, Standart Müqavilə Şərtləri (Standard Contractual Clauses) çərçivəsində
                    məlumat mühafizəsi təminatı verir. Daha ətraflı məlumat üçün{" "}
                    <a
                      href="https://policies.google.com/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                      style={{ color: "#1967D2" }}
                    >
                      Google Məxfilik Siyasəti
                    </a>
                    -nə baxın.
                  </p>
                </section>

                {/* 11. PAYLAŞILMA */}
                <section id="sharing" data-section className="px-8 py-10 scroll-mt-24">
                  <h2 className="text-xl font-medium mb-4" style={{ color: "#202124" }}>
                    Məlumatların Paylaşılması
                  </h2>
                  <p className="text-sm leading-7" style={{ color: "#3C4043" }}>
                    Kamping.az istifadəçilərin şəxsi məlumatlarını{" "}
                    <strong style={{ color: "#202124", fontWeight: 500 }}>satmır</strong> və marketinq
                    məqsədilə üçüncü tərəflərlə paylaşmır. Məlumatlar yalnız aşağıdakı hallarda
                    paylaşıla bilər:
                  </p>
                  <ul className="mt-4 space-y-3">
                    {[
                      "Azərbaycan Respublikasının qanunvericiliyinin tələb etdiyi hallarda",
                      "Xidmətin göstərilməsi üçün bilavasitə zəruri olan texniki tərəfdaşlarla (yuxarıda göstərilmişdir)",
                      "İstifadəçinin açıq razılığı olduqda",
                    ].map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-6" style={{ color: "#3C4043" }}>
                        <span className="mt-2.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#1967D2" }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>

                {/* 12. DƏYİŞİKLİKLƏR */}
                <section id="changes" data-section className="px-8 py-10 scroll-mt-24">
                  <h2 className="text-xl font-medium mb-4" style={{ color: "#202124" }}>
                    Siyasətdə Dəyişikliklər
                  </h2>
                  <p className="text-sm leading-7" style={{ color: "#3C4043" }}>
                    Bu Məxfilik Siyasəti zərurət yarandıqda yenilənə bilər. Əhəmiyyətli dəyişikliklər
                    olduqda istifadəçilər platforma daxilindəki bildiriş vasitəsilə məlumatlandırılacaq.
                    Siyasətin cari versiyası həmişə bu səhifədə dərc olunacaq, yenilənmə tarixi
                    başlığda göstəriləcək.
                  </p>
                </section>

                {/* 13. ƏLAQƏ */}
                <section id="contact" data-section className="px-8 py-10 scroll-mt-24">
                  <h2 className="text-xl font-medium mb-4" style={{ color: "#202124" }}>
                    Əlaqə
                  </h2>
                  <p className="text-sm leading-7 mb-5" style={{ color: "#3C4043" }}>
                    Bu siyasətlə bağlı suallarınız, şikayətləriniz və ya hüquqlarınızı həyata keçirmək
                    üçün müraciətləriniz üçün bizimlə əlaqə saxlaya bilərsiniz:
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
