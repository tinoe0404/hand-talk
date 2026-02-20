import { HandLandmarkerService } from "./hand-landmarker";

/**
 * CLINICAL VISION WORKER
 * - Operates in a separate thread to ensure 60FPS patient instruction playback.
 * - Receives VideoFrames or ImageBitmaps from the main thread.
 * - Posts back landmark results and detection status.
 */

self.onmessage = async (event: MessageEvent) => {
    const { image, timestamp } = event.data;

    try {
        const handLandmarker = await HandLandmarkerService.getInstance();
        const results = handLandmarker.detectForVideo(image, timestamp);

        // Post results back to main thread
        self.postMessage({
            landmarks: results.landmarks,
            worldLandmarks: results.worldLandmarks,
            handedness: results.handedness,
            hasHands: results.landmarks.length > 0
        });

        // If it was a VideoFrame, we should close it to prevent memory leaks in clinical sessions
        if (image instanceof VideoFrame) {
            image.close();
        }
    } catch (error) {
        console.error("Clinical Vision Worker Error:", error);
        self.postMessage({ error: "DETECTION_FAILED" });
    }
};
