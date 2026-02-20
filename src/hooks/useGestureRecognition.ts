import { useRef } from "react";
import { useSessionStore } from "@/store/useSessionStore";
import { ClinicalGesture } from "@/lib/mediapipe/gesture-classifier";

/**
 * CLINICAL GESTURE RECOGNITION HOOK
 * - Implements temporal debouncing for medical-grade input reliability.
 * - Logic: A gesture must be held for 300ms to be recognized.
 */
export function useGestureRecognition() {
    const { setLastGesture } = useSessionStore();
    const gestureBuffer = useRef<{ type: ClinicalGesture | null; count: number }>({ type: null, count: 0 });
    const DEBOUNCE_THRESHOLD = 15; // @60FPS, this is ~250-300ms

    const processRawGesture = (gesture: ClinicalGesture | null) => {
        if (gesture === gestureBuffer.current.type) {
            gestureBuffer.current.count++;
        } else {
            gestureBuffer.current.type = gesture;
            gestureBuffer.current.count = 1;
        }

        // Trigger update if threshold is met
        if (gestureBuffer.current.count === DEBOUNCE_THRESHOLD) {
            setLastGesture(gestureBuffer.current.type);
        }

        // If gesture is lost (null), we reset the last gesture immediately for safety
        if (gesture === null && gestureBuffer.current.count > 5) {
            setLastGesture(null);
            gestureBuffer.current.count = 0;
        }
    };

    return { processRawGesture };
}
