import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

let confirmationResult: ConfirmationResult | null = null;
let recaptchaVerifier: RecaptchaVerifier | null = null;

export function initRecaptcha(containerId: string): void {
  if (recaptchaVerifier) {
    try {
      recaptchaVerifier.clear();
    } catch {
      // ignore if already cleared
    }
    recaptchaVerifier = null;
  }
  recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: process.env.NODE_ENV === "production" ? "invisible" : "normal",
  });
}

export async function sendOtp(phone: string): Promise<void> {
  if (!recaptchaVerifier) throw new Error("reCAPTCHA başlatılmayıb");
  confirmationResult = await signInWithPhoneNumber(auth, phone, recaptchaVerifier);
}

export async function verifyOtp(code: string): Promise<string> {
  if (!confirmationResult) throw new Error("OTP göndərilməyib");
  const result = await confirmationResult.confirm(code);
  return result.user.getIdToken();
}
