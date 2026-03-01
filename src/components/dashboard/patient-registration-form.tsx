"use client";

import { useState, useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { registerPatientAction, generateUniqueMrnAction } from "@/app/[locale]/(radiographer)/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Plus, Loader2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

/** Submit button with loading state via useFormStatus */
function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button
            type="submit"
            disabled={pending}
            className="w-full h-14 text-base font-black shadow-clinical-lg active:scale-95 transition-all rounded-xl"
        >
            {pending ? (
                <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Registering...
                </>
            ) : (
                "Register Patient"
            )}
        </Button>
    );
}

export function PatientRegistrationModal() {
    const [open, setOpen] = useState(false);
    const [state, formAction] = useFormState(registerPatientAction, null);

    const [mrn, setMrn] = useState("");
    const [isGeneratingMrn, setIsGeneratingMrn] = useState(false);

    useEffect(() => {
        if (state?.success) {
            setOpen(false);
            setMrn(""); // Reset MRN on successful submit
        }
    }, [state]);

    const handleGenerateMrn = async () => {
        setIsGeneratingMrn(true);
        try {
            const uniqueMrn = await generateUniqueMrnAction();
            setMrn(uniqueMrn);
        } catch (error) {
            console.error("Failed to generate MRN", error);
        } finally {
            setIsGeneratingMrn(false);
        }
    };

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
                            <label htmlFor="reg-name" className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">Full Name</label>
                            <Input id="reg-name" name="name" placeholder="e.g. John Doe" required className="h-12 border-2 font-bold rounded-xl" />
                        </div>
                        <div className="space-y-1.5">
                            <label htmlFor="reg-mrn" className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">
                                MRN
                            </label>
                            <div className="relative">
                                <Input
                                    id="reg-mrn"
                                    name="mrn"
                                    value={mrn}
                                    onChange={(e) => setMrn(e.target.value)}
                                    placeholder="e.g. P-12345"
                                    required
                                    className="h-12 border-2 font-mono font-bold rounded-xl pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={handleGenerateMrn}
                                    disabled={isGeneratingMrn}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-zinc-400 hover:text-medical-green-600 active:scale-95 transition-all disabled:opacity-50"
                                    title="Auto-generate completely unique MRN"
                                >
                                    <RefreshCw className={cn("w-5 h-5", isGeneratingMrn && "animate-spin")} />
                                    <span className="sr-only">Generate unique MRN</span>
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label htmlFor="reg-gender" className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">Gender</label>
                                <select
                                    id="reg-gender"
                                    name="gender"
                                    required
                                    className="w-full h-12 rounded-xl border-2 border-zinc-200 bg-white px-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-medical-green-500"
                                >
                                    <option value="">Select...</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label htmlFor="reg-dob" className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">DOB</label>
                                <Input
                                    id="reg-dob"
                                    name="dob"
                                    type="date"
                                    className="h-12 border-2 font-bold rounded-xl w-full block appearance-none bg-white"
                                />
                            </div>
                        </div>
                    </div>

                    {state?.error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl" role="alert">
                            <p className="text-xs font-bold text-red-600">
                                {state.error}
                            </p>
                        </div>
                    )}

                    <SubmitButton />
                </form>
            </Modal>
        </>
    );
}
