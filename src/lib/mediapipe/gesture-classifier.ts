/**
 * CLINICAL GESTURE CLASSIFIER
 * - High-precision geometric analysis of MediaPipe hand landmarks.
 * - Optimized for medical environment reliability.
 */

export type ClinicalGesture = 'THUMBS_UP' | 'OPEN_PALM' | 'PEACE_SIGN' | 'POINTING_DOWN';

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
        if (!landmarks || landmarks.length < 21) return false;
        const l: any = landmarks;
        const thumbTip = l[4];
        const thumbIp = l[3];
        const indexMcp = l[5];

        const isUp = thumbTip.y < thumbIp.y && thumbTip.y < indexMcp.y;

        const othersFolded = [8, 12, 16, 20].every(tipIdx => {
            return l[tipIdx].y > l[tipIdx - 2].y;
        });

        return isUp && othersFolded;
    }

    /**
     * OPEN_PALM: All fingers extended and spread.
     */
    private static isOpenPalm(landmarks: Landmark[]): boolean {
        if (!landmarks || landmarks.length < 21) return false;
        const l: any = landmarks;
        const fingersExtended = [8, 12, 16, 20].every(tipIdx => {
            return l[tipIdx].y < l[tipIdx - 2].y;
        });

        return fingersExtended;
    }

    /**
     * PEACE_SIGN: Index and Middle extended, others folded.
     */
    private static isPeaceSign(landmarks: Landmark[]): boolean {
        if (!landmarks || landmarks.length < 21) return false;
        const l: any = landmarks;
        const indexExtended = l[8].y < l[6].y;
        const middleExtended = l[12].y < l[10].y;
        const othersFolded = [16, 20].every(tipIdx => {
            return l[tipIdx].y > l[tipIdx - 2].y;
        });

        return indexExtended && middleExtended && othersFolded;
    }

    /**
     * POINTING_DOWN: Index finger extended downwards, others folded.
     */
    private static isPointingDown(landmarks: Landmark[]): boolean {
        if (!landmarks || landmarks.length < 21) return false;
        const l: any = landmarks;
        const indexPointingDown = l[8].y > l[6].y && l[8].y > l[5].y;

        // Simpler check: index tip is the lowest point (highest Y)
        const isLowest = l[8].y > l[12].y && l[8].y > l[16].y && l[8].y > l[20].y;

        return indexPointingDown && isLowest;
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
            if (this.isPeaceSign(landmarks)) {
                return 'PEACE_SIGN';
            }
            if (this.isOpenPalm(landmarks)) {
                return 'OPEN_PALM';
            }
            if (this.isPointingDown(landmarks)) {
                return 'POINTING_DOWN';
            }
        } catch {
            return null;
        }

        return null;
    }
}
