"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User, Lock, LayoutList, Calendar, ChevronRight,
  CheckCircle, AlertTriangle, Eye, EyeOff, Shield,
} from "lucide-react";
import { auth } from "@/features/(auth)/services/auth.service";
import { validatePhone } from "@/lib/validation";

function getInitials(name: string | null | undefined): string {
  if (!name || typeof name !== "string") return "?";
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  );
}

export default function AccountPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [loadingData, setLoadingData] = useState(false);

  const [profile, setProfile] = useState({ full_name: "", phone: "" });
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState("");

  const [password, setPassword] = useState({ old_password: "", new_password: "", confirm: "" });
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }
    if (status === "authenticated") {
      setLoadingData(true);
      auth.me(session.accessToken)
        .then((user) => {
          setProfile({
            full_name: user.full_name || "",
            phone: user.phone || "",
          });
        })
        .catch(() => {
          setProfile({
            full_name: session.user?.name || "",
            phone: session.user?.phone || "",
          });
        })
        .finally(() => setLoadingData(false));
    }
  }, [status, session?.accessToken]);

  const validateProfile = () => {
    const errs: Record<string, string> = {};
    if (!profile.full_name.trim()) errs.full_name = "Ad Soyad boş ola bilməz.";
    if (profile.phone) {
      const phoneError = validatePhone(profile.phone);
      if (phoneError) errs.phone = phoneError;
    }
    return errs;
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateProfile();
    if (Object.keys(errs).length > 0) { setProfileErrors(errs); return; }
    setProfileSaving(true);
    setProfileError("");
    setProfileSuccess(false);
    try {
      await auth.updateProfile(
        { full_name: profile.full_name.trim(), phone: profile.phone.trim() },
        session!.accessToken
      );
      await update({ name: profile.full_name.trim(), phone: profile.phone.trim() });
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3500);
    } catch {
      setProfileError("Profil yenilənərkən xəta baş verdi.");
    } finally {
      setProfileSaving(false);
    }
  };

  const validatePassword = () => {
    const errs: Record<string, string> = {};
    if (!password.old_password) errs.old_password = "Köhnə şifrəni daxil edin.";
    if (password.new_password.length < 8) errs.new_password = "Şifrə ən azı 8 simvol olmalıdır.";
    if (password.new_password !== password.confirm) errs.confirm = "Şifrələr uyğun gəlmir.";
    return errs;
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validatePassword();
    if (Object.keys(errs).length > 0) { setPasswordErrors(errs); return; }
    setPasswordSaving(true);
    setPasswordError("");
    setPasswordSuccess(false);
    try {
      await auth.changePassword(
        { old_password: password.old_password, new_password: password.new_password },
        session!.accessToken
      );
      setPasswordSuccess(true);
      setPassword({ old_password: "", new_password: "", confirm: "" });
      setTimeout(() => setPasswordSuccess(false), 3500);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      setPasswordError(
        msg.includes("400") ? "Köhnə şifrə yanlışdır." : "Şifrə dəyişdirilə bilmədi. Yenidən cəhd edin."
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  const isOwner = session?.user?.role === "owner";
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");

  if (loadingData) {
    return (
      <main style={{ background: "#FAF6F0" }} className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
          <div className="h-8 w-48 bg-[#E8E5D8] rounded-lg animate-pulse mb-8" />
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl border border-[#E8E5D8] h-72 animate-pulse" />
              <div className="bg-white rounded-3xl border border-[#E8E5D8] h-64 animate-pulse" />
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-3xl border border-[#E8E5D8] h-44 animate-pulse" />
              <div className="bg-white rounded-3xl border border-[#E8E5D8] h-32 animate-pulse" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ background: "#FAF6F0" }} className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#F0EDE6] rounded-full px-3.5 py-1.5 mb-4">
            <User className="w-3.5 h-3.5 text-[#D4A574]" strokeWidth={2} />
            <span className="text-[#A0613B] text-[11px] font-bold uppercase tracking-[0.2em]">
              Şəxsi kabinet
            </span>
          </div>
          <h1
            className="font-display font-bold text-[#1F2D24] leading-tight mb-1"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}
          >
            Hesabım
          </h1>
          <p className="text-[#4A6B4F]/65 text-sm">{session?.user?.email}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Left column: tabbed card */}
          <div className="lg:col-span-2">
            <div
              className="bg-white rounded-3xl border border-[#E8E5D8] overflow-hidden"
              style={{ boxShadow: "0 4px 20px -4px rgba(45,74,51,0.08)" }}
            >
              {/* Card header: avatar + identity */}
              <div className="px-8 pt-7 pb-6 flex items-center gap-4">
                {session?.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name ?? ""}
                    className="w-14 h-14 rounded-2xl object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-[#2D4A33] flex items-center justify-center text-white font-bold text-xl shrink-0">
                    {getInitials(session?.user?.name)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-display text-base font-bold text-[#1F2D24] truncate">
                    {session?.user?.name || "—"}
                  </p>
                  <p className="text-xs text-[#4A6B4F]/60 truncate mt-0.5">{session?.user?.email}</p>
                  <span
                    className={`inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isOwner ? "bg-amber-50 text-amber-700" : "bg-[#F0EDE6] text-[#2D4A33]"
                    }`}
                  >
                    {isOwner ? "Sahibkar" : "İstifadəçi"}
                  </span>
                </div>
              </div>

              {/* Tab bar */}
              <div className="flex border-b border-[#F0EDE6] px-2">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`flex items-center gap-2 px-6 py-3.5 text-sm font-semibold border-b-2 transition-colors -mb-px ${
                    activeTab === "profile"
                      ? "border-[#2D4A33] text-[#2D4A33]"
                      : "border-transparent text-[#4A6B4F]/50 hover:text-[#4A6B4F]"
                  }`}
                >
                  <User className="w-4 h-4" />
                  Profil məlumatları
                </button>
                <button
                  onClick={() => setActiveTab("password")}
                  className={`flex items-center gap-2 px-6 py-3.5 text-sm font-semibold border-b-2 transition-colors -mb-px ${
                    activeTab === "password"
                      ? "border-[#2D4A33] text-[#2D4A33]"
                      : "border-transparent text-[#4A6B4F]/50 hover:text-[#4A6B4F]"
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  Şifrəni dəyiş
                </button>
              </div>

              {/* Tab content */}
              <div className="px-8 py-7">

                {/* Profile tab */}
                {activeTab === "profile" && (
                  <form onSubmit={handleProfileSave} className="space-y-5">
                    {profileSuccess && (
                      <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-2xl">
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        Profil məlumatları uğurla yeniləndi.
                      </div>
                    )}
                    {profileError && (
                      <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-2xl">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        {profileError}
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-[#4A6B4F] uppercase tracking-wider mb-1.5">
                        Ad Soyad
                      </label>
                      <input
                        type="text"
                        value={profile.full_name}
                        onChange={e => {
                          setProfile(p => ({ ...p, full_name: e.target.value }));
                          setProfileErrors(p => ({ ...p, full_name: "" }));
                        }}
                        placeholder="Adınız və soyadınız"
                        className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors ${
                          profileErrors.full_name
                            ? "border-red-300 bg-red-50"
                            : "border-[#E8E5D8] bg-white focus:border-[#4A6B4F]"
                        }`}
                      />
                      {profileErrors.full_name && (
                        <p className="text-red-500 text-xs mt-1">{profileErrors.full_name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#4A6B4F] uppercase tracking-wider mb-1.5">
                        E-poçt{" "}
                        <span className="text-[#4A6B4F]/40 font-normal normal-case tracking-normal">
                          (dəyişdirilə bilməz)
                        </span>
                      </label>
                      <input
                        type="email"
                        value={session?.user?.email || ""}
                        disabled
                        className="w-full border border-[#E8E5D8] bg-[#FAF6F0] rounded-xl px-4 py-3 text-sm text-[#4A6B4F]/50 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#4A6B4F] uppercase tracking-wider mb-1.5">
                        Telefon nömrəsi
                      </label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={e => {
                          const v = e.target.value;
                          setProfile(p => ({ ...p, phone: v.startsWith("+994") ? v : "+994" }));
                          setProfileErrors(p => ({ ...p, phone: "" }));
                        }}
                        placeholder="+994501234567"
                        className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors ${
                          profileErrors.phone
                            ? "border-red-300 bg-red-50"
                            : "border-[#E8E5D8] bg-white focus:border-[#4A6B4F]"
                        }`}
                      />
                      {profileErrors.phone && (
                        <p className="text-red-500 text-xs mt-1">{profileErrors.phone}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={profileSaving}
                      className="flex items-center gap-2 text-white font-bold text-sm px-6 py-3 rounded-2xl transition-all active:scale-95 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                      style={{
                        background: "linear-gradient(135deg, #2D4A33 0%, #1A3A2E 100%)",
                        boxShadow: "0 4px 14px -3px rgba(26,58,46,0.35)",
                      }}
                    >
                      {profileSaving ? <><Spinner /> Saxlanılır...</> : "Dəyişiklikləri saxla"}
                    </button>
                  </form>
                )}

                {/* Password tab */}
                {activeTab === "password" && (
                  <form onSubmit={handlePasswordSave} className="space-y-5">
                    {passwordSuccess && (
                      <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-2xl">
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        Şifrə uğurla dəyişdirildi.
                      </div>
                    )}
                    {passwordError && (
                      <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-2xl">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        {passwordError}
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-[#4A6B4F] uppercase tracking-wider mb-1.5">
                        Köhnə şifrə
                      </label>
                      <div className="relative">
                        <input
                          type={showOld ? "text" : "password"}
                          value={password.old_password}
                          onChange={e => {
                            setPassword(p => ({ ...p, old_password: e.target.value }));
                            setPasswordErrors(p => ({ ...p, old_password: "" }));
                          }}
                          placeholder="••••••••"
                          className={`w-full border rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none transition-colors ${
                            passwordErrors.old_password
                              ? "border-red-300 bg-red-50"
                              : "border-[#E8E5D8] bg-white focus:border-[#4A6B4F]"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowOld(p => !p)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4A6B4F]/40 hover:text-[#4A6B4F] transition-colors"
                        >
                          {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {passwordErrors.old_password && (
                        <p className="text-red-500 text-xs mt-1">{passwordErrors.old_password}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#4A6B4F] uppercase tracking-wider mb-1.5">
                        Yeni şifrə
                      </label>
                      <div className="relative">
                        <input
                          type={showNew ? "text" : "password"}
                          value={password.new_password}
                          onChange={e => {
                            setPassword(p => ({ ...p, new_password: e.target.value }));
                            setPasswordErrors(p => ({ ...p, new_password: "" }));
                          }}
                          placeholder="••••••••"
                          className={`w-full border rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none transition-colors ${
                            passwordErrors.new_password
                              ? "border-red-300 bg-red-50"
                              : "border-[#E8E5D8] bg-white focus:border-[#4A6B4F]"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNew(p => !p)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4A6B4F]/40 hover:text-[#4A6B4F] transition-colors"
                        >
                          {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {passwordErrors.new_password && (
                        <p className="text-red-500 text-xs mt-1">{passwordErrors.new_password}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#4A6B4F] uppercase tracking-wider mb-1.5">
                        Yeni şifrəni təsdiq edin
                      </label>
                      <input
                        type="password"
                        value={password.confirm}
                        onChange={e => {
                          setPassword(p => ({ ...p, confirm: e.target.value }));
                          setPasswordErrors(p => ({ ...p, confirm: "" }));
                        }}
                        placeholder="••••••••"
                        className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors ${
                          passwordErrors.confirm
                            ? "border-red-300 bg-red-50"
                            : "border-[#E8E5D8] bg-white focus:border-[#4A6B4F]"
                        }`}
                      />
                      {passwordErrors.confirm && (
                        <p className="text-red-500 text-xs mt-1">{passwordErrors.confirm}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={passwordSaving}
                      className="flex items-center gap-2 bg-[#F0EDE6] hover:bg-[#E8E5D8] text-[#2D4A33] font-bold text-sm px-6 py-3 rounded-2xl transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {passwordSaving ? (
                        <><Spinner /> Dəyişdirilir...</>
                      ) : (
                        <><Shield className="w-4 h-4" /> Şifrəni dəyiş</>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Right column: quick links + account info */}
          <div className="space-y-4">

            {/* Quick links */}
            <div
              className="bg-white rounded-3xl border border-[#E8E5D8] overflow-hidden"
              style={{ boxShadow: "0 4px 20px -4px rgba(45,74,51,0.08)" }}
            >
              <div className="px-6 py-5 border-b border-[#F0EDE6]">
                <h3 className="font-display text-sm font-bold text-[#1F2D24]">Sürətli keçidlər</h3>
              </div>
              <div className="py-2">
                {isOwner ? (
                  <>
                    <Link
                      href="/dashboard/listings"
                      className="flex items-center gap-3 px-6 py-4 hover:bg-[#FAF6F0] transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-[#F0EDE6] flex items-center justify-center shrink-0">
                        <LayoutList className="w-4 h-4 text-[#2D4A33]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#1F2D24]">Elanlarım</p>
                        <p className="text-xs text-[#4A6B4F]/55">Tur paketlərini idarə et</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#4A6B4F]/30 group-hover:text-[#4A6B4F]/60 transition-colors" />
                    </Link>
                    <div className="mx-6 border-t border-[#F0EDE6]" />
                    <Link
                      href="/dashboard/reservation-intents"
                      className="flex items-center gap-3 px-6 py-4 hover:bg-[#FAF6F0] transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-[#F0EDE6] flex items-center justify-center shrink-0">
                        <Calendar className="w-4 h-4 text-[#2D4A33]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#1F2D24]">Rezervasiya İstəkləri</p>
                        <p className="text-xs text-[#4A6B4F]/55">Daxil olan istəklər</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#4A6B4F]/30 group-hover:text-[#4A6B4F]/60 transition-colors" />
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/dashboard/reservations"
                    className="flex items-center gap-3 px-6 py-4 hover:bg-[#FAF6F0] transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#F0EDE6] flex items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4 text-[#2D4A33]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1F2D24]">Rezervasiyalarım</p>
                      <p className="text-xs text-[#4A6B4F]/55">Bütün rezervasiyalar</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#4A6B4F]/30 group-hover:text-[#4A6B4F]/60 transition-colors" />
                  </Link>
                )}
              </div>
            </div>

            {/* Account info */}
            <div
              className="bg-white rounded-3xl border border-[#E8E5D8] p-6"
              style={{ boxShadow: "0 4px 20px -4px rgba(45,74,51,0.08)" }}
            >
              <h3 className="font-display text-sm font-bold text-[#1F2D24] mb-4">Hesab məlumatı</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#4A6B4F]/60">Hesab tipi</span>
                  <span className="text-xs font-semibold text-[#1F2D24]">
                    {session?.user?.isGoogle ? "Google" : "Email"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
