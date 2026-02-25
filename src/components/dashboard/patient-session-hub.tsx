"use client";

import { useState } from "react";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, Activity } from "lucide-react";
import { useSessionStore } from "@/store/useSessionStore";
import { useRouter } from "@/navigation";

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

export function PatientSessionHub({ patientId, patientName, mrn, sessions }: PatientSessionHubProps) {
    const router = useRouter();
    const sessionStore = useSessionStore();
    const [isResuming, setIsResuming] = useState(false);

    // Find the most recent active session from the database, if any
    const activeSession = sessions.find(s => s.status === "ACTIVE" || s.status === "INTERRUPTED");
    const completedSessions = sessions.filter(s => s.status === "COMPLETED");

    // Check if what's in our Zustand store matches this active session
    const isCurrentStoreSessionMatches = activeSession && sessionStore.sessionId === activeSession.id;

    const handleResume = () => {
        setIsResuming(true);

        if (activeSession) {
            // Re-initialize the Zustand store to match this session
            // The actual radiographerId should technically come from auth context, 
            // but for now we'll assume the current user is the one resuming.
            if (!isCurrentStoreSessionMatches) {
                // We're taking over a session that isn't currently active in this browser's store
                sessionStore.startSession({
                    sessionId: activeSession.id,
                    patientRef: mrn,
                    radiographerId: "RESUMED", // Placeholder for actual ID
                    isFirstDay: false, // Assume false on resume to skip welcome video
                    isLastDay: false     // Would need to pull this from DB ideally
                });

                // If they were in the middle of an instruction, restore it
                if (activeSession.lastInstructionId) {
                    sessionStore.setInstruction(activeSession.lastInstructionId);
                }
            }

            router.push("/dashboard");
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-3xl border-2 border-zinc-100 shadow-sm">
                <h2 className="text-2xl font-black text-medical-green-950 mb-2">{patientName}</h2>
                <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-zinc-100 text-zinc-600 rounded-lg text-sm font-mono font-bold">
                        {mrn}
                    </span>
                    <span className="text-sm font-medium text-zinc-400">
                        {sessions.length} recorded session{sessions.length !== 1 ? 's' : ''}
                    </span>
                </div>
            </div>

            {/* Active Session Card */}
            {activeSession ? (
                <div className="bg-medical-green-50 p-6 rounded-3xl border-2 border-medical-green-200">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Activity className="w-5 h-5 text-medical-green-600" />
                                <h3 className="font-bold text-medical-green-900">Active Session Found</h3>
                            </div>
                            <p className="text-medical-green-700 font-medium mb-1">
                                Treatment: {activeSession.treatmentType}
                            </p>
                            <p className="text-sm text-medical-green-600/70">
                                Started {new Date(activeSession.createdAt).toLocaleDateString()}
                            </p>
                            {activeSession.lastInstructionId && (
                                <p className="text-sm text-medical-green-600/70 mt-1">
                                    Last context: {activeSession.lastInstructionId}
                                </p>
                            )}
                        </div>
                        <Button
                            onClick={handleResume}
                            disabled={isResuming}
                            className="bg-medical-green-600 hover:bg-medical-green-700 text-white shadow-clinical-md"
                        >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            {isResuming ? "Resuming..." : "Resume Setup"}
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="bg-zinc-50 p-6 rounded-3xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center text-center py-12">
                    <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                        <Activity className="w-8 h-8 text-zinc-300" />
                    </div>
                    <h3 className="font-bold text-zinc-600 mb-2">No Active Session</h3>
                    <p className="text-zinc-500 text-sm max-w-sm mb-6">
                        There is no active session open for {patientName}. Start a new one to proceed with treatment.
                    </p>
                    <Link href={`/dashboard/session/new?patientId=${patientId}`}>
                        <Button className="bg-medical-green-600 hover:bg-medical-green-700 text-white shadow-clinical-md">
                            <Play className="w-4 h-4 mr-2" />
                            Start New Session
                        </Button>
                    </Link>
                </div>
            )}

            {/* Completed Sessions (minimal list) */}
            {completedSessions.length > 0 && (
                <div>
                    <h3 className="text-lg font-bold text-zinc-800 mb-4 px-2">History</h3>
                    <div className="space-y-3">
                        {completedSessions.slice(0, 5).map(session => (
                            <div key={session.id} className="flex items-center justify-between p-4 bg-white border-2 border-zinc-100 rounded-2xl">
                                <div>
                                    <p className="font-bold text-zinc-800">{session.treatmentType}</p>
                                    <p className="text-sm text-zinc-400">{new Date(session.createdAt).toLocaleDateString()}</p>
                                </div>
                                <Link href={`/sessions/${session.id}`}>
                                    <Button variant="outline" size="sm" className="font-bold">
                                        View Details
                                    </Button>
                                </Link>
                            </div>
                        ))}
                        {completedSessions.length > 5 && (
                            <Button variant="ghost" className="w-full text-zinc-500">
                                View all history
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
