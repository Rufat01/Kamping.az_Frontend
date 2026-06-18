"use client";
import type { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import RecaptchaProvider from "./RecaptchaProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <RecaptchaProvider>
        {children}
      </RecaptchaProvider>
    </SessionProvider>
  );
}
