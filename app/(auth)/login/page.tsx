"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Tent, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("idle");
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Düzgün email daxil edin.";
    if (!form.password || form.password.length < 6)
      errs.password = "Şifrəni daxil edin.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus("loading");
    setServerError("");

    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (result?.ok) {
      router.push(callbackUrl);
      router.refresh();
    } else {
      setStatus("idle");
      setServerError("Email və ya şifrə yanlışdır.");
    }
  };

  const handleGoogle = () => {
    signIn("google", { callbackUrl });
  };

  return (
    <>
    <Navbar forceScrolled />
    <div className="min-h-screen bg-[#F9F5EE] flex">

      {/* Sol — dekorativ panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-forest-900 relative overflow-hidden flex-col items-center justify-center p-12">
        <img
          src="https://images.unsplash.com/photo-1487730116645-74489c95b41b?w=800&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0"
          style={{ background: "radial-gradient(circle at 30% 50%, #f59e0b22 0%, transparent 60%)" }}
        />
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Tent className="w-8 h-8 text-forest-900" strokeWidth={2} />
          </div>
          <h2 className="font-display text-4xl font-bold text-white mb-4 leading-tight">
            Xoş gəldiniz,<br />
            <span className="text-amber-400">macəraçı!</span>
          </h2>
          <p className="text-white/60 text-lg max-w-sm mx-auto">
            Hesabınıza daxil olun, rezervasiyalarınızı idarə edin.
          </p>

          <div className="mt-10 flex gap-8 justify-center">
            {[["200+", "Məkan"], ["2400+", "Qonaq"], ["4.8★", "Reytinq"]].map(([n, l]) => (
              <div key={l}>
                <div className="font-display text-2xl font-bold text-amber-400">{n}</div>
                <div className="text-white/40 text-xs mt-0.5">{l}</div>
              </div>
            ))}
          </div>
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
            Daxil ol
          </h1>
          <p className="text-forest-500 text-sm mb-8">
            Hesabın yoxdur?{" "}
            <Link href="/register" className="text-forest-800 font-semibold hover:underline">
              Qeydiyyatdan keç
            </Link>
          </p>

          {/* Google */}
          <button
            onClick={handleGoogle}
            type="button"
            className="w-full flex items-center justify-center gap-3 border border-forest-200 bg-white hover:bg-forest-50 text-forest-800 font-medium py-3 rounded-xl transition-all mb-6 shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google ilə daxil ol
          </button>

          {/* Ayırıcı */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-forest-100" />
            <span className="text-forest-400 text-xs font-medium">və ya email ilə</span>
            <div className="flex-1 h-px bg-forest-100" />
          </div>

          {/* Server xətası */}
          {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-forest-700 uppercase tracking-wider mb-1.5">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="email@nümunə.com"
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors ${
                  errors.email
                    ? "border-red-300 bg-red-50"
                    : "border-forest-200 bg-white focus:border-forest-400"
                }`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Şifrə */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-forest-700 uppercase tracking-wider">
                  Şifrə <span className="text-red-400">*</span>
                </label>
                <Link href="/forgot-password" className="text-xs text-forest-500 hover:text-forest-800 transition-colors">
                  Şifrəni unutmusan?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Şifrənizi daxil edin"
                  className={`w-full border rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none transition-colors ${
                    errors.password
                      ? "border-red-300 bg-red-50"
                      : "border-forest-200 bg-white focus:border-forest-400"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-forest-400 hover:text-forest-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full flex items-center justify-center gap-2 bg-forest-800 hover:bg-forest-700 disabled:bg-forest-400 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed mt-2"
            >
              {status === "loading" ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Yüklənir...
                </>
              ) : (
                <>
                  Daxil ol
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}