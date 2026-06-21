"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Tent, ArrowRight, Tent as TentIcon, Users } from "lucide-react";
import { auth } from "@/features/(auth)/services/auth.service";
import { validatePhone } from "@/lib/validation";

export default function CompleteProfilePage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();

  const [form, setForm] = useState({
    full_name: "",
    phone: "+994",
    role: "" as "user" | "owner" | "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // session yüklənəndə adı əvvəlcədən doldur
  useEffect(() => {
    if (session?.user?.name) {
      setForm((prev) => ({ ...prev, full_name: prev.full_name || session.user.name || "" }));
    }
  }, [session]);

  const validate = () => {
    const errs: Record<string, string> = {};
    const phoneError = validatePhone(form.phone);
    if (phoneError) errs.phone = phoneError;
    if (!form.role) errs.role = "Zəhmət olmasa bir seçim edin.";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setServerError("");

    try {
      const payload: { phone: string; role: string; full_name?: string } = {
        phone: form.phone.trim(),
        role: form.role as string,
      };
      if (form.full_name.trim()) payload.full_name = form.full_name.trim();

      await auth.completeProfile(payload, session?.accessToken ?? "");

      // NextAuth session-u yenilə
      await update({
        profileCompleted: true,
        role: form.role,
        phone: form.phone.trim(),
      });

      if (form.role === "owner") {
        router.push("/dashboard/listings");
      } else {
        router.push("/");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Xəta baş verdi. Yenidən cəhd edin.";

      // Backend-dən gələn 400 xətaları
      if (message.includes("400")) {
        setServerError("Bu telefon nömrəsi artıq qeydiyyatdadır.");
      } else {
        setServerError(message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#F9F5EE] flex items-center justify-center">
        <svg className="w-8 h-8 animate-spin text-forest-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F5EE] flex">

      {/* Sol — dekorativ panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-forest-900 relative overflow-hidden flex-col items-center justify-center p-12">
        <img
          src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(circle at 30% 50%, #f59e0b22 0%, transparent 60%)" }}
        />
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Tent className="w-8 h-8 text-forest-900" strokeWidth={2} />
          </div>
          <h2 className="font-display text-4xl font-bold text-white mb-4 leading-tight">
            Az qaldı,<br />
            <span className="text-amber-400">macəra başlayır!</span>
          </h2>
          <p className="text-white/60 text-lg max-w-sm mx-auto">
            Profilinizi tamamlayın və Azərbaycanın ən gözəl kamp məkanlarına çıxın.
          </p>
        </div>
      </div>

      {/* Sağ — form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">

          {/* Logo — mobile */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
              <Tent className="w-4 h-4 text-forest-900" strokeWidth={2.5} />
            </div>
            <span className="font-display text-xl font-bold text-forest-900">
              Kamping<span className="text-amber-500">.az</span>
            </span>
          </div>

          <h1 className="font-display text-3xl font-bold text-forest-900 mb-1">
            Profili tamamla
          </h1>
          <p className="text-forest-500 text-sm mb-8">
            Təbiət səni çağırır. Başlamaq üçün profilini tamamla.
          </p>

          {/* Xəta mesajı */}
          {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {/* Ad Soyad */}
            <div>
              <label className="block text-xs font-semibold text-forest-700 uppercase tracking-wider mb-1.5">
                Ad Soyad
              </label>
              <input
                type="text"
                value={form.full_name}
                onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))}
                placeholder="Adınız və soyadınız"
                className="w-full border border-forest-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest-400 transition-colors"
              />
            </div>

            {/* Telefon */}
            <div>
              <label className="block text-xs font-semibold text-forest-700 uppercase tracking-wider mb-1.5">
                Telefon nömrəsi <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => {
                  const v = e.target.value;
                  setForm((p) => ({ ...p, phone: v.startsWith("+994") ? v : "+994" }));
                  if (errors.phone) setErrors((p) => ({ ...p, phone: "" }));
                }}
                placeholder="501234567"
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors ${
                  errors.phone
                    ? "border-red-300 bg-red-50"
                    : "border-forest-200 bg-white focus:border-forest-400"
                }`}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            {/* Rol seçimi */}
            <div>
              <label className="block text-xs font-semibold text-forest-700 uppercase tracking-wider mb-3">
                Siz kimsiniz? <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* Kamp etməyə gəlirəm */}
                <button
                  type="button"
                  onClick={() => {
                    setForm((p) => ({ ...p, role: "user" }));
                    if (errors.role) setErrors((p) => ({ ...p, role: "" }));
                  }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-sm font-medium ${
                    form.role === "user"
                      ? "border-forest-700 bg-forest-50 text-forest-800"
                      : "border-forest-100 bg-white text-forest-500 hover:border-forest-300"
                  }`}
                >
                  <Users
                    className={`w-6 h-6 ${form.role === "user" ? "text-forest-700" : "text-forest-400"}`}
                    strokeWidth={1.8}
                  />
                  <span>Kamp etməyə gəlirəm</span>
                </button>

                {/* Kamp yerimi əlavə etmək istəyirəm */}
                <button
                  type="button"
                  onClick={() => {
                    setForm((p) => ({ ...p, role: "owner" }));
                    if (errors.role) setErrors((p) => ({ ...p, role: "" }));
                  }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-sm font-medium ${
                    form.role === "owner"
                      ? "border-amber-500 bg-amber-50 text-amber-800"
                      : "border-forest-100 bg-white text-forest-500 hover:border-forest-300"
                  }`}
                >
                  <TentIcon
                    className={`w-6 h-6 ${form.role === "owner" ? "text-amber-600" : "text-forest-400"}`}
                    strokeWidth={1.8}
                  />
                  <span>Elan əlavə etmək istəyirəm</span>
                </button>
              </div>
              {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-forest-800 hover:bg-forest-700 disabled:bg-forest-400 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed mt-2"
            >
              {submitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Saxlanılır...
                </>
              ) : (
                <>
                  Profili tamamla
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
