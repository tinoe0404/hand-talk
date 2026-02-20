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
    CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * CLINICAL EMERGENCY TRIAGE
 * - High-priority categorization interface for distress events.
 * - Forces radiographers to select a reason before resolving the emergency.
 */
export function EmergencyTriage() {
    const { resolveEmergency } = useSessionStore();
    const [selectedReason, setSelectedReason] = useState<string | null>(null);

    const reasons = [
        { id: "PANIC", label: "Panic / Anxiety", icon: Brain, color: "bg-red-50 text-red-600 border-red-200" },
        { id: "PAIN", label: "Physical Pain", icon: Zap, color: "bg-orange-50 text-orange-600 border-orange-200" },
        { id: "BREATHING", label: "Breathing Issue", icon: Wind, color: "bg-blue-50 text-blue-600 border-blue-200" },
        { id: "EQUIP_FEAR", label: "Equipment Fear", icon: Box, color: "bg-purple-50 text-purple-600 border-purple-200" },
        { id: "OTHER", label: "Other / Manual", icon: MessageSquare, color: "bg-zinc-50 text-zinc-600 border-zinc-200" },
    ];

    const handleSubmit = () => {
        if (selectedReason) {
            resolveEmergency(selectedReason);
        }
    };

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
                            className={cn(
                                "flex items-center gap-4 p-6 rounded-clinical border-4 transition-all duration-300 text-left",
                                reason.color,
                                isActive ? "ring-8 ring-offset-4 ring-red-500/20 scale-[1.02] border-red-500 shadow-clinical-lg" : "hover:border-zinc-300 opacity-80"
                            )}
                        >
                            <Icon className="w-10 h-10" />
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
                    onClick={handleSubmit}
                    className={cn(
                        "h-20 px-16 text-2xl font-black rounded-clinical shadow-clinical-lg transition-all",
                        !selectedReason ? "opacity-30" : "animate-pulse"
                    )}
                >
                    <CheckCircle2 className="w-8 h-8 mr-3" />
                    CONFIRM & RESOLVE HALT
                </Button>
            </div>
        </div>
    );
}
