"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ListingForm from "@/features/(dashboard)/components/ListingForm";
import FormSkeleton from "@/features/(dashboard)/components/FormSkeleton";

export default function NewListingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
    if (status === "authenticated" && session.user?.role !== "owner") router.replace("/");
  }, [status, session, router]);

  if (status === "loading") return <FormSkeleton />;

  return <ListingForm />;
}
