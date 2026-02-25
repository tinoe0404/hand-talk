"use client";

import { useSessionStore } from "@/store/useSessionStore";
import { PatientView } from "@/components/dashboard/patient-view";
import { InstructionTabs } from "@/components/dashboard/instruction-selector";
import { EmergencyTriage } from "@/components/dashboard/emergency-triage";
import { VisionEngine } from "@/components/dashboard/vision-engine";
import { InstructionModal } from "@/components/dashboard/instruction-modal";
import { AlertTriangle, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { GestureResultBanner } from "@/components/dashboard/gesture-result-banner";
import { VisionBar } from "@/components/dashboard/vision-bar";
import { SessionInfo } from "@/components/dashboard/session-info";
import { DashboardHub } from "@/components/dashboard/dashboard-hub";

/* ────────────────────────────────────────────────────────────
   MAIN DASHBOARD PAGE
   - HUB MODE: When no session is active.
   - SESSION MODE: When a treatment is active (split screen).
 ──────────────────────────────────────────────────────────── */
export default function DashboardPage() {
    const t = useTranslations("Dashboard");
    const {
        sessionId,
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

    if (!isActive) {
        return <DashboardHub />;
    }

    return (
        /*
          Full viewport split:
          - TOP HALF  (patient-view): PatientView — radiographer tilts phone toward patient
          - BOTTOM HALF (radio-controls): instruction tabs + emergency — radiographer operates
          - InstructionModal overlays on top when an instruction is active
        */
        <>
            <InstructionModal />
            <div className="dashboard-root">
                {/* ── TOP: Patient-facing display ───────────────────────── */}
                <section className="patient-view" aria-label="Patient display">
                    <PatientView />
                </section>

                {/* ── DIVIDER ──────────────────────────────────────────── */}
                <div className="h-1 bg-gradient-to-r from-medical-green-600 via-medical-green-400 to-medical-green-600 shrink-0" />

                {/* ── BOTTOM: Radiographer controls ─────────────────────── */}
                <section className="radio-controls" aria-label="Radiographer controls">
                    <div className="flex flex-col gap-3 p-3 pb-24">
                        {/* Background Vision Logic */}
                        <VisionEngine />

                        {/* Session info bar */}
                        <SessionInfo />

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
                                {t("acknowledgeGuide")}
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        )}

                        {/* EMERGENCY MODE: show triage */}
                        {isEmergency ? (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border-2 border-red-200 rounded-xl">
                                    <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                                    <p className="text-red-800 font-black text-sm">
                                        {t("emergencyTriage")}
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
                                {t("endSession")}
                            </button>
                        )}
                    </div>

                    {/* ── EMERGENCY BUTTON — always sticky at bottom ──────── */}
                    {!isEmergency && (
                        <div className="emergency-sticky">
                            <button
                                onClick={triggerEmergency}
                                className="w-full h-14 rounded-xl bg-red-600 text-white font-black text-base uppercase tracking-widest shadow-lg hover:bg-red-700 active:scale-95 transition-all flex items-center justify-center gap-3 min-h-[56px]"
                                aria-label="Trigger emergency"
                            >
                                <AlertTriangle className="w-6 h-6" />
                                {t("emergencyButton")}
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
                  z-index: 50;
                  background: white;
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
        </>
    );
}
