import Link from "next/link";
import ListingsFilterBar from "../../components/ListingsFilterBar";
import { MapPin, Star, Users, Heart } from "lucide-react";
import { Suspense } from "react";


export const metadata = {
  title: "Kamp Yerleri — Kamping.az",
  description: "Azerbaycanda en gozal kamp yerleri, glamping, bungalo ve cadir yerlerini kesf edin.",
};

async function fetchListings(searchParams) {
  const params = new URLSearchParams();
  if (searchParams?.listing_type) params.append("listing_type", searchParams.listing_type);
  if (searchParams?.city) params.append("city", searchParams.city);
  if (searchParams?.min_price) params.append("min_price", searchParams.min_price);
  if (searchParams?.max_price) params.append("max_price", searchParams.max_price);
  if (searchParams?.guests) params.append("guests", searchParams.guests);
  if (searchParams?.search) params.append("search", searchParams.search);

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

function ListingCard({ listing }) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="listing-card bg-white rounded-2xl overflow-hidden border border-forest-100 block group"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {listing.cover_image ? (
          <img
            src={listing.cover_image}
            alt={listing.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-forest-100 flex items-center justify-center">
            <span className="text-4xl">⛺</span>
          </div>
        )}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-forest-800 text-xs font-semibold px-3 py-1.5 rounded-full">
          {listing.listing_type_display}
        </div>
        {listing.is_free && (
          <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
            Pulsuz
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h2 className="font-display text-lg font-bold text-forest-900 leading-tight line-clamp-2">
            {listing.title}
          </h2>
          {listing.rating > 0 && (
            <div className="flex items-center gap-1 shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-sm font-semibold text-forest-800">{listing.rating}</span>
              {listing.review_count > 0 && (
                <span className="text-xs text-forest-400">({listing.review_count})</span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 text-forest-500 text-sm mb-4">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span>{listing.city}</span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-forest-100">
          <div className="flex items-center gap-1 text-forest-400 text-sm">
            <Users className="w-3.5 h-3.5" />
            <span>Maks. {listing.max_guests} nəfər</span>
          </div>
          <div className="text-right">
            {listing.is_free ? (
              <span className="font-display text-lg font-bold text-green-600">Pulsuz</span>
            ) : listing.entry_fee ? (
              <div>
                <span className="font-display text-xl font-bold text-forest-900">
                  ₼{listing.entry_fee}
                </span>
                <span className="text-forest-400 text-xs"> giriş</span>
              </div>
            ) : (
              <div>
                <span className="font-display text-xl font-bold text-forest-900">
                  ₼{listing.price_per_night}
                </span>
                <span className="text-forest-400 text-xs"> / gecə</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
      <span className="text-6xl mb-4">🏕️</span>
      <h3 className="font-display text-2xl font-bold text-forest-900 mb-2">
        Nəticə tapılmadı
      </h3>
      <p className="text-forest-500 text-sm max-w-xs">
        Axtarış parametrlərini dəyişdirərək yenidən cəhd edin.
      </p>
    </div>
  );
}

export default async function ListingsPage({ searchParams }) {
  const listings = await fetchListings(searchParams);

  return (
    <main>

      {/* Header */}
      <section className="bg-forest-900 pt-28 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-2">
            Kamp Yerleri
          </h1>
          <p className="text-white/60">
            {listings.length > 0 ? `${listings.length} mekan tapildi` : "Azerbaycanda en gozal kamp mecanlari"}
          </p>
        </div>
      </section>

      {/* Filter bar — Navbar-dan sonra sticky */}
      <Suspense fallback={null}>
        <ListingsFilterBar />
      </Suspense>

      {/* Elanlar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.length > 0
            ? listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))
            : <EmptyState />
          }
        </div>
      </div>

    </main>
  );
}