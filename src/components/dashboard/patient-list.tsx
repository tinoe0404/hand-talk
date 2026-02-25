"use client";

import { Link } from "@/navigation";
import {
    Search,
    User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <Input
                    placeholder="Search patients by name or MRN..."
                    className="pl-12 h-14 bg-zinc-50 border-2 border-zinc-100 rounded-xl font-medium"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredPatients.length > 0 ? (
                    filteredPatients.map(patient => (
                        <div
                            key={patient.id}
                            className="group flex items-center justify-between p-4 bg-white border-2 border-zinc-100 rounded-2xl hover:border-medical-green-200 hover:shadow-clinical-md transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-medical-green-50 flex items-center justify-center text-medical-green-600 group-hover:bg-medical-green-600 group-hover:text-white transition-colors">
                                    <User className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-black text-medical-green-950">{patient.name}</h4>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <Badge variant="outline" className="text-[10px] font-mono leading-none py-0.5">
                                            {patient.mrn}
                                        </Badge>
                                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                                            {patient.gender || "Gender not set"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <Link href={`/dashboard/patient/${patient.id}`}>
                                <Button
                                    size="sm"
                                    className="h-10 px-4 rounded-lg bg-zinc-50 text-medical-green-700 border-2 border-transparent hover:bg-medical-green-600 hover:text-white transition-all gap-2 font-bold"
                                >
                                    View
                                </Button>
                            </Link>
                        </div>
                    ))
                ) : (
                    <div className="py-12 text-center bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-200">
                        <p className="text-zinc-500 font-bold italic">No patients found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
