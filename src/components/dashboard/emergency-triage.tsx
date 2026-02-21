"use client";

import React, { useState } from "react";
import { useSessionStore } from "@/store/useSessionStore";
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
    const { resolveEmergency } = useSessionStore();
    const [step, setStep] = useState<1 | 2>(1);
    const [selectedReason, setSelectedReason] = useState<string | null>(null);
    const [location, setLocation] = useState<string | null>(null);
    const [subReason, setSubReason] = useState<string | null>(null);

    const reasons = [
        { id: "PANIC", label: "Panic / Anxiety", icon: Brain, color: "bg-red-50 text-red-600 border-red-200" },
        { id: "PAIN", label: "Physical Pain", icon: Zap, color: "bg-orange-50 text-orange-600 border-orange-200" },
        { id: "BREATHING", label: "Breathing Issue", icon: Wind, color: "bg-blue-50 text-blue-600 border-blue-200" },
        { id: "EQUIP_FEAR", label: "Equipment Fear", icon: Box, color: "bg-purple-50 text-purple-600 border-purple-200" },
        { id: "OTHER", label: "Other / Manual", icon: MessageSquare, color: "bg-zinc-50 text-zinc-600 border-zinc-200" },
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
                        Back to Triage
                    </button>
                    <div className="text-sm font-black uppercase tracking-widest text-zinc-400">
                        Diagnostic Follow-up: <span className="text-zinc-900">{selectedReason}</span>
                    </div>
                </div>

                {selectedReason === "PAIN" && (
                    <div className="space-y-4">
                        <p className="text-xl font-bold text-zinc-700">Localize Distress Area:</p>
                        <BodyMapper onSelect={setLocation} selectedRegion={location} />
                    </div>
                )}

                {selectedReason === "BREATHING" && (
                    <div className="space-y-4">
                        <p className="text-xl font-bold text-zinc-700">Specify Respiratory Issue:</p>
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
                            "h-20 px-16 text-2xl font-black rounded-clinical shadow-clinical-lg transition-all",
                            ((selectedReason === "PAIN" && !location) || (selectedReason === "BREATHING" && !subReason)) ? "opacity-30" : "animate-pulse"
                        )}
                    >
                        <CheckCircle2 className="w-8 h-8 mr-3" />
                        COMPLETE RESOLUTION
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
                            aria-label={`Select distress reason: ${reason.label}`}
                            aria-pressed={isActive}
                            className={cn(
                                "flex items-center gap-4 p-6 rounded-clinical border-4 transition-all duration-300 text-left focus:outline-none focus:ring-4 focus:ring-medical-green-500/50",
                                reason.color,
                                isActive ? "ring-8 ring-offset-4 ring-red-500/20 scale-[1.02] border-red-500 shadow-clinical-lg" : "hover:border-zinc-300 opacity-80"
                            )}
                        >
                            <Icon className="w-10 h-10" aria-hidden="true" />
                            <span className="text-xl font-black uppercase tracking-tight">{reason.label}</span>
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
                        "h-20 px-16 text-2xl font-black rounded-clinical shadow-clinical-lg transition-all",
                        !selectedReason ? "opacity-30" : ""
                    )}
                >
                    {selectedReason === "PAIN" || selectedReason === "BREATHING" ? (
                        <>
                            CONTINUE TO DIAGNOSTICS
                            <ArrowRight className="w-8 h-8 ml-3" />
                        </>
                    ) : (
                        <>
                            <CheckCircle2 className="w-8 h-8 mr-3" />
                            CONFIRM & RESOLVE HALT
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
