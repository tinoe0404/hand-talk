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
    emergencyStage: number; // 0 (none), 1, 2, 3

    // Actions
    startSession: (data: { sessionId: string; patientRef: string; radiographerId: string; isFirstDay: boolean; isLastDay: boolean }) => void;
    endSession: () => void;
    setInstruction: (id: string) => void;
    triggerEmergency: () => void;
    setEmergencyStage: (stage: number) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
    sessionId: null,
    patientRef: null,
    radiographerId: null,
    isFirstDay: false,
    isLastDay: false,
    currentInstructionId: null,
    isEmergency: false,
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
        currentInstructionId: null,
        isEmergency: false,
        emergencyStage: 0
    }),

    setInstruction: (id) => set({ currentInstructionId: id }),

    triggerEmergency: () => set({ isEmergency: true, emergencyStage: 1 }),

    setEmergencyStage: (stage) => set({ emergencyStage: stage }),
}));
