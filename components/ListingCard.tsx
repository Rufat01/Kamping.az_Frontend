"use client";

import Link from "next/link";
import { MapPin, Star, Users } from "lucide-react";
import type { Listing } from "../types";

function ListingCard({ listing }: { listing: Listing }) {
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

export default ListingCard;