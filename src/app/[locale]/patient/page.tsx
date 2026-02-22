"use client";

import { useTranslations } from "next-intl";
import { useSessionStore } from "@/store/useSessionStore";
import {
    Activity,
    ShieldAlert,
    Wifi,
    Hand
} from "lucide-react";
import { InstructionPlayer } from "@/components/patient/instruction-player";
import { CameraFeed } from "@/components/patient/camera-feed";
import { PatientEcho } from "@/components/patient/patient-echo";
import { useEmergencyBridge } from "@/hooks/useEmergencyBridge";

export default function PatientPage() {
    const t = useTranslations("Patient");
    const tE = useTranslations("Emergency");
    const { sessionId, isEmergency, currentInstructionId, emergencyStage } = useSessionStore();

    // Auto-trigger emergency if distress gestures are held
    useEmergencyBridge();

    const isActive = !!sessionId;

    return (
        <main role="main" aria-label="Patient display" className="flex-1 flex flex-col items-center justify-center p-4 md:p-12 text-center relative overflow-hidden">
            {/* Clinical State Mesh Background (Subtle) */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--medical-green-500)_0%,transparent_70%)]" />
            </div>

            {/* Clinical Vision Engine (Background) */}
            <CameraFeed />

            {/* Visual Signal Feedback (Echo) */}
            <PatientEcho />

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
                    {currentInstructionId ? (
                        <InstructionPlayer instructionId={currentInstructionId} />
                    ) : (
                        <div className="w-full max-w-5xl space-y-6 md:space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            {/* Active Session Header */}
                            <div className="flex items-center justify-center gap-4 mb-2 md:mb-4">
                                <div className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-medical-green-900/50 border-2 border-medical-green-700 rounded-full">
                                    <Activity className="w-6 h-6 md:w-8 md:h-8 text-medical-green-400" />
                                    <span className="text-lg md:text-2xl font-bold text-medical-green-100 uppercase tracking-widest">{t("systemActive")}</span>
                                </div>
                            </div>

                            <div className="space-y-4 md:space-y-6">
                                <h2 className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tight leading-tight text-white mb-2">
                                    {t("follow")}
                                </h2>
                            </div>

                            {/* Instruction Card - Phase 10 Preview */}
                            <div className="aspect-video w-full bg-zinc-900 rounded-[2rem] border-4 border-medical-green-500/30 flex flex-col items-center justify-center overflow-hidden shadow-2xl relative group" aria-label="Instruction preview area">
                                <div className="flex flex-col items-center gap-4 md:gap-8 opacity-40">
                                    <Hand className="w-24 h-24 md:w-48 md:h-48 text-medical-green-400" />
                                    <p className="text-xl md:text-4xl font-bold uppercase tracking-widest text-zinc-500">{tE("preparation")}</p>
                                </div>
                                {/* High-visibility Border Glow */}
                                <div className="absolute inset-0 border-8 border-medical-green-500 opacity-20 pointer-events-none rounded-[2rem]" />
                            </div>

                            <div className="flex items-center justify-center gap-3 pt-8">
                                <Wifi className="w-6 h-6 text-medical-green-500" />
                                <span className="text-xl font-bold text-zinc-500 uppercase tracking-widest">{tE("connected")}</span>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-12 animate-in fade-in duration-1000">
                    <div className="w-32 h-32 rounded-full bg-zinc-800 flex items-center justify-center mx-auto border-4 border-zinc-700">
                        <Activity className="w-16 h-16 text-zinc-600" />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-3xl md:text-5xl font-black text-zinc-300 tracking-tight">
                            {t("waiting")}
                        </h1>
                        <p className="text-2xl text-zinc-500 font-medium">{tE("presenceAwaiting")}</p>
                    </div>
                </div>
            )}
        </main>
    );
}
