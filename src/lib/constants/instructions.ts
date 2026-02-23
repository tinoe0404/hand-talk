/**
 * Clinical Instructions Registry
 * This file serves as the clinical "source of truth" for the 20 radiotherapy 
 * instructions supported by Hand Talk.
 * 
 * Categories: BREATHING, POSITIONING, SAFETY, READINESS
 */

export interface ClinicalInstruction {
    id: string;
    category: 'BREATHING' | 'POSITIONING' | 'SAFETY' | 'READINESS';
    videoPath: string;
    iconName: string; // Lucide icon name mapping
}

export const CLINICAL_INSTRUCTIONS: ClinicalInstruction[] = [
    // BREATHING
    { id: 'B-001', category: 'BREATHING', videoPath: '/assets/instructions/B-001.mp4', iconName: 'Wind' },
    { id: 'B-002', category: 'BREATHING', videoPath: '/assets/instructions/B-002.mp4', iconName: 'Wind' },
    { id: 'B-003', category: 'BREATHING', videoPath: '/assets/instructions/B-003.mp4', iconName: 'CircleStop' },
    { id: 'B-004', category: 'BREATHING', videoPath: '/assets/instructions/B-004.mp4', iconName: 'Activity' },

    // POSITIONING
    { id: 'P-001', category: 'POSITIONING', videoPath: '/assets/instructions/P-001.mp4', iconName: 'ArrowBigUp' },
    { id: 'P-002', category: 'POSITIONING', videoPath: '/assets/instructions/P-002.mp4', iconName: 'ArrowBigDown' },
    { id: 'P-003', category: 'POSITIONING', videoPath: '/assets/instructions/P-003.mp4', iconName: 'ArrowBigLeft' },
    { id: 'P-004', category: 'POSITIONING', videoPath: '/assets/instructions/P-004.mp4', iconName: 'ArrowBigRight' },
    { id: 'P-005', category: 'POSITIONING', videoPath: '/assets/instructions/P-005.mp4', iconName: 'PersonStanding' },
    { id: 'P-006', category: 'POSITIONING', videoPath: '/assets/instructions/P-006.mp4', iconName: 'MoveUp' },
    { id: 'P-007', category: 'POSITIONING', videoPath: '/assets/instructions/P-007.mp4', iconName: 'MoveDown' },

    // SAFETY
    { id: 'S-001', category: 'SAFETY', videoPath: '/assets/instructions/S-001.mp4', iconName: 'ShieldAlert' },
    { id: 'S-002', category: 'SAFETY', videoPath: '/assets/instructions/S-002.mp4', iconName: 'Settings' },
    { id: 'S-003', category: 'SAFETY', videoPath: '/assets/instructions/S-003.mp4', iconName: 'Lock' },
    { id: 'S-004', category: 'SAFETY', videoPath: '/assets/instructions/S-004.mp4', iconName: 'Zap' },

    // READINESS
    { id: 'R-001', category: 'READINESS', videoPath: '/assets/instructions/R-001.mp4', iconName: 'CheckCircle' },
    { id: 'R-002', category: 'READINESS', videoPath: '/assets/instructions/R-002.mp4', iconName: 'Flag' },
    { id: 'R-003', category: 'READINESS', videoPath: '/assets/instructions/R-003.mp4', iconName: 'Clock' },
    { id: 'R-004', category: 'READINESS', videoPath: '/assets/instructions/R-004.mp4', iconName: 'Smile' },
    { id: 'R-005', category: 'READINESS', videoPath: '/assets/instructions/R-005.mp4', iconName: 'Search' },
    { id: 'see-you-tomorrow', category: 'READINESS', videoPath: '/assets/instructions/see-you-tomorrow.mp4', iconName: 'DoorOpen' },
    { id: 'treatment-finished', category: 'READINESS', videoPath: '/assets/instructions/treatment-finished.mp4', iconName: 'Award' },
];

/**
 * Utility to get instruction by ID
 */
export const getInstruction = (id: string) =>
    CLINICAL_INSTRUCTIONS.find(inst => inst.id === id);

/**
 * Grouped instructions for Radiographer selection UI
 */
export const GROUPED_INSTRUCTIONS = {
    BREATHING: CLINICAL_INSTRUCTIONS.filter(i => i.category === 'BREATHING'),
    POSITIONING: CLINICAL_INSTRUCTIONS.filter(i => i.category === 'POSITIONING'),
    SAFETY: CLINICAL_INSTRUCTIONS.filter(i => i.category === 'SAFETY'),
    READINESS: CLINICAL_INSTRUCTIONS.filter(i => i.category === 'READINESS'),
};
