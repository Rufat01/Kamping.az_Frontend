import { otpApi } from "@/lib/api/otp";

const SS_REQUEST_ID = "otp_request_id";
const SS_PHONE = "otp_phone";

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

function ssRemove(key: string): void {
  try {
    sessionStorage.removeItem(key);
  } catch {}
}

function toOTPError(code: string, message: string): Error {
  const err = new Error(message);
  (err as Error & { code: string }).code = code;
  return err;
}

// No-op — 1sms.az does not require reCAPTCHA. Kept for interface compatibility.

export async function sendOtp(phone: string): Promise<void> {
  const res = await otpApi.send(phone);
  if (!res.success || !res.data) {
    throw toOTPError(res.code ?? "sms_provider_error", res.message || "OTP göndərilmədi");
  }
  ssWrite(SS_REQUEST_ID, res.data.request_id);
  ssWrite(SS_PHONE, phone);
}

// Returns request_id — used as verification token by PhoneAuthForm → NextAuth phone provider.
export async function verifyOtp(code: string): Promise<string> {
  const requestId = ssRead(SS_REQUEST_ID);
  const phone = ssRead(SS_PHONE);

  if (!requestId || !phone) {
    throw toOTPError("otp_not_found", "Sessiya tapılmadı. Yenidən başlayın");
  }

  const res = await otpApi.verify(requestId, code, phone);
  if (!res.success || !res.data) {
    throw toOTPError(res.code ?? "invalid_code", res.message || "Kod yanlışdır");
  }

  ssRemove(SS_REQUEST_ID);
  ssRemove(SS_PHONE);

  return res.data.request_id;
}
