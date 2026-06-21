"use client";

import { ArrowUpRight } from "lucide-react";

type Props = {
    latitude: number;
    longitude: number;
};

export default function WazeButton({ latitude, longitude }: Props) {
    function handleClick() {
        if (!navigator.geolocation) {
            window.open(
                `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`,
                "_blank",
                "noopener,noreferrer"
            );
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const from = `ll.${pos.coords.latitude},${pos.coords.longitude}`;
                window.open(
                    `https://waze.com/ul?ll=${latitude},${longitude}&from=${from}&navigate=yes`,
                    "_blank",
                    "noopener,noreferrer"
                );
            },
            () => {
                window.open(
                    `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`,
                    "_blank",
                    "noopener,noreferrer"
                );
            },
            { timeout: 5000 }
        );
    }

    return (
        <button
            onClick={handleClick}
            className="w-full flex items-center justify-between gap-3 bg-white border-2 border-dashed border-[#4A6B4F]/30 hover:border-[#2D4A33] hover:shadow-md text-[#1F2D24] font-bold text-sm px-5 py-4 rounded-2xl transition-all group"
        >
            <div className="flex items-center gap-3">
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.54 7.27C19.27 3.1 15.35 0 10.7 0 5.26 0 0.85 4.41 0.85 9.85c0 2.56.97 4.89 2.56 6.65l-.6 3.38a.5.5 0 0 0 .72.53l3.18-1.56A9.82 9.82 0 0 0 10.7 19.7c.47 0 .93-.03 1.38-.09C13.58 23.43 17.2 26 21.38 26A9.62 9.62 0 0 0 31 16.38c0-4.25-2.75-7.87-6.46-9.11Z" fill="#33CCFF"/>
                    <circle cx="8" cy="11" r="1.5" fill="#1A1A1A"/>
                    <circle cx="13.5" cy="11" r="1.5" fill="#1A1A1A"/>
                    <path d="M8 14.5c1 1.5 4.5 1.5 5.5 0" stroke="#1A1A1A" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                <span>Waze ilə yol al</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#4A6B4F] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
    );
}
