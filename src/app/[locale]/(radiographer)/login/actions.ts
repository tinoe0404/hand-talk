"use server";

import { prisma } from "@/lib/prisma";
import { verifyPin, createSession } from "@/lib/auth-utils";
import { redirect } from "next/navigation";

export async function loginAction(_prevState: unknown, formData: FormData) {
    const pin = formData.get("pin") as string;

    if (!pin || pin.length !== 4) {
        return { error: "errorInvalid" };
    }

    // In a real scenario, we might have multiple radiographers.
    // For this version, we look for the active radiographer or allow the first one.
    try {
        const radiographer = await prisma.radiographer.findFirst();

        if (!radiographer) {
            return { error: "errorNoStaff" };
        }

        const isValid = await verifyPin(pin, radiographer.pin);

        if (!isValid) {
            return { error: "errorIncorrect" };
        }

        await createSession(radiographer.id);
    } catch (error) {
        console.error("Auth Error:", error);
        return { error: "errorSystem" };
    }

    // Use locale-prefixed path; middleware ensures correct routing
    redirect("/en/dashboard");
}
