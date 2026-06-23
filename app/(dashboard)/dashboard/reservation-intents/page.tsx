"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar, User, Phone, AlertTriangle, Loader2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { reservationIntents } from "@/features/(dashboard)/services/dashboard.service";
import type { ReservationIntent } from "@/types";

type FilterStatus = "all" | "pending" | "confirmed" | "cancelled";

const FILTERS: { label: string; value: FilterStatus }[] = [
  { label: "Hamısı",       value: "all" },
  { label: "Gözlənilir",   value: "pending" },
  { label: "Təsdiqləndi",  value: "confirmed" },
  { label: "Ləğv edildi",  value: "cancelled" },
];

const STATUS_BADGE: Record<ReservationIntent["status"], { label: string; className: string }> = {
  pending:   { label: "Gözlənilir",  className: "bg-amber-50 text-amber-700 border-amber-200" },
  confirmed: { label: "Təsdiqləndi", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  cancelled: { label: "Ləğv edildi", className: "bg-red-50 text-red-600 border-red-200" },
};

function Skeleton() {
  return (
    <div className="bg-white rounded-3xl p-6 border border-[#E8E5D8] space-y-4"
      style={{ boxShadow: "0 4px 20px -4px rgba(45,74,51,0.08)" }}>
      <div className="flex items-center justify-between">
        <div className="h-5 w-40 bg-[#E8E5D8] rounded-full animate-pulse" />
        <div className="h-5 w-20 bg-[#E8E5D8] rounded-full animate-pulse" />
      </div>
      <div className="h-4 w-56 bg-[#E8E5D8] rounded animate-pulse" />
      <div className="h-4 w-32 bg-[#E8E5D8] rounded animate-pulse" />
      <div className="flex gap-2 pt-2">
        <div className="h-9 w-28 bg-[#E8E5D8] rounded-2xl animate-pulse" />
        <div className="h-9 w-24 bg-[#E8E5D8] rounded-2xl animate-pulse" />
      </div>
    </div>
  );
}

function IntentCard({
  intent,
  onStatusChange,
}: {
  intent: ReservationIntent;
  onStatusChange: (id: number, status: "confirmed" | "cancelled") => Promise<void>;
}) {
  const [loading, setLoading] = useState<"confirmed" | "cancelled" | null>(null);
  const badge = STATUS_BADGE[intent.status];

  async function handleAction(status: "confirmed" | "cancelled") {
    setLoading(status);
    await onStatusChange(intent.id, status);
    setLoading(null);
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#E8E5D8] hover:border-[#4A6B4F]/40 transition-all"
      style={{ boxShadow: "0 4px 20px -4px rgba(45,74,51,0.08)" }}>

      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="min-w-0">
          <Link
            href={`/tours/${intent.tour_id}`}
            className="font-display font-bold text-[#1F2D24] hover:text-[#2D4A33] transition-colors line-clamp-1"
          >
            {intent.tour_title}
          </Link>
          <p className="text-xs text-[#4A6B4F]/60 mt-1">
            {(() => {
              const d = new Date(intent.created_at);
              const dd   = String(d.getDate()).padStart(2, "0");
              const mm   = String(d.getMonth() + 1).padStart(2, "0");
              const yyyy = d.getFullYear();
              const hh   = String(d.getHours()).padStart(2, "0");
              const min  = String(d.getMinutes()).padStart(2, "0");
              return `${dd}/${mm}/${yyyy} - ${hh}:${min}`;
            })()}
          </p>
        </div>
        <span className={`shrink-0 inline-block text-[11px] font-bold px-3 py-1 rounded-full border ${badge.className}`}>
          {badge.label}
        </span>
      </div>

      <div className="space-y-2 text-sm text-[#4A6B4F]/80 mb-5">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 shrink-0 text-[#D4A574]" strokeWidth={1.5} />
          <span className="font-medium text-[#1F2D24]">{intent.user_full_name}</span>
          <span className="text-[#4A6B4F]/40">·</span>
          <span>{intent.user_email}</span>
        </div>
        {intent.user_phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 shrink-0 text-[#D4A574]" strokeWidth={1.5} />
            <a href={`tel:${intent.user_phone}`} className="hover:text-[#2D4A33] transition-colors">
              {intent.user_phone}
            </a>
          </div>
        )}
      </div>

      {intent.status === "pending" && (
        <div className="flex gap-2">
          <button
            onClick={() => handleAction("confirmed")}
            disabled={!!loading}
            className="flex items-center gap-1.5 text-white text-xs font-bold px-4 py-2.5 rounded-2xl transition-all active:scale-95 disabled:opacity-60"
            style={{ background: "#2D4A33" }}
          >
            {loading === "confirmed" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
            Təsdiqlə
          </button>
          <button
            onClick={() => handleAction("cancelled")}
            disabled={!!loading}
            className="flex items-center gap-1.5 text-red-600 text-xs font-bold px-4 py-2.5 rounded-2xl bg-red-50 hover:bg-red-100 transition-all active:scale-95 disabled:opacity-60"
          >
            {loading === "cancelled" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
            Ləğv et
          </button>
        </div>
      )}
    </div>
  );
}

export default function ReservationIntentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [intents, setIntents] = useState<ReservationIntent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("all");

  useEffect(() => {
    if (status === "unauthenticated") { router.replace("/login"); return; }
    if (status === "authenticated" && session.user?.role !== "owner") {
      router.replace("/dashboard"); return;
    }
    if (status === "authenticated") {
      setLoading(true);
      reservationIntents
        .list(session.accessToken)
        .then((data) => setIntents(data.results ?? []))
        .catch(() => setError("Məlumatlar yüklənərkən xəta baş verdi."))
        .finally(() => setLoading(false));
    }
  }, [status, session, router]);

  async function handleStatusChange(id: number, newStatus: "confirmed" | "cancelled") {
    try {
      await reservationIntents.updateStatus(id, newStatus, session!.accessToken);
      setIntents((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
      );
    } catch {
      setError("Status yenilənərkən xəta baş verdi.");
    }
  }

  const filtered = filter === "all" ? intents : intents.filter((i) => i.status === filter);

  return (
    <>
      <Navbar forceScrolled />
      <main style={{ background: "#FAF6F0" }} className="min-h-screen relative overflow-hidden">

        <svg className="absolute top-32 right-8 w-12 h-12 opacity-[0.10] animate-float-slow pointer-events-none" viewBox="0 0 64 64" fill="none">
          <path d="M32 8 C40 16, 48 28, 32 56 C16 28, 24 16, 32 8 Z" fill="#D4A574" />
        </svg>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-[#F0EDE6] rounded-full px-3.5 py-1.5 mb-4">
              <Calendar className="w-3.5 h-3.5 text-[#D4A574]" strokeWidth={2} />
              <span className="text-[#A0613B] text-[11px] font-bold uppercase tracking-[0.2em]">
                Sahibkar paneli
              </span>
            </div>
            <h1 className="font-display font-bold text-[#1F2D24] leading-tight"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}>
              Rezervasiya İstəkləri
            </h1>
            <p className="text-[#4A6B4F]/65 text-sm mt-1.5">
              {intents.length > 0
                ? <><strong className="text-[#1F2D24]">{intents.length}</strong> istək tapıldı</>
                : "Hələ heç bir rezervasiya istəyi yoxdur"}
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-2 flex-wrap mb-6">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                  filter === f.value
                    ? "bg-[#2D4A33] text-[#FAF6F0] shadow-sm"
                    : "bg-white text-[#4A6B4F] border border-[#E8E5D8] hover:border-[#4A6B4F]/40"
                }`}
              >
                {f.label}
                {f.value !== "all" && (
                  <span className="ml-1.5 opacity-60">
                    ({intents.filter((i) => i.status === f.value).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-5 py-4 rounded-2xl mb-6 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => <Skeleton key={i} />)}
            </div>
          ) : filtered.length === 0 && !error ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
                style={{ background: "#1A3A2E" }}>
                <Calendar className="w-9 h-9 text-[#D4A574]" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-2xl font-bold text-[#1F2D24] mb-3">
                Heç bir istək yoxdur
              </h3>
              <p className="text-[#4A6B4F]/70 text-sm max-w-xs leading-relaxed">
                Bu filterdə rezervasiya istəyi tapılmadı.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((intent) => (
                <IntentCard
                  key={intent.id}
                  intent={intent}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
