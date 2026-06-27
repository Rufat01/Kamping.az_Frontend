"use client";
import { useState, useEffect, useRef } from "react";
import { Phone, ArrowRight, RotateCcw, ChevronLeft } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { initRecaptcha, sendOtp, verifyOtp } from "@/lib/auth/phone";

type Step = "phone" | "otp";
type Status = "idle" | "loading" | "sent" | "verifying" | "done";

interface Props {
  callbackUrl?: string;
}

const FIREBASE_ERRORS: Record<string, string> = {
  "auth/invalid-verification-code": "Yanlış OTP kodu",
  "auth/code-expired": "Token müddəti bitib",
  "auth/too-many-requests": "Çox sayda cəhd. Sonra yenidən cəhd edin",
  "auth/invalid-phone-number": "Yanlış telefon nömrəsi formatı",
  "auth/network-request-failed": "Şəbəkə xətası",
  "auth/captcha-check-failed": "reCAPTCHA xətası. Yenidən cəhd edin",
  "auth/quota-exceeded": "SMS limiti aşıldı. Sonra yenidən cəhd edin",
  "auth/user-disabled": "Bu hesab bloklanmışdır",
};

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    const code = (err as { code?: string }).code ?? "";
    return FIREBASE_ERRORS[code] ?? err.message ?? "Naməlum xəta";
  }
  return "Şəbəkə xətası";
}

export default function PhoneAuthForm({ callbackUrl = "/" }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("+994");
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    initRecaptcha("phone-recaptcha-container");
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function startCountdown() {
    setCountdown(60);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!/^\+994[0-9]{9}$/.test(phone)) {
      setError("+994XXXXXXXXX formatında daxil edin (9 rəqəm)");
      return;
    }

    setStatus("loading");
    try {
      await sendOtp(phone);
      setStep("otp");
      setStatus("sent");
      startCountdown();
    } catch (err) {
      setStatus("idle");
      setError(getErrorMessage(err));
      // Reinit recaptcha after failure so user can retry
      initRecaptcha("phone-recaptcha-container");
    }
  }

  async function handleResend() {
    if (countdown > 0) return;
    setError("");
    setStatus("loading");
    setOtp("");
    initRecaptcha("phone-recaptcha-container");
    try {
      await sendOtp(phone);
      setStatus("sent");
      startCountdown();
    } catch (err) {
      setStatus("sent");
      setError(getErrorMessage(err));
      initRecaptcha("phone-recaptcha-container");
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("6 rəqəmli kodu daxil edin");
      return;
    }
    setError("");
    setStatus("verifying");
    try {
      const idToken = await verifyOtp(otp);
      const result = await signIn("phone", { idToken, redirect: false });
      if (result?.ok) {
        setStatus("done");
        router.push(callbackUrl);
        router.refresh();
      } else {
        setStatus("sent");
        setError("Daxil olma uğursuz oldu. Yenidən cəhd edin.");
      }
    } catch (err) {
      setStatus("sent");
      setError(getErrorMessage(err));
    }
  }

  function handleBackToPhone() {
    setStep("phone");
    setOtp("");
    setError("");
    setStatus("idle");
    if (timerRef.current) clearInterval(timerRef.current);
    setCountdown(0);
    initRecaptcha("phone-recaptcha-container");
  }

  const isLoading = status === "loading" || status === "verifying" || status === "done";

  return (
    <div>
      {/* Firebase invisible reCAPTCHA anchor */}
      <div id="phone-recaptcha-container" />

      {step === "phone" ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-forest-700 uppercase tracking-wider mb-1.5">
              Telefon nömrəsi <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  const val = e.target.value;
                  if (!val.startsWith("+994")) return;
                  setPhone(val);
                  if (error) setError("");
                }}
                placeholder="+994501234567"
                maxLength={13}
                className={`w-full border rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none transition-colors ${
                  error
                    ? "border-red-300 bg-red-50"
                    : "border-forest-200 bg-white focus:border-forest-400"
                }`}
              />
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-forest-800 hover:bg-forest-700 disabled:bg-forest-400 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed"
          >
            {status === "loading" ? (
              <>
                <Spinner />
                Göndərilir...
              </>
            ) : (
              <>
                Kodu göndər
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <p className="text-forest-500 text-sm">
            <span className="font-semibold text-forest-800">{phone}</span> nömrəsinə
            göndərilən 6 rəqəmli kodu daxil edin.
          </p>

          <div>
            <label className="block text-xs font-semibold text-forest-700 uppercase tracking-wider mb-1.5">
              OTP kodu <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, ""));
                if (error) setError("");
              }}
              placeholder="000000"
              autoFocus
              className={`w-full border rounded-xl px-4 py-3 text-lg text-center tracking-[0.6em] font-mono focus:outline-none transition-colors ${
                error
                  ? "border-red-300 bg-red-50"
                  : "border-forest-200 bg-white focus:border-forest-400"
              }`}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className="w-full flex items-center justify-center gap-2 bg-forest-800 hover:bg-forest-700 disabled:bg-forest-400 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed"
          >
            {status === "verifying" || status === "done" ? (
              <>
                <Spinner />
                {status === "done" ? "Yönləndirilir..." : "Yoxlanılır..."}
              </>
            ) : (
              <>
                Təsdiqlə
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={handleBackToPhone}
              disabled={isLoading}
              className="flex items-center gap-1 text-forest-500 hover:text-forest-800 disabled:text-forest-300 transition-colors"
            >
              <ChevronLeft className="w-3 h-3" />
              Nömrəni dəyiş
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={countdown > 0 || isLoading}
              className="flex items-center gap-1 text-forest-500 hover:text-forest-800 disabled:text-forest-300 disabled:cursor-not-allowed transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              {countdown > 0 ? `Yenidən göndər (${countdown}s)` : "Yenidən göndər"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  );
}
