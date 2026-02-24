"use client";

import { useSessionStore } from "@/store/useSessionStore";
import { PatientView } from "@/components/dashboard/patient-view";
import { InstructionTabs } from "@/components/dashboard/instruction-selector";
import { EmergencyTriage } from "@/components/dashboard/emergency-triage";
import { VisionEngine } from "@/components/dashboard/vision-engine";
import {
    AlertTriangle,
    ChevronRight,
    Activity,
    Hand,
    Wifi,
    WifiOff,
} from "lucide-react";
import { useEffect, useState } from "react";
import { GESTURE_RESULTS, GestureId } from "@/lib/constants/instructions";
import { Link } from "@/navigation";

/* ────────────────────────────────────────────────────────────
   GESTURE RESULT BANNER
   Shows in the RadioControls section when a gesture is detected
──────────────────────────────────────────────────────────── */
function GestureResultBanner() {
    const { lastGesture } = useSessionStore();
    if (!lastGesture) {
        return null;
    }

    const gestureInfo = GESTURE_RESULTS.find(
        (g) => g.id === (lastGesture.gestureId as GestureId)
    );
    if (!gestureInfo) {
        return null;
    }

    return (
        <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 animate-in slide-in-from-bottom-2 duration-300 ${gestureInfo.color}`}
            role="status"
            aria-live="polite"
        >
            <span className="text-2xl leading-none">{gestureInfo.emoji}</span>
            <div className="flex-1 min-w-0">
                <p className="font-black text-sm leading-tight">{gestureInfo.label}</p>
                <p className="text-xs opacity-70 mt-0.5">
                    {Math.round(lastGesture.confidence * 100)}% confidence
                </p>
            </div>
            <div className={`w-2 h-2 rounded-full animate-pulse ${gestureInfo.dotColor}`} />
        </div>
    );
}

/* ────────────────────────────────────────────────────────────
   VISION STATUS BAR
──────────────────────────────────────────────────────────── */
function VisionBar({ isOnline }: { isOnline: boolean }) {
    const { visionStatus, isHandDetected, sessionId } = useSessionStore();
    if (!sessionId) {
        return null;
    }

    return (
        <div className="flex flex-wrap items-center gap-3 px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-bold uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
                <Activity
                    className={`w-3.5 h-3.5 ${visionStatus === "ready" ? "text-medical-green-600 animate-pulse" : "text-zinc-400"
                        }`}
                />
                <span className={visionStatus === "ready" ? "text-medical-green-700" : "text-zinc-500"}>
                    Vision: {visionStatus}
                </span>
            </div>
            <div className="flex items-center gap-1.5">
                <Hand
                    className={`w-3.5 h-3.5 ${isHandDetected ? "text-blue-600 animate-bounce" : "text-zinc-400"
                        }`}
                />
                <span className={isHandDetected ? "text-blue-700" : "text-zinc-500"}>
                    {isHandDetected ? "Hand detected" : "Awaiting gesture"}
                </span>
            </div>
            {!isOnline && (
                <div className="flex items-center gap-1.5 text-red-600 animate-pulse">
                    <WifiOff className="w-3.5 h-3.5" />
                    <span>Offline</span>
                </div>
            )}
            {isOnline && (
                <div className="flex items-center gap-1.5 text-zinc-400">
                    <Wifi className="w-3.5 h-3.5" />
                </div>
            )}
        </div>
    );
}

/* ────────────────────────────────────────────────────────────
   MAIN DASHBOARD PAGE
──────────────────────────────────────────────────────────── */
export default function DashboardPage() {
    const {
        sessionId,
        patientRef,
        displayMode,
        isEmergency,
        triggerEmergency,
        acknowledgeGestureGuide,
        endSession,
    } = useSessionStore();

    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        setIsOnline(navigator.onLine);
        const on = () => setIsOnline(true);
        const off = () => setIsOnline(false);
        window.addEventListener("online", on);
        window.addEventListener("offline", off);
        return () => {
            window.removeEventListener("online", on);
            window.removeEventListener("offline", off);
        };
    }, []);

    const isActive = !!sessionId;

    return (
        /*
          Full viewport split:
          - TOP HALF  (patient-view): PatientView — radiographer tilts phone toward patient
          - BOTTOM HALF (radio-controls): instruction tabs + emergency — radiographer operates
        */
        <div className="dashboard-root">
            {/* ── TOP: Patient-facing display ───────────────────────── */}
            <section className="patient-view" aria-label="Patient display">
                <PatientView />
            </section>

            {/* ── DIVIDER ──────────────────────────────────────────── */}
            <div className="h-1 bg-gradient-to-r from-medical-green-600 via-medical-green-400 to-medical-green-600 shrink-0" />

            {/* ── BOTTOM: Radiographer controls ─────────────────────── */}
            <section className="radio-controls" aria-label="Radiographer controls">
                {!isActive ? (
                    /* NO SESSION — show start prompt */
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6">
                        <div className="w-16 h-16 bg-medical-green-100 rounded-2xl flex items-center justify-center">
                            <Activity className="w-8 h-8 text-medical-green-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-medical-green-900">
                                No Active Session
                            </h2>
                            <p className="text-sm text-zinc-500 mt-1">
                                Start a session to begin communication
                            </p>
                        </div>
                        <Link href="/dashboard/session/new">
                            <button className="h-14 px-8 text-base font-black rounded-xl bg-medical-green-600 text-white shadow-lg hover:bg-medical-green-700 active:scale-95 transition-all min-w-[200px]">
                                Start Session
                            </button>
                        </Link>
                        <Link href="/dashboard/history">
                            <button className="text-sm font-bold text-medical-green-600 underline underline-offset-2">
                                View History
                            </button>
                        </Link>
                    </div>
                ) : (
                    /* ACTIVE SESSION */
                    <div className="flex flex-col gap-3 p-3 pb-24">
                        {/* Background Vision Logic */}
                        <VisionEngine />

                        {/* Session info bar */}
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                                    Active Session
                                </p>
                                <p className="text-sm font-black text-zinc-900 truncate max-w-[180px]">
                                    {patientRef ?? "Unknown Patient"}
                                </p>
                            </div>
                            <div className="text-xs font-mono text-zinc-400 truncate max-w-[120px] text-right">
                                {sessionId?.slice(0, 16)}…
                            </div>
                        </div>

                        {/* Gesture result display */}
                        <GestureResultBanner />

                        {/* Vision status */}
                        <VisionBar isOnline={isOnline} />

                        {/* GESTURE GUIDE: show "Continue" button while guide is visible */}
                        {displayMode === "gesture-guide" && !isEmergency && (
                            <button
                                onClick={acknowledgeGestureGuide}
                                className="flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-medical-green-600 text-white font-black text-sm uppercase tracking-wider animate-pulse shadow-md min-h-[48px]"
                            >
                                Patient has read the guide — Continue
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        )}

                        {/* EMERGENCY MODE: show triage */}
                        {isEmergency ? (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border-2 border-red-200 rounded-xl">
                                    <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                                    <p className="text-red-800 font-black text-sm">
                                        Emergency — Triage in progress
                                    </p>
                                </div>
                                <EmergencyTriage />
                            </div>
                        ) : (
                            /* INSTRUCTION TABS */
                            (displayMode === "instruction" ||
                                displayMode === "idle" ||
                                displayMode === "gesture-guide") && (
                                <InstructionTabs />
                            )
                        )}

                        {/* End session */}
                        {!isEmergency && (
                            <button
                                onClick={endSession}
                                className="mt-2 h-11 px-4 rounded-xl border-2 border-zinc-200 text-zinc-600 font-bold text-sm hover:border-red-200 hover:text-red-600 hover:bg-red-50 transition-all active:scale-95 min-h-[44px]"
                            >
                                End Session
                            </button>
                        )}
                    </div>
                )}

                {/* ── EMERGENCY BUTTON — always sticky at bottom ──────── */}
                {isActive && !isEmergency && (
                    <div className="emergency-sticky">
                        <button
                            onClick={triggerEmergency}
                            className="w-full h-14 rounded-xl bg-red-600 text-white font-black text-base uppercase tracking-widest shadow-lg hover:bg-red-700 active:scale-95 transition-all flex items-center justify-center gap-3 min-h-[56px]"
                            aria-label="Trigger emergency"
                        >
                            <AlertTriangle className="w-6 h-6" />
                            Emergency
                        </button>
                    </div>
                )}
            </section>

            <style jsx>{`
        .dashboard-root {
          display: flex;
          flex-direction: column;
          height: 100dvh;
          width: 100%;
          overflow: hidden;
          position: fixed;
          inset: 0;
        }
        .patient-view {
          flex: 0 0 50dvh;
          overflow: hidden;
          position: relative;
        }
        .radio-controls {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          position: relative;
          background: #f8fafc;
        }
        .emergency-sticky {
          position: sticky;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 12px;
          background: linear-gradient(to top, #f8fafc 70%, transparent);
          z-index: 10;
        }
      `}</style>
        </div>
    );
}
