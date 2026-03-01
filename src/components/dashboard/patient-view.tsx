"use client";

import React, { useRef, useEffect } from "react";
import { useSessionStore } from "@/store/useSessionStore";
import {
    getInstruction,
    videoPath,
} from "@/lib/constants/instructions";
import { useTranslations } from "next-intl";
import { AlertTriangle, Hand } from "lucide-react";
import { resolveIcon } from "@/lib/icon-map";
import { GestureGuide } from "./gesture-guide";
import { VideoPlayer } from "./video-player";

// Resolve a Lucide icon by name string
function DynIcon({ name, className }: { name: string; className?: string }) {
    const Icon = resolveIcon(name);
    return <Icon className={className} />;
}

/**
 * PatientView — the TOP half of the dashboard.
 *
 * The radiographer holds the phone and tilts this half toward the patient.
 * Driven entirely by `displayMode` in useSessionStore.
 */
export function PatientView() {
    const t = useTranslations("Instructions");
    const {
        displayMode,
        currentInstructionId,
        onWelcomeVideoEnd,
        onFarewellVideoEnd,
    } = useSessionStore();

    const videoRef = useRef<HTMLVideoElement>(null);

    // Whenever the instruction or mode changes, restart + play the video
    useEffect(() => {
        const vid = videoRef.current;
        if (!vid) {
            return;
        }
        vid.load();
        vid.play().catch(() => {/* autoplay blocked — user interaction required */ });
    }, [currentInstructionId, displayMode]);

    // ── IDLE ──────────────────────────────────────────────────
    if (displayMode === "idle") {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-medical-green-900 to-medical-green-800 text-white select-none">
                <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mb-4 shadow-lg">
                    <span className="text-3xl font-black tracking-tighter">HT</span>
                </div>
                <p className="text-lg font-bold text-medical-green-200 tracking-widest uppercase">
                    Hand Talk
                </p>
                <p className="text-sm text-medical-green-400 mt-1">
                    System Ready. Awaiting Radiographer.
                </p>
            </div>
        );
    }

    // ── EMERGENCY ─────────────────────────────────────────────
    if (displayMode === "emergency") {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-red-600 text-white animate-pulse-slow select-none px-6">
                <AlertTriangle className="w-20 h-20 mb-4 drop-shadow-lg" strokeWidth={2.5} />
                <h2 className="text-4xl font-black text-center leading-tight tracking-tight drop-shadow-md">
                    TREATMENT HALTED
                </h2>
                <p className="text-2xl font-bold text-red-100 mt-3 text-center">
                    STAFF AWARE
                </p>
                <div className="mt-6 px-6 py-3 bg-white/20 rounded-2xl border-2 border-white/40">
                    <p className="text-base font-medium text-center text-white/90">
                        Please remain still. Help is coming.
                    </p>
                </div>
            </div>
        );
    }

    // ── GESTURE GUIDE ─────────────────────────────────────────
    if (displayMode === "gesture-guide") {
        return <GestureGuide />;
    }

    // ── FIRST-DAY WELCOME VIDEO ───────────────────────────────
    if (displayMode === "welcome") {
        return (
            <div className="relative h-full bg-black flex items-center justify-center">
                <video
                    ref={videoRef}
                    className="w-full h-full object-contain"
                    src={videoPath("first-day-welcome")}
                    autoPlay
                    muted
                    playsInline
                    onEnded={onWelcomeVideoEnd}
                />
                <div className="absolute top-4 left-4 bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">
                    Welcome — First Day
                </div>
            </div>
        );
    }

    // ── FAREWELL VIDEO ────────────────────────────────────────
    if (displayMode === "farewell") {
        return (
            <div className="relative h-full bg-black flex items-center justify-center">
                <video
                    ref={videoRef}
                    className="w-full h-full object-contain"
                    src={videoPath("last-day-farewell")}
                    autoPlay
                    muted
                    playsInline
                    onEnded={onFarewellVideoEnd}
                />
                <div className="absolute top-4 left-4 bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">
                    Farewell — Last Day
                </div>
            </div>
        );
    }

    // ── INSTRUCTION ───────────────────────────────────────────
    const inst = currentInstructionId ? getInstruction(currentInstructionId) : null;
    const label = currentInstructionId
        ? t(`${currentInstructionId}.title`)
        : null;

    if (!inst || !label) {
        // Instruction mode but nothing selected yet — patient-facing prompt
        return (
            <div className="flex flex-col items-center justify-center h-full bg-medical-green-50 text-medical-green-700 select-none px-6">
                <Hand className="w-16 h-16 mb-4 opacity-30" />
                <p className="text-2xl font-bold text-center">
                    Please Wait for Instructions
                </p>
                <p className="text-base text-medical-green-500 mt-2 text-center">
                    The sign language video will appear here
                </p>
            </div>
        );
    }

    return (
        <div className="relative h-full bg-black flex flex-col overflow-hidden">
            {/* Attention-grabbing visual flash when instruction changes */}
            <div
                key={inst.id} // Re-mounts div to trigger CSS animation on ID change
                className="absolute inset-0 border-4 border-medical-green-500 z-10 pointer-events-none animate-in fade-in zoom-in duration-500 slide-out-to-top-0 fade-out-0"
                style={{ animationFillMode: "forwards", animationDuration: "1s" }}
            />

            {/* Sign language video — uses VideoPlayer for error handling */}
            <VideoPlayer
                src={videoPath(inst.id)}
                autoPlay
                loop
                className="flex-1 min-h-0"
            />

            {/* Overlay: instruction label + icon (High Contrast Pill) */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-lg z-20">
                <div className="bg-black/70 backdrop-blur-xl border border-white/20 rounded-3xl p-4 flex items-center justify-center gap-4 shadow-2xl">
                    <div className="bg-medical-green-500 rounded-full p-3 shrink-0 shadow-inner">
                        <DynIcon name={inst.iconName} className="w-8 h-8 text-white" />
                    </div>
                    <p
                        className="text-white font-black leading-tight text-center"
                        style={{ fontSize: "clamp(1.5rem, 5vw, 2.5rem)" }}
                    >
                        {label}
                    </p>
                </div>
            </div>
        </div>
    );
}

