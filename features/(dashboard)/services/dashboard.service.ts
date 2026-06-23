import { apiFetch } from "@/lib/api/client";
import type { ReservationData, ReservationIntent } from "@/types";

export const reservations = {
  myReservations: (token: string) =>
    apiFetch<unknown[]>("/api/v1/reservations/my/", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  create: (data: ReservationData, token: string) =>
    apiFetch<unknown>("/api/v1/reservations/", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    }),

  cancel: (id: number | string, token: string) =>
    apiFetch<unknown>(`/api/v1/reservations/${id}/cancel/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }),

  incoming: (token: string) =>
    apiFetch<unknown[]>("/api/v1/reservations/incoming/", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  updateStatus: (id: number | string, status: string, token: string) =>
    apiFetch<unknown>(`/api/v1/reservations/incoming/${id}/`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    }),
};

export const reservationIntents = {
  list: (token: string, status?: string) => {
    const query = status ? `?status=${status}` : "";
    return apiFetch<{ results: ReservationIntent[]; count: number }>(
      `/api/v1/owner/reservation-intents/${query}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
  },
  updateStatus: (id: number, status: "confirmed" | "cancelled", token: string) =>
    apiFetch<ReservationIntent>(`/api/v1/owner/reservation-intents/${id}/`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }),
};
