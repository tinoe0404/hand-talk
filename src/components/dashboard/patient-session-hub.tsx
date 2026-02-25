"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, Activity, ChevronLeft, ChevronDown, Loader2 } from "lucide-react";
import { useSessionStore } from "@/store/useSessionStore";
import { Link, useRouter } from "@/navigation";
import { createSessionAction } from "@/app/[locale]/(radiographer)/dashboard/actions";
import { format } from "date-fns";

interface Session {
    id: string;
    createdAt: Date;
    status: string;
    treatmentType: string;
    lastInstructionId?: string | null;
}

interface PatientSessionHubProps {
    patientId: string;
    patientName: string;
    mrn: string;
    sessions: Session[];
}

const TREATMENTS = [
    { value: "GENERAL_RT", label: "General Radiotherapy" },
    { value: "CHEST_SCAN", label: "Chest / Thorax Scan" },
    { value: "ABDOMINAL", label: "Abdominal Imaging" },
    { value: "PEDIATRIC", label: "Pediatric Specialized" },
];

export function PatientSessionHub({ patientName, mrn, sessions }: PatientSessionHubProps) {
    const router = useRouter();
    const sessionStore = useSessionStore();
    const [isResuming, setIsResuming] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [treatment, setTreatment] = useState("GENERAL_RT");
    const [isFirstDay, setIsFirstDay] = useState(false);
    const [isLastDay, setIsLastDay] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const activeSession = sessions.find(s => s.status === "ACTIVE" || s.status === "INTERRUPTED");
    const completedSessions = sessions.filter(s => s.status === "COMPLETED");

    const isCurrentStoreSessionMatches = activeSession && sessionStore.sessionId === activeSession.id;

    const handleResume = () => {
        setIsResuming(true);
        if (activeSession) {
            if (!isCurrentStoreSessionMatches) {
                sessionStore.startSession({
                    sessionId: activeSession.id,
                    patientRef: mrn,
                    radiographerId: "RESUMED",
                    isFirstDay: false,
                    isLastDay: false,
                });
                if (activeSession.lastInstructionId) {
                    sessionStore.setInstruction(activeSession.lastInstructionId);
                }
            }
            router.push("/dashboard");
        }
    };

    const handleStartSession = async () => {
        setIsCreating(true);
        setError(null);

        const formData = new FormData();
        formData.set("name", patientName);
        formData.set("mrn", mrn);
        formData.set("treatment", treatment);
        formData.set("notes", "");
        if (isFirstDay) {
            formData.set("isFirstDay", "on");
        }
        if (isLastDay) {
            formData.set("isLastDay", "on");
        }

        const result = await createSessionAction(null, formData);

        if (result?.error) {
            setError(result.error);
            setIsCreating(false);
            return;
        }

        if (result?.success && result.sessionId) {
            sessionStore.startSession({
                sessionId: result.sessionId,
                patientRef: mrn,
                radiographerId: "unknown",
                isFirstDay: result.isFirstDay || false,
                isLastDay: result.isLastDay || false,
            });
            router.push("/dashboard");
        }
    };

    return (
        <div className="flex flex-col gap-4 p-4 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Link
                    href="/dashboard"
                    className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center active:bg-zinc-200 transition-colors shrink-0"
                >
                    <ChevronLeft className="w-5 h-5 text-zinc-600" />
                </Link>
                <div className="min-w-0">
                    <h1 className="text-xl font-black text-zinc-900 truncate leading-tight">
                        {patientName}
                    </h1>
                    <span className="text-xs font-mono font-bold text-zinc-400">
                        {mrn}
                    </span>
                </div>
            </div>

            {/* Active Session — Resume Card */}
            {activeSession ? (
                <div className="bg-medical-green-50 p-5 rounded-2xl border-2 border-medical-green-200 space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-medical-green-500 rounded-full animate-pulse" />
                        <h3 className="font-bold text-medical-green-900 text-sm">Active Session</h3>
                    </div>
                    <p className="text-sm text-medical-green-700 font-medium">
                        {activeSession.treatmentType} · Started {format(new Date(activeSession.createdAt), "MMM d, HH:mm")}
                    </p>
                    <Button
                        onClick={handleResume}
                        disabled={isResuming}
                        className="w-full h-14 bg-medical-green-600 hover:bg-medical-green-700 text-white font-black text-base rounded-xl shadow-lg active:scale-[0.98] transition-all"
                    >
                        <RotateCcw className="w-5 h-5 mr-2" />
                        {isResuming ? "Resuming..." : "Resume Session"}
                    </Button>
                </div>
            ) : (
                /* Start New Session — Inline Form */
                <div className="bg-white p-5 rounded-2xl border-2 border-zinc-100 space-y-4">
                    <h3 className="font-bold text-zinc-900 text-sm">Start Session</h3>

                    {/* Treatment type */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                            Treatment Type
                        </label>
                        <div className="relative">
                            <select
                                value={treatment}
                                onChange={(e) => setTreatment(e.target.value)}
                                className="w-full h-12 rounded-xl border-2 border-zinc-200 bg-white px-4 pr-10 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-medical-green-500 appearance-none"
                            >
                                {TREATMENTS.map(t => (
                                    <option key={t.value} value={t.value}>{t.label}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Day flags */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => setIsFirstDay(!isFirstDay)}
                            className={`flex-1 h-11 rounded-xl border-2 text-xs font-bold uppercase tracking-wider transition-all active:scale-95 ${isFirstDay
                                ? "bg-medical-green-600 text-white border-medical-green-600"
                                : "bg-zinc-50 text-zinc-500 border-zinc-200"
                                }`}
                        >
                            First Day
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsLastDay(!isLastDay)}
                            className={`flex-1 h-11 rounded-xl border-2 text-xs font-bold uppercase tracking-wider transition-all active:scale-95 ${isLastDay
                                ? "bg-medical-green-600 text-white border-medical-green-600"
                                : "bg-zinc-50 text-zinc-500 border-zinc-200"
                                }`}
                        >
                            Last Day
                        </button>
                    </div>

                    {error && (
                        <p className="text-xs font-bold text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                            {error}
                        </p>
                    )}

                    <Button
                        onClick={handleStartSession}
                        disabled={isCreating}
                        className="w-full h-14 bg-medical-green-600 hover:bg-medical-green-700 text-white font-black text-base rounded-xl shadow-lg active:scale-[0.98] transition-all"
                    >
                        {isCreating ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Starting...
                            </>
                        ) : (
                            <>
                                <Play className="w-5 h-5 mr-2" />
                                Start Session
                            </>
                        )}
                    </Button>
                </div>
            )}

            {/* Session History */}
            {completedSessions.length > 0 && (
                <div className="space-y-2">
                    <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest px-1">
                        History · {completedSessions.length} session{completedSessions.length !== 1 ? "s" : ""}
                    </h3>
                    <div className="flex flex-col gap-2">
                        {completedSessions.slice(0, 10).map(session => (
                            <div
                                key={session.id}
                                className="flex items-center justify-between p-3 bg-white border border-zinc-100 rounded-xl"
                            >
                                <div>
                                    <p className="text-sm font-bold text-zinc-800">{session.treatmentType}</p>
                                    <p className="text-[11px] text-zinc-400 font-medium">
                                        {format(new Date(session.createdAt), "MMM d, yyyy · HH:mm")}
                                    </p>
                                </div>
                                <span className="text-[10px] font-bold text-zinc-400 uppercase bg-zinc-50 px-2 py-1 rounded-lg">
                                    Done
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {completedSessions.length === 0 && !activeSession && (
                <div className="py-8 text-center">
                    <Activity className="w-8 h-8 text-zinc-200 mx-auto mb-2" />
                    <p className="text-sm text-zinc-400 font-medium">
                        No previous sessions recorded.
                    </p>
                </div>
            )}
        </div>
    );
}
