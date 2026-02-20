"use client";

import { useTranslations } from "next-intl";
import { useSessionStore } from "@/store/useSessionStore";
import {
    Activity,
    ShieldAlert,
    Wifi,
    Hand
} from "lucide-react";

export default function PatientPage() {
    const t = useTranslations("Patient");
    const { sessionId, isEmergency, currentInstructionId } = useSessionStore();

    const isActive = !!sessionId;

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center relative overflow-hidden">
            {/* Clinical State Mesh Background (Subtle) */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--medical-green-500)_0%,transparent_70%)]" />
            </div>

            {/* Emergency Overlay (Top Priority) */}
            {isEmergency && (
                <div className="absolute inset-0 z-50 bg-red-600 flex flex-col items-center justify-center p-20 animate-in fade-in zoom-in duration-300">
                    <ShieldAlert className="w-48 h-48 text-white animate-bounce mb-8" />
                    <h1 className="text-6xl font-black text-white uppercase tracking-tighter mb-4">
                        {t("emergency")}
                    </h1>
                    <p className="text-3xl font-bold text-red-100">
                        Please remain still. Support is arriving.
                    </p>
                </div>
            )}

            {isActive ? (
                <div className="w-full max-w-5xl space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    {/* Active Session Header */}
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-medical-green-900/50 border border-medical-green-700 rounded-full">
                            <Activity className="w-5 h-5 text-medical-green-400" />
                            <span className="text-sm font-bold text-medical-green-100 uppercase tracking-widest">{t("systemActive")}</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-7xl md:text-8xl font-black tracking-tight leading-tight">
                            {t("follow")}
                        </h2>
                    </div>

                    {/* Instruction Card - Phase 10 Preview */}
                    <div className="aspect-video w-full bg-zinc-900 rounded-[2rem] border-4 border-medical-green-500/30 flex flex-col items-center justify-center overflow-hidden shadow-2xl relative group">
                        {currentInstructionId ? (
                            <div className="text-white">
                                {/* Video/Animation will play here in Phase 10 */}
                                <PlayMediaPlaceholder />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-8 opacity-40">
                                <Hand className="w-32 h-32 text-medical-green-400" />
                                <p className="text-2xl font-bold">Preparation in progress...</p>
                            </div>
                        )}

                        {/* High-visibility Border Glow */}
                        <div className="absolute inset-0 border-8 border-medical-green-500 opacity-20 pointer-events-none rounded-[2rem]" />
                    </div>

                    <div className="flex items-center justify-center gap-3 pt-8">
                        <Wifi className="w-6 h-6 text-medical-green-500" />
                        <span className="text-xl font-bold text-zinc-500 uppercase tracking-widest">Connected to Controller</span>
                    </div>
                </div>
            ) : (
                <div className="space-y-12 animate-in fade-in duration-1000">
                    <div className="w-32 h-32 rounded-full bg-zinc-800 flex items-center justify-center mx-auto border-4 border-zinc-700">
                        <Activity className="w-16 h-16 text-zinc-600" />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-5xl font-black text-zinc-300 tracking-tight">
                            {t("waiting")}
                        </h1>
                        <p className="text-2xl text-zinc-500 font-medium">Session Authorization Pending</p>
                    </div>
                </div>
            )}
        </div>
    );
}

function PlayMediaPlaceholder() {
    return (
        <div className="flex flex-col items-center gap-6">
            <div className="w-24 h-24 bg-medical-green-600 rounded-full flex items-center justify-center animate-pulse">
                <Activity className="w-12 h-12 text-white" />
            </div>
            <p className="text-3xl font-bold uppercase tracking-widest text-medical-green-400">Receiving Command</p>
        </div>
    );
}
