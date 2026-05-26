import Link from "next/link";
import { Tent, Instagram, Facebook, Youtube, Mail, Phone } from "lucide-react";

const FOOTER_LINKS = {
  "Kəşf et": [
    { label: "Bütün elanlar", href: "/listings" },
    { label: "Xəritə", href: "/map" },
    { label: "Glamping", href: "/listings?listing_type=glamping" },
    { label: "Bungalolar", href: "/listings?listing_type=bungalow" },
  ],
  "Şirkət": [
    { label: "Haqqımızda", href: "/about" },
    { label: "Bloq", href: "/blog" },
    { label: "Karyera", href: "/careers" },
    { label: "Əlaqə", href: "/contact" },
  ],
  "Dəstək": [
    { label: "Yardım mərkəzi", href: "/help" },
    { label: "Sahibkarlar üçün", href: "/for-owners" },
    { label: "Gizlilik siyasəti", href: "/privacy" },
    { label: "İstifadə şərtləri", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-forest-950 text-white">
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-16 pb-8">
        {/* Top */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                <Tent className="w-4 h-4 text-forest-900" strokeWidth={2.5} />
              </div>
              <span className="font-display text-xl font-bold text-white">
                Kamping<span className="text-amber-400">.az</span>
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs mb-6">
              Azərbaycanda ən gözəl kamp yerlərini kəşf edin. 
              Təbiətin qoynunda unudulmaz anlar yaşayın.
            </p>
            {/* Socials */}
            <div className="flex gap-3">
              {[
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Youtube, href: "#", label: "YouTube" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 bg-white/8 hover:bg-amber-500 rounded-lg flex items-center justify-center transition-all duration-200 group"
                >
                  <Icon className="w-4 h-4 text-white/60 group-hover:text-forest-900 transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold text-sm mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/45 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-10 pb-10 border-b border-white/8">
          <a
            href="mailto:info@kamping.az"
            className="flex items-center gap-2 text-white/45 hover:text-white text-sm transition-colors"
          >
            <Mail className="w-4 h-4" />
            info@kamping.az
          </a>
          <a
            href="tel:+994501234567"
            className="flex items-center gap-2 text-white/45 hover:text-white text-sm transition-colors"
          >
            <Phone className="w-4 h-4" />
            +994 50 123 45 67
          </a>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} Kamping.az — Bütün hüquqlar qorunur
          </p>
          <p className="text-white/20 text-xs">
            Azərbaycanda hazırlanmışdır 🇦🇿
          </p>
        </div>
      </div>
    </footer>
  );
}
