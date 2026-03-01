"use client";

import { useEffect, useState } from "react";
import { PatientList } from "./patient-list";
import { PatientRegistrationModal } from "./patient-registration-form";
import { getPatients } from "@/app/[locale]/(radiographer)/dashboard/actions";


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
            <div className="flex flex-col gap-4 p-4">
                {/* Skeleton header */}
                <div className="flex items-center justify-between">
                    <div className="skeleton h-8 w-32" />
                    <div className="skeleton h-10 w-10 rounded-full" />
                </div>
                {/* Skeleton search */}
                <div className="skeleton h-12 w-full rounded-2xl" />
                {/* Skeleton patient cards */}
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-4 rounded-2xl border-2 border-zinc-100">
                        <div className="skeleton h-11 w-11 rounded-xl shrink-0" />
                        <div className="flex-1 space-y-2">
                            <div className="skeleton h-4 w-2/3" />
                            <div className="skeleton h-3 w-1/3" />
                        </div>
                        <div className="skeleton h-5 w-5 rounded shrink-0" />
                    </div>
                ))}
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
