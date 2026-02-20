import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

/**
 * CLINICAL VISION ENGINE: HandLandmarker Singleton
 * - Optimized for real-time hand tracking in radiotherapy environments.
 * - Uses delegated execution to avoid blocking the UI thread.
 */
export class HandLandmarkerService {
    private static instance: HandLandmarker | null = null;

    static async getInstance(): Promise<HandLandmarker> {
        if (this.instance) {
            return this.instance;
        }

        const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        this.instance = await HandLandmarker.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
                delegate: "GPU"
            },
            runningMode: "VIDEO",
            numHands: 2,
            minHandDetectionConfidence: 0.7,
            minHandPresenceConfidence: 0.7,
            minTrackingConfidence: 0.7
        });

        return this.instance;
    }
}
