"use client";

import React, { useEffect, useCallback } from "react";
import { useSessionStore } from "@/store/useSessionStore";
import { getInstruction, videoPath } from "@/lib/constants/instructions";
import { useTranslations } from "next-intl";
import { VideoPlayer } from "./video-player";
import { X, Volume2 } from "lucide-react";
import { resolveIcon } from "@/lib/icon-map";



/**
 * InstructionModal — Full-screen popup triggered when the radiographer
 * taps an instruction button.
 *
 * Displays:
 *  ✔ Sign-language video (auto-play, looped)
 *  ✔ Text label (instruction title)
 *  ✔ Description text
 *  ✔ Matching icon
 *  ✔ Session log entry is handled by the store's setInstruction()
 *
 * The modal drives the PatientView simultaneously via displayMode.
 */
export function InstructionModal() {
    const t = useTranslations("Instructions");
    const { currentInstructionId, stopInstruction } = useSessionStore();

    const inst = currentInstructionId
        ? getInstruction(currentInstructionId)
        : null;

    // Close on Escape
    const handleEsc = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                stopInstruction();
            }
        },
        [stopInstruction]
    );

    useEffect(() => {
        if (!inst) {
            return;
        }
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [inst, handleEsc]);

    if (!inst || !currentInstructionId) {
        return null;
    }

    const Icon = resolveIcon(inst.iconName);
    const title = t(`${currentInstructionId}.title`);
    const desc = t(`${currentInstructionId}.desc`);

    return (
        <div
            className="fixed inset-0 z-[200] flex flex-col bg-black/95 backdrop-blur-md animate-in fade-in duration-200"
            role="dialog"
            aria-modal="true"
            aria-label={title}
        >
            {/* Header bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-black/50 shrink-0 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-medical-green-600 flex items-center justify-center shadow-lg shadow-medical-green-600/30">
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <p className="text-white font-black text-lg leading-tight">
                            {title}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <Volume2 className="w-3 h-3 text-medical-green-400 animate-pulse" />
                            <span className="text-[10px] font-bold text-medical-green-400 uppercase tracking-widest">
                                Now Playing
                            </span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={stopInstruction}
                    className="w-10 h-10 rounded-xl bg-white/10 hover:bg-red-600/80 flex items-center justify-center transition-all duration-200 active:scale-90 border border-white/10"
                    aria-label="Close instruction"
                >
                    <X className="w-5 h-5 text-white" />
                </button>
            </div>

            {/* Video area — takes up the remaining space */}
            <div className="flex-1 min-h-0 relative">
                <VideoPlayer
                    src={videoPath(inst.id)}
                    autoPlay
                    loop
                    className="w-full h-full"
                />
            </div>

            {/* Bottom info bar */}
            <div className="shrink-0 px-5 py-4 bg-gradient-to-t from-black via-black/90 to-transparent border-t border-white/5">
                <div className="flex items-start gap-4">
                    <div className="bg-medical-green-600/20 rounded-2xl p-3 shrink-0 border border-medical-green-600/30">
                        <Icon className="w-8 h-8 text-medical-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p
                            className="text-white font-black leading-tight mb-1"
                            style={{ fontSize: "clamp(1.5rem, 5vw, 2.5rem)" }}
                        >
                            {title}
                        </p>
                        <p className="text-zinc-400 font-medium text-sm leading-relaxed">
                            {desc}
                        </p>
                    </div>
                </div>

                <button
                    onClick={stopInstruction}
                    className="w-full mt-4 h-16 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-black text-base uppercase tracking-widest transition-all active:scale-[0.98] min-h-[64px]"
                >
                    Dismiss Instruction
                </button>
            </div>
        </div>
    );
}
