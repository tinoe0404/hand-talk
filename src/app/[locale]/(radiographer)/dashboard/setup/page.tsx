"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
import { createSessionAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldAlert, Loader2, Sparkles, ClipboardList } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "@/navigation";
import { useSessionStore } from "@/store/useSessionStore";

function SubmitButton() {
    const { pending } = useFormStatus();
    const t = useTranslations("Setup");

    return (
        <Button
            type="submit"
            className="w-full h-[64px] text-xl font-bold bg-medical-green-600 hover:bg-medical-green-700 shadow-clinical-md"
            disabled={pending}
        >
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    {t("submit")}
                </>
            ) : (
                t("submit")
            )}
        </Button>
    );
}

export default function SessionSetupPage() {
    const t = useTranslations("Setup");
    const router = useRouter();
    const [state, formAction] = useFormState(createSessionAction, null);
    const [mrn, setMrn] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    // Auto-generate MRN helper for clinical ease
    const generateMrn = () => {
        setIsGenerating(true);
        setTimeout(() => {
            const random = Math.floor(1000 + Math.random() * 9000);
            setMrn(`P-${random}`);
            setIsGenerating(false);
        }, 800);
    };

    // Initialize with a generated MRN
    useEffect(() => {
        generateMrn();
    }, []);

    const { startSession } = useSessionStore();

    // Handle session success - transition to active treatment view
    useEffect(() => {
        if (state?.success && state.sessionId) {
            // Update local Zustand store
            startSession({
                sessionId: state.sessionId,
                patientRef: mrn,
                radiographerId: 'unknown',
                isFirstDay: false,
                isLastDay: false
            });

            // Redirect to patient display management (future Phase 8/10)
            // For now, redirect back to dashboard
            router.push("/dashboard");
        }
    }, [state, router, mrn, startSession]);

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-extrabold text-medical-green-900 tracking-tight">
                    {t('title')}
                </h1>
                <p className="text-xl text-medical-green-600 font-medium">
                    Please ensure clinical data accuracy before authorizing playback.
                </p>
            </div>

            <Card className="border-2 border-medical-green-100 shadow-clinical-lg">
                <CardHeader className="bg-medical-green-50/50 border-b border-medical-green-100">
                    <div className="flex items-center gap-3">
                        <div className="bg-medical-green-600 p-2 rounded-lg text-white">
                            <ClipboardList className="w-6 h-6" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl text-medical-green-900">Clinical Data Entry</CardTitle>
                            <CardDescription className="text-medical-green-600">Unified Intake Form</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    <form action={formAction} className="space-y-8">
                        <div className="space-y-6">
                            {/* Patient Name */}
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-medical-green-900 uppercase tracking-widest px-1">
                                    {t("name")}
                                </label>
                                <Input
                                    name="name"
                                    placeholder={t("placeholders.name")}
                                    required
                                    className="h-14 text-lg border-2 focus:ring-medical-green-500 font-medium"
                                />
                            </div>

                            {/* MRN with Auto-gen */}
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-medical-green-900 uppercase tracking-widest px-1">
                                    {t("mrn")}
                                </label>
                                <div className="flex gap-3">
                                    <Input
                                        name="mrn"
                                        value={mrn}
                                        onChange={(e) => setMrn(e.target.value)}
                                        required
                                        className="h-14 text-lg border-2 focus:ring-medical-green-500 font-mono font-bold"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={generateMrn}
                                        disabled={isGenerating}
                                        className="h-14 px-6 border-2 border-medical-green-200 text-medical-green-700 hover:bg-medical-green-50"
                                    >
                                        {isGenerating ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <Sparkles className="w-5 h-5" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            {/* Treatment Type Selection */}
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-medical-green-900 uppercase tracking-widest px-1">
                                    {t("treatment")}
                                </label>
                                <select
                                    name="treatment"
                                    className="w-full h-14 rounded-md border-2 border-medical-green-100 bg-white px-3 py-2 text-lg font-medium ring-offset-background focus:outline-none focus:ring-2 focus:ring-medical-green-500"
                                    required
                                >
                                    <option value="">Select Treatment...</option>
                                    <option value="GENERAL_RT">General Radiotherapy</option>
                                    <option value="CHEST_SCAN">Chest/Thorax Scan</option>
                                    <option value="ABDOMINAL">Abdominal Imaging</option>
                                    <option value="PEDIATRIC">Pediatric Specialized</option>
                                </select>
                            </div>

                            {/* Clinical Notes */}
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-medical-green-900 uppercase tracking-widest px-1">
                                    {t("notes")}
                                </label>
                                <textarea
                                    name="notes"
                                    placeholder={t("placeholders.notes")}
                                    rows={4}
                                    className="w-full rounded-md border-2 border-medical-green-100 bg-white px-3 py-2 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-medical-green-500"
                                />
                            </div>

                            {state?.error && (
                                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-clinical animate-in fade-in slide-in-from-top-1">
                                    <ShieldAlert className="w-6 h-6 flex-shrink-0" />
                                    <p className="font-bold">{state.error}</p>
                                </div>
                            )}
                        </div>

                        <SubmitButton />
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
