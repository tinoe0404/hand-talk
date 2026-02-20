"use client";

import React, { useEffect, useRef, useState } from "react";

import { useSessionStore } from "@/store/useSessionStore";
import { Activity } from "lucide-react";
import { useGestureRecognition } from "@/hooks/useGestureRecognition";

/**
 * CLINICAL CAMERA FEED
 * - Manages patient camera lifecycle.
 * - Streams frames to the Vision Worker.
 * - Minimal UI footprint to avoid patient distraction.
 */
export function CameraFeed() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const workerRef = useRef<Worker | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const { setHandDetected, setVisionStatus, visionStatus } = useSessionStore();
    const { processRawGesture } = useGestureRecognition();

    useEffect(() => {
        // Initialize Vision Worker
        setVisionStatus('loading');
        workerRef.current = new Worker(new URL("../../lib/mediapipe/vision-worker.ts", import.meta.url));

        workerRef.current.onmessage = (e) => {
            if (e.data.error) {
                setVisionStatus('error');
            } else {
                setVisionStatus('ready');
                setHandDetected(e.data.hasHands);
                processRawGesture(e.data.gesture);
            }
        };

        // Initialize Camera
        async function startCamera() {
            try {
                const s = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 640 },
                        height: { ideal: 480 },
                        facingMode: "user"
                    },
                    audio: false
                });
                setStream(s);
                if (videoRef.current) {
                    videoRef.current.srcObject = s;
                }
            } catch (err) {
                console.error("Clinical Camera Access Denied:", err);
                setVisionStatus('error');
            }
        }

        startCamera();

        return () => {
            stream?.getTracks().forEach(track => track.stop());
            workerRef.current?.terminate();
        };
    }, [setHandDetected, setVisionStatus, stream, processRawGesture]);

    // Frame processing loop
    useEffect(() => {
        let animationId: number;

        const processFrame = () => {
            if (videoRef.current && videoRef.current.readyState === 4 && workerRef.current) {
                // For high performance, we draw to a hidden OffscreenCanvas or send ImageBitmap
                // Using createImageBitmap for modern browser support and zero-copy transfer
                createImageBitmap(videoRef.current).then(imageBitmap => {
                    workerRef.current?.postMessage({
                        image: imageBitmap,
                        timestamp: performance.now()
                    }, [imageBitmap]); // Transferable
                });
            }
            animationId = requestAnimationFrame(processFrame);
        };

        if (stream) {
            processFrame();
        }

        return () => cancelAnimationFrame(animationId);
    }, [stream]);

    return (
        <div className="fixed bottom-8 right-8 z-40">
            <div className="relative group">
                {/* Hidden processing video */}
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="hidden"
                />

                {/* System Health Indicator */}
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 bg-black/50 backdrop-blur-sm transition-all duration-500 ${visionStatus === 'ready' ? 'border-medical-green-500/50' : 'border-zinc-700/50'
                    }`}>
                    <Activity className={`w-4 h-4 ${visionStatus === 'ready' ? 'text-medical-green-500 animate-pulse' : 'text-zinc-500'
                        }`} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">
                        Vision {visionStatus}
                    </span>
                </div>

                {/* Visual Alert Grid Placeholder (Phase 13) */}
            </div>
        </div>
    );
}
