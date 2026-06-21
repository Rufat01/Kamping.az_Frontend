import Link from "next/link";
import { Suspense } from "react";
import { MapPin, Eye, Clock, Phone, ArrowUpRight, Compass } from "lucide-react";
import ToursFilterBar from "@/features/(public)/tours/components/ToursFilterBar";
import { getTours } from "@/features/(public)/tours/services/tours.service";
import Navbar from "@/components/layout/Navbar";
import type { Tour } from "@/types";

export const metadata = {
  title: "Turlar — Kamping.az",
  description: "Azerbaycanda en gozal tur paketleri ve macera turlari.",
};

type SearchParams = Record<string, string | string[] | undefined>;

async function fetchTours(searchParams: SearchParams) {
  try {
    const params: Record<string, string> = {};
    if (searchParams?.search) params.search = String(searchParams.search);
    if (searchParams?.location) params.location = String(searchParams.location);
    if (searchParams?.min_price) params.min_price = String(searchParams.min_price);
    if (searchParams?.max_price) params.max_price = String(searchParams.max_price);
    if (searchParams?.free) params.free = String(searchParams.free);
    const data = await getTours(params);
    return Array.isArray(data) ? data : ((data as { results?: Tour[] }).results ?? []);
  } catch {
    return [];
  }
}

function TourCard({ tour, index }: { tour: Tour; index: number }) {
  const rotations = [-0.5, 0.4, -0.3, 0.6, -0.4, 0.3];
  const rotate = rotations[index % rotations.length];

  return (
    <Link href={`/tours/${tour.id}`}
      className="group block transition-all duration-300 hover:!rotate-0 hover:-translate-y-2"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{ boxShadow: "0 4px 20px -2px rgba(45,74,51,0.08), 0 12px 30px -6px rgba(45,74,51,0.12)" }}
      >
        {/* Image */}
        <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
          {tour.cover_image ? (
            <img
              src={tour.cover_image}
              alt={tour.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl"
              style={{ background: "#E8E5D8" }}>
              🏔️
            </div>
          )}

          {tour.duration && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[#FAF6F0]/95 backdrop-blur text-[#2D4A33] text-xs font-bold px-3 py-1.5 rounded-md border-2 border-dashed border-[#4A6B4F]/30">
              <Clock className="w-3 h-3" />
              {tour.duration}
            </div>
          )}

          <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur text-white text-xs font-semibold px-2.5 py-1.5 rounded-full">
            <Eye className="w-3 h-3" />
            {tour.view_count}
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-display text-lg font-bold text-[#1F2D24] leading-tight flex-1 line-clamp-2">
              {tour.title}
            </h3>
            <ArrowUpRight className="w-4 h-4 text-[#4A6B4F] shrink-0 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>

          {tour.location && (
            <div className="flex items-center gap-1.5 text-[#4A6B4F]/70 text-sm mb-3">
              <MapPin className="w-3.5 h-3.5" />
              {tour.location}
            </div>
          )}

          <p className="text-[#4A6B4F]/70 text-sm leading-relaxed line-clamp-3 mb-4 font-light">
            {tour.description}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-dashed border-[#E8E5D8]">
            
            <div className="ml-auto">
              {tour.price ? (
                <div>
                  <span className="font-display text-xl font-bold text-[#1F2D24]">
                    ₼{Number(tour.price).toLocaleString()}
                  </span>
                  <span className="text-[#4A6B4F]/60 text-xs ml-1">/ nəfər</span>
                </div>
              ) : (
                <span className="inline-block bg-[#4A6B4F]/10 text-[#4A6B4F] text-xs font-bold px-3 py-1.5 rounded-full">
                  🌿 Pulsuz
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
      <div className="relative mb-8">
        <svg className="absolute -top-2 -left-6 w-10 h-10 opacity-30 animate-float-slow" viewBox="0 0 64 64" fill="none">
          <path d="M32 8 C40 16, 48 28, 32 56 C16 28, 24 16, 32 8 Z" fill="#D4A574" />
        </svg>
        <span className="text-7xl">🏔️</span>
      </div>
      <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#1F2D24] mb-3">
        Nəticə tapılmadı
      </h3>
      <p className="text-[#4A6B4F]/70 text-sm max-w-xs leading-relaxed mb-6">
        Axtarış parametrlərini dəyişdirərək yenidən cəhd edin.
      </p>
      <Link href="/tours"
        className="inline-flex items-center gap-2 text-[#FAF6F0] font-bold text-sm px-6 py-3 rounded-2xl transition-all active:scale-95"
        style={{ background: "#2D4A33" }}>
        Filterləri sıfırla
      </Link>
    </div>
  );
}

export default async function ToursPage({ searchParams }: { searchParams: SearchParams }) {
  const tours = await fetchTours(searchParams);

  return (
    <>
    <Navbar />
    <main style={{ background: "#FAF6F0" }} className="relative overflow-hidden">

      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8"
        style={{ background: "#1A3A2E" }}>

        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1800&q=85"
            alt=""
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(180deg, rgba(26,58,46,0.7) 0%, rgba(26,58,46,0.95) 100%)"
          }} />
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at 30% 40%, rgba(212,165,116,0.15) 0%, transparent 60%)"
          }} />
        </div>

        <svg className="absolute top-32 right-12 w-14 h-14 opacity-25 animate-float-slow pointer-events-none" viewBox="0 0 64 64" fill="none">
          <path d="M32 8 C40 16, 48 28, 32 56 C16 28, 24 16, 32 8 Z" fill="#D4A574" />
        </svg>

        <div className="relative max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 mb-4 text-sm">
            <Compass className="w-4 h-4 text-[#D4A574]" strokeWidth={1.5} />
            <Link href="/" className="text-[#D4A574]/80 hover:text-[#D4A574] font-semibold transition-colors">
              Ana sehife
            </Link>
            <span className="text-[#FAF6F0]/30">/</span>
            <span className="text-[#FAF6F0]/60 font-semibold">Turlar</span>
          </nav>

          <h1 className="font-display font-bold text-[#FAF6F0] leading-[0.95] tracking-tight mb-4"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}>
            <em className="text-[#D4A574]">Tur</em> paketleri
          </h1>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D4A574] animate-pulse" />
            <p className="text-[#FAF6F0]/60 text-sm sm:text-base">
              {tours.length > 0
                ? <><span className="font-bold text-[#FAF6F0]">{tours.length}</span> tur tapildi</>
                : "Azerbaycanda macera turlari"}
            </p>
          </div>
        </div>

        <svg className="absolute bottom-0 left-0 w-full pointer-events-none" viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ height: "40px" }}>
          <path d="M0,40 Q360,5 720,30 T1440,25 L1440,60 L0,60 Z" fill="#FAF6F0" />
        </svg>
      </section>

      {/* Filter bar */}
      <Suspense fallback={null}>
        <ToursFilterBar />
      </Suspense>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative">
        <svg className="absolute top-10 right-8 w-16 h-16 opacity-[0.07] animate-float pointer-events-none" viewBox="0 0 64 64" fill="none">
          <path d="M32 8 C40 16, 48 28, 32 56 C16 28, 24 16, 32 8 Z" fill="#D4A574" />
        </svg>

        {tours.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
            {tours.map((tour, i) => (
              <TourCard key={tour.id} tour={tour} index={i} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </main>
    </>
  );
}
