"use client";

import React, { useState } from "react";
import { useSessionStore } from "@/store/useSessionStore";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
    Brain,
    Zap,
    Wind,
    Box,
    MessageSquare,
    CheckCircle2,
    ArrowRight,
    ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BodyMapper } from "./body-mapper";
import { BreathingLog } from "./breathing-log";

/**
 * CLINICAL EMERGENCY TRIAGE (Multi-stage)
 * - Stage 1: Categorization (Panic, Pain, Breathing, etc.)
 * - Stage 2: Diagnostic Follow-up (Body Mapping, Breathing Log)
 * - Final: Mandatory Audit Resolution
 */
export function EmergencyTriage() {
    const t = useTranslations("Emergency");
    const tTriage = useTranslations("Triage");
    const { resolveEmergency } = useSessionStore();
    const [step, setStep] = useState<1 | 2>(1);
    const [selectedReason, setSelectedReason] = useState<string | null>(null);
    const [location, setLocation] = useState<string | null>(null);
    const [subReason, setSubReason] = useState<string | null>(null);

    const reasons = [
        { id: "PANIC", icon: Brain, color: "bg-red-50 text-red-600 border-red-200" },
        { id: "PAIN", icon: Zap, color: "bg-orange-50 text-orange-600 border-orange-200" },
        { id: "BREATHING", icon: Wind, color: "bg-blue-50 text-blue-600 border-blue-200" },
        { id: "EQUIP_FEAR", icon: Box, color: "bg-purple-50 text-purple-600 border-purple-200" },
        { id: "OTHER", icon: MessageSquare, color: "bg-zinc-50 text-zinc-600 border-zinc-200" },
    ];

    const handleNext = () => {
        if (selectedReason === "PAIN" || selectedReason === "BREATHING") {
            setStep(2);
        } else {
            // Direct resolution for categories without specific v1 follow-up screens
            resolveEmergency(selectedReason || "UNKNOWN");
        }
    };

    const handleResolve = () => {
        // Resolve with localized details
        const finalReason = `${selectedReason}${location ? ` @ ${location}` : ""}${subReason ? ` (${subReason})` : ""}`;
        resolveEmergency(finalReason);
    };

    if (step === 2) {
        return (
            <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                <div className="flex items-center justify-between border-b-2 border-zinc-100 pb-4">
                    <button
                        onClick={() => setStep(1)}
                        className="flex items-center gap-2 text-zinc-500 hover:text-medical-green-600 font-bold uppercase tracking-widest transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                        {t('backToTriage')}
                    </button>
                    <div className="text-sm font-black uppercase tracking-widest text-zinc-400">
                        {t('diagnosticTitle')}: <span className="text-zinc-900">{selectedReason ? tTriage(selectedReason) : ""}</span>
                    </div>
                </div>

                {selectedReason === "PAIN" && (
                    <div className="space-y-4">
                        <BodyMapper onSelect={setLocation} selectedRegion={location} />
                    </div>
                )}

                {selectedReason === "BREATHING" && (
                    <div className="space-y-4">
                        <BreathingLog onSelect={setSubReason} selectedIssue={subReason} />
                    </div>
                )}

                <div className="pt-8 flex justify-end">
                    <Button
                        variant="emergency"
                        size="xl"
                        onClick={handleResolve}
                        disabled={selectedReason === "PAIN" ? !location : selectedReason === "BREATHING" ? !subReason : false}
                        className={cn(
                            "h-14 md:h-20 px-6 md:px-16 text-base md:text-2xl font-black rounded-clinical shadow-clinical-lg transition-all w-full sm:w-auto",
                            ((selectedReason === "PAIN" && !location) || (selectedReason === "BREATHING" && !subReason)) ? "opacity-30" : "animate-pulse"
                        )}
                    >
                        <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-3 shrink-0" />
                        {t('completeResolution')}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in slide-in-from-top-8 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reasons.map((reason) => {
                    const Icon = reason.icon;
                    const isActive = selectedReason === reason.id;

                    return (
                        <button
                            key={reason.id}
                            onClick={() => setSelectedReason(reason.id)}
                            aria-label={`Select distress reason: ${tTriage(reason.id)}`}
                            aria-pressed={isActive}
                            className={cn(
                                "flex items-center gap-4 p-6 rounded-clinical border-4 transition-all duration-300 text-left focus:outline-none focus:ring-4 focus:ring-medical-green-500/50",
                                reason.color,
                                isActive ? "ring-8 ring-offset-4 ring-red-500/20 scale-[1.02] border-red-500 shadow-clinical-lg" : "hover:border-zinc-300 opacity-80"
                            )}
                        >
                            <Icon className="w-10 h-10" aria-hidden="true" />
                            <span className="text-xl font-black uppercase tracking-tight">{tTriage(reason.id)}</span>
                        </button>
                    );
                })}
            </div>

            <div className="pt-8 flex justify-end">
                <Button
                    variant="emergency"
                    size="xl"
                    disabled={!selectedReason}
                    onClick={handleNext}
                    className={cn(
                        "h-14 md:h-20 px-6 md:px-16 text-base md:text-2xl font-black rounded-clinical shadow-clinical-lg transition-all w-full sm:w-auto",
                        !selectedReason ? "opacity-30" : ""
                    )}
                >
                    {selectedReason === "PAIN" || selectedReason === "BREATHING" ? (
                        <>
                            {t('continueToDiagnostics')}
                            <ArrowRight className="w-6 h-6 md:w-8 md:h-8 ml-2 md:ml-3 shrink-0" />
                        </>
                    ) : (
                        <>
                            <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-3 shrink-0" />
                            {t('confirmResolve')}
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
