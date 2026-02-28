import { GestureRecognizerService } from "./hand-landmarker";

/**
 * CLINICAL VISION WORKER
 * - Operates in a separate thread to ensure 60FPS patient instruction playback.
 * - Extracts native MediaPipe gestures and emits if confidence > 85%.
 */

self.onmessage = async (event: MessageEvent) => {
    const { image, timestamp } = event.data;

    try {
        const recognizer = await GestureRecognizerService.getInstance();
        const results = recognizer.recognizeForVideo(image, timestamp);

        let primaryGesture: string | null = null;
        let maxConfidence: number = 0;

        if (results.gestures && results.gestures.length > 0) {
            // MediaPipe returns an array of categories for each detected hand.
            const handGestures = results.gestures[0] || [];
            for (const gesture of handGestures) {
                // Lowered threshold to 0.7 for better local testing responsiveness
                if (gesture.categoryName !== 'None' && gesture.score > 0.70 && gesture.score > maxConfidence) {
                    primaryGesture = gesture.categoryName;
                    maxConfidence = gesture.score;
                }
            }
        }

        // Post detailed results back to main thread
        self.postMessage({
            landmarks: results.landmarks || [],
            hasHands: !!(results.landmarks && results.landmarks.length > 0),
            gesture: primaryGesture,
            confidence: maxConfidence,
            timestamp
        });

        // Close image to prevent memory leaks
        if (image instanceof ImageBitmap) {
            image.close();
        }
    } catch (error) {
        console.error("Clinical Vision Worker Error:", error);
        self.postMessage({ error: error instanceof Error ? error.message : "DETECTION_FAILED" });
    }
};
