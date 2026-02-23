"use client";

import React, { useRef, useEffect } from "react";
import { useSessionStore } from "@/store/useSessionStore";
import {
    getInstruction,
    videoPath,
    INSTRUCTION_LABELS,
} from "@/lib/constants/instructions";
import * as LucideIcons from "lucide-react";
import { AlertTriangle } from "lucide-react";
import { GestureGuide } from "./gesture-guide";

// Resolve a Lucide icon by name string
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const IconMap = LucideIcons as Record<string, React.ElementType>;
function DynIcon({ name, className }: { name: string; className?: string }) {
    const Icon = IconMap[name] ?? LucideIcons.CircleHelp;
    return <Icon className={className} />;
}

/**
 * PatientView — the TOP half of the dashboard.
 *
 * The radiographer holds the phone and tilts this half toward the patient.
 * Driven entirely by `displayMode` in useSessionStore.
 */
export function PatientView() {
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
        if (!vid) return;
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
                    Ready for session
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
        ? INSTRUCTION_LABELS[currentInstructionId] ?? currentInstructionId
        : null;

    if (!inst || !label) {
        // Instruction mode but nothing selected yet — prompt
        return (
            <div className="flex flex-col items-center justify-center h-full bg-medical-green-50 text-medical-green-700 select-none px-6">
                <LucideIcons.Hand className="w-16 h-16 mb-4 opacity-30" />
                <p className="text-2xl font-bold text-center">
                    Tap an instruction below
                </p>
                <p className="text-base text-medical-green-500 mt-2 text-center">
                    The sign language video will appear here
                </p>
            </div>
        );
    }

    return (
        <div className="relative h-full bg-black flex flex-col">
            {/* Sign language video — fills the space, object-contain to keep aspect ratio */}
            <video
                ref={videoRef}
                key={inst.id}
                className="flex-1 w-full object-contain min-h-0"
                src={videoPath(inst.id)}
                autoPlay
                muted
                loop
                playsInline
            />

            {/* Overlay: instruction label + icon */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-5 py-5 flex items-end gap-4">
                <div className="bg-medical-green-600/90 rounded-2xl p-3 shrink-0 shadow-lg">
                    <DynIcon name={inst.iconName} className="w-9 h-9 text-white" />
                </div>
                <p
                    className="text-white font-black leading-tight drop-shadow-lg"
                    style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)" }}
                >
                    {label}
                </p>
            </div>
        </div>
    );
}
