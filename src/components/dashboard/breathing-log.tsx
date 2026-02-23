"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Wind, Timer, AlertCircle, XCircle } from "lucide-react";

interface BreathingLogProps {
    onSelect: (issue: string) => void;
    selectedIssue: string | null;
}

/**
 * CLINICAL BREATHING LOG
 * - Quick-action selectors for respiratory distress events.
 * - Optimized for rapid clinical documentation under pressure.
 */
export function BreathingLog({ onSelect, selectedIssue }: BreathingLogProps) {
    const t = useTranslations("BreathingLog");
    const issues = [
        { id: "SHORTNESS", label: t("SHORTNESS"), icon: Wind, color: "text-blue-600 bg-blue-50 border-blue-200" },
        { id: "COUGH", label: t("COUGH"), icon: AlertCircle, color: "text-orange-600 bg-orange-50 border-orange-200" },
        { id: "EARLY_RELEASE", label: t("EARLY_RELEASE"), icon: Timer, color: "text-purple-600 bg-purple-50 border-purple-200" },
        { id: "UNABLE_HOLD", label: t("UNABLE_HOLD"), icon: XCircle, color: "text-red-600 bg-red-50 border-red-200" },
    ];

    return (
        <div className="space-y-3">
            <p className="text-sm font-bold text-zinc-700 tracking-tight">{t('title')}</p>
            <div className="grid grid-cols-2 gap-2 p-3 bg-zinc-50 rounded-xl border-2 border-zinc-200">
                {issues.map((issue) => {
                    const Icon = issue.icon;
                    const isActive = selectedIssue === issue.id;

                    return (
                        <button
                            key={issue.id}
                            onClick={() => onSelect(issue.id)}
                            className={cn(
                                "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all text-center",
                                issue.color,
                                isActive
                                    ? "scale-[1.02] border-blue-500 shadow-md opacity-100"
                                    : "hover:border-zinc-300 opacity-70"
                            )}
                        >
                            <Icon className="w-6 h-6" />
                            <span className="text-[10px] font-black uppercase tracking-tight leading-tight">
                                {issue.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
