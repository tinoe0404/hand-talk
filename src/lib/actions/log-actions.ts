"use server";

import { prisma } from "@/lib/prisma";

/**
 * CLINICAL AUDIT ACTIONS
 * - Handles persistent recording of session events.
 * - Ensures all medical data is saved to the local database.
 */

export async function logInstructionChange(sessionId: string, instructionId: string, durationMs: number | null = null) {
    try {
        await prisma.$transaction([
            prisma.instructionLog.create({
                data: {
                    sessionId,
                    instructionId,
                    durationMs
                }
            }),
            prisma.session.update({
                where: { id: sessionId },
                data: {
                    lastInstructionId: instructionId,
                    lastInstructionAt: new Date()
                }
            })
        ]);
    } catch (error) {
        console.error("FAILED TO LOG INSTRUCTION CHANGE:", error);
    }
}

export async function logGestureEvent(sessionId: string, gestureType: string, confidence: number) {
    try {
        await prisma.gestureLog.create({
            data: {
                sessionId,
                gestureType,
                confidence
            }
        });
    } catch (error) {
        console.error("FAILED TO LOG GESTURE EVENT:", error);
    }
}

interface EmergencyLogData {
    sessionId: string;
    stage: number;
    triageSelection?: string;
    reason?: string;
    location?: string;
    subReason?: string;
}

export async function logEmergencyEvent(data: EmergencyLogData) {
    try {
        await prisma.emergencyLog.create({
            data: {
                sessionId: data.sessionId,
                stage: data.stage,
                triageSelection: data.triageSelection,
                reason: data.reason,
                location: data.location,
                subReason: data.subReason
            }
        });
    } catch (error) {
        console.error("FAILED TO LOG EMERGENCY EVENT:", error);
    }
}

export async function endClinicalSession(sessionId: string, status: "COMPLETED" | "INTERRUPTED") {
    try {
        await prisma.session.update({
            where: { id: sessionId },
            data: {
                endTime: new Date(),
                status,
                lastInstructionId: null,
                lastInstructionAt: null
            }
        });
    } catch (error) {
        console.error("FAILED TO END CLINICAL SESSION:", error);
    }
}
