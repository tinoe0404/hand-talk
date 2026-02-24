"use client";

import { useSessionStore } from "@/store/useSessionStore";
import { useTranslations } from "next-intl";
import { GESTURE_RESULTS, GestureId } from "@/lib/constants/instructions";

export function GestureResultBanner() {
    const t = useTranslations("Gestures");
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
                <p className="font-black text-sm leading-tight">{t(gestureInfo.id)}</p>
                <p className="text-xs opacity-70 mt-0.5">
                    {Math.round(lastGesture.confidence * 100)}% confidence
                </p>
            </div>
            <div className={`w-2 h-2 rounded-full animate-pulse ${gestureInfo.dotColor}`} />
        </div>
    );
}
