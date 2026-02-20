export type InstructionCategory = 'POSITIONING' | 'SESSION' | 'BREATHING' | 'SAFETY';

export interface Instruction {
    id: string;
    labelEn: string;
    labelZu: string;
    iconName: string; // Lucide icon name
    videoPath: string;
    category: InstructionCategory;
}

export const INSTRUCTIONS: Instruction[] = [
    // POSITIONING
    {
        id: 'lie-down',
        labelEn: 'Lie Down',
        labelZu: 'Lala phansi',
        iconName: 'Bed',
        videoPath: '/videos/lie-down.mp4',
        category: 'POSITIONING',
    },
    {
        id: 'head-straight',
        labelEn: 'Head Straight',
        labelZu: 'Ikhanda liqonde',
        iconName: 'MoveRight', // Placeholder for alignment icon
        videoPath: '/videos/head-straight.mp4',
        category: 'POSITIONING',
    },
    {
        id: 'chin-up',
        labelEn: 'Chin Up',
        labelZu: 'Phakamisa isilevu',
        iconName: 'ChevronUp',
        videoPath: '/videos/chin-up.mp4',
        category: 'POSITIONING',
    },
    {
        id: 'turn-left',
        labelEn: 'Turn Left',
        labelZu: 'Jika kwesokunxele',
        iconName: 'RotateCcw',
        videoPath: '/videos/turn-left.mp4',
        category: 'POSITIONING',
    },
    {
        id: 'turn-right',
        labelEn: 'Turn Right',
        labelZu: 'Jika kwesokudla',
        iconName: 'RotateCw',
        videoPath: '/videos/turn-right.mp4',
        category: 'POSITIONING',
    },
    {
        id: 'arms-up',
        labelEn: 'Arms Up',
        labelZu: 'Phakamisa izingalo',
        iconName: 'MoveUp',
        videoPath: '/videos/arms-up.mp4',
        category: 'POSITIONING',
    },
    {
        id: 'slide-up',
        labelEn: 'Slide Up',
        labelZu: 'Shelela uyenyuka',
        iconName: 'ChevronsUp',
        videoPath: '/videos/slide-up.mp4',
        category: 'POSITIONING',
    },
    {
        id: 'slide-down',
        labelEn: 'Slide Down',
        labelZu: 'Shelela uyehla',
        iconName: 'ChevronsDown',
        videoPath: '/videos/slide-down.mp4',
        category: 'POSITIONING',
    },
    {
        id: 'lift-hips',
        labelEn: 'Lift Hips',
        labelZu: 'Phakamisa ukhalo',
        iconName: 'Accessibility',
        videoPath: '/videos/lift-hips.mp4',
        category: 'POSITIONING',
    },

    // SESSION
    {
        id: 'welcome',
        labelEn: 'Good Day & Welcome',
        labelZu: 'Sawubona, wamkelekile',
        iconName: 'Hand',
        videoPath: '/videos/welcome.mp4',
        category: 'SESSION',
    },
    {
        id: 'relax',
        labelEn: 'Relax',
        labelZu: 'Khululeka',
        iconName: 'Smile',
        videoPath: '/videos/relax.mp4',
        category: 'SESSION',
    },
    {
        id: 'dont-move',
        labelEn: "Don't Move",
        labelZu: 'Unganyakazi',
        iconName: 'XCircle',
        videoPath: '/videos/dont-move.mp4',
        category: 'SESSION',
    },
    {
        id: 'comfortable',
        labelEn: 'Comfortable?',
        labelZu: 'Ukhululekile?',
        iconName: 'HelpCircle',
        videoPath: '/videos/comfortable.mp4',
        category: 'SESSION',
    },
    {
        id: 'same-as-yesterday',
        labelEn: 'Same as Yesterday',
        labelZu: 'Kuyafana nayizolo',
        iconName: 'History',
        videoPath: '/videos/same-as-yesterday.mp4',
        category: 'SESSION',
    },
    {
        id: 'see-you-tomorrow',
        labelEn: 'See You Tomorrow',
        labelZu: 'Sizobonana kusasa',
        iconName: 'Calendar',
        videoPath: '/videos/see-you-tomorrow.mp4',
        category: 'SESSION',
    },
    {
        id: 'thank-you',
        labelEn: 'Thank You',
        labelZu: 'Ngiyabonga',
        iconName: 'Heart',
        videoPath: '/videos/thank-you.mp4',
        category: 'SESSION',
    },
    {
        id: 'treatment-finished',
        labelEn: 'Treatment Finished',
        labelZu: 'Uhlelo lokwelapha luphelile',
        iconName: 'CheckCircle2',
        videoPath: '/videos/treatment-finished.mp4',
        category: 'SESSION',
    },

    // BREATHING
    {
        id: 'breathe-normally',
        labelEn: 'Breathe Normally',
        labelZu: 'Phefumula ngokwejwayelekile',
        iconName: 'Wind',
        videoPath: '/videos/breathe-normally.mp4',
        category: 'BREATHING',
    },

    // SAFETY
    {
        id: 'painless',
        labelEn: 'Painless',
        labelZu: 'Akubuhlungu',
        iconName: 'ShieldCheck',
        videoPath: '/videos/painless.mp4',
        category: 'SAFETY',
    },
    {
        id: 'machine-moving',
        labelEn: 'Machine Moving',
        labelZu: 'Umshini uyanyakaza',
        iconName: 'Settings',
        videoPath: '/videos/machine-moving.mp4',
        category: 'SAFETY',
    },
];
