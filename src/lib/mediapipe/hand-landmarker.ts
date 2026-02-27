import { GestureRecognizer, FilesetResolver } from "@mediapipe/tasks-vision";

/**
 * CLINICAL VISION ENGINE: GestureRecognizer Singleton
 * - Optimized for real-time generic gesture tracking in radiotherapy environments.
 * - Uses delegated execution to avoid blocking the UI thread.
 */
export class GestureRecognizerService {
    private static instance: GestureRecognizer | null = null;

    static async getInstance(): Promise<GestureRecognizer> {
        if (this.instance) {
            return this.instance;
        }

        const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        this.instance = await GestureRecognizer.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath: `https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task`,
                delegate: "GPU"
            },
            runningMode: "VIDEO",
            numHands: 1
        });

        return this.instance;
    }
}
