import Navbar from "../../components/Navbar";
import MapClient from "../../components/MapClient";
import OfflinePanel from "../../components/OfflinePanel";
import { mapLocations, getListingsMap } from "../../lib/api";


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