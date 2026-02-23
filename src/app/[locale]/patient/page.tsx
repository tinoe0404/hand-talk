"use client";

import { useTranslations } from "next-intl";
import { useSessionStore } from "@/store/useSessionStore";
import { ShieldAlert } from "lucide-react";
import { InstructionPlayer } from "@/components/patient/instruction-player";
import { WelcomeVideo } from "@/components/patient/welcome-video";
import { FarewellVideo } from "@/components/patient/farewell-video";
import { GestureGuide } from "@/components/patient/gesture-guide";
import { useEmergencyBridge } from "@/hooks/useEmergencyBridge";

export default function PatientPage() {
    const t = useTranslations("Patient");
    const tE = useTranslations("Emergency");
    const { sessionId, isEmergency, currentInstructionId, emergencyStage, isFirstDay, hasSeenWelcomeVideo, isLastDay, hasSeenGestureGuide } = useSessionStore();

    // Auto-trigger emergency if distress gestures are held
    useEmergencyBridge();

    const isActive = !!sessionId;

    return (
        <main role="main" aria-label="Patient display" className="flex-1 flex flex-col items-center justify-center p-4 md:p-12 text-center relative overflow-hidden bg-[#0A192F]">

            {/* First Day Welcome Video Overlay */}
            {isFirstDay && !hasSeenWelcomeVideo && <WelcomeVideo />}

            {/* Last Day Farewell Video Overlay */}
            {isLastDay && currentInstructionId === 'treatment-finished' && <FarewellVideo />}

            {/* Emergency Overlay (Top Priority) */}
            {isEmergency && (
                <div role="alert" aria-live="assertive" aria-atomic="true" className="absolute inset-0 z-50 bg-red-600 flex flex-col items-center justify-center p-6 md:p-20 animate-in fade-in duration-300">
                    {/* Pulsing Alert Ring */}
                    <div className="absolute inset-0 border-[16px] md:border-[40px] border-red-500 animate-[pulse_0.5s_ease-in-out_infinite]" />

                    <div className="relative z-10 flex flex-col items-center">
                        <ShieldAlert className="w-32 h-32 md:w-64 md:h-64 text-white animate-bounce mb-4 md:mb-8" />
                        <h1 className="text-4xl md:text-8xl font-black text-white uppercase tracking-tighter mb-2 md:mb-4">
                            {emergencyStage > 0 ? tE("haltTitle") : t("emergency")}
                        </h1>
                        <p className="text-xl md:text-4xl font-bold text-red-100 bg-red-900/40 px-4 md:px-8 py-3 md:py-4 rounded-xl border-2 border-red-400/50">
                            {emergencyStage > 0
                                ? tE("staffAlerted")
                                : tE("alertingStaff")}
                        </p>
                    </div>
                </div>
            )}

            {isActive ? (
                <div className="w-full h-full flex flex-col items-center justify-center">
                    {!hasSeenGestureGuide ? (
                        <GestureGuide />
                    ) : currentInstructionId && currentInstructionId !== 'treatment-finished' ? (
                        <InstructionPlayer instructionId={currentInstructionId} />
                    ) : null}
                </div>
            ) : null}
        </main>
    );
}
