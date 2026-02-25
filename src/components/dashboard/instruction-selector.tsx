"use client";

import React, { useState } from "react";
import { useSessionStore } from "@/store/useSessionStore";
import { useTranslations } from "next-intl";
import {
    GROUPED_INSTRUCTIONS,
    InstructionCategory,
    videoPath,
} from "@/lib/constants/instructions";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const IconMap = LucideIcons as unknown as Record<string, React.ElementType>;

/**
 * InstructionTabs — radiographer-side control panel.
 * Shows 4 category tabs, each with a grid of instruction buttons.
 * Tap a button → setInstruction() → PatientView auto-updates.
 */
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

    // Preload videos for the active tab to ensure instant playback
    React.useEffect(() => {
        instructions.forEach((inst) => {
            const link = document.createElement("link");
            link.rel = "preload";
            link.as = "video";
            link.href = videoPath(inst.id);
            document.head.appendChild(link);

            // Optional: remove after a delay so we don't bloat the head
            setTimeout(() => {
                if (document.head.contains(link)) {
                    document.head.removeChild(link);
                }
            }, 60000); // 1 minute
        });
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
            {/* Tab bar */}
            <div className="flex rounded-xl overflow-hidden border border-zinc-200 bg-zinc-50 shrink-0">
                {TABS.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex-1 py-2.5 text-xs font-black uppercase tracking-wider transition-all duration-200 min-h-[44px]",
                                isActive ? tab.activeColor : `${tab.color} hover:bg-zinc-100`
                            )}
                            aria-pressed={isActive}
                        >
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
                    const Icon = IconMap[inst.iconName] ?? LucideIcons.CircleHelp;

                    return (
                        <button
                            key={inst.id}
                            onClick={() => handleTap(inst.id)}
                            aria-pressed={isActive}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl border-2 font-bold text-sm text-left transition-all duration-200 min-h-[56px]",
                                isActive
                                    ? "bg-medical-green-600 text-white border-medical-green-700 shadow-md scale-[1.02]"
                                    : "bg-white text-zinc-800 border-zinc-200 hover:border-medical-green-300 hover:bg-medical-green-50 active:scale-95"
                            )}
                        >
                            <Icon
                                className={cn("w-5 h-5 shrink-0", isActive ? "text-white" : "text-zinc-400")}
                            />
                            <span className="leading-snug">{label}</span>
                            {isActive && (
                                <LucideIcons.Volume2 className="w-4 h-4 ml-auto shrink-0 animate-pulse" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
