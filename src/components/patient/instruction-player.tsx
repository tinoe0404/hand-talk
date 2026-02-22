"use client";

import { useTranslations } from "next-intl";
import { getInstruction } from "@/lib/constants/instructions";
import {
    Activity,
    CircleHelp
} from "lucide-react";
import * as Icons from "lucide-react";
import React from "react";

interface InstructionPlayerProps {
    instructionId: string;
}

export function InstructionPlayer({ instructionId }: InstructionPlayerProps) {
    const t = useTranslations("Instructions");
    const instruction = getInstruction(instructionId);

    if (!instruction) {
        return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const IconsMap: Record<string, React.ElementType> = Icons as any;
    const Icon = IconsMap[instruction.iconName] || CircleHelp;

    return (
        <div className="w-full h-full flex flex-col items-center justify-between p-4 md:p-8 space-y-4 md:space-y-8 animate-in fade-in zoom-in duration-500">
            {/* Visual Indicator Area */}
            <div className="flex-1 w-full flex items-center justify-center relative">
                <div className="absolute inset-0 bg-medical-green-500/5 rounded-[3rem] animate-pulse" />

                <div className="relative z-10 flex flex-col items-center gap-12">
                    <div className="w-32 h-32 md:w-64 md:h-64 bg-medical-green-600 rounded-full flex items-center justify-center shadow-[0_0_80px_rgba(21,128,61,0.4)] border-4 md:border-8 border-medical-green-400/30">
                        <Icon className="w-16 h-16 md:w-32 md:h-32 text-white" strokeWidth={2.5} />
                    </div>

                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-6 py-2 bg-medical-green-900 border border-medical-green-500 rounded-full mx-auto">
                            <Activity className="w-5 h-5 text-medical-green-400" />
                            <span className="text-lg font-bold text-medical-green-100 uppercase tracking-[0.2em]">Executing Command</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Text Command Area */}
            <div className="w-full bg-zinc-900/50 border-2 border-white/10 p-6 md:p-12 rounded-[1.5rem] md:rounded-[2.5rem] space-y-3 md:space-y-6">
                <h1 className="text-4xl md:text-8xl font-black text-white tracking-tighter leading-none mb-1 md:mb-2">
                    {t(`${instructionId}.title`)}
                </h1>
                <p className="text-xl md:text-4xl text-medical-green-400 font-bold leading-relaxed max-w-4xl mx-auto">
                    {t(`${instructionId}.desc`)}
                </p>
            </div>

            {/* Progress/Loop Indicator */}
            <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-medical-green-500 animate-[progress_3s_linear_infinite]" />
            </div>

            <style jsx>{`
        @keyframes progress {
          0% { width: 0%; opacity: 1; }
          90% { width: 100%; opacity: 1; }
          100% { width: 100%; opacity: 0; }
        }
      `}</style>
        </div>
    );
}
