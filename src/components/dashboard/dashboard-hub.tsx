import { PatientList } from "./patient-list";
import { getPatients } from "@/app/[locale]/(radiographer)/dashboard/actions";


interface Patient {
    id: string;
    name: string;
    mrn: string;
    gender: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export async function DashboardHub() {
    const patients = await getPatients() as Patient[];

    return (
        <div className="flex flex-col gap-4 p-4 animate-in fade-in duration-300">
            {/* Header: title + register button are now handled in PatientList to share optimistic UI */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-medical-green-900 tracking-tight">
                    Patients
                </h1>
            </div>

            {/* Patient list */}
            <PatientList initialPatients={patients} />
        </div>
    );
}
