"use client";

import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { registerPatientAction } from "@/app/[locale]/(radiographer)/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { UserPlus } from "lucide-react";

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
            <Button
                onClick={() => setOpen(true)}
                variant="primary"
                className="gap-2 shadow-clinical-md h-12 md:h-14 md:px-6"
            >
                <UserPlus className="w-5 h-5" />
                <span className="hidden sm:inline">Register Patient</span>
                <span className="sm:hidden">Register</span>
            </Button>

            <Modal
                isOpen={open}
                onClose={() => setOpen(false)}
                title="Register New Patient"
                description="Create a persistent medical record for clinician tracking."
            >
                <form action={formAction} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-medical-green-900 uppercase tracking-widest">Full Name</label>
                            <Input name="name" placeholder="e.g. John Doe" required className="h-12 border-2 font-bold" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-medical-green-900 uppercase tracking-widest">Medical Record Number (MRN)</label>
                            <Input name="mrn" placeholder="e.g. P-12345" required className="h-12 border-2 font-mono font-bold" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-medical-green-900 uppercase tracking-widest">Gender</label>
                                <select
                                    name="gender"
                                    className="w-full h-12 rounded-md border-2 border-medical-green-100 bg-white px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-medical-green-500"
                                >
                                    <option value="">Select...</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-medical-green-900 uppercase tracking-widest">Date of Birth</label>
                                <Input name="dob" type="date" className="h-12 border-2 font-bold" />
                            </div>
                        </div>
                    </div>

                    {state?.error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                            <p className="text-xs font-bold text-red-700 italic">
                                {state.error}
                            </p>
                        </div>
                    )}

                    <Button type="submit" className="w-full h-14 text-lg font-black shadow-clinical-lg active:scale-95 transition-all">
                        Complete Registration
                    </Button>
                </form>
            </Modal>
        </>
    );
}
