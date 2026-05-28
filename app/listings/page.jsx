import { getListings } from "../../lib/api";
import ListingsGrid from "../../components/ListingsGrid";

// SEO metadata — bu səhifə üçün
export const metadata = {
  title: "Bütün elanlar | SaytAdı",
  description:
    "Azərbaycan üzrə kirayə və satış elanları. Filtrlə, xəritədə bax, ən uyğununu tap.",
  alternates: { canonical: "/listings" },
  openGraph: {
    title: "Bütün elanlar | SaytAdı",
    description: "Azərbaycan üzrə ən son elanlar.",
    type: "website",
  },
};

export default async function ListingsPage({ searchParams }) {
  // searchParams App Router-da artıq mövcuddur (?category=...&page=...)
  const data = await getListings(searchParams);
  const listings = data.results ?? data; // DRF paginasiyasına görə

  return (
    <main className="container mx-auto px-4 py-16">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Bütün elanlar</h1>
        <p className="text-muted-foreground">
          {data.count ?? listings.length} elan tapıldı
        </p>
      </header>

      <ListingsGrid listings={listings} />
    </main>
  );
}