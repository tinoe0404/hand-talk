"use client";

import { useTranslations } from 'next-intl';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/navigation";
import {
    Users,
    Clock,
    AlertTriangle,
    PlayCircle
} from 'lucide-react';
import { useSessionStore } from "@/store/useSessionStore";
import { InstructionSelector } from "@/components/dashboard/instruction-selector";

export default function DashboardPage() {
    const t = useTranslations('Dashboard');
    const { sessionId } = useSessionStore();
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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-extrabold text-medical-green-900 tracking-tight">
                    {t('welcome')}
                </h1>
                <p className="text-xl text-medical-green-600 font-medium">
                    {isActive ? "Live Clinical Session Active" : "Ready to authorize patient treatment sessions."}
                </p>
            </div>

            {isActive ? (
                <div className="space-y-8 animate-in zoom-in duration-500">
                    <Card className="border-4 border-medical-green-600 shadow-clinical-lg overflow-hidden">
                        <div className="bg-medical-green-600 p-4 flex items-center justify-between text-white">
                            <div className="flex items-center gap-3">
                                <PlayCircle className="w-8 h-8 animate-pulse" />
                                <h2 className="text-2xl font-black uppercase tracking-widest">Active Shift Control</h2>
                            </div>
                            <div className="text-lg font-mono bg-medical-green-900/50 px-4 py-2 rounded-lg border border-medical-green-400/30">
                                SID: {sessionId}
                            </div>
                        </div>
                        <CardContent className="p-8">
                            <div className="space-y-6">
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-3xl font-black text-medical-green-900 tracking-tight">Instruction Playback</h3>
                                    <p className="text-xl text-medical-green-600 font-medium italic">Select a protocol below to broadcast instantly to the patient display.</p>
                                </div>
                                <InstructionSelector />
                            </div>
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
