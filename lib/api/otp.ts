const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface OTPResponse<T = unknown> {
  success: boolean;
  message: string;
  code?: string;
  data?: T;
  details?: Record<string, unknown>;
}

export interface SendOTPData {
  request_id: string;
  expires_at: string;
  cooldown_seconds: number;
}

export interface VerifyOTPData {
  verified: boolean;
  phone: string;
  request_id: string;
}

async function request<T>(path: string, init: RequestInit): Promise<OTPResponse<T>> {
  const res = await fetch(`${API_URL}/api/v1/otp${path}/`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  return res.json() as Promise<OTPResponse<T>>;
}

export const otpApi = {
  send(phone: string) {
    return request<SendOTPData>("/send", {
      method: "POST",
      body: JSON.stringify({ phone }),
    });
  },

  resend(requestId: string) {
    return request<SendOTPData>("/resend", {
      method: "POST",
      body: JSON.stringify({ request_id: requestId }),
    });
  },

  verify(requestId: string, otp: string, phone: string) {
    return request<VerifyOTPData>("/verify", {
      method: "POST",
      body: JSON.stringify({ request_id: requestId, otp, phone }),
    });
  },
};
