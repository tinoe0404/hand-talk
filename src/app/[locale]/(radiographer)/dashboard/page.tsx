"use client";

import { useTranslations } from 'next-intl';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/navigation";
import {
    Users,
    Clock,
    AlertTriangle,
    PlayCircle,
    Activity,
    Hand
} from 'lucide-react';
import { useSessionStore } from "@/store/useSessionStore";
import { InstructionSelector } from "@/components/dashboard/instruction-selector";
import { EmergencyTriage } from "@/components/dashboard/emergency-triage";

export default function DashboardPage() {
    const t = useTranslations('Dashboard');
    const { sessionId, visionStatus, isHandDetected, lastGesture, isEmergency } = useSessionStore();
    const isActive = !!sessionId;

    const stats = [
        {
            label: t('stats.today'),
            value: "12",
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            label: t('stats.avgTime'),
            value: "18m",
            icon: Clock,
            color: "text-medical-green-600",
            bg: "bg-medical-green-50"
        },
        {
            label: t('stats.emergency'),
            value: "0",
            icon: AlertTriangle,
            color: "text-orange-600",
            bg: "bg-orange-50"
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
            {/* Global Emergency Alert Overlay (Dashboard Side) */}
            {isEmergency && (
                <div className="fixed inset-0 pointer-events-none z-[60] border-[24px] border-red-600 animate-[pulse_0.75s_ease-in-out_infinite]" />
            )}

            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-extrabold text-medical-green-900 tracking-tight">
                            {t('welcome')}
                        </h1>
                        <p className="text-xl text-medical-green-600 font-medium">
                            {isActive ? "Live Clinical Session Active" : "Ready to authorize patient treatment sessions."}
                        </p>
                    </div>
                </div>
            </div>

            {isActive ? (
                <div className="space-y-8 animate-in zoom-in duration-500">
                    <Card className={`border-4 ${isEmergency ? 'border-red-600 bg-red-50' : 'border-medical-green-600'} shadow-clinical-lg overflow-hidden transition-colors duration-500`}>
                        <div className={`${isEmergency ? 'bg-red-600' : 'bg-medical-green-600'} p-4 flex items-center justify-between text-white transition-colors duration-500`}>
                            <div className="flex items-center gap-3">
                                {isEmergency ? <AlertTriangle className="w-8 h-8 animate-bounce" /> : <PlayCircle className="w-8 h-8 animate-pulse" />}
                                <h2 className="text-2xl font-black uppercase tracking-widest">
                                    {isEmergency ? "TREATMENT HALTED - EMERGENCY" : "Active Shift Control"}
                                </h2>
                            </div>
                            <div className="text-lg font-mono bg-medical-green-900/50 px-4 py-2 rounded-lg border border-medical-green-400/30">
                                SID: {sessionId}
                            </div>
                        </div>

                        {/* Vision Engine Health Bar (Phase 11 Feedback Loop) */}
                        <div className="bg-medical-green-50 border-b-2 border-medical-green-100 px-8 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <Activity className={`w-5 h-5 ${visionStatus === 'ready' ? 'text-medical-green-600 animate-pulse' : 'text-zinc-400'}`} />
                                    <span className="text-xs font-bold uppercase tracking-widest text-medical-green-900">Vision System:</span>
                                    <span className={`text-xs font-black uppercase ${visionStatus === 'ready' ? 'text-medical-green-600' : 'text-zinc-500'}`}>
                                        {visionStatus || 'offline'}
                                    </span>
                                </div>

                                <div className="h-4 w-[2px] bg-medical-green-200" />

                                <div className="flex items-center gap-2">
                                    <Hand className={`w-5 h-5 ${isHandDetected ? 'text-blue-600 animate-bounce' : 'text-zinc-400'}`} />
                                    <span className="text-xs font-bold uppercase tracking-widest text-medical-green-900">Patient Presence:</span>
                                    <span className={`text-xs font-black uppercase ${isHandDetected ? 'text-blue-600' : 'text-zinc-500'}`}>
                                        {isHandDetected ? 'HANDS DETECTED' : 'AWAITING INPUT'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                {lastGesture && (
                                    <div className="flex items-center gap-2 px-3 py-1 bg-medical-green-600 text-white rounded-md animate-in slide-in-from-right-4 duration-300 shadow-clinical-sm">
                                        <Activity className="w-4 h-4" />
                                        <span className="text-xs font-black uppercase tracking-tighter">Active Signal: {lastGesture}</span>
                                    </div>
                                )}

                                {isHandDetected && (
                                    <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 border border-blue-200 rounded-md animate-in fade-in zoom-in duration-300">
                                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-ping" />
                                        <span className="text-[10px] font-black text-blue-700 uppercase">Input Bridge Active</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <CardContent className="p-8">
                            {isEmergency ? (
                                <div className="space-y-8 animate-in fade-in duration-500">
                                    <div className="flex flex-col gap-1 border-b-2 border-red-100 pb-4">
                                        <h3 className="text-3xl font-black text-red-900 tracking-tight flex items-center gap-3">
                                            <AlertTriangle className="w-8 h-8 animate-pulse" />
                                            Incident Triage Required
                                        </h3>
                                        <p className="text-xl text-red-600 font-medium italic">Select the primary reason for patient distress to resolve the halt.</p>
                                    </div>
                                    <EmergencyTriage />
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex flex-col gap-1">
                                        <h3 className="text-3xl font-black text-medical-green-900 tracking-tight">Instruction Playback</h3>
                                        <p className="text-xl text-medical-green-600 font-medium italic">Select a protocol below to broadcast instantly to the patient display.</p>
                                    </div>
                                    <InstructionSelector />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {stats.map((stat, i) => (
                            <Card key={i} className="border-2 border-medical-green-100 shadow-clinical-sm overflow-hidden group hover:border-medical-green-500 transition-all duration-300">
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-medical-green-600 uppercase tracking-widest">
                                            {stat.label}
                                        </p>
                                        <p className="text-3xl font-black text-medical-green-900">
                                            {stat.value}
                                        </p>
                                    </div>
                                    <div className={`${stat.bg} p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                                        <stat.icon className={`w-8 h-8 ${stat.color}`} />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card className="border-4 border-dashed border-medical-green-200 bg-medical-green-50/30">
                        <CardContent className="flex flex-col items-center justify-center py-20 text-center space-y-8">
                            <div className="bg-white p-8 rounded-full shadow-clinical-md">
                                <PlayCircle className="w-20 h-20 text-medical-green-600 animate-pulse" />
                            </div>

                            <div className="max-w-md space-y-4">
                                <h3 className="text-3xl font-bold text-medical-green-900">
                                    {t('activeSession')}
                                </h3>
                                <p className="text-lg text-medical-green-700 font-medium">
                                    No clinical session is currently active. Initialize a new patient record to begin.
                                </p>
                            </div>

                            <Link href="/dashboard/setup">
                                <Button size="lg" className="h-[72px] px-12 text-2xl font-black rounded-clinical shadow-clinical-lg hover:scale-105 transition-transform">
                                    {t('startSession')}
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}
