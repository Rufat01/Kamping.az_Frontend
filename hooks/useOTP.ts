"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { otpApi } from "@/lib/api/otp";

export type OTPStep = "phone" | "otp" | "verified";
export type OTPLoading = "idle" | "sending" | "resending" | "verifying";

export interface OTPError {
  code: string;
  message: string;
}

interface UseOTPOptions {
  maxVerifyAttempts?: number;
  onVerified?: (phone: string, requestId: string) => void;
}

const SS_KEYS = {
  requestId: "otp_request_id",
  phone: "otp_phone",
  expiresAt: "otp_expires_at",
} as const;

const ERROR_MESSAGES: Record<string, (details?: Record<string, unknown>) => string> = {
  validation_error: (d) =>
    d ? (Object.values(d).flat() as string[]).join(", ") : "Yanlış məlumat daxil edildi",
  invalid_code: (d) =>
    `Kod yanlışdır${d?.attempts_left != null ? ` (${d.attempts_left} cəhd qalıb)` : ""}`,
  otp_not_found: () => "Sessiya tapılmadı. Yenidən başlayın",
  otp_expired: () => "Kodun vaxtı bitib. Yeni kod alın",
  otp_locked: () => "Çox cəhd etdiniz. Yeni kod tələb edin",
  already_verified: () => "Telefon artıq təsdiqlənib",
  cooldown_active: (d) => `${d?.seconds_remaining ?? 60} saniyə gözləyin`,
  rate_limit_exceeded: (d) =>
    `Çox sayda sorğu.${d?.retry_after ? ` ${d.retry_after} saniyə gözləyin` : " Bir qədər gözləyin"}`,
  max_resend_exceeded: () => "Maksimum göndərmə sayına çatdınız. Yeni nömrə daxil edin",
  sms_provider_error: () => "SMS göndərilmədi. Bir az sonra yenidən cəhd edin",
  sms_timeout: () => "SMS göndərilmədi. Bir az sonra yenidən cəhd edin",
  sms_insufficient_balance: () => "SMS xidmətində problem var. Dəstəklə əlaqə saxlayın",
  internal_error: () => "Xəta baş verdi. Dəstəklə əlaqə saxlayın",
};

function buildError(
  code: string,
  fallbackMessage: string,
  details?: Record<string, unknown>
): OTPError {
  const factory = ERROR_MESSAGES[code];
  return { code, message: factory ? factory(details) : fallbackMessage };
}

function maskPhone(phone: string): string {
  if (phone.length < 4) return phone;
  return `${phone.slice(0, -7)}***${phone.slice(-4)}`;
}

function formatSeconds(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function ssRead(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function ssWrite(key: string, value: string): void {
  try {
    sessionStorage.setItem(key, value);
  } catch {}
}

function ssClear(): void {
  try {
    Object.values(SS_KEYS).forEach((k) => sessionStorage.removeItem(k));
  } catch {}
}

export function useOTP({ maxVerifyAttempts = 5, onVerified }: UseOTPOptions = {}) {
  const [step, setStep] = useState<OTPStep>("phone");
  const [phone, setStoredPhone] = useState("");
  const [requestId, setRequestId] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState(maxVerifyAttempts);
  const [loading, setLoading] = useState<OTPLoading>("idle");
  const [error, setError] = useState<OTPError | null>(null);
  const [timeToExpiry, setTimeToExpiry] = useState(0);
  const [cooldownLeft, setCooldownLeft] = useState(0);

  const expiryRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (expiryRef.current) clearInterval(expiryRef.current);
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  const startExpiry = useCallback((expiresAtStr: string) => {
    if (expiryRef.current) clearInterval(expiryRef.current);
    const tick = () => {
      const remaining = Math.max(
        0,
        Math.floor((new Date(expiresAtStr).getTime() - Date.now()) / 1000)
      );
      setTimeToExpiry(remaining);
      if (remaining === 0 && expiryRef.current) clearInterval(expiryRef.current);
    };
    tick();
    expiryRef.current = setInterval(tick, 1000);
  }, []);

  const startCooldown = useCallback((seconds: number) => {
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    setCooldownLeft(seconds);
    cooldownRef.current = setInterval(() => {
      setCooldownLeft((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const stopTimers = useCallback(() => {
    if (expiryRef.current) clearInterval(expiryRef.current);
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    setTimeToExpiry(0);
    setCooldownLeft(0);
  }, []);

  const sendOTP = useCallback(
    async (phone: string) => {
      setError(null);
      setLoading("sending");
      try {
        const res = await otpApi.send(phone);
        if (!res.success || !res.data) {
          setError(buildError(res.code ?? "unknown_error", res.message, res.details));
          setLoading("idle");
          return;
        }
        const { request_id, expires_at, cooldown_seconds } = res.data;
        ssWrite(SS_KEYS.requestId, request_id);
        ssWrite(SS_KEYS.phone, phone);
        ssWrite(SS_KEYS.expiresAt, expires_at);
        setStoredPhone(phone);
        setRequestId(request_id);
        setExpiresAt(expires_at);
        setAttemptsLeft(maxVerifyAttempts);
        setStep("otp");
        setLoading("idle");
        startExpiry(expires_at);
        startCooldown(cooldown_seconds);
      } catch {
        setError({ code: "network_error", message: "Şəbəkə xətası. Yenidən cəhd edin" });
        setLoading("idle");
      }
    },
    [maxVerifyAttempts, startExpiry, startCooldown]
  );

  const resendOTP = useCallback(async () => {
    if (!requestId || cooldownLeft > 0) return;
    setError(null);
    setLoading("resending");
    try {
      const res = await otpApi.resend(requestId);
      if (!res.success || !res.data) {
        const err = buildError(res.code ?? "unknown_error", res.message, res.details);
        setError(err);
        setLoading("idle");
        if (err.code === "cooldown_active" && res.details?.seconds_remaining) {
          startCooldown(res.details.seconds_remaining as number);
        }
        if (err.code === "max_resend_exceeded") {
          stopTimers();
          setStep("phone");
        }
        return;
      }
      const { expires_at, cooldown_seconds } = res.data;
      ssWrite(SS_KEYS.expiresAt, expires_at);
      setExpiresAt(expires_at);
      setLoading("idle");
      startExpiry(expires_at);
      startCooldown(cooldown_seconds);
    } catch {
      setError({ code: "network_error", message: "Şəbəkə xətası. Yenidən cəhd edin" });
      setLoading("idle");
    }
  }, [requestId, cooldownLeft, startExpiry, startCooldown, stopTimers]);

  const verifyOTP = useCallback(
    async (otp: string) => {
      const storedId = requestId ?? ssRead(SS_KEYS.requestId);
      const storedPhone = phone || ssRead(SS_KEYS.phone);
      if (!storedId || !storedPhone) {
        setError({ code: "otp_not_found", message: "Sessiya tapılmadı. Yenidən başlayın" });
        setStep("phone");
        return;
      }
      setError(null);
      setLoading("verifying");
      try {
        const res = await otpApi.verify(storedId, otp, storedPhone);
        if (!res.success || !res.data) {
          const err = buildError(res.code ?? "unknown_error", res.message, res.details);
          setError(err);
          setLoading("idle");
          if (err.code === "invalid_code") {
            const left =
              typeof res.details?.attempts_left === "number"
                ? res.details.attempts_left
                : Math.max(0, attemptsLeft - 1);
            setAttemptsLeft(left);
          }
          if (err.code === "otp_locked" || err.code === "otp_expired") {
            stopTimers();
          }
          if (err.code === "otp_not_found") {
            stopTimers();
            ssClear();
            setStep("phone");
          }
          if (err.code === "already_verified" && res.data) {
            ssClear();
            stopTimers();
            setStep("verified");
            onVerified?.(storedPhone, storedId);
          }
          return;
        }
        ssClear();
        stopTimers();
        setStep("verified");
        setLoading("idle");
        onVerified?.(res.data.phone, res.data.request_id);
      } catch {
        setError({ code: "network_error", message: "Şəbəkə xətası. Yenidən cəhd edin" });
        setLoading("idle");
      }
    },
    [requestId, phone, attemptsLeft, onVerified, stopTimers]
  );

  const resetFlow = useCallback(() => {
    stopTimers();
    ssClear();
    setStep("phone");
    setStoredPhone("");
    setRequestId(null);
    setExpiresAt(null);
    setAttemptsLeft(maxVerifyAttempts);
    setError(null);
    setLoading("idle");
  }, [stopTimers, maxVerifyAttempts]);

  const backToPhone = useCallback(() => {
    stopTimers();
    setStep("phone");
    setError(null);
    setLoading("idle");
  }, [stopTimers]);

  const isExpired = step === "otp" && expiresAt !== null && timeToExpiry === 0;
  const canResend = step === "otp" && cooldownLeft === 0 && !isExpired;

  return {
    step,
    phone,
    maskedPhone: maskPhone(phone),
    requestId,
    expiresAt,
    attemptsLeft,
    loading,
    error,
    timeToExpiry,
    cooldownLeft,
    canResend,
    isExpired,
    isBusy: loading !== "idle",
    formattedExpiry: formatSeconds(timeToExpiry),
    sendOTP,
    resendOTP,
    verifyOTP,
    resetFlow,
    backToPhone,
    clearError: () => setError(null),
  };
}
