import { useEffect, useRef } from "react";
import { useSessionStore } from "@/store/useSessionStore";

/**
 * CLINICAL EMERGENCY BRIDGE
 * - Monitors the recognized gesture for safety-critical distress signals.
 * - Automates system-wide halt if an emergency gesture is held for >1.5 seconds.
 */
export function useEmergencyBridge() {
    const { lastGesture, triggerEmergency, isEmergency } = useSessionStore();
    const distressTimer = useRef<NodeJS.Timeout | null>(null);
    const THRESHOLD_MS = 1500; // Medical-grade certainty threshold

    useEffect(() => {
        // If already in emergency or no gesture is active, reset timer
        if (isEmergency || !lastGesture) {
            if (distressTimer.current) {
                clearTimeout(distressTimer.current);
                distressTimer.current = null;
            }
            return;
        }

        // Check for distress gestures (STOP or PAIN)
        const isDistress = lastGesture.gestureId === 'open-palm' || lastGesture.gestureId === 'peace-sign';

        if (isDistress) {
            // Start or continue the distress timer
            if (!distressTimer.current) {
                distressTimer.current = setTimeout(() => {
                    triggerEmergency();
                }, THRESHOLD_MS);
            }
        } else {
            // Reset if gesture changes to something non-distress
            if (distressTimer.current) {
                clearTimeout(distressTimer.current);
                distressTimer.current = null;
            }
        }

        return () => {
            if (distressTimer.current) {
                clearTimeout(distressTimer.current);
            }
        };
    }, [lastGesture, isEmergency, triggerEmergency]);
}
