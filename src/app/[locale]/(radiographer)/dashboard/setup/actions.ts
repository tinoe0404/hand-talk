"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth-utils";
import { redirect } from "@/navigation";
import { revalidatePath } from "next/cache";

/**
 * createSessionAction
 * Clinical justification: Initializes a new radiotherapy session
 * for a specifically identified patient. Links the session to the
 * authenticated radiographer.
 */
export async function createSessionAction(_prevState: unknown, formData: FormData) {
    const radiographerId = await getSession();

    if (!radiographerId) {
        redirect({ href: "/login", locale: "en" }); // Fallback to en if session is lost
        return;
    }

    const patientName = formData.get("name") as string;
    const patientMrn = formData.get("mrn") as string;
    const treatmentType = formData.get("treatment") as string;
    const notes = formData.get("notes") as string;

    if (!patientName || !patientMrn || !treatmentType) {
        return { error: "Please fill in all clinical requirements." };
    }

    try {
        const session = await prisma.session.create({
            data: {
                patientName,
                patientMrn,
                treatmentType,
                notes,
                radiographerId: String(radiographerId), // Ensure string
                status: "ACTIVE"
            }
        });

        revalidatePath("/dashboard");
        return { success: true, sessionId: session.id };
    } catch (error) {
        console.error("Clinical Session Creation Error:", error);
        return { error: "Failed to initialize clinical session. Please retry or contact IT." };
    }
}
