/**
 * Curated Icon Map — Hand Talk
 *
 * Instead of importing the entire lucide-react namespace (`import * as LucideIcons`),
 * this map contains only the ~25 icons actually referenced by ClinicalInstruction records.
 * This enables proper tree-shaking and dramatically reduces bundle size.
 */
import {
    BedDouble,
    AlignCenter,
    ChevronsUp,
    ArrowLeft,
    ArrowRight,
    ArrowUpFromDot,
    MoveUp,
    MoveDown,
    Dumbbell,
    Sun,
    Leaf,
    Lock,
    Heart,
    RefreshCw,
    DoorOpen,
    HandMetal,
    Award,
    Wind,
    ShieldCheck,
    Settings,
    CircleHelp,
} from "lucide-react";
import type { ElementType } from "react";

/** Map of Lucide icon name → component used by instruction/gesture rendering */
export const INSTRUCTION_ICON_MAP: Record<string, ElementType> = {
    BedDouble,
    AlignCenter,
    ChevronsUp,
    ArrowLeft,
    ArrowRight,
    ArrowUpFromDot,
    MoveUp,
    MoveDown,
    Dumbbell,
    Sun,
    Leaf,
    Lock,
    Heart,
    RefreshCw,
    DoorOpen,
    HandMetal,
    Award,
    Wind,
    ShieldCheck,
    Settings,
};

/** The fallback icon used when a name isn't in the map */
export const FallbackIcon = CircleHelp;

/** Resolve a Lucide icon by its string name from the instructions registry */
export function resolveIcon(name: string): ElementType {
    return INSTRUCTION_ICON_MAP[name] ?? FallbackIcon;
}
