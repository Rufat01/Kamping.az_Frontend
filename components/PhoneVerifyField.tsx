"use client";

import { useState, useEffect, useRef } from "react";
import { Phone, ArrowRight, RotateCcw, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { useOTP } from "@/hooks/useOTP";

interface Props {
  onVerified: (phone: string) => void;
  defaultPhone?: string;
  containerId?: string;
}

const PHONE_RE = /^\+994(50|51|55|60|70|77|99)\d{7}$/;

export default function PhoneVerifyField({
  onVerified,
  defaultPhone = "+994",
}: Props) {
  const [phoneInput, setPhoneInput] = useState(defaultPhone);
  const [phoneError, setPhoneError] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const autoSubmitRef = useRef(false);
  const isBusyRef = useRef(false);
  const verifyOTPRef = useRef<((otp: string) => Promise<void>) | null>(null);

  const {
    step,
    maskedPhone,
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
    onVerified: (phone) => {
      onVerified(phone);
    },
  });

  isBusyRef.current = isBusy;
  verifyOTPRef.current = verifyOTP;

  // Auto-submit when 6 digits entered.
  // deps yalnız [otpValue] — isBusy/verifyOTP dəyişəndə effect yenidən işləməsin
  useEffect(() => {
    if (otpValue.length === 6 && !isBusyRef.current && !autoSubmitRef.current) {
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
  }

  function handleOtpPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    setOtpValue(digits);
    if (error) clearError();
  }

  async function handleSend() {
    if (!PHONE_RE.test(phoneInput)) {
      setPhoneError("Telefon nömrəsi düzgün deyil. Format: +994XXXXXXXXX");
      return;
    }
    setPhoneError("");
    await sendOTP(phoneInput);
  }

  async function handleManualVerify() {
    if (otpValue.length !== 6 || isBusy) return;
    await verifyOTP(otpValue);
  }

  function handleBack() {
    setOtpValue("");
    backToPhone();
  }

  if (step === "verified") {
    return (
      <div className="flex items-center gap-2 border border-green-300 bg-green-50 rounded-xl px-4 py-3">
        <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
        <span className="text-sm text-green-800 font-medium">{phoneInput}</span>
        <span className="text-xs text-green-600 ml-auto">Doğrulandı</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Phone row */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400" />
          <input
            type="tel"
            value={phoneInput}
            onChange={handlePhoneChange}
            placeholder="+994501234567"
            maxLength={13}
            disabled={step === "otp"}
            className={`w-full border rounded-xl pl-9 pr-3 py-3 text-sm focus:outline-none transition-colors disabled:bg-forest-50 disabled:text-forest-400 ${
              phoneError
                ? "border-red-300 bg-red-50"
                : "border-forest-200 bg-white focus:border-forest-400"
            }`}
          />
        </div>

        {step === "phone" && (
          <button
            type="button"
            onClick={handleSend}
            disabled={isBusy}
            className="flex items-center gap-1.5 bg-forest-800 hover:bg-forest-700 disabled:bg-forest-400 text-white text-sm font-semibold px-4 rounded-xl transition-all whitespace-nowrap disabled:cursor-not-allowed"
          >
            {loading === "sending" ? <Spinner /> : <ArrowRight className="w-3.5 h-3.5" />}
            {loading === "sending" ? "Göndərilir..." : "Doğrula"}
          </button>
        )}

        {step === "otp" && (
          <button
            type="button"
            onClick={handleBack}
            disabled={isBusy}
            className="text-xs text-forest-500 hover:text-forest-800 disabled:text-forest-300 px-3 whitespace-nowrap transition-colors"
          >
            Dəyiş
          </button>
        )}
      </div>

      {phoneError && <p className="text-red-500 text-xs">{phoneError}</p>}

      {/* OTP section */}
      {step === "otp" && (
        <>
          <p className="text-xs text-forest-500">
            <span className="font-medium text-forest-800">{maskedPhone}</span> nömrəsinə SMS göndərildi.
          </p>

          {/* Expiry indicator */}
          {!isExpired && timeToExpiry > 0 && (
            <div className="flex items-center gap-1 text-xs text-forest-400">
              <Clock className="w-3 h-3" />
              <span>Kodun vaxtı: {formattedExpiry}</span>
            </div>
          )}

          {/* OTP input row */}
          {!isExpired ? (
            <div className="flex gap-2">
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
                disabled={isBusy}
                className={`flex-1 border rounded-xl px-4 py-3 text-base text-center tracking-[0.5em] font-mono focus:outline-none transition-colors disabled:bg-forest-50 ${
                  error
                    ? "border-red-300 bg-red-50"
                    : "border-forest-200 bg-white focus:border-forest-400"
                }`}
              />
              <button
                type="button"
                onClick={handleManualVerify}
                disabled={otpValue.length !== 6 || isBusy}
                className="flex items-center gap-1.5 bg-forest-800 hover:bg-forest-700 disabled:bg-forest-400 text-white text-sm font-semibold px-4 rounded-xl transition-all disabled:cursor-not-allowed"
              >
                {loading === "verifying" ? <Spinner /> : null}
                {loading === "verifying" ? "Yoxlanılır..." : "Təsdiqlə"}
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <span className="text-sm text-amber-700">Kodun vaxtı bitdi</span>
              <button
                type="button"
                onClick={() => resendOTP()}
                className="text-xs font-semibold text-amber-700 hover:text-amber-900 transition-colors"
              >
                Yeni kod al
              </button>
            </div>
          )}

          {/* Attempt count hint */}
          {attemptsLeft < 5 && attemptsLeft > 0 && !isExpired && (
            <p className="text-xs text-amber-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {attemptsLeft} cəhd qalıb
            </p>
          )}

          {/* Resend */}
          {!isExpired && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => resendOTP()}
                disabled={!canResend || isBusy}
                className="flex items-center gap-1 text-xs text-forest-500 hover:text-forest-800 disabled:text-forest-300 disabled:cursor-not-allowed transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                {cooldownLeft > 0 ? `Yenidən göndər (${cooldownLeft}s)` : "Yenidən göndər"}
              </button>
            </div>
          )}
        </>
      )}

      {/* Error */}
      {error && (
        <p className="text-red-500 text-xs flex items-center gap-1">
          <AlertCircle className="w-3 h-3 shrink-0" />
          {error.message}
        </p>
      )}
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
