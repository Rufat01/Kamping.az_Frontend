"use client";
import { useState } from "react";
import { Download, X } from "lucide-react";
import OfflineMapManager from "./OfflineMapManager";

export default function OfflinePanel() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Toggle düyməsi — sağ alt küncdə */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 left-4 z-[500] flex items-center gap-2 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl transition-all active:scale-95"
        style={{ background: "#1A3A2E" }}
      >
        <Download className="w-4 h-4" style={{ color: "#D4A574" }} />
        <span>Offline Xəritə</span>
      </button>

      {/* Panel — açıldıqda görünür */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[940] bg-black/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <div
            className="fixed z-[950] w-full sm:w-[380px]"
            style={{ bottom: 72, right: 16 }}
          >
            {/* Bağla düyməsi */}
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-md"
              >
                <X className="w-3.5 h-3.5 text-stone-600" />
              </button>
            </div>
            <OfflineMapManager />
          </div>
        </>
      )}
    </>
  );
}