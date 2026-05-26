import Hero from "../components/Hero";
import Marquee from "../components/Marquee";
import Categories from "../components/Categories";
import FeaturedListings from "../components/FeaturedListings";
import MapTeaser from "../components/MapTeaser";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "../components/Testimonials";
import CTA from "../components/CTA";

export default function HomePage() {
  return (
    <main className="grain">
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
