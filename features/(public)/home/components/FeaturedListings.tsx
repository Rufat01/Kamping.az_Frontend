"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Star, Users, Heart, ArrowUpRight } from "lucide-react";
import { getListings } from "@/features/(public)/listings/services/listings.service";
import type { Listing } from "@/types";

const rotations = [-0.5, 0.8, -0.3, 0.5, -0.7, 0.4];

function SkeletonCard({ rotate }: { rotate: number }) {
  return (
    <div
      className="block"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <div
        className="bg-white rounded-2xl overflow-hidden animate-pulse"
        style={{ boxShadow: "0 4px 20px -2px rgba(45,74,51,0.08), 0 12px 30px -6px rgba(45,74,51,0.12)" }}
      >
        <div className="bg-[#E8E5D8]" style={{ aspectRatio: "4/3" }} />
        <div className="p-5 space-y-3">
          <div className="h-5 bg-[#E8E5D8] rounded w-3/4" />
          <div className="h-4 bg-[#E8E5D8] rounded w-1/2" />
          <div className="h-px bg-[#E8E5D8] my-2" />
          <div className="flex justify-between">
            <div className="h-4 bg-[#E8E5D8] rounded w-16" />
            <div className="h-4 bg-[#E8E5D8] rounded w-12" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getListings({ listing_type: "house" })
      .then((data: unknown) => {
        if (Array.isArray(data)) {
          setListings(data);
        } else if (data && typeof data === "object" && "results" in data) {
          setListings((data as { results: Listing[] }).results);
        }
      })
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="relative py-20 lg:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden" style={{ background: "#FAF6F0" }}>

      {/* Section divider — curved top */}
      <svg className="absolute top-0 left-0 w-full pointer-events-none" viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ height: "40px" }}>
        <path d="M0,30 Q360,5 720,25 T1440,20 L1440,0 L0,0 Z" fill="#E8E5D8" opacity="0.5" />
      </svg>

      <div className="relative max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-px bg-[#D4A574]" />
              <span className="text-[#A0613B] text-xs font-bold uppercase tracking-[0.25em]">
                Sevilənlər
              </span>
            </div>
            <h2 className="font-display font-bold text-[#1F2D24] leading-[0.95]"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}>
              <em className="text-[#4A6B4F]">Ürəkdən</em> seçilmiş<br />
              məkanlar
            </h2>
          </div>
          <Link href="/listings"
            className="text-[#4A6B4F] hover:text-[#2D4A33] text-sm font-bold transition-colors flex items-center gap-2 group whitespace-nowrap">
            <span className="underline underline-offset-4 decoration-2 decoration-[#D4A574]">Bütün elanlar</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} rotate={rotations[i % rotations.length]} />
              ))
            : listings.map((listing, i) => (
                <Link
                  key={listing.id}
                  href={`/listings/${listing.id}`}
                  className="group block transition-all duration-300 hover:!rotate-0 hover:-translate-y-2"
                  style={{ transform: `rotate(${rotations[i % rotations.length]}deg)` }}
                >
                  <div className="bg-white rounded-2xl overflow-hidden"
                    style={{ boxShadow: "0 4px 20px -2px rgba(45,74,51,0.08), 0 12px 30px -6px rgba(45,74,51,0.12)" }}>

                    {/* Image */}
                    <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
                      {listing.cover_image ? (
                        <img
                          src={listing.cover_image}
                          alt={listing.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#E8E5D8] flex items-center justify-center text-[#4A6B4F]/30 text-sm">
                          Şəkil yoxdur
                        </div>
                      )}

                      {/* Badge */}
                      <div className="absolute top-4 left-4 bg-[#FAF6F0]/95 backdrop-blur text-[#2D4A33] text-xs font-bold px-3 py-1.5 rounded-md border-2 border-dashed border-[#4A6B4F]/30">
                        {listing.listing_type_display}
                      </div>

                      {/* Heart */}
                      <button
                        onClick={e => e.preventDefault()}
                        className="absolute top-4 right-4 w-9 h-9 bg-white/95 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                      >
                        <Heart className="w-4 h-4 text-[#4A6B4F] hover:text-red-400 hover:fill-red-400 transition-colors" />
                      </button>

                      {/* Price */}
                      <div className="absolute bottom-4 right-4 bg-[#2D4A33] text-[#FAF6F0] px-3 py-2 rounded-xl shadow-lg">
                        <div className="flex items-baseline gap-1">
                          <span className="font-display text-xl font-bold">
                            {listing.is_free ? "Pulsuz" : (listing.price_per_night ?? listing.entry_fee ?? "—")}
                          </span>
                          {!listing.is_free && (
                            <span className="text-[#D4A574] text-xs">₼/gece</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-display text-lg font-bold text-[#1F2D24] leading-tight line-clamp-2 flex-1">
                          {listing.title}
                        </h3>
                        <ArrowUpRight className="w-4 h-4 text-[#4A6B4F] shrink-0 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                      </div>

                      <div className="flex items-center gap-1.5 text-[#4A6B4F]/70 text-sm mb-4">
                        <MapPin className="w-3.5 h-3.5" />
                        {listing.city}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-dashed border-[#E8E5D8]">
                        <div className="flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 fill-[#D4A574] text-[#D4A574]" />
                          <span className="text-sm font-bold text-[#1F2D24]">{listing.rating}</span>
                          <span className="text-[#4A6B4F]/50 text-xs">({listing.review_count})</span>
                        </div>
                        <div className="flex items-center gap-1 text-[#4A6B4F]/70 text-xs">
                          <Users className="w-3.5 h-3.5" />
                          {listing.max_guests} nəfər
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
        </div>

        {/* Empty state */}
        {!loading && listings.length === 0 && (
          <div className="text-center py-16 text-[#4A6B4F]/50 text-sm">
            Hal-hazırda heç bir ev elanı mövcud deyil.
          </div>
        )}
      </div>
    </section>
  );
}
