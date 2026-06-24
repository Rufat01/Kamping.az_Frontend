import { apiFetch } from "@/lib/api/client";
import type { RegisterData, LoginData, User } from "@/types";

export const auth = {
  register: (data: RegisterData) =>
    apiFetch<unknown>("/api/v1/auth/register/", {
      method: "POST",
      body: JSON.stringify({
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        password2: data.password_confirm,
        role: data.role,
      }),
    }),

  login: (data: LoginData) =>
    apiFetch<{ access: string; refresh: string }>("/api/v1/auth/login/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  refresh: (refresh: string) =>
    apiFetch<{ access: string }>("/api/v1/auth/refresh/", {
      method: "POST",
      body: JSON.stringify({ refresh }),
    }),

  me: (token: string) =>
    apiFetch<User>("/api/v1/auth/me/", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  changePassword: (data: { old_password: string; new_password: string }, token: string) =>
    apiFetch<unknown>("/api/v1/auth/change-password/", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    }),

  completeProfile: (
    data: { phone: string; role: string; full_name?: string },
    token: string
  ) =>
    apiFetch<{ user: User }>("/api/v1/auth/complete-profile/", {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    }),

  updateProfile: (data: { full_name?: string; phone?: string }, token: string) =>
    apiFetch<User>("/api/v1/auth/me/", {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    }),
};
