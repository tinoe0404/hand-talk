"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Play, Activity, ChevronLeft, Loader2, Video } from "lucide-react";
import { useSessionStore } from "@/store/useSessionStore";
import { Link, useRouter } from "@/navigation";
import { createSessionAction } from "@/app/[locale]/(radiographer)/dashboard/actions";
import { format } from "date-fns";
import { Modal } from "@/components/ui/modal";

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
    const [isCreating, setIsCreating] = useState(false);
    const [treatment, setTreatment] = useState("GENERAL_RT");
    const [error, setError] = useState<string | null>(null);
    const [showInstructions, setShowInstructions] = useState(false);
    const completedSessions = sessions.filter(s => s.status === "COMPLETED" || s.status === "ACTIVE" || s.status === "INTERRUPTED"); // Treat any past session as history

    const handleStartSession = async () => {
        setIsCreating(true);
        setError(null);

        const formData = new FormData();
        formData.set("name", patientName);
        formData.set("mrn", mrn);
        formData.set("treatment", treatment);
        formData.set("notes", "");

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
                isFirstDay: false,
                isLastDay: false,
            });
            router.push("/dashboard");
        }
    };

    return (
        <div className="flex flex-col gap-4 p-4 animate-in fade-in duration-300">
            {/* Welcome Instructions Modal */}
            <Modal
                isOpen={showInstructions}
                onClose={() => setShowInstructions(false)}
                title="Patient Instructions"
                description="Show this video to the patient so they know what to do if they need help during the session."
            >
                <div className="rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center">
                    <video 
                        src="/videos/good-day-welcome.mp4" 
                        controls 
                        autoPlay 
                        className="w-full h-full object-cover"
                    />
                </div>
            </Modal>

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

            {/* Start New Session — Inline Form */}
            <div className="bg-white p-5 rounded-2xl border-2 border-zinc-100 space-y-4">
                <h3 className="font-bold text-zinc-900 text-sm">Start Session</h3>

                {/* Treatment type */}
                <div className="space-y-1.5">
                    <label htmlFor="session-treatment" className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">
                        Treatment Type
                    </label>
                    <Select
                        id="session-treatment"
                        value={treatment}
                        onChange={(e) => setTreatment(e.target.value)}
                        className="h-12 rounded-xl border-2 border-zinc-200 text-sm"
                    >
                        {TREATMENTS.map(t => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                    </Select>
                </div>



                {error && (
                    <p className="text-xs font-bold text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                        {error}
                    </p>
                )}

                <Button
                    onClick={handleStartSession}
                    disabled={isCreating}
                    className="w-full h-14 bg-medical-green-600 hover:bg-medical-green-700 text-white font-black text-base rounded-xl shadow-lg active:scale-[0.98] transition-all mb-2"
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

                <Button
                    onClick={() => setShowInstructions(true)}
                    variant="outline"
                    className="w-full h-14 border-2 border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-black text-base rounded-xl active:scale-[0.98] transition-all"
                >
                    <Video className="w-5 h-5 mr-2 text-zinc-500" />
                    Play Welcome Instructions
                </Button>
            </div>

            {/* Session History */}
            {completedSessions.length > 0 && (
                <div className="space-y-2">
                    <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest px-1">
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

            {completedSessions.length === 0 && (
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
