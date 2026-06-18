"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import ListingForm from "@/features/(dashboard)/components/ListingForm";

export default function NewListingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
    if (status === "authenticated" && session.user?.role !== "owner") router.replace("/");
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FAF6F0" }}>
        <Loader2 className="w-8 h-8 text-[#4A6B4F] animate-spin" />
      </div>
    );
  }

  return <ListingForm />;
}
