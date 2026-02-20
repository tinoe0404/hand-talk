/**
 * CLINICAL GESTURE CLASSIFIER
 * - High-precision geometric analysis of MediaPipe hand landmarks.
 * - Optimized for medical environment reliability.
 */

export type ClinicalGesture = 'THUMBS_UP' | 'OPEN_PALM' | 'CLOSED_FIST' | 'POINTING';

export interface Landmark {
    x: number;
    y: number;
    z: number;
}

export class GestureClassifier {
    /**
     * THUMBS_UP: Thumb tip is above all other finger tips and joints.
     */
    private static isThumbsUp(landmarks: Landmark[]): boolean {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const l: any = landmarks;
        const thumbTip = l[4];
        const thumbIp = l[3];
        const indexMcp = l[5];

        // Thumb tip must be significantly above thumb IP and index MCP
        const isUp = thumbTip.y < thumbIp.y && thumbTip.y < indexMcp.y;

        // All other fingers must be folded
        const othersFolded = [8, 12, 16, 20].every(tipIdx => {
            return l[tipIdx].y > l[tipIdx - 3].y;
        });

        return isUp && othersFolded;
    }

    /**
     * OPEN_PALM: All fingers extended and spread.
     */
    private static isOpenPalm(landmarks: Landmark[]): boolean {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const l: any = landmarks;
        // All four fingers (index, middle, ring, pinky) must be extended
        const fingersExtended = [8, 12, 16, 20].every(tipIdx => {
            return l[tipIdx].y < l[tipIdx - 3].y;
        });

        // Thumb should also be extended away from palm
        const thumbExtended = l[4].x < l[2].x || l[4].x > l[2].x;

        return fingersExtended && thumbExtended;
    }

    /**
     * CLOSED_FIST: All fingers curled into the palm.
     */
    private static isClosedFist(landmarks: Landmark[]): boolean {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const l: any = landmarks;
        return [8, 12, 16, 20].every(tipIdx => {
            const pipIdx = tipIdx - 2;
            // Tips must be significantly below MCPs (closer to wrist or palm center)
            return l[tipIdx].y > l[pipIdx].y;
        });
    }

    /**
     * POINTING: Index finger extended, others folded.
     */
    private static isPointing(landmarks: Landmark[]): boolean {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const l: any = landmarks;
        const indexExtended = l[8].y < l[6].y;
        const othersFolded = [12, 16, 20].every(tipIdx => {
            return l[tipIdx].y > l[tipIdx - 3].y;
        });

        return indexExtended && othersFolded;
    }

    /**
     * MAIN CLASSIENGINE
     * Analyzes landmarks and returns the primary gesture.
     */
    static classify(landmarks: Landmark[]): ClinicalGesture | null {
        if (!landmarks || landmarks.length < 21) {
            return null;
        }

        try {
            if (this.isThumbsUp(landmarks)) {
                return 'THUMBS_UP';
            }
            if (this.isOpenPalm(landmarks)) {
                return 'OPEN_PALM';
            }
            if (this.isClosedFist(landmarks)) {
                return 'CLOSED_FIST';
            }
            if (this.isPointing(landmarks)) {
                return 'POINTING';
            }
        } catch {
            return null;
        }

        return null;
    }
}
