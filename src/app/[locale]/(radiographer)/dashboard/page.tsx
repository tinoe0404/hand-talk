"use client";

import { useTranslations } from 'next-intl';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/navigation";
import {
    Users,
    Clock,
    AlertTriangle,
    PlayCircle,
    Activity,
    Hand,
    ChevronRight
} from 'lucide-react';
import { useSessionStore } from "@/store/useSessionStore";
import { InstructionSelector } from "@/components/dashboard/instruction-selector";
import { EmergencyTriage } from "@/components/dashboard/emergency-triage";
import { useEffect, useState } from 'react';

import { getDashboardStats } from "@/lib/actions/stats-actions";

export default function DashboardPage() {
    const t = useTranslations('Dashboard');
    const tE = useTranslations('Emergency');
    const { sessionId, visionStatus, isHandDetected, lastGesture, isEmergency, hasSeenGestureGuide, setHasSeenGestureGuide } = useSessionStore();
    const [isOnline, setIsOnline] = useState(true);
    const [liveStats, setLiveStats] = useState({ today: 0, avgTime: "0m", emergencies: 0 });

    useEffect(() => {
        setIsOnline(navigator.onLine);
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Fetch initial stats
        const fetchStats = async () => {
            const stats = await getDashboardStats();
            setLiveStats(stats);
        };
        fetchStats();

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [sessionId]); // Re-fetch when session state changes

    const isActive = !!sessionId;

    const stats = [
        {
            label: t('stats.today'),
            value: liveStats.today.toString(),
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            label: t('stats.avgTime'),
            value: liveStats.avgTime,
            icon: Clock,
            color: "text-medical-green-600",
            bg: "bg-medical-green-50"
        },
        {
            label: t('stats.emergency'),
            value: liveStats.emergencies.toString(),
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
                        <h1 className="text-2xl md:text-4xl font-extrabold text-medical-green-900 tracking-tight">
                            {t('welcome')}
                        </h1>
                        <p className="text-base md:text-xl text-medical-green-600 font-medium">
                            {isActive ? "Live Clinical Session Active" : "Ready to authorize patient treatment sessions."}
                        </p>
                    </div>
                </div>
            </div>

            {isActive ? (
                <div className="space-y-8 animate-in zoom-in duration-500">
                    <Card className={`border-4 ${isEmergency ? 'border-red-600 bg-red-50' : 'border-medical-green-600'} shadow-clinical-lg overflow-hidden transition-colors duration-500`}>
                        <div className={`${isEmergency ? 'bg-red-600' : 'bg-medical-green-600'} p-3 md:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-white transition-colors duration-500`}>
                            <div className="flex items-center gap-3">
                                {isEmergency ? <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 animate-bounce" /> : <PlayCircle className="w-6 h-6 md:w-8 md:h-8 animate-pulse" />}
                                <h2 className="text-base md:text-2xl font-black uppercase tracking-widest">
                                    {isEmergency ? tE("haltTitle") : tE("shiftControl")}
                                </h2>
                            </div>
                            <div className="text-xs md:text-lg font-mono bg-medical-green-900/50 px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-medical-green-400/30 truncate max-w-full">
                                SID: {sessionId}
                            </div>
                        </div>

                        {/* Vision Engine Health Bar (Phase 11 Feedback Loop) */}
                        <div className="bg-medical-green-50 border-b-2 border-medical-green-100 px-4 md:px-8 py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-3 md:gap-6">
                                <div className="flex items-center gap-2">
                                    <Activity className={`w-4 h-4 md:w-5 md:h-5 ${visionStatus === 'ready' ? 'text-medical-green-600 animate-pulse' : 'text-zinc-400'}`} />
                                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-medical-green-900">Vision:</span>
                                    <span className={`text-[10px] md:text-xs font-black uppercase ${visionStatus === 'ready' ? 'text-medical-green-600' : 'text-zinc-500'}`}>
                                        {visionStatus || tE('statusOffline')}
                                    </span>
                                </div>

                                <div className="hidden md:block h-4 w-[2px] bg-medical-green-200" />

                                <div className="flex items-center gap-2">
                                    <Hand className={`w-4 h-4 md:w-5 md:h-5 ${isHandDetected ? 'text-blue-600 animate-bounce' : 'text-zinc-400'}`} />
                                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-medical-green-900">Presence:</span>
                                    <span className={`text-[10px] md:text-xs font-black uppercase ${isHandDetected ? 'text-blue-600' : 'text-zinc-500'}`}>
                                        {isHandDetected ? 'DETECTED' : tE('presenceAwaiting')}
                                    </span>
                                </div>

                                {!isOnline && (
                                    <div className="flex items-center gap-2 animate-pulse">
                                        <AlertTriangle className="w-4 h-4 text-red-600" />
                                        <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">{tE('statusOffline').toUpperCase()}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-4">
                                {!hasSeenGestureGuide && !isEmergency && (
                                    <Button
                                        variant="outline"
                                        className="bg-medical-green-100 hover:bg-medical-green-200 text-medical-green-900 border-medical-green-300 font-bold animate-pulse"
                                        onClick={() => setHasSeenGestureGuide(true)}
                                    >
                                        Continue to Instructions
                                        <ChevronRight className="w-4 h-4 ml-2" />
                                    </Button>
                                )}

                                {lastGesture && (
                                    <div className="flex items-center gap-2 px-3 py-1 bg-medical-green-600 text-white rounded-md animate-in slide-in-from-right-4 duration-300 shadow-clinical-sm">
                                        <Activity className="w-4 h-4" />
                                        <span className="text-xs font-black uppercase tracking-tighter">Active Signal: {lastGesture}</span>
                                    </div>
                                )}

                                {isHandDetected && (
                                    <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 border border-blue-200 rounded-md animate-in fade-in zoom-in duration-300">
                                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-ping" />
                                        <span className="text-[10px] font-black text-blue-700 uppercase">{tE('inputBridge')}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <CardContent className="p-4 md:p-8">
                            {isEmergency ? (
                                <div className="space-y-8 animate-in fade-in duration-500">
                                    <div className="flex flex-col gap-1 border-b-2 border-red-100 pb-4">
                                        <h3 className="text-xl md:text-3xl font-black text-red-900 tracking-tight flex items-center gap-3">
                                            <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 animate-pulse" />
                                            {tE('triageTitle')}
                                        </h3>
                                        <p className="text-base md:text-xl text-red-600 font-medium italic">{tE('triageDesc')}</p>
                                    </div>
                                    <EmergencyTriage />
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex flex-col gap-1">
                                        <h3 className="text-xl md:text-3xl font-black text-medical-green-900 tracking-tight">{t('playbackTitle')}</h3>
                                        <p className="text-sm md:text-xl text-medical-green-600 font-medium italic">{t('playbackDesc')}</p>
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
                                    {t('noActive')}
                                </p>
                            </div>

                            <Link href="/dashboard/setup">
                                <Button size="lg" className="h-[56px] md:h-[72px] px-8 md:px-12 text-lg md:text-2xl font-black rounded-clinical shadow-clinical-lg hover:scale-105 transition-transform">
                                    {t('startSession')}
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* RECENT TREATMENTS / AUDIT TRAIL */}
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                            <h3 className="text-lg md:text-2xl font-black text-medical-green-900 uppercase tracking-tight">{t('recent')}</h3>
                            <Button variant="outline" className="text-xs font-bold uppercase tracking-widest border-2">{t('viewFull')}</Button>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {[1].map((_, i) => (
                                <Card key={i} className="border-2 border-zinc-100 hover:border-medical-green-500 transition-all group">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 md:p-6 gap-4">
                                        <div className="flex items-center gap-4 md:gap-6">
                                            <div className="w-12 h-12 md:w-16 md:h-16 bg-zinc-50 rounded-xl flex items-center justify-center border-2 border-zinc-100 group-hover:border-medical-green-200 transition-colors shrink-0">
                                                <Activity className="text-zinc-300 w-6 h-6 md:w-8 md:h-8 group-hover:text-medical-green-600 transition-colors" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <p className="text-base md:text-lg font-black text-zinc-900">P-10052</p>
                                                    <Badge variant="success" className="text-[10px] py-0">COMPLETED</Badge>
                                                </div>
                                                <p className="text-[10px] md:text-xs font-bold text-zinc-400 uppercase tracking-widest leading-none">Chest SBRT • 14:22 • 20 Feb 2026</p>
                                            </div>
                                        </div>
                                        <Link href="/sessions/cl_mock_123">
                                            <Button variant="ghost" className="text-medical-green-600 font-black uppercase tracking-tight hover:bg-medical-green-50 text-sm">
                                                Audit Trail
                                                <ChevronRight className="w-5 h-5 ml-1" />
                                            </Button>
                                        </Link>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
