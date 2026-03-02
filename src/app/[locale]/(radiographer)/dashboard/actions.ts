"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth-utils";
import { patientSchema } from "@/lib/validations/schemas";

import { createSessionAction } from "@/lib/actions/session-actions";


export async function generateUniqueMrnAction() {
    const session = await getSession();
    if (!session) {
        throw new Error("Unauthorized");
    }

    let isUnique = false;
    let generatedMrn = "";

    // Pattern: P-YYMMDD-XXXX (e.g. P-260301-8492)
    const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, "");

    while (!isUnique) {
        const randomPart = Math.floor(1000 + Math.random() * 9000).toString();
        generatedMrn = `P-${datePart}-${randomPart}`;

        const existing = await prisma.patient.findUnique({
            where: { mrn: generatedMrn }
        });

        if (!existing) {
            isUnique = true;
        }
    }

    return generatedMrn;
}

export async function registerPatientAction(_prevState: unknown, formData: FormData) {
    const session = await getSession();
    if (!session) {
        return { error: "Unauthorized" };
    }

    const patientData = {
        name: formData.get("name") as string,
        mrn: formData.get("mrn") as string,
        gender: formData.get("gender") as string || undefined,
        dateOfBirth: formData.get("dob") as string || undefined,
    };

    const validation = patientSchema.safeParse(patientData);
    if (!validation.success) {
        return { error: validation.error.issues[0]?.message || "Invalid input detected" };
    }

    const { name, mrn, gender, dateOfBirth } = validation.data;

    try {
        const patient = await prisma.patient.create({
            data: {
                name,
                mrn,
                gender: gender || null,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
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

export async function deletePatientAction(patientId: string) {
    const session = await getSession();
    if (!session) {
        return { error: "Unauthorized" };
    }

    try {
        await prisma.$transaction([
            prisma.instructionLog.deleteMany({
                where: { session: { patientId } }
            }),
            prisma.gestureLog.deleteMany({
                where: { session: { patientId } }
            }),
            prisma.emergencyLog.deleteMany({
                where: { session: { patientId } }
            }),
            prisma.session.deleteMany({
                where: { patientId }
            }),
            prisma.patient.delete({
                where: { id: patientId }
            })
        ]);

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete patient:", error);
        return { error: "Failed to delete patient. Please try again." };
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

export { createSessionAction };

