"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, Users, Heart } from "lucide-react";
import type { Listing } from "../types";

export default function ListingsGrid({ listings }: { listings: Listing[] }) {
  if (!listings?.length) {
    return <p className="py-12 text-center">Hələ elan yoxdur.</p>;
  }

  return (
    <section
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      aria-label="Elanların siyahısı"
    >
      {listings.map((item) => (
            <Link
              key={item.id}
              href={`/listings/${item.id}`}
              className="listing-card bg-white rounded-2xl overflow-hidden border border-forest-100 block"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] img-zoom">
                <img
                  src={item.cover_image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                {/* Type badge */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-forest-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                  {item.listing_type_display}
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
                    {item.title}
                  </h3>
                  {/* Rating */}
                  <div className="flex items-center gap-1 shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-semibold text-forest-800">
                      {item.rating}
                    </span>
                    <span className="text-xs text-forest-400">
                      ({item.review_count})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-forest-500 text-sm mb-4">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{item.city}</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-forest-100">
                  <div className="flex items-center gap-1 text-forest-400 text-sm">
                    <Users className="w-3.5 h-3.5" />
                    <span>Maks. {item.max_guests} nəfər</span>
                  </div>
                  {item.is_free ? (
                    <div className="text-right">
                      <span className="font-display text-xl font-bold text-forest-900">
                        Ödənişsiz 
                      </span>
                    </div>
                  ) : item.entry_fee ? (
                    <div className="text-right">
                      <span className="font-display text-xl font-bold text-forest-900">
                        ₼{item.entry_fee}
                      </span>
                      <span className="text-forest-400 text-xs"> / giriş</span>
                    </div>
                  ) : (
                    <div className="text-right">
                      <span className="font-display text-xl font-bold text-forest-900">
                        ₼{item.price_per_night}
                      </span>
                      <span className="text-forest-400 text-xs"> / gecə</span>
                    </div>
                  )}

                </div>
              </div>
            </Link>
          ))}
    </section>
  );
}