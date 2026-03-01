/* eslint-disable no-console */
"use client";

import React, { useRef, useEffect } from "react";
import { useSessionStore } from "@/store/useSessionStore";

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
        processVisionResult
    } = useSessionStore();

    useEffect(() => {
        if (!sessionId) {
            console.log("Clinical Vision: No active session, engine paused.");
            return;
        }

        console.log("Clinical Vision: Initializing engine for session:", sessionId);

        // 1. Initialize Worker (Using relative path for better local resolution)
        try {
            workerRef.current = new Worker(
                new URL("../../lib/mediapipe/vision-worker.ts", import.meta.url)
            );
            console.log("Clinical Vision: Worker thread spawned.");
        } catch (workerError) {
            console.error("Clinical Vision: Failed to spawn worker:", workerError);
            setVisionStatus("error");
            return;
        }

        workerRef.current.onmessage = (event) => {
            const { hasHands, gesture, confidence, error, debug } = event.data;

            if (debug) {
                console.log("Vision Worker Debug:", debug);
            }

            if (error) {
                console.error("Clinical Vision: Worker reported error:", error);
                setVisionStatus("error");
                return;
            }

            // Prevent spamming state if unchanged
            if (hasHands !== useSessionStore.getState().isHandDetected) {
                setHandDetected(hasHands);
            }
            if (useSessionStore.getState().visionStatus !== "ready") {
                console.log("Clinical Vision: Received first frame, system READY.");
                setVisionStatus("ready");
            }

            // Log gesture if detected
            if (gesture) {
                console.log(`Clinical Vision: Candidate [${gesture}] (confidence: ${(confidence * 100).toFixed(1)}%)`);
            }

            // Centralized Store Logic handles the 1.5s clinical debounce
            processVisionResult(gesture, confidence);
        };

        // 2. Initialize Camera
        const startCamera = async () => {
            console.log("Clinical Vision: Requesting camera access...");
            try {
                // Ensure audio is explicitly false to avoid Safari panics
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
                    console.log("Clinical Vision: Camera stream active.");

                    // Force play in case autoPlay is blocked by iOS
                    videoRef.current.play().catch(playErr => {
                        console.warn("Clinical Vision: Auto-play blocked by iOS, requires tap:", playErr);
                        // Safari hack: if it fails, try playing again immediately
                        setTimeout(() => {
                            videoRef.current?.play().catch(e => console.error("Retry failed:", e));
                        }, 500);
                    });
                }
            } catch (err) {
                console.error("Clinical Vision: Camera access denied or hardware error:", err);
                // Important: On iOS, this happens if the page isn't served over HTTPS,
                // or if the user denied permission.
                setVisionStatus("error");
            }
        };

        startCamera();

        // 3. Frame Loop
        const processFrame = () => {
            // Mobile Safari safely needs readyState >= 2 (HAVE_CURRENT_DATA)
            if (videoRef.current && workerRef.current && videoRef.current.readyState >= 2) {
                createImageBitmap(videoRef.current).then(image => {
                    workerRef.current?.postMessage({
                        image,
                        timestamp: performance.now()
                    }, [image]);
                }).catch((err) => {
                    console.error("Clinical Vision: Frame capture error:", err);
                });
            }
            requestRef.current = requestAnimationFrame(processFrame);
        };

        // Delay starting the frame loop slightly to allow camera to warm up
        setTimeout(() => {
            requestRef.current = requestAnimationFrame(processFrame);
        }, 1000);

        const videoElement = videoRef.current;

        return () => {
            console.log("Clinical Vision: Shutting down engine.");
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
    }, [sessionId, setVisionStatus, setHandDetected, processVisionResult]);

    return (
        <div className="fixed top-0 left-0 w-1 h-1 opacity-0 pointer-events-none -z-50" aria-hidden="true">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                width={640}
                height={480}
            />
        </div>
    );
}
