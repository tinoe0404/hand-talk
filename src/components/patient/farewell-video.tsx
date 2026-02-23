"use client";

import React, { useRef, useEffect } from "react";
import { useSessionStore } from "@/store/useSessionStore";

export function FarewellVideo() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const { endSession } = useSessionStore();

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleEnded = () => {
            endSession(); // End session after farewell video finishes
        };

        video.addEventListener('ended', handleEnded);
        return () => {
            video.removeEventListener('ended', handleEnded);
        };
    }, [endSession]);

    return (
        <div className="fixed inset-0 z-40 bg-black flex items-center justify-center">
            <video
                ref={videoRef}
                src="/videos/last-day-farewell.mp4"
                autoPlay
                playsInline
                className="w-full h-full object-cover"
            />
        </div>
    );
}
