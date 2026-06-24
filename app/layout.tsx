import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import PageLoader from "@/components/ui/PageLoader";
import RecaptchaProvider from "@/lib/providers/RecaptchaProvider";
import AuthSessionProvider from "@/features/(auth)/components/SessionProvider";
import InstallBanner from "@/components/ui/InstallBanner";
import OfflineBanner from "@/features/(public)/map/components/OfflineBanner";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});


export const metadata = {
  title: "Kamping.az",
  description: "Azerbaycanda en gozal kamp, glamping, bungalo ve cadir yerlerini kesf edin.",
  keywords: "kamp, camping, glamping, Azerbaijan, cadir, bungalo, tebit, istirahет, kamp yeri",
  openGraph: {
    title: "Kamping.az",
    description: "Azerbaycanda en gozal kamp yerlerini kesf edin.",
    url: "https://kamping.az",
    siteName: "Kamping.az",
    locale: "az_AZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kamping.az",
    description: "Azerbaycanda en yaxsi kamp yerleri",
  },
  alternates: {
    canonical: "https://kamping.az",
  },
  robots: {
    index: true,
    follow: true,
  },
    // ... mövcud metadata
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#1A3A2E",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="az" className={`${fraunces.variable} ${plusJakarta.variable}`}>
      <body className="font-body bg-cream antialiased">
        {/* <PageLoader /> */}
        <AuthSessionProvider>
          <RecaptchaProvider>
            {children}
            <div className="hidden md:block">
              <Footer />
            </div>
            <MobileBottomNav />
          </RecaptchaProvider>
        </AuthSessionProvider>
        <InstallBanner />
        <OfflineBanner />
      </body>
    </html>
  );
}
