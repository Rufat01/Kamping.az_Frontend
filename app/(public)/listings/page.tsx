import Link from "next/link";
import { Suspense } from "react";
import ListingsFilterBar from "@/features/(public)/listings/components/ListingsFilterBar";
import ListingCard from "@/features/(public)/listings/components/ListingCard";
import { MapPin, Star, Users, Heart, ArrowUpRight, Compass } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

export const metadata = {
  title: "Kamp Yerleri — Kamping.az",
  description: "Azerbaycanda en gozal kamp yerleri, glamping, bungalo ve cadir yerlerini kesf edin.",
};

type SearchParams = Record<string, string | string[] | undefined>;

async function fetchListings(searchParams: SearchParams) {
  const params = new URLSearchParams();
  if (searchParams?.listing_type) params.append("listing_type", String(searchParams.listing_type));
  if (searchParams?.city) params.append("city", String(searchParams.city));
  if (searchParams?.min_price) params.append("min_price", String(searchParams.min_price));
  if (searchParams?.max_price) params.append("max_price", String(searchParams.max_price));
  if (searchParams?.guests) params.append("guests", String(searchParams.guests));
  if (searchParams?.search) params.append("search", String(searchParams.search));

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/listings/${params.toString() ? `?${params.toString()}` : ""}`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data.results ?? []);
  } catch {
    return [];
  }
}

// function ListingCard({ listing, index }) {
//   // Scattered postcard rotation
//   const rotations = [-0.6, 0.5, -0.3, 0.7, -0.5, 0.4];
//   const rotate = rotations[index % rotations.length];

//   return (
//     <Link
//       href={`/listings/${listing.id}`}
//       className="group block transition-all duration-300 hover:!rotate-0 hover:-translate-y-2"
//       style={{ transform: `rotate(${rotate}deg)` }}
//     >
//       <div className="bg-white rounded-2xl overflow-hidden"
//         style={{ boxShadow: "0 4px 20px -2px rgba(45,74,51,0.08), 0 12px 30px -6px rgba(45,74,51,0.12)" }}>

//         {/* Image */}
//         <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
//           {listing.cover_image ? (
//             <img
//               src={listing.cover_image}
//               alt={listing.title}
//               className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//             />
//           ) : (
//             <div className="w-full h-full flex items-center justify-center" style={{ background: "#E8E5D8" }}>
//               <span className="text-5xl">⛺</span>
//             </div>
//           )}

//           {/* Type stamp */}
//           <div className="absolute top-4 left-4 bg-[#FAF6F0]/95 backdrop-blur text-[#2D4A33] text-xs font-bold px-3 py-1.5 rounded-md border-2 border-dashed border-[#4A6B4F]/30">
//             {listing.listing_type_display}
//           </div>

//           {/* Free / Entry fee badges */}
//           {listing.is_free && !listing.entry_fee && (
//             <div className="absolute top-4 right-4 px-3 py-1.5 rounded-md text-xs font-bold text-white shadow-md"
//               style={{ background: "#4A6B4F" }}>
//               🌿 Pulsuz
//             </div>
//           )}
//           {listing.entry_fee && (
//             <div className="absolute top-4 right-4 px-3 py-1.5 rounded-md text-xs font-bold text-white shadow-md"
//               style={{ background: "#A0613B" }}>
//               🎟️ Girişli
//             </div>
//           )}

//           {/* Heart — bottom-left, doesn't conflict with badges */}
//           <button onClick={e => e.preventDefault()}
//             className="absolute bottom-4 left-4 w-9 h-9 bg-white/95 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm">
//             <Heart className="w-4 h-4 text-[#4A6B4F] hover:text-red-400 hover:fill-red-400 transition-colors" />
//           </button>

//           {/* Price tag */}
//           {!listing.is_free && (
//             <div className="absolute bottom-4 right-4 bg-[#2D4A33] text-[#FAF6F0] px-3 py-2 rounded-xl shadow-lg">
//               <div className="flex items-baseline gap-1">
//                 <span className="font-display text-xl font-bold">
//                   {listing.entry_fee || listing.price_per_night}
//                 </span>
//                 <span className="text-[#D4A574] text-xs">
//                   ₼{listing.entry_fee ? "" : "/gece"}
//                 </span>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Body */}
//         <div className="p-5">
//           <div className="flex items-start justify-between gap-2 mb-2">
//             <h3 className="font-display text-lg font-bold text-[#1F2D24] leading-tight line-clamp-2 flex-1">
//               {listing.title}
//             </h3>
//             <ArrowUpRight className="w-4 h-4 text-[#4A6B4F] shrink-0 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
//           </div>

//           <div className="flex items-center gap-1.5 text-[#4A6B4F]/70 text-sm mb-4">
//             <MapPin className="w-3.5 h-3.5" />
//             {listing.city}
//           </div>

//           <div className="flex items-center justify-between pt-4 border-t border-dashed border-[#E8E5D8]">
//             {listing.rating > 0 ? (
//               <div className="flex items-center gap-1.5">
//                 <Star className="w-3.5 h-3.5 fill-[#D4A574] text-[#D4A574]" />
//                 <span className="text-sm font-bold text-[#1F2D24]">{listing.rating}</span>
//                 {listing.review_count > 0 && (
//                   <span className="text-[#4A6B4F]/50 text-xs">({listing.review_count})</span>
//                 )}
//               </div>
//             ) : (
//               <span className="text-[#4A6B4F]/50 text-xs italic">Yeni elan</span>
//             )}
//             <div className="flex items-center gap-1 text-[#4A6B4F]/70 text-xs">
//               <Users className="w-3.5 h-3.5" />
//               {listing.max_guests} nefer
//             </div>
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// }

function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
      {/* Tent illustration */}
      <div className="relative mb-8">
        <svg className="absolute -top-2 -left-8 w-12 h-12 opacity-30 animate-float-slow" viewBox="0 0 64 64" fill="none">
          <path d="M32 8 C40 16, 48 28, 32 56 C16 28, 24 16, 32 8 Z" fill="#D4A574" />
        </svg>
        <svg className="absolute -bottom-2 -right-6 w-10 h-10 opacity-25 animate-float" viewBox="0 0 64 64" fill="none">
          <path d="M32 8 C40 16, 48 28, 32 56 C16 28, 24 16, 32 8 Z" fill="#4A6B4F" />
        </svg>
        <span className="text-7xl block">🏕️</span>
      </div>

      <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#1F2D24] mb-3">
        Heç bir məkan tapılmadı
      </h3>
      <p className="text-[#4A6B4F]/70 text-sm max-w-xs leading-relaxed mb-6">
        Cığır burada bitir... Filterləri dəyişib yeniden cəhd et və ya bütün məkanlara bax.
      </p>
      <Link href="/listings"
        className="inline-flex items-center gap-2 text-[#FAF6F0] font-bold text-sm px-6 py-3 rounded-2xl transition-all active:scale-95 hover:shadow-xl"
        style={{ background: "#2D4A33" }}>
        Filterləri sıfırla
      </Link>
    </div>
  );
}

export default async function ListingsPage({ searchParams }: { searchParams: SearchParams }) {
  const listings = await fetchListings(searchParams);

  return (
     <>
    <Navbar />
    <main style={{ background: "#FAF6F0" }}>

      {/* Hero — forest journal header */}
      <section className="relative overflow-hidden pt-28 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8" style={{ background: "#1A3A2E" }}>

        {/* Background image */}
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
            background: "radial-gradient(ellipse at 20% 30%, rgba(212,165,116,0.15) 0%, transparent 50%)"
          }} />
        </div>

        {/* Floating leaves */}
        <svg className="absolute top-32 right-12 w-14 h-14 opacity-25 animate-float-slow" viewBox="0 0 64 64" fill="none">
          <path d="M32 8 C40 16, 48 28, 32 56 C16 28, 24 16, 32 8 Z" fill="#D4A574" />
        </svg>
        <svg className="absolute bottom-20 left-16 w-10 h-10 opacity-20 animate-float" viewBox="0 0 64 64" fill="none">
          <path d="M32 8 C40 16, 48 28, 32 56 C16 28, 24 16, 32 8 Z" fill="#FAF6F0" />
        </svg>

        <div className="relative max-w-7xl mx-auto">

          {/* Breadcrumb / location */}
          <div className="flex items-center gap-3 mb-4">
            <Compass className="w-4 h-4 text-[#D4A574]" strokeWidth={1.5} />
            <Link href="/" className="text-[#D4A574]/80 hover:text-[#D4A574] text-xs font-semibold tracking-[0.25em] uppercase transition-colors">
              Ana səhifə
            </Link>
            <span className="text-[#FAF6F0]/30">/</span>
            <span className="text-[#FAF6F0]/60 text-xs font-semibold tracking-[0.25em] uppercase">
              Kamp Yerləri
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display font-bold text-[#FAF6F0] leading-[0.95] tracking-tight mb-5"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}>
            <em className="text-[#D4A574]">Məkanlar</em><br />
            kataloqu
          </h1>

          {/* Results count */}
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D4A574] animate-pulse" />
              <p className="text-[#FAF6F0]/60 text-sm sm:text-base">
                {listings.length > 0
                  ? <><span className="font-bold text-[#FAF6F0]">{listings.length}</span> məkan tapıldı</>
                  : "Filterlərlə uyğun məkan tapılmadı"}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom curve */}
        <svg className="absolute bottom-0 left-0 w-full pointer-events-none" viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ height: "40px" }}>
          <path d="M0,40 Q360,5 720,30 T1440,25 L1440,60 L0,60 Z" fill="#FAF6F0" />
        </svg>
      </section>

      {/* Filter bar */}
      <Suspense fallback={null}>
        <ListingsFilterBar />
      </Suspense>

      {/* Listings grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-7">
            {listings.map((listing, i) => (
              <ListingCard key={listing.id} listing={listing} />
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
