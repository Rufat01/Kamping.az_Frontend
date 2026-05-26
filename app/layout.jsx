import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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
  title: "Kamping.az — Azərbaycanda Ən Yaxşı Kamp Yerləri",
  description:
    "Azərbaycanda ən gözəl kamp, glamping, bungalo və çadır yerlərini kəşf edin. Təbiətin qoynunda unudulmaz bir istirahət üçün indi rezervasiya edin.",
  keywords:
    "kamp, camping, glamping, Azərbaycan, çadır, bungalo, təbiət, istirahət, kamp yeri",
  openGraph: {
    title: "Kamping.az — Azərbaycanda Ən Yaxşı Kamp Yerləri",
    description:
      "Azərbaycanda ən gözəl kamp, glamping, bungalo və çadır yerlərini kəşf edin.",
    url: "https://kamping.az",
    siteName: "Kamping.az",
    locale: "az_AZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kamping.az",
    description: "Azərbaycanda ən yaxşı kamp yerləri",
  },
  alternates: {
    canonical: "https://kamping.az",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="az" className={`${fraunces.variable} ${plusJakarta.variable}`}>
      <Navbar />
      <body className="font-body bg-cream antialiased">{children}</body>
      <Footer />
    </html>
  );
}
