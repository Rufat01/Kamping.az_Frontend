"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, Tent, ChevronDown, User, LogOut, Settings, LayoutList, Calendar } from "lucide-react";

interface NavbarProps {
  forceScrolled?: boolean;
}

export default function Navbar({ forceScrolled }: NavbarProps) {
  const [scrolled, setScrolled] = useState(forceScrolled);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data: session, status } = useSession();

useEffect(() => {
  if (forceScrolled) return; // scroll dinləməyə ehtiyac yox
  const onScroll = () => setScrolled(window.scrollY > 40);
  window.addEventListener("scroll", onScroll);
  return () => window.removeEventListener("scroll", onScroll);
}, [forceScrolled]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("#user-dropdown")) setDropdownOpen(false);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const getInitials = (name: string | null | undefined): string => {
    if (!name || typeof name !== "string") return "?";
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[1100] transition-all duration-500 ${
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
            { label: "Turlar", href: "/tours" },
            { label: "Xəritə", href: "/map" },
            { label: "Haqqımızda", href: "/about" },
            { label: "Əlaqə", href: "/contact" },
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
          {status === "loading" ? (
            <div className="w-36 h-9 bg-white/10 rounded-full animate-pulse" />
          ) : status === "authenticated" ? (
            <div id="user-dropdown" className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full pl-2 pr-3 py-1.5 transition-all"
              >
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name}
                    className="w-7 h-7 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-forest-900 text-xs font-bold">
                    {getInitials(session.user?.name)}
                  </div>
                )}
                <span className="text-white text-sm font-medium max-w-[120px] truncate">
                  {session.user?.name?.split(" ")[0] || "Hesabim"}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-white/60 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl shadow-forest-900/15 border border-forest-100 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-forest-100 bg-forest-50/50">
                    <p className="text-sm font-semibold text-forest-900 truncate">
                      {session.user?.name}
                    </p>
                    <p className="text-xs text-forest-400 truncate mt-0.5">
                      {session.user?.email}
                    </p>
                  </div>
                  <div className="py-1.5">
                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-forest-700 hover:bg-forest-50 transition-colors"
                    >
                      <User className="w-4 h-4 text-forest-400" />
                      Hesabim
                    </Link>
                    {session.user?.role === "owner" ? (
                      <>
                        <Link
                          href="/dashboard/listings"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-forest-700 hover:bg-forest-50 transition-colors"
                        >
                          <LayoutList className="w-4 h-4 text-forest-400" />
                          Elanlarım
                        </Link>
                        <Link
                          href="/dashboard/reservation-intents"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-forest-700 hover:bg-forest-50 transition-colors"
                        >
                          <Calendar className="w-4 h-4 text-forest-400" />
                          Rezervasiya İstəkləri
                        </Link>
                      </>
                    ) : (
                      <Link
                        href="/dashboard/reservations"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-forest-700 hover:bg-forest-50 transition-colors"
                      >
                        <Settings className="w-4 h-4 text-forest-400" />
                        Rezervasiyalarım
                      </Link>
                    )}
                  </div>
                  <div className="border-t border-forest-100 py-1.5">
                    <button
                      onClick={() => { signOut({ callbackUrl: "/" }); setDropdownOpen(false); }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Çıxış
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
                Daxil ol
              </Link>
              <Link href="/register" className="bg-amber-500 hover:bg-amber-400 text-forest-900 text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/25 active:scale-95">
                Qeydiyyat
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-white p-1"
          aria-label="Menyunu ac/bagla"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-forest-800/98 backdrop-blur-md px-4 pt-4 pb-6 flex flex-col gap-4 border-t border-white/10">
          {[
            { label: "Elanlar", href: "/listings" },
            { label: "Turlar", href: "/tours" },
            { label: "Xəritə", href: "/map" },
            { label: "Haqqımızda", href: "/about" },
            { label: "Əlaqə", href: "/contact" },
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
            {status === "loading" ? (
              <div className="space-y-2 py-1">
                <div className="h-9 bg-white/10 rounded-xl animate-pulse" />
                <div className="h-12 bg-white/10 rounded-full animate-pulse" />
              </div>
            ) : status === "authenticated" ? (
              <>
                <div className="flex items-center gap-3 py-2">
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt=""
                      className="w-9 h-9 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center text-forest-900 text-sm font-bold">
                      {getInitials(session.user?.name)}
                    </div>
                  )}
                  <div>
                    <p className="text-white text-sm font-semibold">{session.user?.name}</p>
                    <p className="text-white/40 text-xs">{session.user?.email}</p>
                  </div>
                </div>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)}
                  className="text-white/80 text-sm py-2">Hesabim</Link>
                {session.user?.role === "owner" ? (
                  <>
                    <Link href="/dashboard/listings" onClick={() => setMobileOpen(false)}
                      className="text-white/80 text-sm py-2">Elanlarım</Link>
                    <Link href="/dashboard/reservation-intents" onClick={() => setMobileOpen(false)}
                      className="text-white/80 text-sm py-2">Rezervasiya İstəkləri</Link>
                  </>
                ) : (
                  <Link href="/dashboard/reservations" onClick={() => setMobileOpen(false)}
                    className="text-white/80 text-sm py-2">Rezervasiyalarım</Link>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-red-400 text-sm py-2 text-left"
                >
                  Çıxış
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-white/80 text-base font-medium py-2 text-center">
                  Daxil ol
                </Link>
                <Link href="/register"
                  className="bg-amber-500 text-forest-900 font-semibold py-3 rounded-full text-center text-base">
                  Qeydiyyat
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
