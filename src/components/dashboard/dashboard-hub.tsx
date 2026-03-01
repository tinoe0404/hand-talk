import { PatientList } from "./patient-list";


interface Patient {
    id: string;
    name: string;
    mrn: string;
    gender: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export function DashboardHub({ initialPatients }: { initialPatients: Patient[] }) {

    return (
        <div className="flex flex-col gap-4 p-4 animate-in fade-in duration-300">
            {/* Header: title + register button are now handled in PatientList to share optimistic UI */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-medical-green-900 tracking-tight">
                    Patients
                </h1>
            </div>

            {/* Patient list */}
            <PatientList initialPatients={initialPatients} />
        </div>
    );
}
