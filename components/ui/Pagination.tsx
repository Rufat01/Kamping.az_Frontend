"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalCount: number;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
}

const PAGE_SIZES = [12, 24, 48];

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "...")[] = [1];

  if (current > 3) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("...");

  pages.push(total);
  return pages;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalCount,
  pageSize,
  onPageSizeChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const rangeFrom = (currentPage - 1) * pageSize + 1;
  const rangeTo = Math.min(currentPage * pageSize, totalCount);
  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className="mt-12 flex flex-col items-center gap-5">
      
      {/* Page buttons */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-full border border-[#E8E5D8] bg-white text-[#4A6B4F] transition-all hover:border-[#4A6B4F] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-[#E8E5D8]"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {pages.map((page, i) =>
          page === "..." ? (
            <span
              key={`ellipsis-${i}`}
              className="w-9 text-center text-sm text-[#4A6B4F]/40 select-none"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-9 h-9 text-sm font-bold rounded-full transition-all ${
                currentPage === page
                  ? "text-white shadow-md"
                  : "bg-white border border-[#E8E5D8] text-[#4A6B4F] hover:border-[#4A6B4F]"
              }`}
              style={currentPage === page ? { background: "#2D4A33" } : {}}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-full border border-[#E8E5D8] bg-white text-[#4A6B4F] transition-all hover:border-[#4A6B4F] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-[#E8E5D8]"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
