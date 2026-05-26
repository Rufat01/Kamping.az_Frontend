"use client";

import Link from "next/link";
import { MapPin, Star, Users, Heart } from "lucide-react";

// Demo data — real data comes from API: GET /api/v1/listings/
const LISTINGS = [
  {
    id: 1,
    title: "Göygöl Meşəsində Glamping",
    city: "Göygöl, Gəncə",
    listing_type_display: "Glamping",
    price_per_night: 85,
    max_guests: 4,
    rating: 4.9,
    review_count: 38,
    cover_image: "https://images.unsplash.com/photo-1533873984035-25970ab07461?w=700&q=80",
  },
  {
    id: 2,
    title: "Şəki Bağlarında Bungalo",
    city: "Şəki",
    listing_type_display: "Bungalo",
    price_per_night: 60,
    max_guests: 6,
    rating: 4.7,
    review_count: 24,
    cover_image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=700&q=80",
  },
  {
    id: 3,
    title: "Qəbələ Dağ Çadırı",
    city: "Qəbələ",
    listing_type_display: "Çadır yeri",
    price_per_night: 30,
    max_guests: 3,
    rating: 4.8,
    review_count: 61,
    cover_image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=700&q=80",
  },
  {
    id: 4,
    title: "Lerik Meşə Evi",
    city: "Lerik",
    listing_type_display: "Ev",
    price_per_night: 110,
    max_guests: 8,
    rating: 4.95,
    review_count: 17,
    cover_image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=700&q=80",
  },
  {
    id: 5,
    title: "Lənkəran Sahil Kampı",
    city: "Lənkəran",
    listing_type_display: "Çadır yeri",
    price_per_night: 25,
    max_guests: 5,
    rating: 4.6,
    review_count: 45,
    cover_image: "https://images.unsplash.com/photo-1537905569824-f89f14cceb68?w=700&q=80",
  },
  {
    id: 6,
    title: "İsmayıllı Glamping Resort",
    city: "İsmayıllı",
    listing_type_display: "Glamping",
    price_per_night: 130,
    max_guests: 2,
    rating: 5.0,
    review_count: 12,
    cover_image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=700&q=80",
  },
];

export default function FeaturedListings() {
  return (
    <section className="py-20 lg:py-28 bg-forest-900/5">
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-amber-600 text-sm font-semibold uppercase tracking-widest">
              Seçilmiş məkanlar
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-forest-900 mt-2 leading-tight">
              Ən çox bəyənilənlər
            </h2>
          </div>
          <Link
            href="/listings"
            className="text-forest-700 hover:text-forest-900 font-semibold text-sm underline underline-offset-4 decoration-forest-300 hover:decoration-forest-600 transition-all whitespace-nowrap"
          >
            Bütün elanlar →
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {LISTINGS.map((listing) => (
            <Link
              key={listing.id}
              href={`/listings/${listing.id}`}
              className="listing-card bg-white rounded-2xl overflow-hidden border border-forest-100 block"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] img-zoom">
                <img
                  src={listing.cover_image}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
                {/* Type badge */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-forest-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                  {listing.listing_type_display}
                </div>
                {/* Wishlist */}
                <button
                  onClick={(e) => e.preventDefault()}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                  aria-label="Seçilmişlərə əlavə et"
                >
                  <Heart className="w-4 h-4 text-forest-400 hover:text-red-500 transition-colors" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-display text-lg font-bold text-forest-900 leading-tight line-clamp-2">
                    {listing.title}
                  </h3>
                  {/* Rating */}
                  <div className="flex items-center gap-1 shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-semibold text-forest-800">
                      {listing.rating}
                    </span>
                    <span className="text-xs text-forest-400">
                      ({listing.review_count})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-forest-500 text-sm mb-4">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{listing.city}</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-forest-100">
                  <div className="flex items-center gap-1 text-forest-400 text-sm">
                    <Users className="w-3.5 h-3.5" />
                    <span>Maks. {listing.max_guests} nəfər</span>
                  </div>
                  <div className="text-right">
                    <span className="font-display text-xl font-bold text-forest-900">
                      ₼{listing.price_per_night}
                    </span>
                    <span className="text-forest-400 text-xs"> / gecə</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
