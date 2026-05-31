"use client";
import { useEffect, useState } from "react";

export default function PageLoader() {
  const [phase, setPhase] = useState("hidden");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("zipper-opening"), 300);
    const t2 = setTimeout(() => setPhase("done"), 2000);
    return () => [t1, t2].forEach(clearTimeout);
  }, []);

  if (phase === "done") return null;

  const zipperOpen = phase === "zipper-opening";

  return (
    <div
      suppressHydrationWarning
      className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
    >
      {/* Sol panel */}
      <div
        suppressHydrationWarning
        className="absolute inset-y-0 left-0 bg-forest-950 transition-transform ease-in-out"
        style={{
          width: "50%",
          transitionDuration: "1.6s",
          transitionDelay: "0.1s",
          transform: zipperOpen ? "translateX(-100%)" : "translateX(0%)",
        }}
      >
        <div className="absolute right-0 inset-y-0 w-1 bg-amber-500/40" />
      </div>

      {/* Sağ panel */}
      <div
        suppressHydrationWarning
        className="absolute inset-y-0 right-0 bg-[#0f2a1e] transition-transform ease-in-out"
        style={{
          width: "50%",
          transitionDuration: "1.6s",
          transitionDelay: "0.1s",
          transform: zipperOpen ? "translateX(100%)" : "translateX(0%)",
        }}
      >
        <div className="absolute left-0 inset-y-0 w-1 bg-amber-500/40" />
      </div>

      {/* Zipper dişləri */}
      <div
        suppressHydrationWarning
        className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
        style={{ opacity: zipperOpen ? 0 : 1 }}
      >
        <div className="flex flex-col gap-1.5">
          {Array.from({ length: 32 }).map((_, i) => (
            <div key={i} className="flex gap-1 items-center">
              <div className="w-3 h-2.5 rounded-sm bg-amber-500/60" />
              <div className="w-1 h-3 bg-amber-400/30" />
              <div className="w-3 h-2.5 rounded-sm bg-amber-500/60" />
            </div>
          ))}
        </div>
      </div>


      {/* Zipper çəkici */}
      <div
        suppressHydrationWarning
        className="absolute left-1/2 -translate-x-1/2 transition-all duration-700"
        style={{
          top: zipperOpen ? "-60px" : "50%",
          marginTop: zipperOpen ? "0" : "-12px",
          opacity: zipperOpen ? 0 : 1,
        }}
      >
        <div className="flex flex-col items-center gap-0.5 animate-bounce">
          <div className="w-6 h-4 bg-amber-500 rounded-sm shadow-lg" />
          <div className="w-0 h-0" style={{
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderTop: "8px solid #f59e0b",
          }} />
        </div>
      </div>
    </div>
  );
}