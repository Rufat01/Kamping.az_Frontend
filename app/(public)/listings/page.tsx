import Link from "next/link";
import { Suspense } from "react";
import ListingsFilterBar from "@/features/(public)/listings/components/ListingsFilterBar";
import ListingsContent from "@/features/(public)/listings/components/ListingsContent";
import { Compass } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

export const metadata = {
  title: "Kamp Yerleri — Kamping.az",
  description: "Azerbaycanda en gozal kamp yerleri, glamping, bungalo ve cadir yerlerini kesf edin.",
};

function ListingsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-7">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl overflow-hidden animate-pulse"
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

export default function ListingsPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "#FAF6F0" }}>

        {/* Hero */}
        <section className="relative overflow-hidden pt-28 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8" style={{ background: "#1A3A2E" }}>
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1800&q=85"
              alt=""
              className="w-full h-full object-cover opacity-25"
            />
            <div className="absolute inset-0" style={{
              background: "linear-gradient(180deg, rgba(26,58,46,0.7) 0%, rgba(26,58,46,0.95) 100%)"
            }} />
            <div className="absolute inset-0" style={{
              background: "radial-gradient(ellipse at 20% 30%, rgba(212,165,116,0.15) 0%, transparent 50%)"
            }} />
          </div>

          <svg className="absolute top-32 right-12 w-14 h-14 opacity-25 animate-float-slow" viewBox="0 0 64 64" fill="none">
            <path d="M32 8 C40 16, 48 28, 32 56 C16 28, 24 16, 32 8 Z" fill="#D4A574" />
          </svg>
          <svg className="absolute bottom-20 left-16 w-10 h-10 opacity-20 animate-float" viewBox="0 0 64 64" fill="none">
            <path d="M32 8 C40 16, 48 28, 32 56 C16 28, 24 16, 32 8 Z" fill="#FAF6F0" />
          </svg>

          <div className="relative max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <Compass className="w-4 h-4 text-[#D4A574]" strokeWidth={1.5} />
              <Link href="/" className="text-[#D4A574]/80 hover:text-[#D4A574] text-xs font-semibold tracking-[0.25em] uppercase transition-colors">
                Ana səhifə
              </Link>
              <span className="text-[#FAF6F0]/30">/</span>
              <span className="text-[#FAF6F0]/60 text-xs font-semibold tracking-[0.25em] uppercase">
                Kamp Yerləri
              </span>
            </div>

            <h1 className="font-display font-bold text-[#FAF6F0] leading-[0.95] tracking-tight mb-5"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}>
              <em className="text-[#D4A574]">Məkanlar</em><br />
              kataloqu
            </h1>
          </div>

          <svg className="absolute bottom-0 left-0 w-full pointer-events-none" viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ height: "40px" }}>
            <path d="M0,40 Q360,5 720,30 T1440,25 L1440,60 L0,60 Z" fill="#FAF6F0" />
          </svg>
        </section>

        {/* Filter bar */}
        <Suspense fallback={null}>
          <ListingsFilterBar />
        </Suspense>

        {/* Listings grid + pagination */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <Suspense fallback={<ListingsGridSkeleton />}>
            <ListingsContent />
          </Suspense>
        </div>
      </main>
    </>
  );
}
