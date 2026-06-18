import Hero from "@/features/(public)/home/components/Hero";
import Marquee from "@/features/(public)/home/components/Marquee";
import Categories from "@/features/(public)/home/components/Categories";
import FeaturedListings from "@/features/(public)/home/components/FeaturedListings";
import MapTeaser from "@/features/(public)/home/components/MapTeaser";
import HowItWorks from "@/features/(public)/home/components/HowItWorks";
import Testimonials from "@/features/(public)/home/components/Testimonials";
import CTA from "@/features/(public)/home/components/CTA";
import Navbar from "@/components/layout/Navbar";

export default function HomePage() {
  return (
    <main className="grain">
      <Navbar />
      <Hero />
      <Marquee />
      <Categories />
      <FeaturedListings />
      <MapTeaser />
      <HowItWorks />
      <Testimonials />
      <CTA />
    </main>
  );
}
