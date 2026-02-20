import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility for merging tailwind classes with clsx logic.
 * Essential for dynamic styling in clinical components.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
