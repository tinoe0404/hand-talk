"use client";

import { useSessionStore } from "@/store/useSessionStore";
import { useTranslations } from "next-intl";

export function SessionInfo() {
    const t = useTranslations("Dashboard");
    const { sessionId, patientRef } = useSessionStore();

    return (
        <div className="flex items-center justify-between">
            <div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    {t("activeSession")}
                </p>
                <p className="text-sm font-black text-zinc-900 truncate max-w-[180px]">
                    {patientRef ?? t("unknownPatient")}
                </p>
            </div>
            <div className="text-xs font-mono text-zinc-400 truncate max-w-[120px] text-right">
                {sessionId?.slice(0, 16)}…
            </div>
        </div>
    );
}
