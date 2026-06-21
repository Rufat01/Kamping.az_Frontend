"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Phone, Eye } from "lucide-react";

interface Props {
  phone: string;
  tourId: number;
  isLoggedIn: boolean;
  autoReveal?: boolean;
  label?: string;
  variant?: "dark" | "gold";
}

function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("994") && digits.length >= 5) {
    return `+994 ${digits.slice(3, 5)} *** ** **`;
  }
  if (digits.length >= 4) {
    return `${digits.slice(0, 4)} *** ** **`;
  }
  return "*** *** **";
}

export default function RevealPhoneButton({
  phone,
  tourId,
  isLoggedIn,
  autoReveal = false,
  label,
  variant = "dark",
}: Props) {
  const router = useRouter();
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (autoReveal && isLoggedIn && !revealed) {
      setRevealed(true);
      fetch(`/api/tours/${tourId}/phone-reveal`, { method: "POST" }).catch(() => {});
      router.replace(`/tours/${tourId}`, { scroll: false });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const baseClass =
    "flex w-full items-center justify-center gap-2 font-bold text-sm px-5 py-3.5 rounded-2xl transition-all active:scale-95 hover:shadow-lg";

  const colorStyle =
    variant === "gold"
      ? { background: "#D4A574", color: "#1A3A2E" }
      : { background: "#2D4A33", color: "#FAF6F0" };

  function handleClick() {
    if (!isLoggedIn) {
      const callbackUrl = encodeURIComponent(`/tours/${tourId}?reveal_phone=true`);
      router.push(`/login?callbackUrl=${callbackUrl}`);
      return;
    }
    if (!revealed) {
      setRevealed(true);
      fetch(`/api/tours/${tourId}/phone-reveal`, { method: "POST" }).catch(() => {});
    }
  }

  if (revealed) {
    return (
      <a href={`tel:${phone}`} className={baseClass} style={colorStyle}>
        <Phone className="w-4 h-4" />
        {phone}
      </a>
    );
  }

  return (
    <button onClick={handleClick} className={`${baseClass} cursor-pointer`} style={colorStyle}>
      {label ? (
        <>
          <Phone className="w-4 h-4" />
          {label}
        </>
      ) : (
        <>
          <Eye className="w-4 h-4 shrink-0" />
          <span>{maskPhone(phone)}</span>
          <span className="text-xs opacity-60 font-normal">— nömrəni gör</span>
        </>
      )}
    </button>
  );
}
