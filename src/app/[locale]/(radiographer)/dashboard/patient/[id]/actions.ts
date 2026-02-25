"use server";

import { prisma } from "@/lib/prisma";

export async function getPatientWithSessions(patientId: string) {
    try {
        const patient = await prisma.patient.findUnique({
            where: { id: patientId },
            include: {
                sessions: {
                    orderBy: { createdAt: "desc" },
                    include: {
                        instructionLogs: true,
                    },
                },
            },
        });
        return patient;
    } catch (error) {
        console.error("Failed to fetch patient:", error);
        return null;
    }
}

export async function resumeSession(sessionId: string) {
    try {
        const session = await prisma.session.findUnique({
            where: { id: sessionId },
            include: {
                patient: true,
                radiographer: true,
            }
        });

        if (!session) {
            return null;
        }

        return {
            success: true,
            data: session
        };
    } catch (error) {
        console.error("Failed to resume session:", error);
        return { success: false, error: "Failed to resume session" };
    }
}
