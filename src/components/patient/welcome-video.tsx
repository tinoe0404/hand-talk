"use client";

import React, { useRef, useEffect } from "react";
import { useSessionStore } from "@/store/useSessionStore";

export function WelcomeVideo() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const { setHasSeenWelcomeVideo } = useSessionStore();

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleEnded = () => {
            setHasSeenWelcomeVideo(true);
        };

        video.addEventListener('ended', handleEnded);
        return () => {
            video.removeEventListener('ended', handleEnded);
        };
    }, [setHasSeenWelcomeVideo]);

    return (
        <div className="fixed inset-0 z-40 bg-black flex items-center justify-center">
            <video
                ref={videoRef}
                src="/videos/first-day-welcome.mp4"
                autoPlay
                playsInline
                className="w-full h-full object-cover"
            />
        </div>
    );
}
