"use client";

import React, { useRef, useEffect } from "react";
import { useSessionStore } from "@/store/useSessionStore";
import { GESTURE_RESULTS, GestureId } from "@/lib/constants/instructions";

/**
 * VisionEngine — Handles camera access and MediaPipe gesture detection.
 * It runs in the background of the RadioControls (bottom panel).
 * Results are posted to useSessionStore to update the UI across both panels.
 */
export function VisionEngine() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const workerRef = useRef<Worker | null>(null);
    const requestRef = useRef<number>();

    const {
        sessionId,
        setVisionStatus,
        setHandDetected,
        recordGesture
    } = useSessionStore();

    useEffect(() => {
        if (!sessionId) return;

        // 1. Initialize Worker
        workerRef.current = new Worker(
            new URL("@/lib/mediapipe/vision-worker.ts", import.meta.url)
        );

        workerRef.current.onmessage = (event) => {
            const { hasHands, gesture, error } = event.data;

            if (error) {
                setVisionStatus("error");
                return;
            }

            setHandDetected(hasHands);
            setVisionStatus("ready");

            if (gesture) {
                // Map slug GESTURE_CLASSIFIER output to GESTURE_RESULTS
                // Mediapipe worker returns: 'THUMBS_UP' | 'OPEN_PALM' | 'PEACE_SIGN' | 'POINTING_DOWN'
                const gestureId = gesture.toLowerCase().replace('_', '-') as GestureId;
                const result = GESTURE_RESULTS.find(g => g.id === gestureId);

                if (result) {
                    recordGesture({
                        gestureId,
                        emoji: result.emoji,
                        label: result.label,
                        color: result.color,
                        dotColor: result.dotColor,
                        confidence: 0.95,
                        timestamp: Date.now()
                    });
                }
            }
        };

        // 2. Initialize Camera
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: "user",
                        width: { ideal: 640 },
                        height: { ideal: 480 },
                        frameRate: { ideal: 30 }
                    },
                    audio: false,
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    setVisionStatus("loading");
                }
            } catch (err) {
                console.error("Clinical Vision: Camera access denied:", err);
                setVisionStatus("error");
            }
        };

        startCamera();

        // 3. Frame Loop
        const processFrame = () => {
            if (videoRef.current && workerRef.current && videoRef.current.readyState === 4) {
                createImageBitmap(videoRef.current).then(image => {
                    workerRef.current?.postMessage({
                        image,
                        timestamp: performance.now()
                    }, [image]);
                }).catch(() => { });
            }
            requestRef.current = requestAnimationFrame(processFrame);
        };

        requestRef.current = requestAnimationFrame(processFrame);

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            workerRef.current?.terminate();
            if (videoRef.current?.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [sessionId, setVisionStatus, setHandDetected, recordGesture]);

    return (
        <div className="hidden pointer-events-none" aria-hidden="true">
            <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                width={640}
                height={480}
            />
        </div>
    );
}
