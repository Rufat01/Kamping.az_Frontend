"use client";
import { useEffect, useState } from "react";
import { X, Download, Smartphone } from "lucide-react";

// Module-level flag: event bir session-da yalnız bir dəfə emal edilir,
// komponentin remount olub-olmamasından asılı olmayaraq.
let capturedPrompt: any = null;
let shownThisSession = false;

export default function InstallBanner() {
  const [prompt, setPrompt] = useState<any>(null);
  const [show, setShow] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstalled(true);
      return;
    }
    if (localStorage.getItem("install-dismissed")) return;
    if (shownThisSession) return;

    // Əvvəlki navigasiyada artıq event tutulubsa — gecikməli göstər
    if (capturedPrompt) {
      shownThisSession = true;
      const t = setTimeout(() => { setPrompt(capturedPrompt); setShow(true); }, 4000);
      return () => clearTimeout(t);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      capturedPrompt = e;
      if (shownThisSession) return;
      shownThisSession = true;
      // İlk yükləmədən 4 saniyə sonra göstər
      setTimeout(() => { setPrompt(e); setShow(true); }, 4000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("install-dismissed", "1");
    setShow(false);
  };

  const handleInstall = async () => {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") setInstalled(true);
    setShow(false);
  };

  if (!show || installed) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-[1200] rounded-2xl overflow-hidden"
      style={{ boxShadow: "0 20px 50px -10px rgba(26,58,46,0.4)" }}
    >
      {/* Tünd forest fon */}
      <div className="relative p-5" style={{ background: "#1A3A2E" }}>

        {/* Bağla */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center transition-colors"
          style={{ background: "rgba(250,246,240,0.1)" }}
        >
          <X className="w-3.5 h-3.5" style={{ color: "#FAF6F0" }} />
        </button>

        {/* Məzmun */}
        <div className="flex items-start gap-4 pr-6">
          {/* İkon */}
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "#D4A574" }}>
            <Smartphone className="w-6 h-6" style={{ color: "#1A3A2E" }} strokeWidth={2} />
          </div>

          <div>
            <p className="font-display font-bold text-base mb-0.5" style={{ color: "#FAF6F0" }}>
              Offline xəritə
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "rgba(250,246,240,0.6)" }}>
              Tətbiqi yüklə — internetsiz kamp yerlərini tap, naviqasiya et.
            </p>
          </div>
        </div>

        {/* Düymələr */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleInstall}
            className="flex-1 flex items-center justify-center gap-2 font-bold text-sm py-2.5 rounded-xl transition-all active:scale-95"
            style={{ background: "#D4A574", color: "#1A3A2E" }}
          >
            <Download className="w-4 h-4" />
            Yüklə
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold transition-all"
            style={{ background: "rgba(250,246,240,0.08)", color: "rgba(250,246,240,0.5)" }}
          >
            İndi yox
          </button>
        </div>
      </div>
    </div>
  );
}