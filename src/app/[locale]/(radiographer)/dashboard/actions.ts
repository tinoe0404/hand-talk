"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth-utils";

export async function registerPatientAction(_prevState: unknown, formData: FormData) {
    const session = await getSession();
    if (!session) {
        return { error: "Unauthorized" };
    }

    const name = formData.get("name") as string;
    const mrn = formData.get("mrn") as string;
    const gender = formData.get("gender") as string;
    const dobString = formData.get("dob") as string;

    if (!name || !mrn) {
        return { error: "Name and MRN are required" };
    }

    try {
        const patient = await prisma.patient.create({
            data: {
                name,
                mrn,
                gender: gender || null,
                dateOfBirth: dobString ? new Date(dobString) : null,
            },
        });

        revalidatePath("/dashboard");
        return { success: true, patientId: patient.id };
    } catch (e: unknown) {
        const error = e as { code?: string };
        if (error.code === 'P2002') {
            return { error: "MRN already exists in the system" };
        }
        return { error: "Failed to register patient" };
    }
}

export async function getDashboardStats() {
    const session = await getSession();
    if (!session) {
        return null;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [sessionCount, patientCount, emergencyCount] = await Promise.all([
        prisma.session.count({
            where: { createdAt: { gte: today } }
        }),
        prisma.patient.count(),
        prisma.emergencyLog.count({
            where: { timestamp: { gte: today } }
        })
    ]);

    return {
        sessionCount,
        patientCount,
        emergencyCount
    };
}

export async function getPatients() {
    const session = await getSession();
    if (!session) {
        return [];
    }

    return prisma.patient.findMany({
        orderBy: { updatedAt: 'desc' },
        take: 50
    });
}
