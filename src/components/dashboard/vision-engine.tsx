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

    const debounceRef = useRef<{ id: string; startTime: number } | null>(null);
    const lastFiredRef = useRef<{ id: string; time: number } | null>(null);

    const {
        sessionId,
        setVisionStatus,
        setHandDetected,
        recordGesture
    } = useSessionStore();

    useEffect(() => {
        if (!sessionId) {
            return;
        }

        // 1. Initialize Worker
        workerRef.current = new Worker(
            new URL("@/lib/mediapipe/vision-worker.ts", import.meta.url)
        );

        workerRef.current.onmessage = (event) => {
            const { hasHands, gesture, confidence, error } = event.data;

            if (error) {
                setVisionStatus("error");
                return;
            }

            // Prevent spamming state if unchanged
            if (hasHands !== useSessionStore.getState().isHandDetected) {
                setHandDetected(hasHands);
            }
            if (useSessionStore.getState().visionStatus !== "ready") {
                setVisionStatus("ready");
            }

            if (gesture && confidence > 0.85) {
                const gestureId = gesture as GestureId;
                const now = Date.now();

                if (debounceRef.current?.id === gestureId) {
                    // Gesture has been held consistently
                    if (now - debounceRef.current.startTime > 1500) {
                        // Don't repeatedly fire the same gesture endlessly; enforce a 5-second cooldown 
                        if (
                            lastFiredRef.current?.id !== gestureId ||
                            now - lastFiredRef.current.time > 5000
                        ) {
                            const result = GESTURE_RESULTS.find((g) => g.id === gestureId);

                            if (result) {
                                recordGesture({
                                    gestureId,
                                    emoji: result.emoji || "✋",
                                    color: result.color,
                                    dotColor: result.dotColor,
                                    confidence: confidence,
                                    timestamp: now,
                                });
                                lastFiredRef.current = { id: gestureId, time: now };
                            }
                        }
                    }
                } else {
                    // Start tracking a new gesture
                    debounceRef.current = { id: gestureId, startTime: now };
                }
            } else {
                // Break the debounce tracking if hand drops or gesture is lost
                debounceRef.current = null;
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

        const videoElement = videoRef.current;

        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
            if (workerRef.current) {
                workerRef.current.terminate();
            }

            if (videoElement?.srcObject) {
                const stream = videoElement.srcObject as MediaStream;
                stream.getTracks().forEach((track) => track.stop());
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
