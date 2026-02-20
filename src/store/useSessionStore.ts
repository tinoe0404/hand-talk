import { create } from 'zustand';

/**
 * Session State Store
 * Manages the real-time radiotherapy session state.
 * Clinical justification: Ensures consistent state between radiographer controls 
 * and patient display, and facilitates automatic auditing.
 */
interface SessionState {
    sessionId: string | null;
    patientRef: string | null;
    radiographerId: string | null;
    isFirstDay: boolean;
    isLastDay: boolean;
    currentInstructionId: string | null;
    isEmergency: boolean;
    isHandDetected: boolean;
    visionStatus: 'idle' | 'loading' | 'ready' | 'error';
    emergencyStage: number; // 0 (none), 1, 2, 3

    // Actions
    startSession: (data: { sessionId: string; patientRef: string; radiographerId: string; isFirstDay: boolean; isLastDay: boolean }) => void;
    endSession: () => void;
    setInstruction: (id: string) => void;
    stopInstruction: () => void;
    setHandDetected: (detected: boolean) => void;
    setVisionStatus: (status: 'idle' | 'loading' | 'ready' | 'error') => void;
    triggerEmergency: () => void;
    setEmergencyStage: (stage: number) => void;
    reset: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
    sessionId: null,
    patientRef: null,
    radiographerId: null,
    isFirstDay: false,
    isLastDay: false,
    currentInstructionId: null,
    isEmergency: false,
    isHandDetected: false,
    visionStatus: 'idle',
    emergencyStage: 0,

    startSession: (data) => set({
        ...data,
        currentInstructionId: null,
        isEmergency: false,
        emergencyStage: 0
    }),

    endSession: () => set({
        sessionId: null,
        patientRef: null,
        radiographerId: null,
        currentInstructionId: null,
        isEmergency: false,
        emergencyStage: 0
    }),

    setInstruction: (id) => set({ currentInstructionId: id }),
    stopInstruction: () => set({ currentInstructionId: null }),

    setHandDetected: (detected: boolean) => set({ isHandDetected: detected }),
    setVisionStatus: (status: 'idle' | 'loading' | 'ready' | 'error') => set({ visionStatus: status }),

    triggerEmergency: () => set({ isEmergency: true, emergencyStage: 1, currentInstructionId: null }),

    setEmergencyStage: (stage) => set({ emergencyStage: stage }),

    reset: () => set({
        sessionId: null,
        patientRef: null,
        radiographerId: null,
        currentInstructionId: null,
        isEmergency: false,
        emergencyStage: 0,
        isHandDetected: false,
        visionStatus: 'idle'
    }),
}));
