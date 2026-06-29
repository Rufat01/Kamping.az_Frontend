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

  const container = document.getElementById(containerId);
  if (container) container.innerHTML = "";

  recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: "invisible",
  });
}

export async function sendOtp(phone: string): Promise<void> {
  if (!recaptchaVerifier) throw new Error("reCAPTCHA başlatılmayıb");
  await recaptchaVerifier.render();
  confirmationResult = await signInWithPhoneNumber(auth, phone, recaptchaVerifier);
}

export async function verifyOtp(code: string): Promise<string> {
  if (!confirmationResult) throw new Error("OTP göndərilməyib");
  const result = await confirmationResult.confirm(code);
  return result.user.getIdToken();
}
