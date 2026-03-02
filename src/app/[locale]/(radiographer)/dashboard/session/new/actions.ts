"use server";

import { createSessionAction as createSessionActionImpl } from "@/lib/actions/session-actions";

export async function createSessionAction(prevState: unknown, formData: FormData) {
    return createSessionActionImpl(prevState, formData);
}
