"use client";

import React, { useRef, useEffect, useState } from "react";
import { Loader2, AlertTriangle, RefreshCw } from "lucide-react";

interface VideoPlayerProps {
    src: string;
    autoPlay?: boolean;
    loop?: boolean;
    /** Called each time the video completes one playback */
    onEnded?: () => void;
    className?: string;
}

/**
 * VideoPlayer — handles loading, error, and fallback states for clinical videos.
 * 
 * States:
 *  - LOADING:  spinner overlay while video loads
 *  - PLAYING:  video is playing normally
 *  - ERROR:    video failed to load — shows fallback UI with retry
 */
export function VideoPlayer({
    src,
    autoPlay = true,
    loop = true,
    onEnded,
    className = "",
}: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [status, setStatus] = useState<"loading" | "playing" | "error">("loading");

    // Reset status when source changes
    useEffect(() => {
        setStatus("loading");
        const vid = videoRef.current;
        if (!vid) {
            return;
        }
        vid.load();
        if (autoPlay) {
            vid.play().catch(() => {
                /* autoplay may be blocked — user interaction needed */
            });
        }
    }, [src, autoPlay]);

    const handleCanPlay = () => {
        setStatus("playing");
    };

    const handleError = () => {
        setStatus("error");
    };

    const handleRetry = () => {
        setStatus("loading");
        const vid = videoRef.current;
        if (vid) {
            vid.load();
            vid.play().catch(() => { });
        }
    };

    return (
        <div className={`relative bg-black ${className}`}>
            {/* Video element — always mounted so ref stays valid */}
            <video
                ref={videoRef}
                src={src}
                autoPlay={autoPlay}
                loop={loop}
                muted
                playsInline
                onCanPlay={handleCanPlay}
                onError={handleError}
                onEnded={onEnded}
                className={`w-full h-full object-contain transition-opacity duration-300 ${status === "playing" ? "opacity-100" : "opacity-0"
                    }`}
            />

            {/* Loading overlay */}
            {status === "loading" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10">
                    <Loader2 className="w-12 h-12 text-medical-green-400 animate-spin mb-3" />
                    <p className="text-white/70 text-sm font-bold uppercase tracking-widest">
                        Loading video...
                    </p>
                </div>
            )}

            {/* Error fallback */}
            {status === "error" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 z-10 px-6">
                    <div className="bg-red-500/10 border-2 border-red-500/30 rounded-3xl p-8 flex flex-col items-center gap-4 max-w-sm">
                        <AlertTriangle className="w-14 h-14 text-red-400" />
                        <p className="text-white font-bold text-center text-lg leading-tight">
                            Unable to load this instruction video
                        </p>
                        <p className="text-zinc-400 text-sm text-center">
                            Please check video configuration or try again.
                        </p>
                        <button
                            onClick={handleRetry}
                            className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-bold text-sm transition-all active:scale-95"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Retry
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
