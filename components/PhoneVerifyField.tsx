"use client";
import { useState, useEffect, useRef } from "react";
import { Phone, ArrowRight, RotateCcw, CheckCircle2 } from "lucide-react";
import { initRecaptcha, sendOtp, verifyOtp } from "@/lib/auth/phone";

type Step = "phone" | "otp" | "verified";
type Status = "idle" | "sending" | "sent" | "verifying";

interface Props {
  onVerified: (phone: string) => void;
  defaultPhone?: string;
}

const FIREBASE_ERRORS: Record<string, string> = {
  "auth/invalid-verification-code": "Yanlış OTP kodu",
  "auth/code-expired": "Token müddəti bitib",
  "auth/too-many-requests": "Çox sayda cəhd. Sonra yenidən cəhd edin",
  "auth/invalid-phone-number": "Yanlış telefon nömrəsi formatı",
  "auth/network-request-failed": "Şəbəkə xətası",
  "auth/captcha-check-failed": "reCAPTCHA xətası. Yenidən cəhd edin",
};

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    const code = (err as { code?: string }).code ?? "";
    return FIREBASE_ERRORS[code] ?? err.message ?? "Naməlum xəta";
  }
  return "Şəbəkə xətası";
}

export default function PhoneVerifyField({ onVerified, defaultPhone = "+994" }: Props) {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState(defaultPhone);
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    initRecaptcha("profile-recaptcha-container");
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

  async function handleSendOtp() {
    setError("");
    if (!/^\+994[0-9]{9}$/.test(phone)) {
      setError("+994XXXXXXXXX formatında daxil edin (9 rəqəm)");
      return;
    }
    setStatus("sending");
    try {
      await sendOtp(phone);
      setStep("otp");
      setStatus("sent");
      startCountdown();
    } catch (err) {
      setStatus("idle");
      setError(getErrorMessage(err));
      initRecaptcha("profile-recaptcha-container");
    }
  }

  async function handleResend() {
    if (countdown > 0) return;
    setError("");
    setOtp("");
    setStatus("sending");
    initRecaptcha("profile-recaptcha-container");
    try {
      await sendOtp(phone);
      setStatus("sent");
      startCountdown();
    } catch (err) {
      setStatus("sent");
      setError(getErrorMessage(err));
      initRecaptcha("profile-recaptcha-container");
    }
  }

  async function handleVerifyOtp() {
    if (otp.length !== 6) {
      setError("6 rəqəmli kodu daxil edin");
      return;
    }
    setError("");
    setStatus("verifying");
    try {
      await verifyOtp(otp);
      setStep("verified");
      onVerified(phone);
    } catch (err) {
      setStatus("sent");
      setError(getErrorMessage(err));
    }
  }

  const isBusy = status === "sending" || status === "verifying";

  if (step === "verified") {
    return (
      <div className="flex items-center gap-2 border border-green-300 bg-green-50 rounded-xl px-4 py-3">
        <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
        <span className="text-sm text-green-800 font-medium">{phone}</span>
        <span className="text-xs text-green-600 ml-auto">Doğrulandı</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div id="profile-recaptcha-container" />

      {/* Phone input row */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400" />
          <input
            type="tel"
            value={phone}
            onChange={(e) => {
              const v = e.target.value;
              if (!v.startsWith("+994")) return;
              setPhone(v);
              if (error) setError("");
            }}
            placeholder="+994501234567"
            maxLength={13}
            disabled={step === "otp"}
            className={`w-full border rounded-xl pl-9 pr-3 py-3 text-sm focus:outline-none transition-colors disabled:bg-forest-50 disabled:text-forest-400 ${
              error && step === "phone"
                ? "border-red-300 bg-red-50"
                : "border-forest-200 bg-white focus:border-forest-400"
            }`}
          />
        </div>
        {step === "phone" && (
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={isBusy}
            className="flex items-center gap-1.5 bg-forest-800 hover:bg-forest-700 disabled:bg-forest-400 text-white text-sm font-semibold px-4 rounded-xl transition-all whitespace-nowrap disabled:cursor-not-allowed"
          >
            {status === "sending" ? <Spinner /> : <ArrowRight className="w-3.5 h-3.5" />}
            {status === "sending" ? "Göndərilir..." : "Doğrula"}
          </button>
        )}
        {step === "otp" && (
          <button
            type="button"
            onClick={() => {
              setStep("phone");
              setOtp("");
              setError("");
              setStatus("idle");
              if (timerRef.current) clearInterval(timerRef.current);
              setCountdown(0);
              initRecaptcha("profile-recaptcha-container");
            }}
            className="text-xs text-forest-500 hover:text-forest-800 px-3 whitespace-nowrap transition-colors"
          >
            Dəyiş
          </button>
        )}
      </div>

      {/* OTP row */}
      {step === "otp" && (
        <>
          <p className="text-xs text-forest-500">
            <span className="font-medium text-forest-800">{phone}</span> nömrəsinə SMS göndərildi.
          </p>
          <div className="flex gap-2">
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
              className={`flex-1 border rounded-xl px-4 py-3 text-base text-center tracking-[0.5em] font-mono focus:outline-none transition-colors ${
                error
                  ? "border-red-300 bg-red-50"
                  : "border-forest-200 bg-white focus:border-forest-400"
              }`}
            />
            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={otp.length !== 6 || isBusy}
              className="flex items-center gap-1.5 bg-forest-800 hover:bg-forest-700 disabled:bg-forest-400 text-white text-sm font-semibold px-4 rounded-xl transition-all disabled:cursor-not-allowed"
            >
              {status === "verifying" ? <Spinner /> : null}
              {status === "verifying" ? "Yoxlanılır..." : "Təsdiqlə"}
            </button>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={handleResend}
              disabled={countdown > 0 || isBusy}
              className="flex items-center gap-1 text-xs text-forest-500 hover:text-forest-800 disabled:text-forest-300 disabled:cursor-not-allowed transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              {countdown > 0 ? `Yenidən göndər (${countdown}s)` : "Yenidən göndər"}
            </button>
          </div>
        </>
      )}

      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}

function Spinner() {
  return (
    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  );
}
