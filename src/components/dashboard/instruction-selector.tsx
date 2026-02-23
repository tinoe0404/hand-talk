"use client";

import { useTranslations } from "next-intl";
import { useSessionStore } from "@/store/useSessionStore";
import { GROUPED_INSTRUCTIONS } from "@/lib/constants/instructions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Play,
    Square,
    Wind,
    Move,
    ShieldCheck,
    Activity,
    CircleHelp
} from "lucide-react";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

export function InstructionSelector() {
    const t = useTranslations("Instructions");
    const { currentInstructionId, setInstruction, stopInstruction, isLastDay } = useSessionStore();

    const categories = [
        { id: "BREATHING", icon: Wind, color: "text-blue-500", bg: "bg-blue-50" },
        { id: "POSITIONING", icon: Move, color: "text-amber-500", bg: "bg-amber-50" },
        { id: "SAFETY", icon: ShieldCheck, color: "text-red-500", bg: "bg-red-50" },
        { id: "READINESS", icon: Activity, color: "text-medical-green-500", bg: "bg-medical-green-50" },
    ];

    const handleToggle = (id: string) => {
        if (currentInstructionId === id) {
            stopInstruction();
        } else {
            setInstruction(id);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => {
                const Icon = cat.icon;
                const categoryKey = cat.id as keyof typeof GROUPED_INSTRUCTIONS;
                let instructions = GROUPED_INSTRUCTIONS[categoryKey];

                if (categoryKey === "READINESS") {
                    instructions = instructions.filter(inst => {
                        if (isLastDay && inst.id === 'see-you-tomorrow') return false;
                        if (!isLastDay && inst.id === 'treatment-finished') return false;
                        return true;
                    });
                }

                return (
                    <Card key={cat.id} className="border-2 border-slate-100 shadow-clinical-sm overflow-hidden">
                        <CardHeader className={cn("py-3 px-4 border-b", cat.bg)}>
                            <div className="flex items-center gap-2">
                                <Icon className={cn("w-5 h-5", cat.color)} />
                                <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-700">
                                    {cat.id}
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-3 space-y-2">
                            {instructions.map((inst) => {
                                const isActive = currentInstructionId === inst.id;
                                // Dynamically get icon from Lucide
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                const IconsMap: Record<string, React.ElementType> = Icons as any;
                                const InstIcon = IconsMap[inst.iconName] || CircleHelp;

                                return (
                                    <Button
                                        key={inst.id}
                                        variant={isActive ? "primary" : "outline"}
                                        className={cn(
                                            "w-full justify-between h-auto py-3 px-4 border-2 transition-all duration-200",
                                            isActive
                                                ? "bg-medical-green-600 border-medical-green-700 scale-[1.02] shadow-clinical-md"
                                                : "hover:border-medical-green-200 hover:bg-medical-green-50/50"
                                        )}
                                        onClick={() => handleToggle(inst.id)}
                                    >
                                        <div className="flex items-center gap-3 text-left">
                                            <InstIcon className={cn("w-5 h-5 shrink-0", isActive ? "text-white" : "text-slate-400")} />
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm leading-tight">{t(`${inst.id}.title`)}</span>
                                                <span className={cn("text-[10px] font-medium uppercase opacity-60", isActive ? "text-medical-white" : "text-slate-500")}>
                                                    {inst.id}
                                                </span>
                                            </div>
                                        </div>
                                        {isActive ? (
                                            <Square className="w-4 h-4 fill-current animate-pulse" />
                                        ) : (
                                            <Play className="w-4 h-4 text-slate-300" />
                                        )}
                                    </Button>
                                );
                            })}
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
