"use client";

import { useSessionStore } from "@/store/useSessionStore";
import { Activity, Hand, Wifi, WifiOff } from "lucide-react";

export function VisionBar({ isOnline }: { isOnline: boolean }) {
    const { visionStatus, isHandDetected, sessionId } = useSessionStore();
    if (!sessionId) {
        return null;
    }

    return (
        <div className="flex flex-wrap items-center gap-3 px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-bold uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
                <Activity
                    className={`w-3.5 h-3.5 ${visionStatus === "ready" ? "text-medical-green-600 animate-pulse" : "text-zinc-400"
                        }`}
                />
                <span className={visionStatus === "ready" ? "text-medical-green-700" : "text-zinc-500"}>
                    Vision: {visionStatus}
                </span>
            </div>
            <div className="flex items-center gap-1.5">
                <Hand
                    className={`w-3.5 h-3.5 ${isHandDetected ? "text-blue-600 animate-bounce" : "text-zinc-400"
                        }`}
                />
                <span className={isHandDetected ? "text-blue-700" : "text-zinc-500"}>
                    {isHandDetected ? "Hand detected" : "Awaiting gesture"}
                </span>
            </div>
            {!isOnline && (
                <div className="flex items-center gap-1.5 text-red-600 animate-pulse">
                    <WifiOff className="w-3.5 h-3.5" />
                    <span>Offline</span>
                </div>
            )}
            {isOnline && (
                <div className="flex items-center gap-1.5 text-zinc-400">
                    <Wifi className="w-3.5 h-3.5" />
                </div>
            )}
        </div>
    );
}
