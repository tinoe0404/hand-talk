/* eslint-disable no-console */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { logInstructionChange, logEmergencyEvent, endClinicalSession } from '@/lib/actions/log-actions';
import { GESTURE_RESULTS, type GestureId } from '@/lib/constants/instructions';

/**
 * Display mode controls what the TOP (patient-facing) panel shows.
 * Everything happens on one screen; the radiographer holds the phone
 * and tilts it toward the patient as needed.
 */
export type DisplayMode =
    | 'idle'          // No session — show logo/ready state
    | 'gesture-guide' // 4-card gesture guide shown to patient at session start
    | 'instruction'   // Active instruction: large text + icon + video
    | 'welcome'       // First-day welcome video plays in full
    | 'farewell'      // Last-day farewell video plays in full
    | 'emergency';    // Red screen "TREATMENT HALTED"

export interface GestureResult {
    gestureId: GestureId;
    emoji: string;
    color: string;
    dotColor: string;
    confidence: number;
    timestamp: number;
}

interface SessionState {
    // ── Session meta ──────────────────────────────────────────
    sessionId: string | null;
    patientRef: string | null;
    radiographerId: string | null;
    isFirstDay: boolean;
    isLastDay: boolean;

    // ── Display state (drives the TOP panel) ─────────────────
    displayMode: DisplayMode;
    currentInstructionId: string | null;
    currentInstructionStartTime: number | null;

    // ── Emergency ─────────────────────────────────────────────
    isEmergency: boolean;
    emergencyStage: number; // 0 = none, 1 = reason, 2 = body, 3 = notes

    // ── Gesture detection ─────────────────────────────────────
    isHandDetected: boolean;
    visionStatus: 'idle' | 'loading' | 'ready' | 'error';

    // ── Debounced Gesture State ───────────────────────────────
    currentDetectedSign: string | null;
    currentSignStartTime: number | null;
    lastPatientSign: { gestureId: string; phrase: string; confidence: number; severity: string } | null;

    // ── Actions ───────────────────────────────────────────────
    startSession: (data: {
        sessionId: string;
        patientRef: string;
        radiographerId: string;
        isFirstDay: boolean;
        isLastDay: boolean;
    }) => void;
    endSession: () => void;

    setInstruction: (id: string) => void;
    stopInstruction: () => void;

    /** Radiographer taps "Continue" on gesture-guide → switch to instruction mode */
    acknowledgeGestureGuide: () => void;
    /** Called when the first-day welcome video finishes playing */
    onWelcomeVideoEnd: () => void;
    /** Called when the last-day farewell video finishes playing */
    onFarewellVideoEnd: () => void;

    triggerEmergency: () => void;
    resolveEmergency: (reason: string) => void;
    setEmergencyStage: (stage: number) => void;

    setHandDetected: (detected: boolean) => void;
    setVisionStatus: (status: 'idle' | 'loading' | 'ready' | 'error') => void;

    processVisionResult: (gestureName: string | null, confidence: number) => void;
    clearPatientSign: () => void;

    // For complete store reset
    reset: () => void;
}

const INITIAL_STATE = {
    sessionId: null,
    patientRef: null,
    radiographerId: null,
    isFirstDay: false,
    isLastDay: false,
    displayMode: 'idle' as DisplayMode,
    currentInstructionId: null,
    currentInstructionStartTime: null,
    isEmergency: false,
    emergencyStage: 0,
    isHandDetected: false,
    visionStatus: 'idle' as const,
    currentDetectedSign: null,
    currentSignStartTime: null,
    lastPatientSign: null,
};

export const useSessionStore = create<SessionState>()(
    persist(
        (set, get) => ({
            ...INITIAL_STATE,

            startSession: (data) => {
                // If first day → play welcome video, then gesture guide
                // Otherwise → show gesture guide immediately
                const displayMode: DisplayMode = data.isFirstDay ? 'welcome' : 'gesture-guide';
                set({
                    ...data,
                    displayMode,
                    currentInstructionId: null,
                    currentInstructionStartTime: null,
                    isEmergency: false,
                    emergencyStage: 0,
                });
            },

            endSession: () => {
                const { sessionId, currentInstructionId, currentInstructionStartTime } = get();
                // Log final instruction duration if one was active
                if (sessionId && currentInstructionId && currentInstructionStartTime) {
                    const durationMs = Date.now() - currentInstructionStartTime;
                    logInstructionChange(sessionId, currentInstructionId, durationMs);
                }

                if (sessionId) {
                    endClinicalSession(sessionId, 'COMPLETED');
                }
                set({ ...INITIAL_STATE });
            },

            setInstruction: (id) => {
                const { sessionId, isLastDay, currentInstructionId, currentInstructionStartTime } = get();

                if (sessionId) {
                    // If changing instructions, log the duration of the PREVIOUS one
                    if (currentInstructionId && currentInstructionStartTime) {
                        const durationMs = Date.now() - currentInstructionStartTime;
                        logInstructionChange(sessionId, currentInstructionId, durationMs);
                    }
                    // Log the start of the NEW instruction (duration will be null initially)
                    logInstructionChange(sessionId, id);
                }

                const now = Date.now();

                // Special: treatment-finished on last day triggers farewell
                if (id === 'treatment-finished' && isLastDay) {
                    set({ currentInstructionId: id, currentInstructionStartTime: now, displayMode: 'farewell' });
                } else {
                    set({ currentInstructionId: id, currentInstructionStartTime: now, displayMode: 'instruction' });
                }
            },

            stopInstruction: () => {
                const { sessionId, currentInstructionId, currentInstructionStartTime } = get();

                if (sessionId && currentInstructionId && currentInstructionStartTime) {
                    const durationMs = Date.now() - currentInstructionStartTime;
                    // Log the 'stop' event with the final calculated duration
                    logInstructionChange(sessionId, currentInstructionId, durationMs);
                }

                set({ currentInstructionId: null, currentInstructionStartTime: null, displayMode: 'instruction' });
            },
            acknowledgeGestureGuide: () =>
                set({ displayMode: 'instruction' }),

            onWelcomeVideoEnd: () =>
                set({ displayMode: 'gesture-guide' }),

            onFarewellVideoEnd: () => {
                const { sessionId } = get();
                if (sessionId) {
                    endClinicalSession(sessionId, 'COMPLETED');
                }
                set({ ...INITIAL_STATE });
            },

            triggerEmergency: () => {
                const { sessionId } = get();
                if (sessionId) {
                    logEmergencyEvent({ sessionId, stage: 1 });
                }
                set({ isEmergency: true, emergencyStage: 1, displayMode: 'emergency', currentInstructionId: null });
            },

            resolveEmergency: (reason) => {
                const { sessionId } = get();
                if (sessionId) {
                    logEmergencyEvent({ sessionId, stage: 3, reason });
                }
                set({
                    isEmergency: false,
                    emergencyStage: 0,
                    displayMode: 'instruction',
                    currentInstructionId: null,
                });
            },

            setEmergencyStage: (stage) => set({ emergencyStage: stage }),

            setHandDetected: (detected) => set({ isHandDetected: detected }),
            setVisionStatus: (status) => set({ visionStatus: status }),

            processVisionResult: (gestureName, confidence) => {
                const now = Date.now();
                const state = get();

                if (!gestureName) {
                    if (state.currentDetectedSign !== null) {
                        set({ currentDetectedSign: null, currentSignStartTime: null });
                    }
                    return;
                }

                if (gestureName !== state.currentDetectedSign) {
                    set({ currentDetectedSign: gestureName, currentSignStartTime: now });
                    return;
                }

                if (state.currentSignStartTime && now - state.currentSignStartTime >= 1500) {
                    console.log(`[STORE] Clinical Debounce Met: ${gestureName}`);
                    const gestureDetail = GESTURE_RESULTS.find((g) => g.id === gestureName);
                    if (!gestureDetail) { return; }

                    if (gestureName === 'Closed_Fist') {
                        get().triggerEmergency();
                    }

                    set({
                        lastPatientSign: {
                            gestureId: gestureDetail.id,
                            phrase: gestureDetail.meaning,
                            confidence,
                            severity: gestureDetail.severity,
                        },
                        currentDetectedSign: null,
                        currentSignStartTime: null,
                    });
                }
            },

            clearPatientSign: () => set({ lastPatientSign: null }),

            reset: () => set({ ...INITIAL_STATE }),
        }),
        {
            name: 'hand-talk-session',
            partialize: (state) => ({
                sessionId: state.sessionId,
                patientRef: state.patientRef,
                radiographerId: state.radiographerId,
                isFirstDay: state.isFirstDay,
                isLastDay: state.isLastDay,
                displayMode: state.displayMode,
                currentInstructionId: state.currentInstructionId,
                currentInstructionStartTime: state.currentInstructionStartTime,
                isEmergency: state.isEmergency,
                emergencyStage: state.emergencyStage,
            }),
        }
    )
);
