"use client";

import React, { useEffect, useState } from "react";
import { useSessionStore } from "@/store/useSessionStore";
import { ThumbsUp, Hand, MousePointer2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * PATIENT ECHO COMPONENT
 * - Displays a high-contrast visual "echo" of the recognized gesture.
 * - Provides immediate confidence to the patient that their signal was received.
 */
export function PatientEcho() {
    const { lastGesture } = useSessionStore();
    const [visible, setVisible] = useState(false);
    const [current, setCurrent] = useState<string | null>(null);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (lastGesture) {
            setCurrent(lastGesture);
            setVisible(true);
        } else {
            timer = setTimeout(() => {
                setVisible(false);
            }, 1000);
        }
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [lastGesture]);

    if (!visible && !lastGesture) {
        return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const config: Record<string, { icon: any; color: string; label: string; bg: string }> = {
        'THUMBS_UP': {
            icon: ThumbsUp,
            color: "text-medical-green-600",
            bg: "bg-medical-green-50",
            label: "OK"
        },
        'OPEN_PALM': {
            icon: Hand,
            color: "text-orange-600",
            bg: "bg-orange-50",
            label: "HELP"
        },
        'CLOSED_FIST': {
            icon: Hand,
            color: "text-red-600",
            bg: "bg-red-50",
            label: "STOP"
        },
        'POINTING': {
            icon: MousePointer2,
            color: "text-blue-600",
            bg: "bg-blue-50",
            label: "ATTENTION"
        }
    };

    const active = config[current || ''] || null;
    if (!active) {
        return null;
    }

    const Icon = active.icon;

    return (
        <div className={cn(
            "fixed bottom-12 right-12 z-50 transition-all duration-500 transform",
            visible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-4"
        )}>
            <div className={cn(
                "flex flex-col items-center justify-center p-8 rounded-full shadow-clinical-lg border-4 w-48 h-48",
                active.bg,
                active.color.replace('text', 'border')
            )}>
                <Icon className={cn("w-20 h-20 mb-2", active.color, "animate-pulse")} strokeWidth={2.5} />
                <span className={cn("text-xl font-black uppercase tracking-tighter", active.color)}>
                    {active.label}
                </span>
            </div>

            {/* Visual Ripple Effect */}
            <div className={cn(
                "absolute inset-0 rounded-full animate-ping opacity-20 border-8",
                active.color.replace('text', 'border')
            )} />
        </div>
    );
}
