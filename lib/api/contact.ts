import { API_URL } from "./client";
import type { ContactFormData } from "@/types";

export async function sendContactMessage(data: ContactFormData): Promise<unknown> {
  const res = await fetch(`${API_URL}/api/v1/contact/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw json;
  return json;
}
