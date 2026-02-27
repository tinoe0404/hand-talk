"use client";

import { useSessionStore } from "@/store/useSessionStore";
import { GESTURE_RESULTS, GestureId } from "@/lib/constants/instructions";
import { X, AlertTriangle, Info, Bell } from "lucide-react";
import { useEffect } from "react";

export function GestureResultBanner() {
    const { lastGesture } = useSessionStore();

    useEffect(() => {
        if (!lastGesture) { return undefined; }

        const gestureInfo = GESTURE_RESULTS.find(g => g.id === (lastGesture.gestureId as GestureId));

        // Auto-fade informational messages after 6 seconds
        if (gestureInfo && gestureInfo.severity === 'informational') {
            const timer = setTimeout(() => {
                useSessionStore.setState({ lastGesture: null });
            }, 6000);
            return () => clearTimeout(timer);
        }
        return undefined;
    }, [lastGesture]);

    if (!lastGesture) {
        return null;
    }

    const gestureInfo = GESTURE_RESULTS.find(g => g.id === (lastGesture.gestureId as GestureId));
    if (!gestureInfo) { return null; }

    return (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 pointer-events-auto">
            <div
                className={`relative flex items-center gap-5 p-5 rounded-2xl border-2 shadow-2xl animate-in slide-in-from-top-4 duration-300 w-full backdrop-blur-md ${gestureInfo.color} bg-opacity-95`}
                role="alert"
                aria-live="assertive"
            >
                <div className="flex-shrink-0">
                    <span className="text-5xl drop-shadow-sm" aria-hidden="true">{gestureInfo.emoji}</span>
                </div>

                <div className="flex-1 min-w-0 pr-8">
                    <div className="flex items-center gap-1.5 mb-1 opacity-80">
                        {gestureInfo.severity === 'critical' ? (
                            <AlertTriangle className="w-4 h-4" />
                        ) : gestureInfo.severity === 'priority' ? (
                            <Bell className="w-4 h-4" />
                        ) : (
                            <Info className="w-4 h-4" />
                        )}
                        <span className="text-xs font-bold uppercase tracking-widest">
                            Patient Alert
                        </span>
                    </div>

                    <p className="font-black text-2xl leading-snug mb-1 uppercase tracking-tight">
                        &quot;{gestureInfo.meaning}&quot;
                    </p>

                    <p className="text-sm font-medium opacity-75">
                        Detected ML Sign: {gestureInfo.id.replace('_', ' ')} • Match: {Math.round(lastGesture.confidence * 100)}%
                    </p>
                </div>

                <button
                    onClick={() => useSessionStore.setState({ lastGesture: null })}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/10 transition-colors"
                    aria-label="Dismiss alert"
                >
                    <X className="w-6 h-6 opacity-70" />
                </button>

                <div className={`absolute bottom-4 right-5 w-3 h-3 rounded-full animate-ping ${gestureInfo.dotColor}`} />
            </div>
        </div>
    );
}
