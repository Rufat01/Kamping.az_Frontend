"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2, AlertTriangle, CheckCircle2, ChevronRight, Compass,
  MapPin, Users, DollarSign, Image, AlignLeft, Tag,
} from "lucide-react";
import Navbar from "../../../components/Navbar";
import { ownerListings } from "../../../lib/api";

const LISTING_TYPES = [
  { value: "camping", label: "🏕️ Kamp" },
  { value: "glamping", label: "✨ Glamping" },
  { value: "bungalow", label: "🏠 Bungalov" },
  { value: "villa", label: "🏡 Villa" },
  { value: "treehouse", label: "🌳 Ağac evi" },
  { value: "other", label: "📍 Digər" },
];

const PRICE_TYPES = [
  { value: "per_night", label: "Gecəlik ödəniş" },
  { value: "entry_fee", label: "Giriş haqqı" },
  { value: "free", label: "Pulsuz" },
];

const EMPTY_FORM = {
  title: "",
  description: "",
  listing_type: "camping",
  city: "",
  address: "",
  max_guests: "",
  price_type: "per_night",
  price_per_night: "",
  entry_fee: "",
  cover_image: "",
  latitude: "",
  longitude: "",
};

import type { ReactNode } from "react";
import type { Listing } from "../../../types";

function FieldLabel({ children, required }: { children: ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-bold text-[#2D4A33] uppercase tracking-wider mb-1.5">
      {children} {required && <span className="text-red-400">*</span>}
    </label>
  );
}

function Input({ error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  return (
    <input
      className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors ${
        error
          ? "border-red-300 bg-red-50 focus:border-red-400"
          : "border-[#E8E5D8] bg-white focus:border-[#4A6B4F]"
      }`}
      {...props}
    />
  );
}

function Textarea({ error, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }) {
  return (
    <textarea
      className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors resize-none ${
        error
          ? "border-red-300 bg-red-50 focus:border-red-400"
          : "border-[#E8E5D8] bg-white focus:border-[#4A6B4F]"
      }`}
      rows={5}
      {...props}
    />
  );
}

interface ListingFormProps {
  initialData?: Partial<Listing>;
  listingId?: number | string;
}

export default function ListingForm({ initialData, listingId }: ListingFormProps) {
  const isEdit = !!listingId;
  const { data: session } = useSession();
  const router = useRouter();

  const [form, setForm] = useState(() => {
    if (!initialData) return EMPTY_FORM;
    return {
      title: initialData.title ?? "",
      description: initialData.description ?? "",
      listing_type: initialData.listing_type ?? "camping",
      city: initialData.city ?? "",
      address: initialData.address ?? "",
      max_guests: initialData.max_guests ?? "",
      price_type: initialData.is_free
        ? "free"
        : initialData.entry_fee
        ? "entry_fee"
        : "per_night",
      price_per_night: initialData.price_per_night ?? "",
      entry_fee: initialData.entry_fee ?? "",
      cover_image: initialData.cover_image ?? "",
      latitude: initialData.latitude ?? "",
      longitude: initialData.longitude ?? "",
    };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Başlıq daxil edin.";
    if (!form.description.trim()) e.description = "Təsvir daxil edin.";
    if (!form.city.trim()) e.city = "Şəhər daxil edin.";
    if (!form.max_guests || Number(form.max_guests) < 1) e.max_guests = "Düzgün qonaq sayı daxil edin.";
    if (form.price_type === "per_night" && (!form.price_per_night || Number(form.price_per_night) <= 0))
      e.price_per_night = "Gecəlik qiymət daxil edin.";
    if (form.price_type === "entry_fee" && (!form.entry_fee || Number(form.entry_fee) <= 0))
      e.entry_fee = "Giriş haqqı daxil edin.";
    return e;
  };

  const buildPayload = () => ({
    title: form.title.trim(),
    description: form.description.trim(),
    listing_type: form.listing_type,
    city: form.city.trim(),
    address: form.address.trim(),
    max_guests: Number(form.max_guests),
    is_free: form.price_type === "free",
    price_per_night: form.price_type === "per_night" ? Number(form.price_per_night) : null,
    entry_fee: form.price_type === "entry_fee" ? Number(form.entry_fee) : null,
    cover_image: form.cover_image.trim() || null,
    latitude: form.latitude ? Number(form.latitude) : null,
    longitude: form.longitude ? Number(form.longitude) : null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSubmitting(true);
    setServerError("");
    try {
      if (isEdit) {
        await ownerListings.update(listingId, buildPayload(), session.accessToken);
      } else {
        await ownerListings.create(buildPayload(), session.accessToken);
      }
      setSuccess(true);
      setTimeout(() => router.push("/dashboard/listings"), 1500);
    } catch (err) {
      setServerError("Xəta baş verdi. Yenidən cəhd edin.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <>
        <Navbar forceScrolled />
        <main className="min-h-screen flex items-center justify-center" style={{ background: "#FAF6F0" }}>
          <div className="text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ background: "#2D4A33" }}>
              <CheckCircle2 className="w-9 h-9 text-[#FAF6F0]" />
            </div>
            <h2 className="font-display text-2xl font-bold text-[#1F2D24] mb-2">
              {isEdit ? "Elan yeniləndi!" : "Elan əlavə olundu!"}
            </h2>
            <p className="text-[#4A6B4F]/70 text-sm">Elanlarınıza yönləndirilirsiniz…</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar forceScrolled />
      <main style={{ background: "#FAF6F0" }} className="min-h-screen relative overflow-hidden">

        {/* Decorative */}
        <svg className="absolute top-32 right-8 w-12 h-12 opacity-[0.10] animate-float-slow pointer-events-none" viewBox="0 0 64 64" fill="none">
          <path d="M32 8 C40 16, 48 28, 32 56 C16 28, 24 16, 32 8 Z" fill="#D4A574" />
        </svg>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Compass className="w-4 h-4 text-[#D4A574]" strokeWidth={1.5} />
            <Link href="/dashboard/listings" className="text-[#4A6B4F]/70 hover:text-[#2D4A33] font-semibold transition-colors">
              Elanlarım
            </Link>
            <ChevronRight className="w-3 h-3 text-[#4A6B4F]/40" />
            <span className="text-[#2D4A33] font-bold">{isEdit ? "Redaktə et" : "Yeni elan"}</span>
          </nav>

          {/* Page title */}
          <div className="mb-8">
            <h1 className="font-display font-bold text-[#1F2D24]"
              style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)" }}>
              {isEdit ? "Elanı redaktə et" : "Yeni elan əlavə et"}
            </h1>
            <p className="text-[#4A6B4F]/70 text-sm mt-1">
              {isEdit ? "Elanınızın məlumatlarını yeniləyin." : "Kamp mekanınızı platformada paylaşın."}
            </p>
          </div>

          {serverError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-5 py-4 rounded-2xl mb-6">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-7">

            {/* ─ Əsas məlumatlar ─ */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 space-y-5"
              style={{ boxShadow: "0 4px 20px -2px rgba(45,74,51,0.06)" }}>
              <div className="flex items-center gap-2 pb-4 border-b border-dashed border-[#E8E5D8]">
                <Tag className="w-4 h-4 text-[#D4A574]" strokeWidth={1.5} />
                <h2 className="text-[#A0613B] text-xs font-bold uppercase tracking-[0.25em]">Əsas məlumatlar</h2>
              </div>

              <div>
                <FieldLabel required>Başlıq</FieldLabel>
                <Input
                  type="text"
                  placeholder="Məkanın adı"
                  value={form.title}
                  onChange={set("title")}
                  error={errors.title}
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
              </div>

              <div>
                <FieldLabel required>Məkan növü</FieldLabel>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {LISTING_TYPES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, listing_type: t.value }))}
                      className={`py-2.5 px-3 rounded-xl text-sm font-semibold border-2 transition-all text-left ${
                        form.listing_type === t.value
                          ? "border-[#2D4A33] bg-[#2D4A33]/5 text-[#2D4A33]"
                          : "border-[#E8E5D8] bg-white text-[#4A6B4F] hover:border-[#4A6B4F]/40"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <FieldLabel required>Təsvir</FieldLabel>
                <Textarea
                  placeholder="Məkan haqqında ətraflı məlumat"
                  value={form.description}
                  onChange={set("description")}
                  error={errors.description}
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>
            </section>

            {/* ─ Yer ─ */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 space-y-5"
              style={{ boxShadow: "0 4px 20px -2px rgba(45,74,51,0.06)" }}>
              <div className="flex items-center gap-2 pb-4 border-b border-dashed border-[#E8E5D8]">
                <MapPin className="w-4 h-4 text-[#D4A574]" strokeWidth={1.5} />
                <h2 className="text-[#A0613B] text-xs font-bold uppercase tracking-[0.25em]">Yer</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <FieldLabel required>Şəhər / Rayon</FieldLabel>
                  <Input
                    type="text"
                    placeholder="Şəki, Quba, Lənkəran..."
                    value={form.city}
                    onChange={set("city")}
                    error={errors.city}
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>
                <div>
                  <FieldLabel>Ünvan</FieldLabel>
                  <Input
                    type="text"
                    placeholder="Məhəllə, kənd, küçə..."
                    value={form.address}
                    onChange={set("address")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <FieldLabel>Enlik (latitude)</FieldLabel>
                  <Input
                    type="number"
                    step="any"
                    placeholder="40.4093"
                    value={form.latitude}
                    onChange={set("latitude")}
                  />
                </div>
                <div>
                  <FieldLabel>Uzunluq (longitude)</FieldLabel>
                  <Input
                    type="number"
                    step="any"
                    placeholder="49.8671"
                    value={form.longitude}
                    onChange={set("longitude")}
                  />
                </div>
              </div>
            </section>

            {/* ─ Qiymət və tutum ─ */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 space-y-5"
              style={{ boxShadow: "0 4px 20px -2px rgba(45,74,51,0.06)" }}>
              <div className="flex items-center gap-2 pb-4 border-b border-dashed border-[#E8E5D8]">
                <DollarSign className="w-4 h-4 text-[#D4A574]" strokeWidth={1.5} />
                <h2 className="text-[#A0613B] text-xs font-bold uppercase tracking-[0.25em]">Qiymət & Tutum</h2>
              </div>

              <div>
                <FieldLabel required>Maksimum qonaq sayı</FieldLabel>
                <Input
                  type="number"
                  min="1"
                  placeholder="10"
                  value={form.max_guests}
                  onChange={set("max_guests")}
                  error={errors.max_guests}
                />
                {errors.max_guests && <p className="text-red-500 text-xs mt-1">{errors.max_guests}</p>}
              </div>

              <div>
                <FieldLabel required>Qiymət növü</FieldLabel>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {PRICE_TYPES.map((pt) => (
                    <button
                      key={pt.value}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, price_type: pt.value }))}
                      className={`py-3 px-4 rounded-xl text-sm font-semibold border-2 transition-all ${
                        form.price_type === pt.value
                          ? "border-[#2D4A33] bg-[#2D4A33]/5 text-[#2D4A33]"
                          : "border-[#E8E5D8] bg-white text-[#4A6B4F] hover:border-[#4A6B4F]/40"
                      }`}
                    >
                      {pt.label}
                    </button>
                  ))}
                </div>
              </div>

              {form.price_type === "per_night" && (
                <div>
                  <FieldLabel required>Gecəlik qiymət (₼)</FieldLabel>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="50"
                    value={form.price_per_night}
                    onChange={set("price_per_night")}
                    error={errors.price_per_night}
                  />
                  {errors.price_per_night && <p className="text-red-500 text-xs mt-1">{errors.price_per_night}</p>}
                </div>
              )}

              {form.price_type === "entry_fee" && (
                <div>
                  <FieldLabel required>Giriş haqqı (₼)</FieldLabel>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="10"
                    value={form.entry_fee}
                    onChange={set("entry_fee")}
                    error={errors.entry_fee}
                  />
                  {errors.entry_fee && <p className="text-red-500 text-xs mt-1">{errors.entry_fee}</p>}
                </div>
              )}
            </section>

            {/* ─ Media ─ */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 space-y-5"
              style={{ boxShadow: "0 4px 20px -2px rgba(45,74,51,0.06)" }}>
              <div className="flex items-center gap-2 pb-4 border-b border-dashed border-[#E8E5D8]">
                <Image className="w-4 h-4 text-[#D4A574]" strokeWidth={1.5} />
                <h2 className="text-[#A0613B] text-xs font-bold uppercase tracking-[0.25em]">Media</h2>
              </div>

              <div>
                <FieldLabel>Əsas şəkil (URL)</FieldLabel>
                <Input
                  type="url"
                  placeholder="https://..."
                  value={form.cover_image}
                  onChange={set("cover_image")}
                />
                {form.cover_image && (
                  <div className="mt-3 rounded-2xl overflow-hidden border border-[#E8E5D8]"
                    style={{ aspectRatio: "16/7" }}>
                    <img
                      src={form.cover_image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>
                )}
              </div>
            </section>

            {/* Submit */}
            <div className="flex items-center gap-3 pt-2">
              <Link
                href="/dashboard/listings"
                className="flex-1 sm:flex-none py-3.5 px-6 rounded-2xl border-2 border-[#E8E5D8] text-[#4A6B4F] font-semibold text-sm text-center hover:bg-[#FAF6F0] transition-colors"
              >
                Ləğv et
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-[#FAF6F0] font-bold text-sm px-8 py-3.5 rounded-2xl transition-all active:scale-95 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: "#2D4A33" }}
              >
                {submitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Göndərilir…</>
                ) : isEdit ? (
                  "Yadda saxla"
                ) : (
                  "Elanı əlavə et"
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
