import { z } from "zod";

export const patientSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    mrn: z.string().regex(/^P-[\w-]+$/, "Invalid MRN format (e.g., P-1001 or P-260301-8924)"),
    gender: z.enum(["Male", "Female", "Other"]).optional(),
    dateOfBirth: z.string().optional(),
});

export const sessionSchema = z.object({
    patientId: z.string().uuid(),
    treatmentType: z.string().min(1, "Treatment type is required"),
    notes: z.string().optional(),
    isFirstDay: z.boolean().default(false),
    isLastDay: z.boolean().default(false),
});

export const loginSchema = z.object({
    pin: z.string().length(4, "PIN must be exactly 4 digits").regex(/^\d+$/, "PIN must contain only digits"),
});
