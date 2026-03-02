"use client";

import { Link } from "@/navigation";
import { Search, User, ChevronRight, Trash2, Loader2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import React, { useState, useTransition, useOptimistic } from "react";
import { Modal } from "@/components/ui/modal";
import { deletePatientAction } from "@/app/[locale]/(radiographer)/dashboard/actions";
import { PatientRegistrationModal } from "./patient-registration-form";

interface Patient {
    id: string;
    name: string;
    mrn: string;
    gender: string | null;
    createdAt: Date;
}

export function PatientList({ initialPatients }: { initialPatients: Patient[] }) {
    const [search, setSearch] = useState("");
    const [isPending, startTransition] = useTransition();
    const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);

    const [optimisticPatients, modifyOptimisticPatients] = useOptimistic(
        initialPatients,
        (state: Patient[], action: { type: 'add' | 'delete', payload: string | Patient }) => {
            switch (action.type) {
                case 'add':
                    return [action.payload as Patient, ...state];
                case 'delete':
                    return state.filter((p) => p.id !== action.payload as string);
                default:
                    return state;
            }
        }
    );

    const filteredPatients = React.useMemo(() =>
        optimisticPatients.filter(p =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.mrn.toLowerCase().includes(search.toLowerCase())
        ), [optimisticPatients, search]);

    const handleDelete = () => {
        if (!patientToDelete) {
            return;
        }

        const idToDelete = patientToDelete.id;

        startTransition(async () => {
            // Optimistically update UI
            modifyOptimisticPatients({ type: 'delete', payload: idToDelete });
            setPatientToDelete(null);

            // Background server execution
            const result = await deletePatientAction(idToDelete);
            if (result?.error) {
                alert(result.error);
            }
        });
    };

    return (
        <div className="space-y-4">
            {/* Top Bar with Registration */}
            <div className="flex items-center justify-end">
                <PatientRegistrationModal
                    onOptimisticAdd={(patient) => startTransition(() => {
                        modifyOptimisticPatients({ type: 'add', payload: patient });
                    })}
                />
            </div>

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
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setPatientToDelete(patient);
                                    }}
                                    className="p-2 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                    aria-label="Delete patient"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                                <ChevronRight className="w-5 h-5 text-zinc-300 shrink-0" />
                            </div>
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

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={!!patientToDelete}
                onClose={() => setPatientToDelete(null)}
                title="Delete Patient"
                description={`Remove ${patientToDelete?.name} from records?`}
            >
                <div className="space-y-5">
                    <div className="flex gap-4 p-4 rounded-xl bg-red-50 border-2 border-red-100 items-start">
                        <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <p className="text-sm font-bold text-red-900">This action cannot be undone.</p>
                            <p className="text-xs font-medium text-red-700 leading-relaxed">
                                Deleting this patient will permanently remove their profile. Active sessions associated with this patient must be ended first.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setPatientToDelete(null)}
                            disabled={isPending}
                            className="flex-1 h-12 rounded-xl border-2 border-zinc-200 text-zinc-700 font-bold text-sm hover:bg-zinc-50 transition-all active:scale-95 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isPending}
                            className="flex-1 h-12 rounded-xl bg-red-600 text-white font-black text-sm hover:bg-red-700 transition-all active:scale-95 flex items-center justify-center disabled:opacity-50"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Deleting
                                </>
                            ) : (
                                "Delete Patient"
                            )}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
