import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import { Activity, Users, AlertTriangle, ShieldCheck } from "lucide-react";
import { AnalyticsCharts } from "./analytics-charts";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
    const t = await getTranslations("Dashboard");

    // Fetch core statistics
    const totalSessions = await prisma.session.count();
    const completedSessions = await prisma.session.count({
        where: { status: "COMPLETED" },
    });
    const uniquePatients = await prisma.patient.count();

    // Calculate total emergency halts
    const totalEmergencies = await prisma.emergencyLog.count();

    // Calculate gesture frequency
    const gesturesRaw = await prisma.gestureLog.groupBy({
        by: ["gestureType"],
        _count: {
            gestureType: true,
        },
        orderBy: {
            _count: {
                gestureType: "desc",
            }
        },
        take: 5
    });

    const formattedGestures = gesturesRaw.map(g => ({
        name: g.gestureType,
        count: g._count.gestureType
    }));

    // Calculate instruction frequency (top 5 broadcasts)
    const instructionsRaw = await prisma.instructionLog.groupBy({
        by: ["instructionId"],
        _count: {
            instructionId: true,
        },
        orderBy: {
            _count: {
                instructionId: "desc",
            }
        },
        take: 5
    });

    const formattedInstructions = instructionsRaw.map(i => ({
        name: i.instructionId,
        count: i._count.instructionId
    }));

    // Generate a quick completion rate
    const completionRate = totalSessions > 0
        ? Math.round((completedSessions / totalSessions) * 100)
        : 0;

    return (
        <div className="container max-w-5xl mx-auto p-4 md:p-8 space-y-8 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">
                    {t("analytics")}
                </h1>
                <p className="text-zinc-500 font-medium mt-2">
                    Hospital-wide radiographer acoustic translation usage metrics.
                </p>
            </div>

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-medical-green-50/50 border-medical-green-100/50 shadow-sm">
                    <CardContent className="p-6">
                        <Users className="w-6 h-6 text-medical-green-600 mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-medical-green-700/70 mb-1">
                            Total Patients
                        </p>
                        <p className="text-3xl font-black text-medical-green-900 tracking-tighter">
                            {uniquePatients}
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-blue-50/50 border-blue-100/50 shadow-sm">
                    <CardContent className="p-6">
                        <Activity className="w-6 h-6 text-blue-600 mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-700/70 mb-1">
                            Total Sessions
                        </p>
                        <p className="text-3xl font-black text-blue-900 tracking-tighter">
                            {totalSessions}
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-orange-50/50 border-orange-100/50 shadow-sm">
                    <CardContent className="p-6">
                        <AlertTriangle className="w-6 h-6 text-orange-600 mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-orange-700/70 mb-1">
                            Emergency Halts
                        </p>
                        <p className="text-3xl font-black text-orange-900 tracking-tighter">
                            {totalEmergencies}
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-indigo-50/50 border-indigo-100/50 shadow-sm">
                    <CardContent className="p-6">
                        <ShieldCheck className="w-6 h-6 text-indigo-600 mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-700/70 mb-1">
                            Completion Rate
                        </p>
                        <p className="text-3xl font-black text-indigo-900 tracking-tighter">
                            {completionRate}%
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Interactive Charts Area (Client Component) */}
            <AnalyticsCharts
                gestures={formattedGestures}
                instructions={formattedInstructions}
            />
        </div>
    );
}
