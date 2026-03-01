"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface BodyRegion {
    id: string;
    label: string;
    path: string;
}

interface BodyMapperProps {
    onSelect: (regionId: string) => void;
    selectedRegion: string | null;
}

/**
 * CLINICAL BODY MAPPER
 * - Interactive SVG for localizing patient pain.
 * - Optimized for large touch targets on radiographer dashboard.
 */
export function BodyMapper({ onSelect, selectedRegion }: BodyMapperProps) {
    const t = useTranslations("BodyMapper");
    const regions: BodyRegion[] = [
        { id: "HEAD", label: t("HEAD"), path: "M50,15 A10,10 0 1,1 50,35 A10,10 0 1,1 50,15" },
        { id: "CHEST", label: t("CHEST"), path: "M40,35 L60,35 L60,55 L40,55 Z" },
        { id: "ABDOMEN", label: t("ABDOMEN"), path: "M40,55 L60,55 L60,75 L40,75 Z" },
        { id: "SIDE_L", label: t("SIDE_L"), path: "M25,35 L40,35 L40,75 L25,75 Z" },
        { id: "SIDE_R", label: t("SIDE_R"), path: "M60,35 L75,35 L75,75 L60,75 Z" },
        { id: "LOWER_BODY", label: t("LOWER_BODY"), path: "M35,75 L65,75 L65,100 L35,100 Z" },
    ];

    return (
        <div className="flex flex-col items-center gap-4 p-4 bg-zinc-50 rounded-xl border-2 border-zinc-200">
            <div className="relative w-full max-w-[180px] aspect-[2/3] bg-white rounded-xl shadow-inner border border-zinc-100 p-2">
                <p className="absolute top-1 left-0 right-0 text-center text-[8px] font-bold text-zinc-400 uppercase tracking-widest pointer-events-none">
                    {t('title')}
                </p>
                <svg viewBox="0 0 100 110" className="w-full h-full drop-shadow-md" role="img" aria-label={t('title')}>
                    {regions.map((region) => (
                        <g key={region.id}>
                            <title>{region.label}</title>
                            <path
                                d={region.path}
                                onClick={() => onSelect(region.id)}
                                role="button"
                                aria-label={region.label}
                                aria-pressed={selectedRegion === region.id}
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        onSelect(region.id);
                                    }
                                }}
                                className={cn(
                                    "cursor-pointer transition-all duration-300 stroke-[1.5] outline-none focus:stroke-medical-green-500 focus:stroke-[3]",
                                    selectedRegion === region.id
                                        ? "fill-red-500 stroke-red-700 pulse-glow"
                                        : "fill-zinc-200 stroke-zinc-400 hover:fill-zinc-300"
                                )}
                            />
                        </g>
                    ))}
                </svg>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-2 w-full">
                {regions.map((region) => (
                    <button
                        key={region.id}
                        onClick={() => onSelect(region.id)}
                        className={cn(
                            "p-3 text-[10px] font-black uppercase tracking-widest rounded-lg border-2 transition-all",
                            selectedRegion === region.id
                                ? "bg-red-600 text-white border-red-700 shadow-md scale-105"
                                : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
                        )}
                    >
                        {region.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
