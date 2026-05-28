import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import MapClient from "../../components/MapClient";
import { mapLocations, getListingsMap } from "../../lib/api";

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
  const [adminLocations, listingMapData] = await Promise.allSettled([
    mapLocations.list(),
    getListingsMap(),
  ]);

  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 pt-16">
        <MapClient
          locations={adminLocations.status === "fulfilled" ? adminLocations.value : []}
          listingLocations={listingMapData.status === "fulfilled" ? listingMapData.value : []}
        />
      </div>
    </main>
  );
}