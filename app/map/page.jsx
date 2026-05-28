import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import MapClient from "../../components/MapClient";
import { mapLocations, listings as listingsApi } from "../../lib/api";

export const metadata = {
  title: "Xəritə — Kamping.az",
  description: "Azərbaycandakı bütün kamp yerlərini xəritədə kəşf edin.",
  openGraph: {
    title: "Xəritə — Kamping.az",
    description: "Azərbaycandakı kamp yerlərini xəritədə kəşf edin.",
    url: "https://kamping.az/map",
  },
};

export default async function MapPage() {
  let adminLocations = [];
  try {
    adminLocations = await mapLocations.list();
  } catch {
    adminLocations = [];
  }

  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 pt-16">
        <MapClient
          locations={adminLocations}
          listingLocations={[]}
        />
      </div>
    </main>
  );
}