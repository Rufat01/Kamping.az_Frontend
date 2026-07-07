"use client";

import { useState, useEffect, useRef } from "react";
import { Phone, ArrowRight, RotateCcw, ChevronLeft, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useOTP } from "@/hooks/useOTP";

interface Props {
  callbackUrl?: string;
}

const PHONE_RE = /^\+994(50|51|55|60|70|77|99)\d{7}$/;

export default function PhoneAuthForm({ callbackUrl = "/" }: Props) {
  const router = useRouter();
  const [phoneInput, setPhoneInput] = useState("+994");
  const [phoneError, setPhoneError] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [authError, setAuthError] = useState("");
  const [authing, setAuthing] = useState(false);
  const autoSubmitRef = useRef(false);
  const isBusyRef = useRef(false);
  const authingRef = useRef(false);
  const verifyOTPRef = useRef<((otp: string) => Promise<void>) | null>(null);

  const {
    step,
    phone,
    maskedPhone,
    requestId,
    attemptsLeft,
    loading,
    error,
    timeToExpiry,
    cooldownLeft,
    canResend,
    isExpired,
    isBusy,
    formattedExpiry,
    sendOTP,
    resendOTP,
    verifyOTP,
    backToPhone,
    clearError,
  } = useOTP({
    onVerified: async (verifiedPhone, verifiedRequestId) => {
      setAuthing(true);
      setAuthError("");
      try {
        const result = await signIn("phone", {
          phone: verifiedPhone,
          requestId: verifiedRequestId,
          redirect: false,
        });
        if (result?.ok) {
          router.push(callbackUrl);
          router.refresh();
        } else {
          setAuthError("Daxil olma uğursuz oldu. Yenidən cəhd edin.");
        }
      } catch {
        setAuthError("Şəbəkə xətası. Yenidən cəhd edin.");
      } finally {
        setAuthing(false);
      }
    },
  });

  isBusyRef.current = isBusy;
  authingRef.current = authing;
  verifyOTPRef.current = verifyOTP;

  // Auto-submit when 6 digits entered.
  // deps yalnız [otpValue] — isBusy/authing/verifyOTP dəyişəndə effect yenidən işləməsin
  useEffect(() => {
    if (otpValue.length === 6 && !isBusyRef.current && !authingRef.current && !autoSubmitRef.current) {
      const fn = verifyOTPRef.current;
      if (fn) {
        autoSubmitRef.current = true;
        fn(otpValue).finally(() => {
          autoSubmitRef.current = false;
        });
      }
    }
    if (otpValue.length < 6) autoSubmitRef.current = false;
  }, [otpValue]);

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    if (!v.startsWith("+994")) return;
    setPhoneInput(v);
    if (phoneError) setPhoneError("");
    if (error) clearError();
  }

  function handleOtpChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtpValue(digits);
    if (error) clearError();
    if (authError) setAuthError("");
  }

  function handleOtpPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    setOtpValue(digits);
    if (error) clearError();
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!PHONE_RE.test(phoneInput)) {
      setPhoneError("Telefon nömrəsi düzgün deyil. Format: +994XXXXXXXXX");
      return;
    }
    setPhoneError("");
    await sendOTP(phoneInput);
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (otpValue.length !== 6 || isBusy || authing) return;
    await verifyOTP(otpValue);
  }

  function handleBack() {
    setOtpValue("");
    setAuthError("");
    backToPhone();
  }

  const isLoading = isBusy || authing;

  if (step === "verified" && !authing && !authError) {
    return (
      <div className="flex items-center gap-2 border border-green-300 bg-green-50 rounded-xl px-4 py-3">
        <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
        <span className="text-sm text-green-800 font-medium">Yönləndirilir...</span>
      </div>
    );
  }

  if (step === "phone") {
    return (
      <form onSubmit={handleSend} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-forest-700 uppercase tracking-wider mb-1.5">
            Telefon nömrəsi <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400" />
            <input
              type="tel"
              value={phoneInput}
              onChange={handlePhoneChange}
              placeholder="+994501234567"
              maxLength={13}
              className={`w-full border rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none transition-colors ${
                phoneError
                  ? "border-red-300 bg-red-50"
                  : "border-forest-200 bg-white focus:border-forest-400"
              }`}
            />
          </div>
          {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-3 py-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error.message}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-forest-800 hover:bg-forest-700 disabled:bg-forest-400 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed"
        >
          {loading === "sending" ? (
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
    );
  }

  return (
    <form onSubmit={handleVerify} className="space-y-4">
      <p className="text-forest-500 text-sm">
        <span className="font-semibold text-forest-800">{maskedPhone}</span> nömrəsinə
        göndərilən 6 rəqəmli kodu daxil edin.
      </p>

      {/* Expiry */}
      {!isExpired && timeToExpiry > 0 && (
        <div className="flex items-center gap-1 text-xs text-forest-400">
          <Clock className="w-3 h-3" />
          <span>Kodun vaxtı: {formattedExpiry}</span>
        </div>
      )}

      {isExpired ? (
        <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <span className="text-sm text-amber-700">Kodun vaxtı bitdi</span>
          <button
            type="button"
            onClick={() => resendOTP()}
            disabled={isLoading}
            className="text-xs font-semibold text-amber-700 hover:text-amber-900 transition-colors disabled:opacity-50"
          >
            Yeni kod al
          </button>
        </div>
      ) : (
        <div>
          <label className="block text-xs font-semibold text-forest-700 uppercase tracking-wider mb-1.5">
            OTP kodu <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={otpValue}
            onChange={handleOtpChange}
            onPaste={handleOtpPaste}
            placeholder="000000"
            autoFocus
            disabled={isLoading}
            className={`w-full border rounded-xl px-4 py-3 text-lg text-center tracking-[0.6em] font-mono focus:outline-none transition-colors disabled:bg-forest-50 ${
              error || authError
                ? "border-red-300 bg-red-50"
                : "border-forest-200 bg-white focus:border-forest-400"
            }`}
          />
          {attemptsLeft < 5 && attemptsLeft > 0 && (
            <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {attemptsLeft} cəhd qalıb
            </p>
          )}
          {(error || authError) && (
            <p className="text-red-500 text-xs mt-1">{error?.message || authError}</p>
          )}
        </div>
      )}

      {!isExpired && (
        <button
          type="submit"
          disabled={isLoading || otpValue.length !== 6}
          className="w-full flex items-center justify-center gap-2 bg-forest-800 hover:bg-forest-700 disabled:bg-forest-400 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Spinner />
              {authing ? "Daxil edilir..." : "Yoxlanılır..."}
            </>
          ) : (
            <>
              Təsdiqlə
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      )}

      <div className="flex items-center justify-between text-sm">
        <button
          type="button"
          onClick={handleBack}
          disabled={isLoading}
          className="flex items-center gap-1 text-forest-500 hover:text-forest-800 disabled:text-forest-300 transition-colors"
        >
          <ChevronLeft className="w-3 h-3" />
          Nömrəni dəyiş
        </button>
        {!isExpired && (
          <button
            type="button"
            onClick={() => resendOTP()}
            disabled={!canResend || isLoading}
            className="flex items-center gap-1 text-forest-500 hover:text-forest-800 disabled:text-forest-300 disabled:cursor-not-allowed transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            {cooldownLeft > 0 ? `Yenidən göndər (${cooldownLeft}s)` : "Yenidən göndər"}
          </button>
        )}
      </div>
    </form>
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
