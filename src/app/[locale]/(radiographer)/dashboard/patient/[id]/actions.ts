"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth-utils";

export async function getPatientWithSessions(patientId: string) {
    const session = await getSession();
    if (!session) {
        return null;
    }

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
    const authSession = await getSession();
    if (!authSession) {
        return { success: false, error: "Unauthorized" };
    }

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

