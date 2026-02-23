import { HandLandmarkerService } from "./hand-landmarker";
import { GestureClassifier, ClinicalGesture } from "./gesture-classifier";

/**
 * CLINICAL VISION WORKER
 * - Operates in a separate thread to ensure 60FPS patient instruction playback.
 * - Processes raw landmarks into Clinical Gestures.
 */

self.onmessage = async (event: MessageEvent) => {
    const { image, timestamp } = event.data;

    try {
        const handLandmarker = await HandLandmarkerService.getInstance();
        const results = handLandmarker.detectForVideo(image, timestamp);

        const detectedGestures: (ClinicalGesture | null)[] = results.landmarks.map(landmarks => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return GestureClassifier.classify(landmarks as any);
        });

        // We prioritize the most "urgent" gesture (PEACE_SIGN = PAIN)
        let primaryGesture: ClinicalGesture | null = null;
        if (detectedGestures.includes('PEACE_SIGN')) {
            primaryGesture = 'PEACE_SIGN';
        } else if (detectedGestures.includes('OPEN_PALM')) {
            primaryGesture = 'OPEN_PALM';
        } else {
            primaryGesture = detectedGestures[0] || null;
        }

        // Post detailed results back to main thread
        self.postMessage({
            landmarks: results.landmarks,
            hasHands: results.landmarks.length > 0,
            gesture: primaryGesture,
            timestamp
        });

        // Close image to prevent memory leaks
        if (image instanceof ImageBitmap) {
            image.close();
        }
    } catch (error) {
        console.error("Clinical Vision Worker Error:", error);
        self.postMessage({ error: "DETECTION_FAILED" });
    }
};
