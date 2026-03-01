"use client";

import { GESTURE_RESULTS } from "@/lib/constants/instructions";

/**
 * GestureGuide — shown on the PatientView (top panel) at the start of every session.
 * The radiographer tilts the phone toward the patient to show these gesture cards.
 *
 * Single source of truth: GESTURE_RESULTS from instructions.ts
 * All 7 clinically recognized hand signs are displayed, grouped by severity:
 *   - CRITICAL (red)   → patient's life may be at risk
 *   - PRIORITY (amber)  → patient needs attention
 *   - INFORMATIONAL (green/blue) → patient is communicating status
 */

/** Map severity → visual treatment for the patient-facing guide cards */
const SEVERITY_STYLES: Record<string, { bg: string; border: string; text: string; badge: string; label: string }> = {
    critical: {
        bg: "bg-red-50",
        border: "border-red-400",
        text: "text-red-800",
        badge: "bg-red-200 text-red-900",
        label: "URGENT",
    },
    priority: {
        bg: "bg-amber-50",
        border: "border-amber-400",
        text: "text-amber-800",
        badge: "bg-amber-200 text-amber-900",
        label: "IMPORTANT",
    },
    informational: {
        bg: "bg-green-50",
        border: "border-green-400",
        text: "text-green-800",
        badge: "bg-green-200 text-green-900",
        label: "INFO",
    },
};

export function GestureGuide() {
    return (
        <div className="h-full flex flex-col bg-white overflow-y-auto">
            {/* Header */}
            <div className="bg-medical-green-700 px-4 py-3 text-center shrink-0">
                <p className="text-white font-black text-base uppercase tracking-widest">
                    Hand Gestures Guide
                </p>
                <p className="text-medical-green-200 text-xs mt-0.5">
                    Show the radiographer how you feel
                </p>
            </div>

            {/* Severity Legend — compact row */}
            <div className="flex items-center justify-center gap-3 px-3 py-2 bg-zinc-50 border-b border-zinc-100 shrink-0">
                <span className="flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-widest text-red-700">
                    <span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Urgent
                </span>
                <span className="flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-widest text-amber-700">
                    <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Important
                </span>
                <span className="flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-widest text-green-700">
                    <span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Info
                </span>
            </div>

            {/* Gesture Cards — responsive grid for all 7 signs */}
            <div className="grid grid-cols-2 gap-2.5 p-3 flex-1 auto-rows-min content-start">
                {GESTURE_RESULTS.map((gesture) => {
                    const style = SEVERITY_STYLES[gesture.severity] ?? SEVERITY_STYLES.informational!;

                    return (
                        <div
                            key={gesture.id}
                            className={`flex flex-col items-center justify-center rounded-2xl border-2 p-2.5 gap-1 ${style.bg} ${style.border}`}
                        >
                            {/* Gesture emoji — very large for visibility */}
                            <span
                                className="leading-none select-none"
                                style={{ fontSize: "clamp(2rem, 8vw, 3.5rem)" }}
                                role="img"
                                aria-label={gesture.id.replace(/_/g, " ")}
                            >
                                {gesture.emoji}
                            </span>

                            {/* Gesture name */}
                            <p
                                className={`font-black text-center leading-tight ${style.text}`}
                                style={{ fontSize: "clamp(0.75rem, 3vw, 1.1rem)" }}
                            >
                                {gesture.id.replace(/_/g, " ")}
                            </p>

                            {/* Meaning badge — matches GESTURE_RESULTS exactly */}
                            <span
                                className={`px-2 py-0.5 rounded-full font-semibold text-center leading-snug ${style.badge}`}
                                style={{ fontSize: "clamp(0.6rem, 2.2vw, 0.8rem)" }}
                            >
                                {gesture.meaning}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
