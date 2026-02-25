"use client";

import { Link } from "@/navigation";
import { Search, User, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface Patient {
    id: string;
    name: string;
    mrn: string;
    gender: string | null;
    createdAt: Date;
}

export function PatientList({ initialPatients }: { initialPatients: Patient[] }) {
    const [search, setSearch] = useState("");

    const filteredPatients = initialPatients.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.mrn.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-3">
            {/* Search bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <Input
                    placeholder="Search by name or MRN..."
                    className="pl-10 h-12 bg-white border-2 border-zinc-100 rounded-2xl font-medium text-base"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Patient cards */}
            <div className="flex flex-col gap-2">
                {filteredPatients.length > 0 ? (
                    filteredPatients.map(patient => (
                        <Link
                            key={patient.id}
                            href={`/dashboard/patient/${patient.id}`}
                            className="flex items-center gap-3 p-4 bg-white border-2 border-zinc-100 rounded-2xl active:bg-medical-green-50 active:border-medical-green-200 transition-all min-h-[64px]"
                        >
                            <div className="w-11 h-11 rounded-xl bg-medical-green-50 flex items-center justify-center text-medical-green-600 shrink-0">
                                <User className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-zinc-900 text-[15px] leading-tight truncate">
                                    {patient.name}
                                </h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-xs font-mono text-zinc-500 font-bold">
                                        {patient.mrn}
                                    </span>
                                    {patient.gender && (
                                        <>
                                            <span className="text-zinc-300">·</span>
                                            <span className="text-xs text-zinc-400 font-medium">
                                                {patient.gender}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-zinc-300 shrink-0" />
                        </Link>
                    ))
                ) : (
                    <div className="py-16 text-center">
                        <User className="w-10 h-10 text-zinc-200 mx-auto mb-3" />
                        <p className="text-zinc-400 font-bold text-sm">
                            No patients found.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
