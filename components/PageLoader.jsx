"use client";
import { useEffect, useState } from "react";

export default function PageLoader() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    // 2.2s sonra fade-out başlasın
    const t1 = setTimeout(() => setLeaving(true), 2200);
    // 2.8s sonra tamam yox olsun
    const t2 = setTimeout(() => setVisible(false), 2800);
    return () => [t1, t2].forEach(clearTimeout);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#F9F5EE] transition-opacity duration-600"
      style={{ opacity: leaving ? 0 : 1, transitionDuration: "600ms" }}
    >
      {/* Ceyran SVG animasiyası */}
      <div className="relative w-64 h-32 mb-6">
        <svg
          viewBox="0 0 260 110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* ── Yer xətti ── */}
          <line x1="0" y1="95" x2="260" y2="95" stroke="#d4c9b8" strokeWidth="1.5" strokeDasharray="4 6" />

          {/* ── Ceyran — animated translate ── */}
          <g style={{
            animation: "deerRun 2.2s cubic-bezier(0.4,0,0.2,1) forwards",
          }}>
            {/* Bədən */}
            <ellipse cx="40" cy="72" rx="22" ry="13" fill="#8B6F4E" />

            {/* Boyun */}
            <path d="M52 65 Q60 52 58 46" stroke="#8B6F4E" strokeWidth="9" strokeLinecap="round" fill="none" />

            {/* Baş */}
            <ellipse cx="59" cy="43" rx="9" ry="7" fill="#8B6F4E" />

            {/* Burun */}
            <ellipse cx="66" cy="45" rx="3.5" ry="2.5" fill="#7a5f3f" />
            <circle cx="67" cy="44" r="1" fill="#5a3f22" />

            {/* Göz */}
            <circle cx="62" cy="40" r="1.8" fill="#2d1a0e" />
            <circle cx="62.6" cy="39.4" r="0.6" fill="white" />

            {/* Qulaq */}
            <path d="M55 38 Q52 30 56 28 Q60 30 58 38" fill="#8B6F4E" />
            <path d="M55.5 37 Q53 31 56 29.5 Q59 31 57.5 37" fill="#c49a72" />

            {/* Buynuzlar */}
            <path d="M54 35 Q50 24 46 20 M50 28 Q47 22 50 18"
              stroke="#6B4C2A" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M56 34 Q59 22 62 19 M59 27 Q61 21 64 20"
              stroke="#6B4C2A" strokeWidth="2" strokeLinecap="round" fill="none" />

            {/* Qarın — açıq rəng */}
            <ellipse cx="38" cy="78" rx="14" ry="7" fill="#c49a72" />

            {/* Quyruq */}
            <path d="M18 68 Q12 62 14 58 Q18 60 20 67" fill="#e8d5c0" />

            {/* ── Ayaqlar — qaçış animasiyası ── */}
            {/* Ön sol ayaq */}
            <path
              d="M48 83 Q46 90 44 95"
              stroke="#7a5f3f" strokeWidth="4" strokeLinecap="round" fill="none"
              style={{ animation: "legF1 0.35s ease-in-out infinite alternate" }}
              transformOrigin="48 83"
            />
            {/* Ön sağ ayaq */}
            <path
              d="M52 83 Q54 90 56 95"
              stroke="#7a5f3f" strokeWidth="4" strokeLinecap="round" fill="none"
              style={{ animation: "legF2 0.35s ease-in-out infinite alternate-reverse" }}
              transformOrigin="52 83"
            />
            {/* Arxa sol ayaq */}
            <path
              d="M28 83 Q26 90 24 95"
              stroke="#7a5f3f" strokeWidth="4" strokeLinecap="round" fill="none"
              style={{ animation: "legB1 0.35s ease-in-out infinite alternate-reverse" }}
              transformOrigin="28 83"
            />
            {/* Arxa sağ ayaq */}
            <path
              d="M33 82 Q35 89 37 95"
              stroke="#7a5f3f" strokeWidth="4" strokeLinecap="round" fill="none"
              style={{ animation: "legB2 0.35s ease-in-out infinite alternate" }}
              transformOrigin="33 82"
            />

            {/* Hərəkət xətləri */}
            <g style={{ animation: "motionLines 0.4s ease-in-out infinite alternate" }}>
              <line x1="8" y1="60" x2="0" y2="60" stroke="#d4c9b8" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="10" y1="68" x2="0" y2="70" stroke="#d4c9b8" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="12" y1="75" x2="2" y2="78" stroke="#d4c9b8" strokeWidth="1.5" strokeLinecap="round" />
            </g>
          </g>

          {/* Kölgə */}
          <ellipse
            cx="40" cy="95" rx="20" ry="3"
            fill="#c4b8a8" opacity="0.4"
            style={{ animation: "deerRun 2.2s cubic-bezier(0.4,0,0.2,1) forwards" }}
          />
        </svg>
      </div>

      {/* Logo */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center">
          <span className="text-sm">⛺</span>
        </div>
        <span className="font-display text-xl font-bold text-forest-900">
          Kamping<span className="text-amber-500">.az</span>
        </span>
      </div>

      {/* Loading xətti */}
      <div className="w-40 h-0.5 bg-forest-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-500 rounded-full"
          style={{ animation: "loadBar 2.2s ease-out forwards" }}
        />
      </div>

      {/* CSS keyframes */}
      <style>{`
        @keyframes deerRun {
          0%   { transform: translateX(-80px); }
          100% { transform: translateX(340px); }
        }
        @keyframes legF1 {
          from { transform: rotate(-25deg); }
          to   { transform: rotate(20deg); }
        }
        @keyframes legF2 {
          from { transform: rotate(20deg); }
          to   { transform: rotate(-25deg); }
        }
        @keyframes legB1 {
          from { transform: rotate(20deg); }
          to   { transform: rotate(-20deg); }
        }
        @keyframes legB2 {
          from { transform: rotate(-20deg); }
          to   { transform: rotate(20deg); }
        }
        @keyframes motionLines {
          from { opacity: 0.3; transform: translateX(0px); }
          to   { opacity: 1;   transform: translateX(-4px); }
        }
        @keyframes loadBar {
          0%   { width: 0%; }
          60%  { width: 75%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}