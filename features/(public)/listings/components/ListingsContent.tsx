"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { usePagination } from "@/hooks/usePagination";
import ListingCard from "./ListingCard";
import Pagination from "@/components/ui/Pagination";
import type { Listing } from "@/types";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/listings/`;

function ListingsGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-7">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl sm:rounded-2xl overflow-hidden animate-pulse"
          style={{ boxShadow: "0 4px 20px -2px rgba(45,74,51,0.08), 0 12px 30px -6px rgba(45,74,51,0.12)" }}
        >
          <div className="bg-[#E8E5D8]" style={{ aspectRatio: "4/3" }} />
          <div className="p-5 space-y-3">
            <div className="h-5 bg-[#E8E5D8] rounded-lg w-full" />
            <div className="h-3.5 bg-[#E8E5D8] rounded-lg w-2/3" />
            <div className="pt-4 border-t border-dashed border-[#E8E5D8] flex items-center justify-between">
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
      <span className="text-7xl block mb-8">🏕️</span>
      <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#1F2D24] mb-3">
        Heç bir məkan tapılmadı
      </h3>
      <p className="text-[#4A6B4F]/70 text-sm max-w-xs leading-relaxed mb-6">
        Filterləri dəyişib yenidən cəhd et.
      </p>
      <Link
        href="/listings"
        className="inline-flex items-center gap-2 text-[#FAF6F0] font-bold text-sm px-6 py-3 rounded-2xl transition-all active:scale-95 hover:shadow-xl"
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

export default function ListingsContent() {
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
  } = usePagination<Listing>(BASE_URL, 12);

  useEffect(() => {
    const filters: Record<string, string> = {};
    const p = (key: string) => searchParams.get(key);
    if (p("listing_type")) filters.listing_type = p("listing_type")!;
    if (p("city")) filters.city = p("city")!;
    if (p("min_price")) filters.min_price = p("min_price")!;
    if (p("max_price")) filters.max_price = p("max_price")!;
    if (p("guests")) filters.guests = p("guests")!;
    if (p("search")) filters.search = p("search")!;
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

  if (loading) return <ListingsGridSkeleton />;

  if (error) return <ErrorState onRetry={() => fetchPage(currentPage)} />;

  if (!data?.results.length) return <EmptyState />;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-7">
        {data.results.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
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
