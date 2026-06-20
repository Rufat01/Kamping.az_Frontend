"use client";
import { SessionProvider, useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import type { ReactNode } from "react";

function TokenErrorWatcher() {
  const { data: session } = useSession();
  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signOut({ callbackUrl: "/login" });
    }
  }, [session?.error]);
  return null;
}

export default function AuthSessionProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <TokenErrorWatcher />
      {children}
    </SessionProvider>
  );
}
