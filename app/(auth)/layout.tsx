import Navbar from "@/components/layout/Navbar";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar forceScrolled />
      {children}
    </>
  );
}
