"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import ListingForm from "../../ListingForm";
import { getListing } from "../../../../../lib/api";

export default function EditListingPage({ params }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [listing, setListing] = useState(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") { router.replace("/login"); return; }
    if (status === "authenticated" && session.user?.role !== "owner") { router.replace("/"); return; }
    if (status === "authenticated") {
      getListing(params.id)
        .then(setListing)
        .catch(() => setLoadError(true));
    }
  }, [status, session, params.id, router]);

  if (status === "loading" || (!listing && !loadError)) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FAF6F0" }}>
        <Loader2 className="w-8 h-8 text-[#4A6B4F] animate-spin" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FAF6F0" }}>
        <p className="text-[#4A6B4F]">Elan tapılmadı.</p>
      </div>
    );
  }

  return <ListingForm initialData={listing} listingId={params.id} />;
}
