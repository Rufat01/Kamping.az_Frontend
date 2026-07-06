import { getTour } from "@/features/(public)/tours/services/tours.service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin, Clock, Compass, ChevronRight,
  Users, CheckCircle2, XCircle, Calendar, Eye,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import ImageGallery from "@/features/(public)/listings/components/ImageGallery";
import RevealPhoneButton from "@/features/(public)/tours/components/RevealPhoneButton";

type PageProps = { params: { id: string }; searchParams?: { reveal_phone?: string } };

export async function generateMetadata({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  try {
    const tour = await getTour(params.id, session?.accessToken);
    return {
      title: `${tour.title} | Kamping.az`,
      description: tour.description?.slice(0, 155),
      openGraph: {
        title: tour.title,
        description: tour.description?.slice(0, 155),
        images: tour.cover_image ? [{ url: tour.cover_image }] : [],
      },
    };
  } catch {
    return { title: "Tur tapılmadı" };
  }
}

export default async function TourDetailPage({ params, searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  const autoReveal = !!session && searchParams?.reveal_phone === "true";
  let tour;
  try {
    tour = await getTour(params.id, session?.accessToken);
  } catch {
    notFound();
  }

  const isFullyFree = !tour.price;

  const mobileCtaPriceLabel = tour.price
    ? <>₼{Number(tour.price).toLocaleString()}<span className="text-[#4A6B4F]/60 text-xs font-normal"> /nəfər</span></>
    : <span className="text-[#D4A574]">Pulsuz</span>;

  return (
    <>
      <Navbar forceScrolled />
      <main style={{ background: "#FAF6F0" }} className="relative overflow-x-clip">

        {/* Decorative leaves */}
        <svg className="absolute top-32 right-8 w-12 h-12 opacity-[0.12] animate-float-slow pointer-events-none" viewBox="0 0 64 64" fill="none">
          <path d="M32 8 C40 16, 48 28, 32 56 C16 28, 24 16, 32 8 Z" fill="#D4A574" />
        </svg>
        <svg className="absolute top-[600px] left-6 w-14 h-14 opacity-[0.08] animate-float pointer-events-none hidden lg:block" viewBox="0 0 64 64" fill="none" style={{ transform: "rotate(40deg)" }}>
          <path d="M32 8 C40 16, 48 28, 32 56 C16 28, 24 16, 32 8 Z" fill="#4A6B4F" />
        </svg>

        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 ${tour.owner_phone ? "pb-28 md:pb-16" : "pb-16"}`}>

          {/* Breadcrumb */}
          <nav aria-label="Naviqasiya" className="mb-6 flex items-center gap-2 text-sm">
            <Compass className="w-4 h-4 text-[#D4A574]" strokeWidth={1.5} />
            <Link href="/" className="text-[#4A6B4F]/70 hover:text-[#2D4A33] transition-colors font-semibold">
              Ana səhifə
            </Link>
            <ChevronRight className="w-3 h-3 text-[#4A6B4F]/40" />
            <Link href="/tours" className="text-[#4A6B4F]/70 hover:text-[#2D4A33] transition-colors font-semibold">
              Turlar
            </Link>
          </nav>

          {/* Main content + sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">

            {/* Left — main content */}
            <div className="lg:col-span-2 space-y-10">

              {/* Image Gallery */}
              {(tour.images?.length || tour.cover_image) && (
                <section aria-label="Şəkillər">
                  <ImageGallery
                    images={
                      tour.images?.length
                        ? tour.images
                        : [{ id: 0, image: tour.cover_image!, is_cover: true }]
                    }
                    title={tour.title}
                  />
                </section>
              )}

              {/* Title section */}
              <section>
                <div className="flex items-start justify-between gap-6 mb-4">
                  <div className="flex-1">

                    <h1 className="font-display font-bold text-[#1F2D24] leading-[0.95] mb-3"
                      style={{ fontSize: "24px" }}>
                      {tour.title}
                    </h1>

                    {tour.location && (
                      <div className="flex items-center gap-2 text-[#4A6B4F]/80">
                        <MapPin className="w-4 h-4" strokeWidth={1.5} />
                        <span className="text-sm font-medium">{tour.location}</span>
                      </div>
                    )}
                  </div>

                  
                </div>

                {/* Stats bar */}
                <div className="flex flex-wrap items-center gap-6 pt-5 mt-5 border-t border-dashed border-[#E8E5D8]">
                  {tour.duration && (
                    <div className="flex items-center gap-1.5 text-[#4A6B4F]/80 text-sm">
                      <Clock className="w-4 h-4" strokeWidth={1.5} />
                      <span><strong>{tour.duration}</strong></span>
                    </div>
                  )}
                  {tour.max_participants && (
                    <div className="flex items-center gap-1.5 text-[#4A6B4F]/80 text-sm">
                      <Users className="w-4 h-4" strokeWidth={1.5} />
                      <span>Maks. <strong>{tour.max_participants}</strong> nəfər</span>
                    </div>
                  )}
                  {tour.difficulty && (
                    <div className="flex items-center gap-1.5 text-sm">
                      <span className="inline-block bg-[#4A6B4F]/10 text-[#4A6B4F] text-xs font-bold px-3 py-1 rounded-full">
                        {tour.difficulty}
                      </span>
                    </div>
                  )}
                </div>
              </section>

              {/* Description */}
              <section aria-labelledby="desc-heading">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-px bg-[#D4A574]" />
                  <h2 id="desc-heading" className="text-[#A0613B] text-xs font-bold uppercase tracking-[0.25em]">
                    Tur haqqında
                  </h2>
                </div>
                <div className="bg-white rounded-2xl p-7 lg:p-8 relative"
                  style={{ boxShadow: "0 4px 20px -2px rgba(45,74,51,0.05)" }}>
                  <p className="whitespace-pre-line leading-relaxed text-[#1F2D24]/85 text-base font-light">
                    {tour.description}
                  </p>
                </div>
              </section>

              {/* Itinerary / Program */}
              {tour.itinerary && (
                <section aria-labelledby="itinerary-heading">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-px bg-[#D4A574]" />
                    <h2 id="itinerary-heading" className="text-[#A0613B] text-xs font-bold uppercase tracking-[0.25em]">
                      Proqram
                    </h2>
                  </div>
                  <div className="bg-white rounded-2xl p-7 lg:p-8"
                    style={{ boxShadow: "0 4px 20px -2px rgba(45,74,51,0.05)" }}>
                    <p className="whitespace-pre-line leading-relaxed text-[#1F2D24]/85 text-base font-light">
                      {tour.itinerary}
                    </p>
                  </div>
                </section>
              )}

              {/* Includes / Excludes */}
              {(tour.includes?.length > 0 || tour.excludes?.length > 0) && (
                <section aria-labelledby="incl-heading">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-px bg-[#D4A574]" />
                    <h2 id="incl-heading" className="text-[#A0613B] text-xs font-bold uppercase tracking-[0.25em]">
                      Daxildir / Daxil deyil
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {tour.includes?.length > 0 && (
                      <div className="bg-white rounded-2xl p-6 border border-[#4A6B4F]/15"
                        style={{ boxShadow: "0 4px 20px -2px rgba(45,74,51,0.05)" }}>
                        <p className="text-[#2D4A33] text-xs font-bold uppercase tracking-widest mb-4">
                          Daxildir
                        </p>
                        <ul className="space-y-3">
                          {tour.includes.map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-[#1F2D24]/80">
                              <CheckCircle2 className="w-4 h-4 text-[#4A6B4F] shrink-0 mt-0.5" strokeWidth={1.5} />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {tour.excludes?.length > 0 && (
                      <div className="bg-white rounded-2xl p-6 border border-[#E8E5D8]"
                        style={{ boxShadow: "0 4px 20px -2px rgba(45,74,51,0.05)" }}>
                        <p className="text-[#A0613B] text-xs font-bold uppercase tracking-widest mb-4">
                          Daxil deyil
                        </p>
                        <ul className="space-y-3">
                          {tour.excludes.map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-[#1F2D24]/80">
                              <XCircle className="w-4 h-4 text-[#A0613B]/70 shrink-0 mt-0.5" strokeWidth={1.5} />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Meeting point */}
              {tour.meeting_point && (
                <section aria-labelledby="meeting-heading">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-px bg-[#D4A574]" />
                    <h2 id="meeting-heading" className="text-[#A0613B] text-xs font-bold uppercase tracking-[0.25em]">
                      Görüş nöqtəsi
                    </h2>
                  </div>
                  <div className="flex items-start gap-3 bg-white rounded-2xl p-6"
                    style={{ boxShadow: "0 4px 20px -2px rgba(45,74,51,0.05)" }}>
                    <MapPin className="w-5 h-5 text-[#D4A574] shrink-0 mt-0.5" strokeWidth={1.5} />
                    <p className="text-[#1F2D24]/85 text-base leading-relaxed">{tour.meeting_point}</p>
                  </div>
                </section>
              )}

              <Link href="/tours"
                className="inline-flex items-center gap-2 text-[#4A6B4F] hover:text-[#2D4A33] text-sm font-bold transition-colors">
                ← Bütün turlara qayıt
              </Link>
            </div>

            {/* Right — sticky sidebar */}
            <aside className="lg:sticky lg:top-24 h-fit space-y-5">

              {/* Rezervasiya kartı — rəhbər, qiymət və detallar bir bölmədə */}
              {(tour.owner_name || tour.price || tour.owner_phone) && (
                <div className="bg-white rounded-3xl overflow-hidden"
                  style={{ boxShadow: "0 8px 30px -5px rgba(45,74,51,0.12)" }}>

                  <div className="px-6 py-3 border-b border-dashed border-[#E8E5D8]"
                    style={{ background: "#FAF6F0" }}>
                    <p className="text-[#A0613B] text-xs font-bold uppercase tracking-[0.25em]">
                      Rezervasiya
                    </p>
                  </div>

                  <div className="p-6 space-y-5">
                    {tour.owner_name && (
                      <div className="flex items-center gap-3 pb-5 border-b border-dashed border-[#E8E5D8]">
                        <div className="relative">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full text-[#FAF6F0] text-lg font-bold font-display"
                            style={{ background: "#2D4A33" }}>
                            {tour.owner_name.charAt(0).toUpperCase()}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white"
                            style={{ background: "#D4A574" }} />
                        </div>
                        <div>
                          <p className="font-display text-lg font-bold text-[#1F2D24]">{tour.owner_name}</p>
                          <p className="text-xs text-[#4A6B4F]/60">Doğrulanmış rehber</p>
                        </div>
                      </div>
                    )}

                    {tour.price ? (
                      <div className="text-center pb-4 border-b border-dashed border-[#E8E5D8]">
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="font-display text-4xl font-bold text-[#1F2D24]">
                            ₼{Number(tour.price).toLocaleString()}
                          </span>
                          <span className="text-[#4A6B4F]/60 text-sm">/nəfər</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4 rounded-2xl border border-dashed border-[#D4A574]/40"
                        style={{ background: "#FAF6F0" }}>
                        <span className="font-display text-2xl font-bold text-[#A0613B]">
                          Tamamilə Pulsuz
                        </span>
                      </div>
                    )}

                    <div className="space-y-3 text-sm">
                      {tour.duration && (
                        <div className="flex justify-between items-center">
                          <span className="text-[#4A6B4F]/70 flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5" /> Müddət
                          </span>
                          <span className="font-bold text-[#1F2D24]">{tour.duration}</span>
                        </div>
                      )}
                      {tour.location && (
                        <div className="flex justify-between items-center">
                          <span className="text-[#4A6B4F]/70 flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5" /> Yer
                          </span>
                          <span className="font-bold text-[#1F2D24]">{tour.location}</span>
                        </div>
                      )}
                      {tour.max_participants && (
                        <div className="flex justify-between items-center">
                          <span className="text-[#4A6B4F]/70 flex items-center gap-2">
                            <Users className="w-3.5 h-3.5" /> Qrup
                          </span>
                          <span className="font-bold text-[#1F2D24]">maks. {tour.max_participants} nəfər</span>
                        </div>
                      )}
                      {typeof tour.view_count === "number" && (
                        <div className="flex justify-between items-center">
                          <span className="text-[#4A6B4F]/70 flex items-center gap-2">
                            <Eye className="w-3.5 h-3.5" /> Baxış sayı
                          </span>
                          <span className="font-bold text-[#1F2D24]">{tour.view_count}</span>
                        </div>
                      )}
                    </div>

                    {tour.owner_phone && (
                      <RevealPhoneButton
                        phone={tour.owner_phone}
                        tourId={tour.id}
                        isLoggedIn={!!session}
                        autoReveal={autoReveal}
                        label={tour.price ? "Rezervasiya et" : "Əlaqə"}
                        variant={tour.price ? "dark" : "gold"}
                        whatsapp={!!tour.price}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Start date */}
              {tour.start_date && (
                <div className="flex items-center justify-between gap-3 bg-white border-2 border-dashed border-[#4A6B4F]/30 text-[#1F2D24] font-bold text-sm px-5 py-4 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-[#A0613B]" strokeWidth={1.5} />
                    <span>Başlama tarixi</span>
                  </div>
                  <span className="text-[#4A6B4F]">{new Date(tour.start_date).toLocaleDateString("az-AZ")}</span>
                </div>
              )}
            </aside>
          </div>
        </div>

        {/* Mobile — aşağıda sabit rezervasiya zolağı (bottom tab nav-ın üstündə) */}
        {tour.owner_phone && (
          <div className="md:hidden fixed inset-x-0 z-[1100] bg-white/95 backdrop-blur-md border-t border-[#E8E5D8]"
            style={{ bottom: "4rem", boxShadow: "0 -4px 20px -4px rgba(45,74,51,0.15)" }}>
            <div className="flex items-center gap-4 px-4 py-3">
              <div className="font-display text-xl font-bold text-[#1F2D24] shrink-0">
                {mobileCtaPriceLabel}
              </div>
              <div className="flex-1 min-w-0">
                <RevealPhoneButton
                  phone={tour.owner_phone}
                  tourId={tour.id}
                  isLoggedIn={!!session}
                  autoReveal={false}
                  variant={isFullyFree ? "gold" : "dark"}
                  label={isFullyFree ? "Əlaqə" : "Rezervasiya et"}
                  whatsapp={!isFullyFree}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
