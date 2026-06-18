"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus, Pencil, Trash2, MapPin, Users, Eye,
  Tent, AlertTriangle, Loader2, LayoutList,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { ownerListings } from "@/features/(public)/listings/services/listings.service";
import type { Listing } from "@/types";

function ConfirmModal({ listing, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl"
        style={{ boxShadow: "0 20px 60px -10px rgba(26,58,46,0.25)" }}>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background: "#FEF2F2" }}>
          <AlertTriangle className="w-7 h-7 text-red-500" />
        </div>
        <h3 className="font-display text-xl font-bold text-[#1F2D24] text-center mb-2">
          Elanı sil
        </h3>
        <p className="text-[#4A6B4F]/70 text-sm text-center leading-relaxed mb-7">
          <strong className="text-[#1F2D24]">"{listing.title}"</strong> elanını silmək istədiyinizə əminsiniz?
          Bu əməliyyat geri qaytarıla bilməz.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-2xl border-2 border-[#E8E5D8] text-[#4A6B4F] font-semibold text-sm hover:bg-[#FAF6F0] transition-colors"
          >
            Ləğv et
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-colors"
          >
            Sil
          </button>
        </div>
      </div>
    </div>
  );
}

function ListingRow({ listing, onDelete }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#E8E5D8] hover:border-[#4A6B4F]/30 hover:shadow-md transition-all group"
      style={{ boxShadow: "0 2px 12px -2px rgba(45,74,51,0.06)" }}>
      <div className="flex items-start gap-0 sm:gap-4">

        {/* Cover image */}
        <div className="shrink-0 w-28 sm:w-36 h-full min-h-[100px] relative overflow-hidden">
          {listing.cover_image ? (
            <img
              src={listing.cover_image}
              alt={listing.title}
              className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full absolute inset-0 flex items-center justify-center text-3xl"
              style={{ background: "#E8E5D8" }}>
              🏕️
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 p-4 sm:py-4 sm:pr-4 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {listing.listing_type_display && (
                <span className="inline-block bg-[#FAF6F0] text-[#2D4A33] text-[10px] font-bold px-2.5 py-1 rounded-md border border-dashed border-[#4A6B4F]/25 mb-2">
                  {listing.listing_type_display}
                </span>
              )}
              <h3 className="font-display text-base sm:text-lg font-bold text-[#1F2D24] leading-tight truncate">
                {listing.title}
              </h3>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-[#4A6B4F]/70">
                {listing.city && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {listing.city}
                  </span>
                )}
                {listing.max_guests && (
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" /> {listing.max_guests} qonaq
                  </span>
                )}
                {listing.view_count != null && (
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {listing.view_count}
                  </span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="shrink-0 text-right">
              {listing.is_free || (!listing.price_per_night && !listing.entry_fee) ? (
                <span className="inline-block bg-[#4A6B4F]/10 text-[#4A6B4F] text-xs font-bold px-3 py-1.5 rounded-full">
                  🌿 Pulsuz
                </span>
              ) : listing.entry_fee ? (
                <div>
                  <p className="font-display text-lg font-bold text-[#A0613B]">₼{Number(listing.entry_fee).toLocaleString()}</p>
                  <p className="text-[10px] text-[#4A6B4F]/60">giriş</p>
                </div>
              ) : (
                <div>
                  <p className="font-display text-lg font-bold text-[#1F2D24]">₼{Number(listing.price_per_night).toLocaleString()}</p>
                  <p className="text-[10px] text-[#4A6B4F]/60">gecəlik</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-dashed border-[#E8E5D8]">
            <Link
              href={`/listings/${listing.id}`}
              className="flex items-center gap-1.5 text-[#4A6B4F] hover:text-[#2D4A33] text-xs font-semibold px-3 py-2 rounded-xl hover:bg-[#FAF6F0] transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              Bax
            </Link>
            <Link
              href={`/dashboard/listings/${listing.id}/edit`}
              className="flex items-center gap-1.5 text-[#2D4A33] text-xs font-semibold px-3 py-2 rounded-xl border border-[#4A6B4F]/25 hover:bg-[#FAF6F0] transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
              Redaktə
            </Link>
            <button
              onClick={() => onDelete(listing)}
              className="flex items-center gap-1.5 text-red-500 hover:text-red-600 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-red-50 transition-colors ml-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Sil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OwnerListingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }
    if (status === "authenticated" && session.user?.role !== "owner") {
      router.replace("/dashboard/reservations");
      return;
    }
    if (status === "authenticated") {
      ownerListings.myListings(session.accessToken)
        .then((data) => {
          setListings(Array.isArray(data) ? data : ((data as { results?: Listing[] }).results ?? []));
        })
        .catch(() => setError("Elanlar yüklənərkən xəta baş verdi."))
        .finally(() => setLoading(false));
    }
  }, [status, session, router]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await ownerListings.delete(deleteTarget.id, session.accessToken);
      setListings((prev) => prev.filter((l) => l.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {
      setError("Silmə zamanı xəta baş verdi.");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <>
        <Navbar forceScrolled />
        <main className="min-h-screen flex items-center justify-center" style={{ background: "#FAF6F0" }}>
          <Loader2 className="w-8 h-8 text-[#4A6B4F] animate-spin" />
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar forceScrolled />
      {deleteTarget && (
        <ConfirmModal
          listing={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <main style={{ background: "#FAF6F0" }} className="min-h-screen relative overflow-hidden">

        {/* Decorative */}
        <svg className="absolute top-32 right-8 w-12 h-12 opacity-[0.10] animate-float-slow pointer-events-none" viewBox="0 0 64 64" fill="none">
          <path d="M32 8 C40 16, 48 28, 32 56 C16 28, 24 16, 32 8 Z" fill="#D4A574" />
        </svg>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">

          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <LayoutList className="w-5 h-5 text-[#D4A574]" strokeWidth={1.5} />
                <span className="text-[#A0613B] text-xs font-bold uppercase tracking-[0.25em]">
                  Sahibkar paneli
                </span>
              </div>
              <h1 className="font-display font-bold text-[#1F2D24] leading-tight"
                style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}>
                Elanlarım
              </h1>
              <p className="text-[#4A6B4F]/70 text-sm mt-1.5">
                {listings.length > 0
                  ? <><strong className="text-[#1F2D24]">{listings.length}</strong> aktiv elan</>
                  : "Hələ ki elan yoxdur"}
              </p>
            </div>

            <Link
              href="/dashboard/listings/new"
              className="flex items-center gap-2 text-[#FAF6F0] font-bold text-sm px-5 py-3 rounded-2xl transition-all active:scale-95 hover:shadow-lg shrink-0"
              style={{ background: "#2D4A33" }}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Yeni elan</span>
              <span className="sm:hidden">Əlavə et</span>
            </Link>
          </div>

          {/* Error banner */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-5 py-4 rounded-2xl mb-6 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Empty state */}
          {listings.length === 0 && !error && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
                style={{ background: "#1A3A2E" }}>
                <Tent className="w-9 h-9 text-[#D4A574]" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-2xl font-bold text-[#1F2D24] mb-3">
                Heç bir elan yoxdur
              </h3>
              <p className="text-[#4A6B4F]/70 text-sm max-w-xs leading-relaxed mb-8">
                İlk elanınızı əlavə edərək platformada görünməyə başlayın.
              </p>
              <Link
                href="/dashboard/listings/new"
                className="inline-flex items-center gap-2 text-[#FAF6F0] font-bold text-sm px-7 py-3.5 rounded-2xl transition-all active:scale-95 hover:shadow-lg"
                style={{ background: "#2D4A33" }}
              >
                <Plus className="w-4 h-4" />
                İlk elanı əlavə et
              </Link>
            </div>
          )}

          {/* Listings list */}
          {listings.length > 0 && (
            <div className="space-y-4">
              {listings.map((listing) => (
                <ListingRow
                  key={listing.id}
                  listing={listing}
                  onDelete={setDeleteTarget}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
