"use client";

import { useEffect, useState } from "react";
import { DashboardStats } from "./stats-cards";
import { PatientList } from "./patient-list";
import { PatientRegistrationModal } from "./patient-registration-form";
import { getDashboardStats, getPatients } from "@/app/[locale]/(radiographer)/dashboard/actions";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Users, ClipboardList, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DashboardStatsData {
    sessionCount: number;
    patientCount: number;
    emergencyCount: number;
}

interface Patient {
    id: string;
    name: string;
    mrn: string;
    gender: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export function DashboardHub() {
    const [stats, setStats] = useState<DashboardStatsData | null>(null);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [s, p] = await Promise.all([
                    getDashboardStats(),
                    getPatients()
                ]);
                setStats(s as DashboardStatsData);
                setPatients(p as Patient[]);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-medical-green-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 p-6 md:p-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-medical-green-900 tracking-tight">
                        Clinical Overview
                    </h1>
                    <p className="text-zinc-500 font-bold italic mt-1">
                        Welcome back. Standardizing communication for better patient outcomes.
                    </p>
                </div>
                <PatientRegistrationModal />
            </div>

            {/* Statistics Section */}
            {stats && <DashboardStats stats={stats} />}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Patient List Section */}
                <Card className="lg:col-span-2 border-2 border-zinc-100 shadow-clinical-lg overflow-hidden">
                    <CardHeader className="bg-zinc-50/50 border-b border-zinc-100">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-600 p-2 rounded-xl text-white">
                                <Users className="w-5 h-5" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">Patient Directory</CardTitle>
                                <CardDescription className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                                    Quick-start treatment sessions
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <PatientList initialPatients={patients} />
                    </CardContent>
                </Card>

                {/* Right Column: Alerts/History/Info */}
                <div className="space-y-6">
                    <Card className="border-2 border-medical-green-100 shadow-clinical-md overflow-hidden bg-medical-green-50/20">
                        <CardHeader className="pb-3 px-6 pt-6">
                            <div className="flex items-center gap-3">
                                <div className="bg-medical-green-600 p-2 rounded-xl text-white">
                                    <ClipboardList className="w-5 h-5" />
                                </div>
                                <CardTitle className="text-lg">Protocol Quick-Link</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="px-6 pb-6 space-y-3">
                            <p className="text-xs font-medium text-medical-green-700 leading-relaxed">
                                Standardized radiotherapy communication allows for 22% reduction in patient movement during scans.
                            </p>
                            <div className="p-3 bg-white rounded-xl border border-medical-green-100 text-[10px] font-bold text-medical-green-600 italic">
                                Tip: Ensure camera visibility for gesture detection.
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-2 border-zinc-100 shadow-clinical-md">
                        <CardHeader className="pb-3 px-6 pt-6">
                            <CardTitle className="text-lg">System Health</CardTitle>
                        </CardHeader>
                        <CardContent className="px-6 pb-6 space-y-4">
                            <div className="flex items-center justify-between text-xs font-bold">
                                <span className="text-zinc-400 uppercase tracking-widest">Gesture Engine</span>
                                <Badge className="bg-medical-green-100 text-medical-green-700 hover:bg-medical-green-100 border-none">Ready</Badge>
                            </div>
                            <div className="flex items-center justify-between text-xs font-bold">
                                <span className="text-zinc-400 uppercase tracking-widest">Local Database</span>
                                <Badge className="bg-medical-green-100 text-medical-green-700 hover:bg-medical-green-100 border-none">Synced</Badge>
                            </div>
                            <div className="flex items-center justify-between text-xs font-bold">
                                <span className="text-zinc-400 uppercase tracking-widest">Display Bridge</span>
                                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">Active</Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
