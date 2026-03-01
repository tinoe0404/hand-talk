"use client";

import {
    Clock,
    Calendar,
    User,
    ShieldAlert,
    Activity,
    CheckCircle2,
    AlertTriangle,
    MapPin,
    Wind,
    Hand,
    PlayCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useTranslations } from "next-intl";

interface EmergencyLog {
    timestamp: string | Date;
    triageSelection: string | null;
    location: string | null;
    subReason: string | null;
    reason: string | null;
}

interface InstructionLog {
    timestamp: string | Date;
    instructionId: string;
}

interface GestureLog {
    timestamp: string | Date;
    gestureType: string;
    confidence: number;
}

interface ClinicalSession {
    id: string;
    patient: {
        name: string;
        mrn: string;
    };
    createdAt: string | Date;
    status: string;
    emergencyLogs: EmergencyLog[];
    instructionLogs: InstructionLog[];
    gestureLogs: GestureLog[];
}

interface SessionSummaryProps {
    session: ClinicalSession;
}

type TimelineEvent =
    | { type: 'EMERGENCY', timestamp: Date, data: EmergencyLog }
    | { type: 'INSTRUCTION', timestamp: Date, data: InstructionLog }
    | { type: 'GESTURE', timestamp: Date, data: GestureLog }
    | { type: 'START', timestamp: Date };

/**
 * CLINICAL AUDIT VIEWER
 * - Provides a high-fidelity timeline of treatment events.
 * - Highlights emergency interventions and diagnostic follow-ups.
 * - NEW: Interleaves instruction playback and patient gestures for full legal record.
 */
export function SessionAuditViewer({ session }: SessionSummaryProps) {
    const tIns = useTranslations("Instructions");

    // Combine and sort events
    const timelineEvents: TimelineEvent[] = [
        ...session.emergencyLogs.map(log => ({ type: 'EMERGENCY' as const, timestamp: new Date(log.timestamp), data: log })),
        ...session.instructionLogs.map(log => ({ type: 'INSTRUCTION' as const, timestamp: new Date(log.timestamp), data: log })),
        ...session.gestureLogs.map(log => ({ type: 'GESTURE' as const, timestamp: new Date(log.timestamp), data: log })),
        { type: 'START' as const, timestamp: new Date(session.createdAt) }
    ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()); // Chronological reverse (latest first)

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Session Header Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Card className="bg-medical-green-50 border-medical-green-100">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <User className="text-medical-green-600 w-6 h-6 shrink-0" />
                            <div>
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-1">Patient Name</p>
                                <p className="text-base font-black text-zinc-900">{session.patient.name}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-50 border-zinc-100">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <User className="text-zinc-600 w-6 h-6 shrink-0" />
                            <div>
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-1">Patient MRN</p>
                                <p className="text-base font-black text-zinc-900">{session.patient.mrn}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-blue-50 border-blue-100">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <Calendar className="text-blue-600 w-6 h-6 shrink-0" />
                            <div>
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-1">Execution Date</p>
                                <p className="text-base font-black text-zinc-900">{format(new Date(session.createdAt), "dd MMM yyyy")}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className={session.emergencyLogs.length > 0 ? "bg-red-50 border-red-100" : "bg-zinc-50 border-zinc-100"}>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <ShieldAlert className={session.emergencyLogs.length > 0 ? "text-red-600 w-6 h-6 shrink-0" : "text-zinc-600 w-6 h-6 shrink-0"} />
                            <div>
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-1">Emergency Intervention</p>
                                <p className="text-base font-black text-zinc-900">{session.emergencyLogs.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-orange-50 border-orange-100">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <PlayCircle className="text-orange-600 w-6 h-6 shrink-0" />
                            <div>
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-1">Instructions Played</p>
                                <p className="text-base font-black text-zinc-900">{session.instructionLogs.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-indigo-50 border-indigo-100">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <Hand className="text-indigo-600 w-6 h-6 shrink-0" />
                            <div>
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-1">Gestures Detected</p>
                                <p className="text-base font-black text-zinc-900">{session.gestureLogs.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-50 border-zinc-100">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <Activity className="text-zinc-600 w-6 h-6 shrink-0" />
                            <div>
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-1">Final Status</p>
                                <Badge variant={session.status === "COMPLETED" ? "success" : "destructive"} className="text-[10px] py-0">
                                    {session.status}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Event Timeline */}
            <Card className="border-2 shadow-clinical-md overflow-hidden">
                <CardHeader className="bg-zinc-50 border-b-2">
                    <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                        <Clock className="w-6 h-6 text-medical-green-600" />
                        Comprehensive Clinical Timeline
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {/* Unified Timeline View */}
                    <div className="divide-y divide-zinc-100">
                        {timelineEvents.map((event, idx) => {
                            if (event.type === 'START') {
                                return (
                                    <div key={idx} className="flex items-center gap-6 p-6 md:p-8 bg-medical-green-50/50">
                                        <div className="w-12 h-12 rounded-full bg-medical-green-600 flex items-center justify-center shrink-0 ring-8 ring-medical-green-100">
                                            <CheckCircle2 className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-lg font-black text-medical-green-900 uppercase tracking-tight">Treatment Session Initiated</p>
                                            <span className="text-sm font-bold text-medical-green-600">
                                                {format(event.timestamp, "HH:mm:ss")}
                                            </span>
                                        </div>
                                    </div>
                                );
                            }

                            if (event.type === 'EMERGENCY') {
                                const log = event.data;
                                return (
                                    <div key={idx} className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-10 hover:bg-red-50/30 transition-colors">
                                        <div className="flex items-center md:flex-col gap-4 md:gap-2 md:w-24 shrink-0">
                                            <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shrink-0 ring-8 ring-red-100">
                                                <AlertTriangle className="w-6 h-6 text-white" />
                                            </div>
                                            <span className="text-xs font-black text-red-600 bg-white px-2 py-1 rounded border border-red-200 shadow-sm">
                                                {format(event.timestamp, "HH:mm:ss")}
                                            </span>
                                        </div>

                                        <div className="flex-1 space-y-4">
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
                                                <p className="text-xl font-black text-red-900 uppercase tracking-tight">Emergency Intervention</p>
                                                <Badge variant="destructive" className="animate-pulse">CRITICAL HALT</Badge>
                                            </div>

                                            <div className="bg-white border-2 border-red-100 rounded-xl p-6 shadow-sm overflow-hidden">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Initial Reason</p>
                                                        <p className="text-lg font-black text-red-900 leading-tight">{log.triageSelection || "UNRESOLVED"}</p>
                                                    </div>

                                                    {log.location && (
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Localized Localization</p>
                                                            <div className="flex items-center gap-2">
                                                                <MapPin className="w-4 h-4 text-red-600" />
                                                                <p className="text-lg font-black text-red-900 leading-tight">{log.location}</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {log.subReason && (
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Diagnostic Detail</p>
                                                            <div className="flex items-center gap-2">
                                                                <Wind className="w-4 h-4 text-red-600" />
                                                                <p className="text-lg font-black text-red-900 leading-tight">{log.subReason}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {log.reason && (
                                                    <div className="mt-6 pt-4 border-t border-red-50">
                                                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Integrated Log Message</p>
                                                        <p className="text-sm font-medium text-red-900 italic">&quot;{log.reason}&quot;</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            if (event.type === 'INSTRUCTION') {
                                const log = event.data;
                                return (
                                    <div key={idx} className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-10 hover:bg-orange-50/30 transition-colors">
                                        <div className="flex items-center md:flex-col gap-4 md:gap-2 md:w-24 shrink-0">
                                            <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center shrink-0 ring-8 ring-orange-100">
                                                <PlayCircle className="w-6 h-6 text-white" />
                                            </div>
                                            <span className="text-xs font-bold text-zinc-400">
                                                {format(event.timestamp, "HH:mm:ss")}
                                            </span>
                                        </div>

                                        <div className="flex-1 space-y-2">
                                            <p className="text-sm font-black text-orange-600 uppercase tracking-widest">Instruction broadcast change</p>
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                                <Badge variant="outline" className="border-orange-200 text-orange-700 bg-orange-50 font-black px-4">{log.instructionId}</Badge>
                                                <p className="text-2xl font-black text-zinc-900 tracking-tight">
                                                    {tIns(`${log.instructionId}.title`)}
                                                </p>
                                            </div>
                                            <p className="text-sm text-zinc-500 font-medium italic">{tIns(`${log.instructionId}.desc`)}</p>
                                        </div>
                                    </div>
                                );
                            }

                            if (event.type === 'GESTURE') {
                                const log = event.data;
                                return (
                                    <div key={idx} className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-10 hover:bg-indigo-50/30 transition-colors">
                                        <div className="flex items-center md:flex-col gap-4 md:gap-2 md:w-24 shrink-0">
                                            <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 ring-8 ring-indigo-100">
                                                <Hand className="w-6 h-6 text-white" />
                                            </div>
                                            <span className="text-xs font-bold text-zinc-400">
                                                {format(event.timestamp, "HH:mm:ss")}
                                            </span>
                                        </div>

                                        <div className="flex-1 space-y-2">
                                            <p className="text-sm font-black text-indigo-600 uppercase tracking-widest">Patient signal detected</p>
                                            <div className="flex items-center gap-4">
                                                <p className="text-2xl font-black text-zinc-900 tracking-tight">
                                                    {log.gestureType}
                                                </p>
                                                <Badge variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-50">
                                                    {(log.confidence * 100).toFixed(0)}% Confidence
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            return null;
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
