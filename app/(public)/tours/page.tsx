import Link from "next/link";
import { Suspense } from "react";
import { Compass } from "lucide-react";
import ToursFilterBar from "@/features/(public)/tours/components/ToursFilterBar";
import ToursContent from "@/features/(public)/tours/components/ToursContent";
import Navbar from "@/components/layout/Navbar";

export const metadata = {
  title: "Turlar — Kamping.az",
  description: "Azerbaycanda en gozal tur paketleri ve macera turlari.",
};

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

export default function ToursPage() {
  return (
    <>
      <Navbar forceScrolledMobile />
      <main className="pt-16 sm:pt-0 relative overflow-x-clip" style={{ background: "#FAF6F0" }}>

        {/* Hero */}
        <section
          className="hidden sm:block relative overflow-hidden pt-28 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8"
          style={{ background: "#1A3A2E" }}
        >
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
              background: "radial-gradient(ellipse at 30% 40%, rgba(212,165,116,0.15) 0%, transparent 60%)"
            }} />
          </div>

          <svg className="absolute top-32 right-12 w-14 h-14 opacity-25 animate-float-slow pointer-events-none" viewBox="0 0 64 64" fill="none">
            <path d="M32 8 C40 16, 48 28, 32 56 C16 28, 24 16, 32 8 Z" fill="#D4A574" />
          </svg>

          <div className="relative max-w-7xl mx-auto">
            <nav className="flex items-center gap-2 mb-4 text-sm">
              <Compass className="w-4 h-4 text-[#D4A574]" strokeWidth={1.5} />
              <Link href="/" className="text-[#D4A574]/80 hover:text-[#D4A574] text-xs font-semibold tracking-[0.25em] uppercase transition-colors">
                Ana səhifə
              </Link>
              <span className="text-[#FAF6F0]/30">/</span>
              <span className="text-[#FAF6F0]/60 text-xs font-semibold tracking-[0.25em] uppercase">Turlar</span>
            </nav>

            <h1
              className="font-display font-bold text-[#FAF6F0] leading-[0.95] tracking-tight mb-4"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}
            >
              <span className="text-[#D4A574]">Tur</span> paketləri
            </h1>

          </div>

          <svg className="absolute bottom-0 left-0 w-full pointer-events-none" viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ height: "40px" }}>
            <path d="M0,40 Q360,5 720,30 T1440,25 L1440,60 L0,60 Z" fill="#FAF6F0" />
          </svg>
        </section>

        {/* Filter bar */}
        <Suspense fallback={null}>
          <ToursFilterBar />
        </Suspense>

        {/* Tours grid + pagination */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-16 relative">
          <svg className="absolute top-10 right-8 w-16 h-16 opacity-[0.07] animate-float pointer-events-none" viewBox="0 0 64 64" fill="none">
            <path d="M32 8 C40 16, 48 28, 32 56 C16 28, 24 16, 32 8 Z" fill="#D4A574" />
          </svg>

          <Suspense fallback={<ToursGridSkeleton />}>
            <ToursContent />
          </Suspense>
        </div>
      </main>
    </>
  );
}
