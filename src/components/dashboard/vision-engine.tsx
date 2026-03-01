/* eslint-disable no-console */
"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { useSessionStore } from "@/store/useSessionStore";
import { GestureRecognizerService } from "@/lib/mediapipe/hand-landmarker";

/**
 * VisionEngine — Handles camera access and MediaPipe gesture detection.
 *
 * PRODUCTION FIX: Runs MediaPipe GestureRecognizer on the main thread instead
 * of a Web Worker. The @mediapipe/tasks-vision WASM module uses importScripts()
 * and DOM APIs internally that are incompatible with classic Web Workers in
 * production bundlers (Vercel/Next.js). Running on the main thread with
 * throttled processing (~10fps) is the officially supported approach.
 *
 * Results are posted to useSessionStore to update the UI across both panels.
 */

/** Target ~10 frames per second for gesture detection — balances accuracy vs performance */
const DETECTION_INTERVAL_MS = 100;

/** Minimum confidence to accept a gesture (55% — debounce provides additional filtering) */
const MIN_CONFIDENCE = 0.55;

export function VisionEngine() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const requestRef = useRef<number>();
    const lastProcessTimeRef = useRef<number>(0);
    const recognizerReadyRef = useRef<boolean>(false);

    const {
        sessionId,
        setVisionStatus,
        setHandDetected,
        processVisionResult,
    } = useSessionStore();

    /**
     * Process a single video frame through MediaPipe GestureRecognizer.
     * Runs on the main thread with throttling to maintain UI responsiveness.
     */
    const processFrame = useCallback(async (video: HTMLVideoElement) => {
        try {
            const recognizer = await GestureRecognizerService.getInstance();

            if (!recognizerReadyRef.current) {
                recognizerReadyRef.current = true;
                console.log("Clinical Vision: GestureRecognizer loaded, system READY.");
                setVisionStatus("ready");
            }

            const results = recognizer.recognizeForVideo(video, performance.now());

            const hasHands = !!(results.landmarks && results.landmarks.length > 0);
            let primaryGesture: string | null = null;
            let maxConfidence = 0;

            if (results.gestures && results.gestures.length > 0) {
                const handGestures = results.gestures[0] || [];
                for (const gesture of handGestures) {
                    if (
                        gesture.categoryName !== "None" &&
                        gesture.score > MIN_CONFIDENCE &&
                        gesture.score > maxConfidence
                    ) {
                        primaryGesture = gesture.categoryName;
                        maxConfidence = gesture.score;
                    }
                }
            }

            // Update store (only if state actually changed to avoid re-renders)
            if (hasHands !== useSessionStore.getState().isHandDetected) {
                setHandDetected(hasHands);
            }

            if (primaryGesture) {
                console.log(
                    `Clinical Vision: Candidate [${primaryGesture}] (confidence: ${(maxConfidence * 100).toFixed(1)}%)`
                );
            }

            // Centralized Store Logic handles the 1.5s clinical debounce
            processVisionResult(primaryGesture, maxConfidence);
        } catch (error) {
            console.error("Clinical Vision: Detection error:", error);
            // Don't set error status for transient frame errors — only if recognizer fails to load
            if (!recognizerReadyRef.current) {
                setVisionStatus("error");
            }
        }
    }, [setVisionStatus, setHandDetected, processVisionResult]);

    useEffect(() => {
        if (!sessionId) {
            console.log("Clinical Vision: No active session, engine paused.");
            return;
        }

        console.log("Clinical Vision: Initializing engine for session:", sessionId);
        setVisionStatus("loading");

        // Pre-warm the recognizer singleton (starts WASM download)
        GestureRecognizerService.getInstance()
            .then(() => {
                console.log("Clinical Vision: GestureRecognizer pre-warmed.");
            })
            .catch((err) => {
                console.error("Clinical Vision: Failed to load GestureRecognizer:", err);
                setVisionStatus("error");
            });

        // Initialize camera
        let streamRef: MediaStream | null = null;

        const startCamera = async () => {
            console.log("Clinical Vision: Requesting camera access...");
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: "user",
                        width: { ideal: 640 },
                        height: { ideal: 480 },
                        frameRate: { ideal: 30 },
                    },
                    audio: false,
                });

                streamRef = stream;

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    console.log("Clinical Vision: Camera stream active.");

                    // Force play (required for iOS Safari)
                    videoRef.current.play().catch((playErr) => {
                        console.warn("Clinical Vision: Auto-play blocked, requires tap:", playErr);
                        setTimeout(() => {
                            videoRef.current?.play().catch((e) => console.error("Retry failed:", e));
                        }, 500);
                    });
                }
            } catch (err) {
                console.error("Clinical Vision: Camera access denied or hardware error:", err);
                setVisionStatus("error");
            }
        };

        startCamera();

        // Frame loop — throttled to ~10fps for main-thread gesture detection
        const frameLoop = () => {
            const now = performance.now();

            if (
                videoRef.current &&
                videoRef.current.readyState >= 2 &&
                now - lastProcessTimeRef.current >= DETECTION_INTERVAL_MS
            ) {
                lastProcessTimeRef.current = now;
                // Fire-and-forget — processFrame handles its own errors
                processFrame(videoRef.current);
            }

            requestRef.current = requestAnimationFrame(frameLoop);
        };

        // Delay starting to allow camera warm-up
        const videoEl = videoRef.current; // Capturing ref inside effect body

        const startTimeout = setTimeout(() => {
            requestRef.current = requestAnimationFrame(frameLoop);
        }, 1000);

        return () => {
            console.log("Clinical Vision: Shutting down engine.");
            clearTimeout(startTimeout);

            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }

            if (streamRef) {
                streamRef.getTracks().forEach((track) => track.stop());
            }

            if (videoEl?.srcObject) {
                const stream = videoEl.srcObject as MediaStream;
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [sessionId, setVisionStatus, processFrame]);

    return (
        <div
            className="fixed top-0 left-0 w-1 h-1 opacity-0 pointer-events-none -z-50"
            aria-hidden="true"
        >
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
