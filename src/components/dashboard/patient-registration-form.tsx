"use client";

import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { registerPatientAction } from "@/app/[locale]/(radiographer)/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Plus } from "lucide-react";

export function PatientRegistrationModal() {
    const [open, setOpen] = useState(false);
    const [state, formAction] = useFormState(registerPatientAction, null);

    useEffect(() => {
        if (state?.success) {
            setOpen(false);
        }
    }, [state]);

    return (
        <>
            {/* Compact circle trigger */}
            <button
                onClick={() => setOpen(true)}
                className="w-10 h-10 rounded-full bg-medical-green-600 text-white flex items-center justify-center shadow-lg shadow-medical-green-600/20 active:scale-90 transition-transform"
                aria-label="Register new patient"
            >
                <Plus className="w-5 h-5" strokeWidth={3} />
            </button>

            <Modal
                isOpen={open}
                onClose={() => setOpen(false)}
                title="New Patient"
                description="Create a medical record."
            >
                <form action={formAction} className="space-y-5">
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Full Name</label>
                            <Input name="name" placeholder="e.g. John Doe" required className="h-12 border-2 font-bold rounded-xl" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">MRN</label>
                            <Input name="mrn" placeholder="e.g. P-12345" required className="h-12 border-2 font-mono font-bold rounded-xl" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Gender</label>
                                <select
                                    name="gender"
                                    className="w-full h-12 rounded-xl border-2 border-zinc-200 bg-white px-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-medical-green-500"
                                >
                                    <option value="">Select...</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">DOB</label>
                                <Input name="dob" type="date" className="h-12 border-2 font-bold rounded-xl" />
                            </div>
                        </div>
                    </div>

                    {state?.error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                            <p className="text-xs font-bold text-red-600">
                                {state.error}
                            </p>
                        </div>
                    )}

                    <Button type="submit" className="w-full h-14 text-base font-black shadow-clinical-lg active:scale-95 transition-all rounded-xl">
                        Register Patient
                    </Button>
                </form>
            </Modal>
        </>
    );
}
