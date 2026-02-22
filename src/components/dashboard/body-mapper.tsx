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
        { id: "CHEST", label: t("CHEST"), path: "M35,35 L65,35 L65,65 L35,65 Z" },
        { id: "ARM_L", label: t("ARM_L"), path: "M20,35 L35,35 L35,60 L25,60 Z" },
        { id: "ARM_R", label: t("ARM_R"), path: "M65,35 L80,35 L75,60 L65,60 Z" },
        { id: "LEG_L", label: t("LEG_L"), path: "M35,65 L50,65 L50,100 L35,100 Z" },
        { id: "LEG_R", label: t("LEG_R"), path: "M50,65 L65,65 L65,100 L50,100 Z" },
    ];

    return (
        <div className="flex flex-col md:flex-row items-center gap-12 p-6 bg-zinc-50 rounded-clinical border-2 border-zinc-200">
            <div className="relative w-full max-w-[300px] aspect-[2/3] bg-white rounded-xl shadow-inner border border-zinc-100 p-4">
                <p className="absolute top-2 left-0 right-0 text-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest pointer-events-none">
                    {t('title')}
                </p>
                <svg viewBox="0 0 100 110" className="w-full h-full drop-shadow-clinical">
                    {regions.map((region) => (
                        <path
                            key={region.id}
                            d={region.path}
                            onClick={() => onSelect(region.id)}
                            className={cn(
                                "cursor-pointer transition-all duration-300 stroke-[1.5]",
                                selectedRegion === region.id
                                    ? "fill-red-500 stroke-red-700 pulse-glow"
                                    : "fill-zinc-200 stroke-zinc-400 hover:fill-zinc-300"
                            )}
                        />
                    ))}
                </svg>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-3 w-full">
                {regions.map((region) => (
                    <button
                        key={region.id}
                        onClick={() => onSelect(region.id)}
                        className={cn(
                            "p-4 text-sm font-black uppercase tracking-widest rounded-lg border-2 transition-all",
                            selectedRegion === region.id
                                ? "bg-red-600 text-white border-red-700 shadow-clinical-sm scale-105"
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
