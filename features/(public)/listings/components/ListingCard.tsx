"use client";

import Link from "next/link";
import { MapPin, Star, Users } from "lucide-react";
import type { Listing } from "@/types";

function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="listing-card bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-forest-100 block group"
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
        <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 bg-white/90 backdrop-blur-sm text-forest-800 text-[10px] sm:text-xs font-semibold px-2 py-1 sm:px-3 sm:py-1.5 rounded-full max-w-[75%] truncate">
          {listing.listing_type_display}
        </div>
        {listing.is_free && (
          <div className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 bg-green-500 text-white text-[10px] sm:text-xs font-semibold px-2 py-1 sm:px-3 sm:py-1.5 rounded-full">
            Pulsuz
          </div>
        )}
      </div>

      <div className="p-2.5 sm:p-5">
        <div className="flex items-center justify-between gap-2 mb-1.5 sm:mb-2">
          {listing.is_free ? (
            <span className="font-display text-base sm:text-xl font-bold text-green-600">Pulsuz</span>
          ) : listing.entry_fee ? (
            <div className="min-w-0">
              <span className="font-display text-base sm:text-xl font-bold text-forest-900">
                ₼{listing.entry_fee}
              </span>
              <span className="text-forest-400 text-[10px] sm:text-xs"> / giriş</span>
            </div>
          ) : (
            <div className="min-w-0">
              <span className="font-display text-base sm:text-xl font-bold text-forest-900">
                ₼{listing.price_per_night}
              </span>
              <span className="text-forest-400 text-[10px] sm:text-xs"> / gecə</span>
            </div>
          )}
          {listing.rating > 0 && (
            <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs sm:text-sm font-semibold text-forest-800">{listing.rating}</span>
            </div>
          )}
        </div>

        <h2 className="font-display text-xs sm:text-lg font-bold text-forest-900 leading-tight truncate mb-1.5 sm:mb-2">
          {listing.title}
        </h2>

        <div className="flex items-center justify-between gap-2 pt-1.5 sm:pt-3 border-t border-forest-100">
          <div className="flex items-center gap-1 text-forest-500 text-[11px] sm:text-sm min-w-0">
            <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            <span className="truncate">{listing.city}</span>
          </div>
          <div className="flex items-center gap-1 text-forest-400 text-[11px] sm:text-sm shrink-0">
            <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>{listing.max_guests}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ListingCard;