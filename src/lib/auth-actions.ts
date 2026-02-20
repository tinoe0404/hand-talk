"use server";

import { deleteSession } from "@/lib/auth-utils";
import { redirect } from "next/navigation";

/**
 * logoutAction
 * Clinical justification: Securely terminates the radiographer's shift
 * session and clears the httpOnly session cookie. 
 * Moved to lib for centralized clinical action management.
 */
export async function logoutAction() {
    await deleteSession();
    redirect("/login");
}
