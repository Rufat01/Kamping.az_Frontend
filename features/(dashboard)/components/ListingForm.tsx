"use client";
import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2, AlertTriangle, CheckCircle2, ChevronRight, Compass, X, ImagePlus,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { ownerListings } from "@/features/(public)/listings/services/listings.service";
import type { ReactNode } from "react";
import type { Tour, ListingImage } from "@/types";

const EMPTY_FORM = {
  title: "",
  description: "",
  price: "",
  duration: "",
  location: "",
  status: "draft" as string,
};

function FieldLabel({ children, required }: { children: ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-bold text-[#2D4A33] uppercase tracking-wider mb-1.5">
      {children} {required && <span className="text-red-400">*</span>}
    </label>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <span className="text-[#A0613B] text-[10px] font-bold uppercase tracking-[0.3em] whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 border-t border-dashed border-[#E8E5D8]" />
    </div>
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
      rows={4}
      {...props}
    />
  );
}

interface ListingFormProps {
  initialData?: Partial<Tour>;
  listingId?: number | string;
}

export default function ListingForm({ initialData, listingId }: ListingFormProps) {
  const isEdit = !!listingId;
  const { data: session } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState(() => {
    if (!initialData) return EMPTY_FORM;
    return {
      title: initialData.title ?? "",
      description: initialData.description ?? "",
      price: String(initialData.price ?? ""),
      duration: initialData.duration ?? "",
      location: initialData.location ?? "",
      status: initialData.status ?? "draft",
    };
  });

  const [existingImages, setExistingImages] = useState<ListingImage[]>(
    initialData?.images ?? []
  );
  const [removedImageIds, setRemovedImageIds] = useState<number[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const set = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setNewImages((prev) => [...prev, ...files]);
    setNewPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
    e.target.value = "";
  };

  const removeNew = (index: number) => {
    URL.revokeObjectURL(newPreviews[index]);
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExisting = (id: number) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== id));
    setRemovedImageIds((prev) => [...prev, id]);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Başlıq daxil edin.";
    if (!form.description.trim()) e.description = "Təsvir daxil edin.";
    if (!form.price || Number(form.price) <= 0) e.price = "Qiymət daxil edin.";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSubmitting(true);
    setServerError("");
    try {
      const payload: Record<string, unknown> = {
        title: form.title.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        duration: form.duration.trim() || null,
        location: form.location.trim() || null,
        status: form.status,
      };

      console.log("[ownerListings] payload:", payload);

      let targetId: number | string;
      if (isEdit) {
        await ownerListings.update(listingId, payload, session!.accessToken);
        targetId = listingId;
      } else {
        const created = await ownerListings.create(payload, session!.accessToken);
        targetId = created.id;
      }

      const existingHasCover = existingImages.some((img) => img.is_cover);
      const failedUploads: string[] = [];
      for (let i = 0; i < newImages.length; i++) {
        const isCover = !existingHasCover && i === 0;
        try {
          const uploaded = await ownerListings.uploadImage(targetId, newImages[i], isCover, session!.accessToken);
          console.log(`[upload ${i + 1}/${newImages.length}] uğurlu:`, uploaded);
        } catch (err) {
          console.error(`[upload ${i + 1}/${newImages.length}] xəta:`, err);
          failedUploads.push(newImages[i].name);
        }
      }

      for (const imgId of removedImageIds) {
        await ownerListings.deleteImage(targetId, imgId, session!.accessToken);
      }

      if (failedUploads.length > 0) {
        setServerError(`${failedUploads.length} şəkil yüklənmədi: ${failedUploads.join(", ")}`);
        setSubmitting(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/dashboard/listings"), 1500);
    } catch {
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

  const totalImages = existingImages.length + newImages.length;

  return (
    <>
      <Navbar forceScrolled />
      <main style={{ background: "#FAF6F0" }} className="min-h-screen relative overflow-hidden">

        <svg className="absolute top-32 right-8 w-12 h-12 opacity-[0.10] animate-float-slow pointer-events-none" viewBox="0 0 64 64" fill="none">
          <path d="M32 8 C40 16, 48 28, 32 56 C16 28, 24 16, 32 8 Z" fill="#D4A574" />
        </svg>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">

          <nav className="flex items-center gap-2 text-sm mb-8">
            <Compass className="w-4 h-4 text-[#D4A574]" strokeWidth={1.5} />
            <Link href="/dashboard/listings" className="text-[#4A6B4F]/70 hover:text-[#2D4A33] font-semibold transition-colors">
              Elanlarım
            </Link>
            <ChevronRight className="w-3 h-3 text-[#4A6B4F]/40" />
            <span className="text-[#2D4A33] font-bold">{isEdit ? "Redaktə et" : "Yeni elan"}</span>
          </nav>

          <div className="mb-8">
            <h1 className="font-display font-bold text-[#1F2D24]"
              style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)" }}>
              {isEdit ? "Elanı redaktə et" : "Yeni elan əlavə et"}
            </h1>
            <p className="text-[#4A6B4F]/70 text-sm mt-1">
              {isEdit ? "Elanınızın məlumatlarını yeniləyin." : "Tur elanınızı platformada paylaşın."}
            </p>
          </div>

          {serverError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-5 py-4 rounded-2xl mb-6">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="bg-white rounded-3xl p-6 sm:p-8 space-y-5"
              style={{ boxShadow: "0 4px 20px -2px rgba(45,74,51,0.06)" }}>

              {/* Əsas məlumatlar */}
              <SectionDivider label="Əsas məlumatlar" />

              <div>
                <FieldLabel required>Başlıq</FieldLabel>
                <Input
                  type="text"
                  placeholder="Turun adı"
                  value={form.title}
                  onChange={set("title")}
                  error={errors.title}
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
              </div>

              <div>
                <FieldLabel required>Təsvir</FieldLabel>
                <Textarea
                  placeholder="Tur haqqında ətraflı məlumat"
                  value={form.description}
                  onChange={set("description")}
                  error={errors.description}
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>

              {/* Yer */}
              <SectionDivider label="Yer" />

              <div>
                <FieldLabel>Məkan</FieldLabel>
                <Input
                  type="text"
                  placeholder="Şəki, Quba, Lənkəran..."
                  value={form.location}
                  onChange={set("location")}
                />
              </div>

              {/* Qiymət & Müddət */}
              <SectionDivider label="Qiymət & Müddət" />

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <FieldLabel required>Qiymət (₼)</FieldLabel>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="150"
                    value={form.price}
                    onChange={set("price")}
                    error={errors.price}
                  />
                  {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                </div>
                <div>
                  <FieldLabel>Müddət</FieldLabel>
                  <Input
                    type="text"
                    placeholder="3 gün 2 gecə"
                    value={form.duration}
                    onChange={set("duration")}
                  />
                </div>
              </div>

              {/* Şəkillər */}
              <SectionDivider label="Şəkillər" />

              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />

                {totalImages === 0 ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-[#E8E5D8] rounded-2xl py-10 flex flex-col items-center justify-center gap-2 hover:border-[#4A6B4F]/40 hover:bg-[#FAF6F0]/60 transition-colors cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#F0EBE1] flex items-center justify-center">
                      <ImagePlus className="w-5 h-5 text-[#4A6B4F]" strokeWidth={1.5} />
                    </div>
                    <p className="text-sm font-semibold text-[#4A6B4F]">Şəkil əlavə et</p>
                    <p className="text-xs text-[#4A6B4F]/50">Qalereya və ya kamera — bir neçə seçə bilərsiniz</p>
                  </button>
                ) : (
                  <div className="grid grid-cols-3 gap-2.5">
                    {existingImages.map((img) => (
                      <div key={img.id} className="relative aspect-square rounded-2xl overflow-hidden border border-[#E8E5D8]">
                        <img src={img.image} alt="" className="w-full h-full object-cover" />
                        {img.is_cover && (
                          <span className="absolute bottom-1.5 left-1.5 bg-[#2D4A33] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                            Əsas
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => removeExisting(img.id)}
                          className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center"
                        >
                          <X className="w-3 h-3 text-white" strokeWidth={2.5} />
                        </button>
                      </div>
                    ))}

                    {newPreviews.map((src, i) => (
                      <div key={`new-${i}`} className="relative aspect-square rounded-2xl overflow-hidden border border-[#E8E5D8]">
                        <img src={src} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeNew(i)}
                          className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center"
                        >
                          <X className="w-3 h-3 text-white" strokeWidth={2.5} />
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-2xl border-2 border-dashed border-[#E8E5D8] flex flex-col items-center justify-center gap-1 hover:border-[#4A6B4F]/40 hover:bg-[#FAF6F0] transition-colors cursor-pointer"
                    >
                      <ImagePlus className="w-5 h-5 text-[#4A6B4F]/50" strokeWidth={1.5} />
                      <span className="text-[10px] text-[#4A6B4F]/50 font-medium">Əlavə et</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center gap-3 pt-6">
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
