"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { MapPin, Eye, Clock, ArrowUpRight } from "lucide-react";
import { usePagination } from "@/hooks/usePagination";
import Pagination from "@/components/ui/Pagination";
import type { Tour } from "@/types";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts/`;

const CARD_ROTATIONS = [-0.5, 0.4, -0.3, 0.6, -0.4, 0.3];

function TourCard({ tour, index }: { tour: Tour; index: number }) {
  const rotate = CARD_ROTATIONS[index % CARD_ROTATIONS.length];

  return (
    <Link
      href={`/tours/${tour.id}`}
      className="group block transition-all duration-300 hover:!rotate-0 hover:-translate-y-2"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{ boxShadow: "0 4px 20px -2px rgba(45,74,51,0.08), 0 12px 30px -6px rgba(45,74,51,0.12)" }}
      >
        <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
          {tour.cover_image ? (
            <img
              src={tour.cover_image}
              alt={tour.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl" style={{ background: "#E8E5D8" }}>
              🏔️
            </div>
          )}

          {tour.duration && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[#FAF6F0]/95 backdrop-blur text-[#2D4A33] text-xs font-bold px-3 py-1.5 rounded-md border-2 border-dashed border-[#4A6B4F]/30">
              <Clock className="w-3 h-3" />
              {tour.duration}
            </div>
          )}

          <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur text-white text-xs font-semibold px-2.5 py-1.5 rounded-full">
            <Eye className="w-3 h-3" />
            {tour.view_count}
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-display text-lg font-bold text-[#1F2D24] leading-tight flex-1 line-clamp-2">
              {tour.title}
            </h3>
            <ArrowUpRight className="w-4 h-4 text-[#4A6B4F] shrink-0 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>

          {tour.location && (
            <div className="flex items-center gap-1.5 text-[#4A6B4F]/70 text-sm mb-3">
              <MapPin className="w-3.5 h-3.5" />
              {tour.location}
            </div>
          )}

          <p className="text-[#4A6B4F]/70 text-sm leading-relaxed line-clamp-3 mb-4 font-light">
            {tour.description}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-dashed border-[#E8E5D8]">
            <div className="ml-auto">
              {tour.price ? (
                <div>
                  <span className="font-display text-xl font-bold text-[#1F2D24]">
                    ₼{Number(tour.price).toLocaleString()}
                  </span>
                  <span className="text-[#4A6B4F]/60 text-xs ml-1">/ nəfər</span>
                </div>
              ) : (
                <span className="inline-block bg-[#4A6B4F]/10 text-[#4A6B4F] text-xs font-bold px-3 py-1.5 rounded-full">
                  🌿 Pulsuz
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function ToursGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl overflow-hidden animate-pulse"
          style={{ boxShadow: "0 4px 20px -2px rgba(45,74,51,0.08), 0 12px 30px -6px rgba(45,74,51,0.12)" }}
        >
          <div className="bg-[#E8E5D8]" style={{ aspectRatio: "16/9" }} />
          <div className="p-5 space-y-3">
            <div className="h-5 bg-[#E8E5D8] rounded-lg w-full" />
            <div className="h-3.5 bg-[#E8E5D8] rounded-lg w-1/2" />
            <div className="space-y-2">
              <div className="h-3 bg-[#E8E5D8] rounded-lg w-full" />
              <div className="h-3 bg-[#E8E5D8] rounded-lg w-5/6" />
              <div className="h-3 bg-[#E8E5D8] rounded-lg w-3/4" />
            </div>
            <div className="pt-4 border-t border-dashed border-[#E8E5D8] flex justify-end">
              <div className="h-6 w-24 bg-[#E8E5D8] rounded-lg" />
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
        {data.results.map((tour, i) => (
          <TourCard key={tour.id} tour={tour} index={i} />
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
