"use client";
import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

async function checkInternet() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    await fetch("/manifest.json", {
      method: "HEAD",
      cache: "no-cache",
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return true;
  } catch {
    return false;
  }
}

export default function OfflineBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const check = async () => {
      const online = await checkInternet();
      setOffline(!online);
    };

    check();
    const interval = setInterval(check, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!offline) return null;

  return (
    <div
      className="fixed top-20 left-1/2 -translate-x-1/2 z-[1150] flex items-center gap-3 px-5 py-3 rounded-2xl"
      style={{ background: "#1A3A2E", boxShadow: "0 10px 30px -5px rgba(0,0,0,0.3)" }}
    >
      <WifiOff className="w-4 h-4 shrink-0" style={{ color: "#D4A574" }} />
      <p className="text-sm font-semibold" style={{ color: "#FAF6F0" }}>
        Offline rejimdəsiniz — yüklənmiş xəritələr aktifdir
      </p>
    </div>
  );
}