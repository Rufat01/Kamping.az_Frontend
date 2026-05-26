"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Tent, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#1B4332]/95 backdrop-blur-md shadow-lg shadow-forest-900/20 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center group-hover:bg-amber-400 transition-colors">
            <Tent className="w-4 h-4 text-forest-800" strokeWidth={2.5} />
          </div>
          <span className="font-display text-xl font-bold text-white tracking-tight">
            Kamping<span className="text-amber-400">.az</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: "Elanlar", href: "/listings" },
            { label: "Xəritə", href: "/map" },
            { label: "Haqqımızda", href: "/about" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-white/80 hover:text-white text-sm font-medium link-underline transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-white/80 hover:text-white text-sm font-medium transition-colors"
          >
            Daxil ol
          </Link>
          <Link
            href="/register"
            className="bg-amber-500 hover:bg-amber-400 text-forest-900 text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/25 active:scale-95"
          >
            Qeydiyyat
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-white p-1"
          aria-label="Menyunu aç/bağla"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          mobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-forest-800/98 backdrop-blur-md px-4 pt-4 pb-6 flex flex-col gap-4 border-t border-white/10">
          {[
            { label: "Elanlar", href: "/listings" },
            { label: "Xəritə", href: "/map" },
            { label: "Haqqımızda", href: "/about" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="text-white/80 hover:text-white text-base font-medium py-1 transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
            <Link
              href="/login"
              className="text-white/80 text-base font-medium py-2 text-center"
            >
              Daxil ol
            </Link>
            <Link
              href="/register"
              className="bg-amber-500 text-forest-900 font-semibold py-3 rounded-full text-center text-base"
            >
              Qeydiyyat
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
