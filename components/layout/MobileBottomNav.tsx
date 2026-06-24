"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Home, Compass, Map, Tent, User, LogIn } from "lucide-react";

const MAIN_TABS = [
  { label: "Əsas",    href: "/",         icon: Home,    exact: true  },
  { label: "Elanlar", href: "/listings", icon: Compass, exact: false },
  { label: "Xəritə",  href: "/map",      icon: Map,     exact: false },
  { label: "Turlar",  href: "/tours",    icon: Tent,    exact: false },
];

function isActive(pathname: string, href: string, exact: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const tabs = [
    ...MAIN_TABS,
    {
      label: session ? "Hesab"   : "Daxil ol",
      href:  session ? "/dashboard" : "/login",
      icon:  session ? User      : LogIn,
      exact: false,
    },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-[1200] bg-white border-t border-gray-100"
      style={{
        boxShadow: "0 -4px 24px rgba(0,0,0,0.09)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="flex items-stretch h-16">
        {tabs.map(({ label, href, icon: Icon, exact }) => {
          const active = isActive(pathname, href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors duration-150 ${
                active ? "text-forest-700" : "text-gray-400"
              }`}
            >
              <div
                className={`flex items-center justify-center w-11 h-7 rounded-2xl transition-all duration-150 ${
                  active ? "bg-forest-50" : ""
                }`}
              >
                <Icon
                  className="w-[22px] h-[22px]"
                  strokeWidth={active ? 2.5 : 1.8}
                />
              </div>
              <span
                className={`text-[10px] leading-none tracking-tight ${
                  active ? "font-semibold" : "font-medium"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
