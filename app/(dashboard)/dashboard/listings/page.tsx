"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus, Pencil, Trash2, Clock, Eye,
  Tent, AlertTriangle, LayoutList, LayoutGrid,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { ownerListings } from "@/features/(public)/listings/services/listings.service";
import type { Tour, TourStatus } from "@/types";

const STATUS_CONFIG: Record<TourStatus, { label: string; className: string }> = {
  published: { label: "Paylaşılıb", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  draft:    { label: "Qaralama", className: "bg-amber-50 text-amber-700 border-amber-200" },
  inactive: { label: "Rədd edildi",  className: "bg-[#F5F0EB] text-[#4A6B4F]/60 border-[#E8E5D8]" },
  pending:  { label: "Təsdiq Gözlənilir", className: "bg-blue-50 text-blue-700 border-blue-200" },
};

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

function ListingSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-[#E8E5D8]"
      style={{ boxShadow: "0 4px 20px -4px rgba(45,74,51,0.08)" }}>
      <div className="flex items-stretch">
        <div className="shrink-0 w-36 sm:w-48 min-h-[140px] bg-[#E8E5D8] animate-pulse" />
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-5 w-20 bg-[#E8E5D8] rounded-full animate-pulse" />
              <div className="h-5 w-24 bg-[#E8E5D8] rounded-full animate-pulse" />
            </div>
            <div className="h-6 w-3/4 bg-[#E8E5D8] rounded-lg animate-pulse mb-2" />
            <div className="h-4 w-1/2 bg-[#E8E5D8] rounded animate-pulse" />
          </div>
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#F0EDE6]">
            <div className="flex gap-2">
              <div className="h-8 w-16 bg-[#E8E5D8] rounded-xl animate-pulse" />
              <div className="h-8 w-24 bg-[#E8E5D8] rounded-xl animate-pulse" />
            </div>
            <div className="h-7 w-20 bg-[#E8E5D8] rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ListingRow({ listing, onDelete }) {
  return (
    <div
      className="bg-white rounded-3xl overflow-hidden border border-[#E8E5D8] hover:border-[#4A6B4F]/40 transition-all duration-300 group"
      style={{ boxShadow: "0 4px 20px -4px rgba(45,74,51,0.08)" }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 8px 32px -6px rgba(45,74,51,0.14)")}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 4px 20px -4px rgba(45,74,51,0.08)")}
    >
      <div className="flex items-stretch">

        {/* Cover image */}
        <div className="shrink-0 w-36 sm:w-48 relative overflow-hidden">
          {listing.cover_image ? (
            <img
              src={listing.cover_image}
              alt={listing.title}
              className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full absolute inset-0 flex flex-col items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg, #E8E5D8 0%, #D4CFC4 100%)" }}>
              <span className="text-4xl">🏕️</span>
              <span className="text-[9px] font-semibold text-[#4A6B4F]/50 uppercase tracking-widest">Şəkil yoxdur</span>
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/5 pointer-events-none" />
        </div>

        {/* Info */}
        <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between min-w-0">
          <div>
            {/* Badges row */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="inline-flex items-center gap-1 bg-[#F0EDE6] text-[#2D4A33] text-[10px] font-bold px-2.5 py-1 rounded-full">
                <Tent className="w-3 h-3" />
                Tur paketi
              </span>
              {listing.status && STATUS_CONFIG[listing.status] && (
                <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full border ${STATUS_CONFIG[listing.status].className}`}>
                  {STATUS_CONFIG[listing.status].label}
                </span>
              )}
            </div>

            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-base sm:text-lg font-bold text-[#1F2D24] leading-snug line-clamp-2">
                  {listing.title}
                </h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-[#4A6B4F]/65">
                  {listing.duration && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> {listing.duration}
                    </span>
                  )}
                  {listing.view_count != null && (
                    <span className="flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" /> {listing.view_count} baxış
                    </span>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="shrink-0 text-right">
                {listing.price ? (
                  <div className="bg-[#F0EDE6] rounded-2xl px-3 py-2 text-center">
                    <p className="font-display text-xl font-bold text-[#1F2D24] leading-none">₼{Number(listing.price).toLocaleString()}</p>
                    <p className="text-[10px] text-[#4A6B4F]/60 mt-0.5">/ nəfər</p>
                  </div>
                ) : (
                  <div className="bg-emerald-50 rounded-2xl px-3 py-2 text-center">
                    <p className="text-emerald-700 text-xs font-bold">Pulsuz</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-5 pt-4 border-t border-[#F0EDE6]">
            <Link
              href={`/tours/${listing.id}`}
              className="flex items-center gap-1.5 text-[#4A6B4F] hover:text-[#2D4A33] text-xs font-semibold px-3.5 py-2 rounded-xl hover:bg-[#F0EDE6] transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              Bax
            </Link>
            <Link
              href={`/dashboard/listings/${listing.id}/edit`}
              className="flex items-center gap-1.5 text-[#2D4A33] text-xs font-semibold px-3.5 py-2 rounded-xl bg-[#F0EDE6] hover:bg-[#E8E5D8] transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
              Redaktə
            </Link>
            <button
              onClick={() => onDelete(listing)}
              className="flex items-center gap-1.5 text-red-400 hover:text-red-600 text-xs font-semibold px-3.5 py-2 rounded-xl hover:bg-red-50 transition-colors ml-auto"
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

function ListingCard({ listing, onDelete }) {
  return (
    <div
      className="bg-white rounded-3xl overflow-hidden border border-[#E8E5D8] hover:border-[#4A6B4F]/40 transition-all duration-300 group flex flex-col"
      style={{ boxShadow: "0 4px 20px -4px rgba(45,74,51,0.08)" }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 8px 32px -6px rgba(45,74,51,0.14)")}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 4px 20px -4px rgba(45,74,51,0.08)")}
    >
      {/* Cover image */}
      <div className="relative overflow-hidden h-44">
        {listing.cover_image ? (
          <img
            src={listing.cover_image}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, #E8E5D8 0%, #D4CFC4 100%)" }}>
            <span className="text-4xl">🏕️</span>
            <span className="text-[9px] font-semibold text-[#4A6B4F]/50 uppercase tracking-widest">Şəkil yoxdur</span>
          </div>
        )}
        {/* Status badge over image */}
        {listing.status && STATUS_CONFIG[listing.status] && (
          <div className="absolute top-3 left-3">
            <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-sm ${STATUS_CONFIG[listing.status].className}`}>
              {STATUS_CONFIG[listing.status].label}
            </span>
          </div>
        )}
        {/* Price badge over image */}
        <div className="absolute top-3 right-3">
          {listing.price ? (
            <div className="bg-white/90 backdrop-blur-sm rounded-xl px-2.5 py-1.5 text-center shadow-sm">
              <p className="font-display text-sm font-bold text-[#1F2D24] leading-none">₼{Number(listing.price).toLocaleString()}</p>
              <p className="text-[9px] text-[#4A6B4F]/60 mt-0.5">/ nəfər</p>
            </div>
          ) : (
            <div className="bg-emerald-500/90 backdrop-blur-sm rounded-xl px-2.5 py-1.5 shadow-sm">
              <p className="text-white text-[10px] font-bold">Pulsuz</p>
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col p-4">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="inline-flex items-center gap-1 bg-[#F0EDE6] text-[#2D4A33] text-[10px] font-bold px-2 py-0.5 rounded-full">
            <Tent className="w-3 h-3" />
            Tur paketi
          </span>
        </div>
        <h3 className="font-display text-sm font-bold text-[#1F2D24] leading-snug line-clamp-2 mb-2">
          {listing.title}
        </h3>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#4A6B4F]/65 mb-auto">
          {listing.duration && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {listing.duration}
            </span>
          )}
          {listing.view_count != null && (
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" /> {listing.view_count} baxış
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-[#F0EDE6]">
          <Link
            href={`/tours/${listing.id}`}
            className="flex items-center gap-1 text-[#4A6B4F] hover:text-[#2D4A33] text-xs font-semibold px-2.5 py-1.5 rounded-xl hover:bg-[#F0EDE6] transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            Bax
          </Link>
          <Link
            href={`/dashboard/listings/${listing.id}/edit`}
            className="flex items-center gap-1 text-[#2D4A33] text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-[#F0EDE6] hover:bg-[#E8E5D8] transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
            Redaktə
          </Link>
          <button
            onClick={() => onDelete(listing)}
            className="flex items-center gap-1 text-red-400 hover:text-red-600 text-xs font-semibold px-2.5 py-1.5 rounded-xl hover:bg-red-50 transition-colors ml-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Sil
          </button>
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
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

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
          setListings(Array.isArray(data) ? data : ((data as { results?: Tour[] }).results ?? []));
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
        <main style={{ background: "#FAF6F0" }} className="min-h-screen">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
            <div className="flex items-end justify-between gap-4 mb-8">
              <div>
                <div className="h-7 w-36 bg-[#E8E5D8] rounded-full animate-pulse mb-4" />
                <div className="h-9 w-48 bg-[#E8E5D8] rounded-lg animate-pulse mb-2" />
                <div className="h-4 w-28 bg-[#E8E5D8] rounded animate-pulse" />
              </div>
              <div className="h-11 w-32 bg-[#E8E5D8] rounded-2xl animate-pulse shrink-0" />
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => <ListingSkeleton key={i} />)}
            </div>
          </div>
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
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#F0EDE6] rounded-full px-3.5 py-1.5 mb-4">
                <LayoutList className="w-3.5 h-3.5 text-[#D4A574]" strokeWidth={2} />
                <span className="text-[#A0613B] text-[11px] font-bold uppercase tracking-[0.2em]">
                  Sahibkar paneli
                </span>
              </div>
              <h1 className="font-display font-bold text-[#1F2D24] leading-tight"
                style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}>
                Elanlarım
              </h1>
              <p className="text-[#4A6B4F]/65 text-sm mt-1.5">
                {listings.length > 0
                  ? <><strong className="text-[#1F2D24]">{listings.length}</strong> elan tapıldı</>
                  : "Hələ ki elan əlavə edilməyib"}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {/* View toggle */}
              <div className="flex items-center bg-[#F0EDE6] rounded-xl p-1">
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all ${viewMode === "list" ? "bg-white shadow-sm text-[#2D4A33]" : "text-[#4A6B4F]/50 hover:text-[#4A6B4F]"}`}
                  title="Siyahı görünüşü"
                >
                  <LayoutList className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-[#2D4A33]" : "text-[#4A6B4F]/50 hover:text-[#4A6B4F]"}`}
                  title="Grid görünüşü"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>

              <Link
                href="/dashboard/listings/new"
                className="flex items-center gap-2 text-white font-bold text-sm px-5 py-3 rounded-2xl transition-all active:scale-95 hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #2D4A33 0%, #1A3A2E 100%)", boxShadow: "0 4px 14px -3px rgba(26,58,46,0.4)" }}
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Yeni elan</span>
                <span className="sm:hidden">Əlavə et</span>
              </Link>
            </div>
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

          {/* Listings */}
          {listings.length > 0 && (
            viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {listings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onDelete={setDeleteTarget}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {listings.map((listing) => (
                  <ListingRow
                    key={listing.id}
                    listing={listing}
                    onDelete={setDeleteTarget}
                  />
                ))}
              </div>
            )
          )}
        </div>
      </main>
    </>
  );
}
