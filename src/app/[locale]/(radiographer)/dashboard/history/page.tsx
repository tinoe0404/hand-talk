import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ClipboardCheck } from "lucide-react";
import { Link } from "@/navigation";

export default async function HistoryPage() {
    const t = await getTranslations("History");

    // Fetch clinical logs from Prisma
    const sessions = await prisma.session.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
        include: {
            radiographer: true
        }
    });

    return (
        <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-1 md:gap-2">
                <h1 className="text-3xl md:text-4xl font-extrabold text-medical-green-900 tracking-tight">
                    {t('title')}
                </h1>
                <p className="text-lg md:text-xl text-medical-green-600 font-medium leading-tight">
                    {t('description')}
                </p>
            </div>

            <Card className="border-2 border-medical-green-100 shadow-clinical-lg overflow-hidden">
                <CardHeader className="bg-medical-green-50/50 border-b border-medical-green-100 p-4 md:p-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-medical-green-600 p-2 rounded-lg text-white shadow-md">
                            <ClipboardCheck className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div>
                            <CardTitle className="text-xl md:text-2xl text-medical-green-900">Clinical Log</CardTitle>
                            <CardDescription className="text-medical-green-600 font-medium">Treatment Audit Records</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {/* ── DESKTOP TABLE VIEW ────────────────────────────── */}
                    <div className="hidden md:block">
                        <Table>
                            <TableHeader className="bg-medical-green-50/30">
                                <TableRow>
                                    <TableHead className="font-bold text-medical-green-900 uppercase tracking-wider text-xs">{t('table.patient')}</TableHead>
                                    <TableHead className="font-bold text-medical-green-900 uppercase tracking-wider text-xs">{t('table.mrn')}</TableHead>
                                    <TableHead className="font-bold text-medical-green-900 uppercase tracking-wider text-xs">{t('table.treatment')}</TableHead>
                                    <TableHead className="font-bold text-medical-green-900 uppercase tracking-wider text-xs">{t('table.date')}</TableHead>
                                    <TableHead className="font-bold text-medical-green-900 uppercase tracking-wider text-xs">{t('table.status')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sessions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center text-medical-green-600 font-medium italic">
                                            {t('table.noRecords')}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    sessions.map((session) => (
                                        <TableRow key={session.id} className="hover:bg-medical-green-50/50 transition-colors group cursor-pointer border-medical-green-50">
                                            <TableCell className="font-bold text-medical-green-900">
                                                <Link href={`/sessions/${session.id}`} className="hover:underline flex items-center gap-2">
                                                    {session.patientName}
                                                </Link>
                                            </TableCell>
                                            <TableCell className="font-mono text-sm text-medical-green-700">{session.patientMrn}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="border-medical-green-200 text-medical-green-700 bg-medical-green-50 font-bold">
                                                    {session.treatmentType}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-medical-green-600 font-medium text-sm">
                                                {format(new Date(session.createdAt), "MMM d, yyyy HH:mm")}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={session.status === 'ACTIVE' ? 'default' : 'secondary'}
                                                    className={session.status === 'ACTIVE' ? 'bg-blue-600 shadow-sm' : 'shadow-sm'}
                                                >
                                                    {t(`status.${session.status.toLowerCase()}`)}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* ── MOBILE CARD VIEW ──────────────────────────────── */}
                    <div className="md:hidden divide-y divide-medical-green-50">
                        {sessions.length === 0 ? (
                            <div className="h-32 flex items-center justify-center text-medical-green-600 font-medium italic">
                                {t('table.noRecords')}
                            </div>
                        ) : (
                            sessions.map((session) => (
                                <Link
                                    key={session.id}
                                    href={`/sessions/${session.id}`}
                                    className="block p-4 active:bg-medical-green-50 transition-colors"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="space-y-0.5">
                                            <p className="font-black text-medical-green-900 text-lg uppercase leading-tight">
                                                {session.patientName}
                                            </p>
                                            <p className="font-mono text-[10px] text-medical-green-600 tracking-widest font-bold">
                                                MRN: {session.patientMrn}
                                            </p>
                                        </div>
                                        <Badge
                                            variant={session.status === 'ACTIVE' ? 'default' : 'secondary'}
                                            className={`${session.status === 'ACTIVE' ? 'bg-blue-600' : ''} text-[10px] h-5 px-1.5`}
                                        >
                                            {t(`status.${session.status.toLowerCase()}`)}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between items-center mt-3">
                                        <Badge variant="outline" className="border-medical-green-100 text-medical-green-600 bg-medical-green-50/50 text-[10px]">
                                            {session.treatmentType}
                                        </Badge>
                                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">
                                            {format(new Date(session.createdAt), "MMM d, HH:mm")}
                                        </p>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
