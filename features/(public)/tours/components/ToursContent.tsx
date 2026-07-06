"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { MapPin, Eye, Clock } from "lucide-react";
import { usePagination } from "@/hooks/usePagination";
import Pagination from "@/components/ui/Pagination";
import type { Tour } from "@/types";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts/`;

function TourCard({ tour }: { tour: Tour }) {
  return (
    <Link
      href={`/tours/${tour.id}`}
      className="tour-card bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-forest-100 block group"
    >
      <div className="relative aspect-[4/3] sm:aspect-[16/9] overflow-hidden">
        {tour.cover_image ? (
          <img
            src={tour.cover_image}
            alt={tour.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-forest-100 flex items-center justify-center">
            <span className="text-4xl">🏔️</span>
          </div>
        )}

        {tour.duration && (
          <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-forest-800 text-[10px] sm:text-xs font-semibold px-2 py-1 sm:px-3 sm:py-1.5 rounded-full max-w-[75%]">
            <Clock className="w-3 h-3 shrink-0" />
            <span className="truncate">{tour.duration}</span>
          </div>
        )}

        <div className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 flex items-center gap-1 bg-black/40 backdrop-blur text-white text-[10px] sm:text-xs font-semibold px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-full">
          <Eye className="w-3 h-3" />
          {tour.view_count}
        </div>
      </div>

      <div className="p-2.5 sm:p-5">
        <div className="flex items-center justify-between gap-2 mb-1.5 sm:mb-2">
          {tour.price ? (
            <div className="min-w-0">
              <span className="font-display text-base sm:text-xl font-bold text-forest-900">
                ₼{Number(tour.price).toLocaleString()}
              </span>
              <span className="text-forest-400 text-[10px] sm:text-xs"> / nəfər</span>
            </div>
          ) : (
            <span className="font-display text-base sm:text-xl font-bold text-green-600">Pulsuz</span>
          )}
        </div>

        <h2 className="font-display text-xs sm:text-lg font-bold text-forest-900 leading-tight truncate mb-1.5 sm:mb-2">
          {tour.title}
        </h2>

        <div className="flex items-center justify-between gap-2 pt-1.5 sm:pt-3 border-t border-forest-100">
          <div className="flex items-center gap-1 text-forest-500 text-[11px] sm:text-sm min-w-0">
            <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            <span className="truncate">{tour.location || "Azərbaycan"}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function ToursGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-7">
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl sm:rounded-2xl overflow-hidden animate-pulse"
          style={{ boxShadow: "0 4px 20px -2px rgba(45,74,51,0.08), 0 12px 30px -6px rgba(45,74,51,0.12)" }}
        >
          <div className="bg-[#E8E5D8]" style={{ aspectRatio: "4/3" }} />
          <div className="p-2.5 sm:p-5 space-y-2 sm:space-y-3">
            <div className="h-5 bg-[#E8E5D8] rounded-lg w-full" />
            <div className="h-3.5 bg-[#E8E5D8] rounded-lg w-2/3" />
            <div className="pt-2 sm:pt-4 border-t border-dashed border-[#E8E5D8] flex items-center justify-between">
              <div className="h-3 bg-[#E8E5D8] rounded-lg w-16" />
              <div className="h-3 bg-[#E8E5D8] rounded-lg w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <span className="text-7xl mb-8">🏔️</span>
      <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#1F2D24] mb-3">
        Nəticə tapılmadı
      </h3>
      <p className="text-[#4A6B4F]/70 text-sm max-w-xs leading-relaxed mb-6">
        Axtarış parametrlərini dəyişdirərək yenidən cəhd edin.
      </p>
      <Link
        href="/tours"
        className="inline-flex items-center gap-2 text-[#FAF6F0] font-bold text-sm px-6 py-3 rounded-2xl transition-all active:scale-95"
        style={{ background: "#2D4A33" }}
      >
        Filterləri sıfırla
      </Link>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <span className="text-6xl mb-6">⚠️</span>
      <p className="text-[#4A6B4F]/70 text-sm mb-6">Məlumatlar yüklənərkən xəta baş verdi.</p>
      <button
        onClick={onRetry}
        className="text-[#FAF6F0] font-bold text-sm px-6 py-3 rounded-2xl transition-all active:scale-95 hover:shadow-xl"
        style={{ background: "#2D4A33" }}
      >
        Yenidən cəhd et
      </button>
    </div>
  );
}

export default function ToursContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const {
    data,
    loading,
    error,
    currentPage,
    pageSize,
    setPageSize,
    totalPages,
    fetchPage,
  } = usePagination<Tour>(BASE_URL, 9);

  useEffect(() => {
    const filters: Record<string, string> = {};
    const p = (key: string) => searchParams.get(key);
    if (p("search")) filters.search = p("search")!;
    if (p("location")) filters.location = p("location")!;
    if (p("min_price")) filters.min_price = p("min_price")!;
    if (p("max_price")) filters.max_price = p("max_price")!;
    if (p("free")) filters.free = p("free")!;
    const page = Number(p("page") || 1);
    fetchPage(page, filters);
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return <ToursGridSkeleton />;

  if (error) return <ErrorState onRetry={() => fetchPage(currentPage)} />;

  if (!data?.results.length) return <EmptyState />;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-7">
        {data.results.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalCount={data.count}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
      />
    </>
  );
}
