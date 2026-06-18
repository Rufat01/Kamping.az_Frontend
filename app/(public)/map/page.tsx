import Navbar from "@/components/layout/Navbar";
import MapClient from "@/features/(public)/map/components/MapClient";
import OfflinePanel from "@/features/(public)/map/components/OfflinePanel";
import { mapLocations } from "@/features/(public)/map/services/map.service";
import { getListingsMap } from "@/features/(public)/listings/services/listings.service";


export const metadata = {
  title: "Xerite — Kamping.az",
  description: "Azerbaycandaki butun kamp yerlerini xeritede kesf edin.",
};

export default async function MapPage() {
  const [adminLocations, listingMapData] = await Promise.allSettled([
    mapLocations.list(),
    getListingsMap(),
  ]);

  return (
    <main>
      <Navbar forceScrolled />
      <MapClient
        locations={adminLocations.status === "fulfilled" ? adminLocations.value : []}
        listingLocations={listingMapData.status === "fulfilled" ? listingMapData.value : []}
      />
      <OfflinePanel />
    </main>
  );
}