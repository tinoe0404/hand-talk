"use client";

import { useEffect, useState } from "react";
import { PatientList } from "./patient-list";
import { PatientRegistrationModal } from "./patient-registration-form";
import { getPatients } from "@/app/[locale]/(radiographer)/dashboard/actions";
import { Loader2 } from "lucide-react";

interface Patient {
    id: string;
    name: string;
    mrn: string;
    gender: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export function DashboardHub() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const p = await getPatients();
                setPatients(p as Patient[]);
            } catch (error) {
                console.error("Failed to fetch patients:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60dvh]">
                <Loader2 className="w-8 h-8 text-medical-green-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 p-4 animate-in fade-in duration-300">
            {/* Header: title + register button */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-medical-green-900 tracking-tight">
                    Patients
                </h1>
                <PatientRegistrationModal />
            </div>

            {/* Patient list */}
            <PatientList initialPatients={patients} />
        </div>
    );
}
