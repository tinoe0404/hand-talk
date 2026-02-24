/**
 * Clinical Instructions Registry — Hand Talk
 *
 * IDs match /public/videos/<id>.mp4 exactly.
 * 20 clinical instructions + 2 special session videos.
 */

export type InstructionCategory = 'POSITIONING' | 'SESSION' | 'BREATHING' | 'SAFETY';

export interface ClinicalInstruction {
  id: string;
  category: InstructionCategory;
  iconName: string; // Lucide icon name
}

export const CLINICAL_INSTRUCTIONS: ClinicalInstruction[] = [
  // ── POSITIONING (9) ───────────────────────────────────────
  { id: 'lie-down', category: 'POSITIONING', iconName: 'BedDouble' },
  { id: 'head-straight', category: 'POSITIONING', iconName: 'AlignCenter' },
  { id: 'chin-up', category: 'POSITIONING', iconName: 'ChevronsUp' },
  { id: 'turn-left', category: 'POSITIONING', iconName: 'ArrowLeft' },
  { id: 'turn-right', category: 'POSITIONING', iconName: 'ArrowRight' },
  { id: 'arms-up', category: 'POSITIONING', iconName: 'ArrowUpFromDot' },
  { id: 'slide-up', category: 'POSITIONING', iconName: 'MoveUp' },
  { id: 'slide-down', category: 'POSITIONING', iconName: 'MoveDown' },
  { id: 'lift-hips', category: 'POSITIONING', iconName: 'Dumbbell' },

  // ── SESSION (8) ───────────────────────────────────────────
  { id: 'good-day-welcome', category: 'SESSION', iconName: 'Sun' },
  { id: 'relax', category: 'SESSION', iconName: 'Leaf' },
  { id: 'dont-move', category: 'SESSION', iconName: 'Lock' },
  { id: 'comfortable', category: 'SESSION', iconName: 'Heart' },
  { id: 'same-as-yesterday', category: 'SESSION', iconName: 'RefreshCw' },
  { id: 'see-you-tomorrow', category: 'SESSION', iconName: 'DoorOpen' },
  { id: 'thank-you', category: 'SESSION', iconName: 'HandMetal' },
  { id: 'treatment-finished', category: 'SESSION', iconName: 'Award' },

  // ── BREATHING (1) ─────────────────────────────────────────
  { id: 'breathe-normally', category: 'BREATHING', iconName: 'Wind' },

  // ── SAFETY (2) ────────────────────────────────────────────
  { id: 'painless', category: 'SAFETY', iconName: 'ShieldCheck' },
  { id: 'machine-moving', category: 'SAFETY', iconName: 'Settings' },
];

/** Resolve the Supabase Storage path for any instruction or special video */
export const videoPath = (id: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL || '/videos';
  return `${baseUrl}/${id}.mp4`;
};

/** Lookup by id */
export const getInstruction = (id: string) =>
  CLINICAL_INSTRUCTIONS.find((inst) => inst.id === id);

/** Grouped for tab rendering */
export const GROUPED_INSTRUCTIONS: Record<InstructionCategory, ClinicalInstruction[]> = {
  POSITIONING: CLINICAL_INSTRUCTIONS.filter((i) => i.category === 'POSITIONING'),
  SESSION: CLINICAL_INSTRUCTIONS.filter((i) => i.category === 'SESSION'),
  BREATHING: CLINICAL_INSTRUCTIONS.filter((i) => i.category === 'BREATHING'),
  SAFETY: CLINICAL_INSTRUCTIONS.filter((i) => i.category === 'SAFETY'),
};

/** Gesture detection results */
export const GESTURE_RESULTS = [
  {
    id: 'thumbs-up',
    emoji: '👍',
    color: 'bg-green-100 text-green-800 border-green-300',
    dotColor: 'bg-green-500',
  },
  {
    id: 'open-palm',
    emoji: '✋',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    dotColor: 'bg-yellow-500',
  },
  {
    id: 'peace-sign',
    emoji: '✌️',
    color: 'bg-orange-100 text-orange-800 border-orange-300',
    dotColor: 'bg-orange-500',
  },
  {
    id: 'pointing-down',
    emoji: '👇',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    dotColor: 'bg-blue-500',
  },
] as const;

export type GestureId = typeof GESTURE_RESULTS[number]['id'];
