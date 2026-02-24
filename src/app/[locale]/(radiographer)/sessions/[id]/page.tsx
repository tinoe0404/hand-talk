import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { SessionAuditViewer } from "@/components/dashboard/session-audit-viewer";
import { BackButton } from "@/components/dashboard/back-button";

interface SessionDetailsPageProps {
    params: {
        id: string;
        locale: string;
    };
}

/**
 * CLINICAL SESSION AUDIT PAGE
 * - Server-side data fetching for medical records.
 * - Renders the internal audit timeline for a specific clinical event.
 */
export default async function SessionDetailsPage({ params }: SessionDetailsPageProps) {
    const session = await prisma.session.findUnique({
        where: { id: params.id },
        include: {
            emergencyLogs: {
                orderBy: { timestamp: "asc" }
            },
            instructionLogs: {
                orderBy: { timestamp: "asc" }
            },
            gestureLogs: {
                orderBy: { timestamp: "asc" }
            }
        }
    });

    if (!session) {
        notFound();
    }

    return (
        <div className="container mx-auto py-12 px-6 space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <BackButton />
                    <div>
                        <h1 className="text-3xl font-black text-zinc-900 uppercase tracking-tight">
                            Clinical Session Audit
                        </h1>
                        <p className="text-zinc-500 font-medium">
                            Persistent records for Session ID: <span className="font-mono text-medical-green-600">{session.id}</span>
                        </p>
                    </div>
                </div>
            </div>

            <SessionAuditViewer session={session} />
        </div>
    );
}
