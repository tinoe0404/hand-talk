"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSessionStore } from "@/store/useSessionStore";
import { useTranslations } from "next-intl";
import {
    GROUPED_INSTRUCTIONS,
    InstructionCategory,
    videoPath,
} from "@/lib/constants/instructions";
import { Move, MessageSquare, Wind, Shield, Volume2 } from "lucide-react";
import { resolveIcon } from "@/lib/icon-map";
import { cn } from "@/lib/utils";


const TAB_ICONS: Record<InstructionCategory, React.ElementType> = {
    POSITIONING: Move,
    SESSION: MessageSquare,
    BREATHING: Wind,
    SAFETY: Shield,
};

export function InstructionTabs() {
    const tInst = useTranslations("Instructions");
    const tCat = useTranslations("Categories");
    const [activeTab, setActiveTab] = useState<InstructionCategory>("POSITIONING");
    const { currentInstructionId, setInstruction, stopInstruction } = useSessionStore();

    const TABS: { id: InstructionCategory; label: string; color: string; activeColor: string }[] = [
        { id: "POSITIONING", label: tCat("POSITIONING"), color: "text-amber-600", activeColor: "bg-amber-500 text-white" },
        { id: "SESSION", label: tCat("SESSION"), color: "text-medical-green-700", activeColor: "bg-medical-green-600 text-white" },
        { id: "BREATHING", label: tCat("BREATHING"), color: "text-blue-600", activeColor: "bg-blue-500 text-white" },
        { id: "SAFETY", label: tCat("SAFETY"), color: "text-red-600", activeColor: "bg-red-500 text-white" },
    ];

    const instructions = GROUPED_INSTRUCTIONS[activeTab];

    const preloadLinksRef = useRef<HTMLLinkElement[]>([]);

    // Preload videos for the active tab — clean up previous links
    useEffect(() => {
        // Remove previous preload links
        preloadLinksRef.current.forEach((link) => {
            if (document.head.contains(link)) {
                document.head.removeChild(link);
            }
        });
        preloadLinksRef.current = [];

        // Create new preload links
        instructions.forEach((inst) => {
            const link = document.createElement("link");
            link.rel = "preload";
            link.as = "video";
            link.href = videoPath(inst.id);
            document.head.appendChild(link);
            preloadLinksRef.current.push(link);
        });

        return () => {
            preloadLinksRef.current.forEach((link) => {
                if (document.head.contains(link)) {
                    document.head.removeChild(link);
                }
            });
            preloadLinksRef.current = [];
        };
    }, [instructions]);

    const handleTap = (id: string) => {
        if (currentInstructionId === id) {
            stopInstruction();
        } else {
            setInstruction(id);
        }
    };

    return (
        <div className="flex flex-col gap-3">
            {/* Tab bar with icons */}
            <div className="flex rounded-2xl overflow-hidden border-2 border-zinc-200 bg-zinc-50 shrink-0">
                {TABS.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const TabIcon = TAB_ICONS[tab.id];
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex-1 flex flex-col items-center justify-center gap-1 py-3 text-[10px] font-black uppercase tracking-wider transition-all duration-200 min-h-[56px]",
                                isActive ? tab.activeColor : `${tab.color} hover:bg-zinc-100`
                            )}
                            aria-pressed={isActive}
                        >
                            <TabIcon className="w-5 h-5" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Instruction button grid */}
            <div className="grid grid-cols-2 gap-2">
                {instructions.map((inst) => {
                    const isActive = currentInstructionId === inst.id;
                    const label = tInst(`${inst.id}.title`);
                    const Icon = resolveIcon(inst.iconName);

                    return (
                        <button
                            key={inst.id}
                            onClick={() => handleTap(inst.id)}
                            aria-pressed={isActive}
                            className={cn(
                                "flex items-center gap-3 px-4 py-4 rounded-2xl border-2 font-bold text-sm text-left transition-all duration-200 min-h-[64px]",
                                isActive
                                    ? "bg-medical-green-600 text-white border-medical-green-700 shadow-lg scale-[1.02]"
                                    : "bg-white text-zinc-800 border-zinc-200 hover:border-medical-green-300 hover:bg-medical-green-50 active:scale-95"
                            )}
                        >
                            <Icon
                                className={cn("w-6 h-6 shrink-0", isActive ? "text-white" : "text-zinc-400")}
                            />
                            <span className="leading-snug">{label}</span>
                            {isActive && (
                                <Volume2 className="w-4 h-4 ml-auto shrink-0 animate-pulse" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
