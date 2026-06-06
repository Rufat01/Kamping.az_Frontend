import Navbar from "../../components/Navbar";
import MapClient from "../../components/MapClient";
import { mapLocations, getListingsMap } from "../../lib/api";
import OfflineMapManager from "../../components/OfflineMapManager";

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
      {/* FIX 2 & 3 — forceScrolled + z-[1100] Navbar */}
      <Navbar forceScrolled />
      <MapClient
        locations={adminLocations.status === "fulfilled" ? adminLocations.value : []}
        listingLocations={listingMapData.status === "fulfilled" ? listingMapData.value : []}
        apiUrl={process.env.NEXT_PUBLIC_API_URL}
      />
      {/* Offline manager — sağ alt künc */}
      <div style={{ position: "fixed", bottom: 20, right: 16, zIndex: 900, width: 340 }}>
        <OfflineMapManager />
      </div>
    </main>
  );
}
