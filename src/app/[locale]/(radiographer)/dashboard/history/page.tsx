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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-extrabold text-medical-green-900 tracking-tight">
                    {t('title')}
                </h1>
                <p className="text-xl text-medical-green-600 font-medium">
                    {t('description')}
                </p>
            </div>

            <Card className="border-2 border-medical-green-100 shadow-clinical-lg overflow-hidden">
                <CardHeader className="bg-medical-green-50/50 border-b border-medical-green-100">
                    <div className="flex items-center gap-3">
                        <div className="bg-medical-green-600 p-2 rounded-lg text-white">
                            <ClipboardCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl text-medical-green-900">Clinical Log</CardTitle>
                            <CardDescription className="text-medical-green-600">Treatment Audit Records</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-medical-green-50/30">
                            <TableRow>
                                <TableHead className="font-bold text-medical-green-900">{t('table.patient')}</TableHead>
                                <TableHead className="font-bold text-medical-green-900">{t('table.mrn')}</TableHead>
                                <TableHead className="font-bold text-medical-green-900">{t('table.treatment')}</TableHead>
                                <TableHead className="font-bold text-medical-green-900">{t('table.date')}</TableHead>
                                <TableHead className="font-bold text-medical-green-900">{t('table.status')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sessions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center text-medical-green-600 font-medium">
                                        {t('table.noRecords')}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sessions.map((session) => (
                                    <TableRow key={session.id} className="hover:bg-medical-green-50/50 transition-colors group cursor-pointer">
                                        <TableCell className="font-bold text-medical-green-900">
                                            <Link href={`/sessions/${session.id}`} className="hover:underline">
                                                {session.patientName}
                                            </Link>
                                        </TableCell>
                                        <TableCell className="font-mono text-sm text-medical-green-700">{session.patientMrn}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="border-medical-green-200 text-medical-green-700 bg-medical-green-50">
                                                {session.treatmentType}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-medical-green-600 font-medium">
                                            {format(new Date(session.createdAt), "MMM d, yyyy HH:mm")}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={session.status === 'ACTIVE' ? 'default' : 'secondary'}
                                                className={session.status === 'ACTIVE' ? 'bg-blue-600' : ''}
                                            >
                                                {t(`status.${session.status.toLowerCase()}`)}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
