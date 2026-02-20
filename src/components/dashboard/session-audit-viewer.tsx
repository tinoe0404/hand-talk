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
    Wind
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface EmergencyLog {
    timestamp: string | Date;
    triageSelection: string | null;
    location: string | null;
    subReason: string | null;
    reason: string | null;
}

interface ClinicalSession {
    patientMrn: string;
    createdAt: string | Date;
    status: string;
    emergencyLogs: EmergencyLog[];
}

interface SessionSummaryProps {
    session: ClinicalSession;
}

/**
 * CLINICAL AUDIT VIEWER
 * - Provides a high-fidelity timeline of treatment events.
 * - Highlights emergency interventions and diagnostic follow-ups.
 * - Optimized for post-session clinician review.
 */
export function SessionAuditViewer({ session }: SessionSummaryProps) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Session Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-medical-green-50 border-medical-green-100">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <User className="text-medical-green-600 w-6 h-6" />
                            <div>
                                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Patient MRN</p>
                                <p className="text-lg font-black text-zinc-900">{session.patientMrn}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-blue-50 border-blue-100">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <Calendar className="text-blue-600 w-6 h-6" />
                            <div>
                                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Treatment Date</p>
                                <p className="text-lg font-black text-zinc-900">{format(new Date(session.createdAt), "dd MMM yyyy")}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className={session.emergencyLogs.length > 0 ? "bg-red-50 border-red-100" : "bg-zinc-50 border-zinc-100"}>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <ShieldAlert className={session.emergencyLogs.length > 0 ? "text-red-600 w-6 h-6" : "text-zinc-600 w-6 h-6"} />
                            <div>
                                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Emergencies</p>
                                <p className="text-lg font-black text-zinc-900">{session.emergencyLogs.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-50 border-zinc-100">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <Activity className="text-zinc-600 w-6 h-6" />
                            <div>
                                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Status</p>
                                <Badge variant={session.status === "COMPLETED" ? "success" : "destructive"}>
                                    {session.status}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Event Timeline */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                        <Clock className="w-5 h-5 text-medical-green-600" />
                        Clinical Event Timeline
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Simplified Timeline View */}
                    <div className="border-l-4 border-zinc-100 ml-4 pl-8 space-y-8">
                        {session.emergencyLogs.map((log, idx) => (
                            <div key={idx} className="relative">
                                <span className="absolute -left-[42px] top-0 p-1.5 bg-red-600 rounded-full ring-8 ring-white">
                                    <AlertTriangle className="w-4 h-4 text-white" />
                                </span>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <p className="text-sm font-black text-red-600 uppercase tracking-widest">Emergency intervention</p>
                                        <span className="text-xs font-bold text-zinc-400">
                                            {format(new Date(log.timestamp), "HH:mm:ss")}
                                        </span>
                                    </div>
                                    <div className="bg-red-50 border border-red-100 rounded-xl p-6 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-1">
                                                <p className="text-xs font-black text-red-800/50 uppercase">Distress Reason</p>
                                                <p className="text-xl font-bold text-red-900">{log.triageSelection || "NOT_CATEGORIZED"}</p>
                                            </div>

                                            {log.location && (
                                                <div className="space-y-1">
                                                    <p className="text-xs font-black text-red-800/50 uppercase">Localization</p>
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-4 h-4 text-red-600" />
                                                        <p className="text-xl font-bold text-red-900">{log.location}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {log.subReason && (
                                                <div className="space-y-1">
                                                    <p className="text-xs font-black text-red-800/50 uppercase">Diagnostic Sub-type</p>
                                                    <div className="flex items-center gap-2">
                                                        <Wind className="w-4 h-4 text-red-600" />
                                                        <p className="text-xl font-bold text-red-900">{log.subReason}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {log.reason && (
                                            <div className="pt-4 border-t border-red-200">
                                                <p className="text-xs font-black text-red-800/50 uppercase mb-1">Combined Clinical Note</p>
                                                <p className="text-sm font-medium text-red-900 italic">&quot;{log.reason}&quot;</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="relative">
                            <span className="absolute -left-[42px] top-0 p-1.5 bg-medical-green-600 rounded-full ring-8 ring-white">
                                <CheckCircle2 className="w-4 h-4 text-white" />
                            </span>
                            <div>
                                <p className="text-sm font-black text-zinc-900 uppercase tracking-widest leading-none">Treatment Session Initiated</p>
                                <span className="text-xs font-bold text-zinc-400">
                                    {format(new Date(session.createdAt), "HH:mm:ss")}
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
