import { Users, Activity, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface StatCardProps {
    title: string;
    value: number | string;
    label: string;
    icon: React.ElementType;
    color: "green" | "blue" | "red";
}

function StatCard({ title, value, label, icon: Icon, color }: StatCardProps) {
    const colors = {
        green: "bg-medical-green-50 text-medical-green-600 border-medical-green-100",
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        red: "bg-red-50 text-red-600 border-red-100",
    };

    const iconColors = {
        green: "bg-medical-green-600",
        blue: "bg-blue-600",
        red: "bg-red-600",
    };

    return (
        <div className={cn("p-6 rounded-2xl border-2 transition-all hover:shadow-clinical-md", colors[color])}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs font-black uppercase tracking-widest opacity-70 mb-1">{title}</p>
                    <h3 className="text-3xl font-black">{value}</h3>
                    <p className="text-[10px] font-bold mt-1 opacity-60 italic">{label}</p>
                </div>
                <div className={cn("p-3 rounded-xl text-white shadow-md", iconColors[color])}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
}

export function DashboardStats({ stats }: { stats: { sessionCount: number; patientCount: number; emergencyCount: number } }) {
    const t = useTranslations("Stats");
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
                title={t("sessionsToday")}
                value={stats.sessionCount}
                label={t("sessionsTodayLabel")}
                icon={Activity}
                color="green"
            />
            <StatCard
                title={t("totalPatients")}
                value={stats.patientCount}
                label={t("totalPatientsLabel")}
                icon={Users}
                color="blue"
            />
            <StatCard
                title={t("activeAlarms")}
                value={stats.emergencyCount}
                label={t("activeAlarmsLabel")}
                icon={AlertCircle}
                color="red"
            />
        </div>
    );
}
