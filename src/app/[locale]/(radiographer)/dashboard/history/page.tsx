import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Link } from "@/navigation";
import { ChevronRight } from "lucide-react";

export default async function HistoryPage() {
    const t = await getTranslations("History");

    const sessions = await prisma.session.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
        include: {
            radiographer: true,
            patient: true
        }
    });

    return (
        <div className="flex flex-col gap-4 p-4 animate-in fade-in duration-300">
            <h1 className="text-2xl font-black text-medical-green-900 tracking-tight">
                {t("title")}
            </h1>

            {sessions.length === 0 ? (
                <div className="py-16 text-center">
                    <p className="text-zinc-400 font-bold text-sm italic">
                        {t("table.noRecords")}
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {sessions.map((session) => (
                        <Link
                            key={session.id}
                            href={`/dashboard/patient/${session.patient.id}`}
                            className="flex items-center gap-3 p-4 bg-white border-2 border-zinc-100 rounded-2xl active:bg-medical-green-50 transition-all min-h-[64px]"
                        >
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <p className="font-bold text-zinc-900 text-[15px] truncate">
                                        {session.patient.name}
                                    </p>
                                    <Badge
                                        variant={session.status === "ACTIVE" ? "default" : "secondary"}
                                        className={`text-[9px] h-4 px-1.5 shrink-0 ${session.status === "ACTIVE" ? "bg-blue-600" : ""
                                            }`}
                                    >
                                        {t(`status.${session.status.toLowerCase()}`)}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-mono text-zinc-400 font-bold">
                                        {session.patient.mrn}
                                    </span>
                                    <span className="text-zinc-300">·</span>
                                    <span className="text-xs text-zinc-400">
                                        {session.treatmentType}
                                    </span>
                                    <span className="text-zinc-300">·</span>
                                    <span className="text-[11px] text-zinc-400">
                                        {format(new Date(session.createdAt), "MMM d, HH:mm")}
                                    </span>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-zinc-300 shrink-0" />
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
