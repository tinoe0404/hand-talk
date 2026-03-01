import { DashboardClient } from "./dashboard-client";
import { getPatients } from "@/app/[locale]/(radiographer)/dashboard/actions";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const patients = await getPatients();
    return <DashboardClient initialPatients={patients as { id: string, name: string, mrn: string, gender: string | null, createdAt: Date, updatedAt: Date }[]} />;
}
