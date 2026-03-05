"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
import { loginAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert, Loader2, Keyboard } from "lucide-react";

function LoginButton() {
    const { pending } = useFormStatus();
    const t = useTranslations("Auth");

    return (
        <Button
            type="submit"
            className="w-full min-h-[56px] md:h-[64px] text-lg md:text-xl font-black py-2 whitespace-normal leading-tight"
            disabled={pending}
        >
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-5 w-5 md:h-6 md:w-6 animate-spin" />
                    {t("authorizing")}
                </>
            ) : (
                t("button")
            )}
        </Button>
    );
}

export default function LoginPage() {
    const [state, formAction] = useFormState(loginAction, null);
    const t = useTranslations("Auth");

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-clinical-offwhite p-4 md:p-6 relative">
            <div className="w-full max-w-md flex flex-col gap-4">

                <Card className="shadow-clinical-lg border-2 border-medical-green-100 overflow-hidden">
                    <CardHeader className="text-center pb-4 space-y-2">
                        <div className="flex justify-center mb-2">
                            <div className="bg-medical-green-50 p-3 md:p-4 rounded-full">
                                <ShieldAlert className="w-8 h-8 md:w-10 md:h-10 text-medical-green-600" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl md:text-3xl font-black text-medical-green-900 leading-tight px-2">
                            {t("title")}
                        </CardTitle>
                        <CardDescription className="text-base md:text-lg font-medium">
                            {t("description")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-4 md:px-6">
                        <form action={formAction} className="space-y-6">
                            <div className="space-y-4">
                                <div className="relative">
                                    <Input
                                        name="pin"
                                        type="password"
                                        inputMode="numeric"
                                        autoComplete="one-time-code"
                                        pattern="[0-9]*"
                                        maxLength={4}
                                        placeholder={t("pinPlaceholder")}
                                        required
                                        className="text-center text-3xl md:text-4xl tracking-widest h-[70px] md:h-[80px] font-bold border-2 focus:ring-medical-green-500"
                                    />
                                </div>

                                {state?.error && (
                                    <div className="flex items-center gap-2 p-3 md:p-4 bg-red-50 border border-red-200 text-red-700 rounded-clinical animate-in fade-in slide-in-from-top-1">
                                        <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                                        <p className="text-xs md:text-sm font-semibold italic">
                                            {t(state.error as "errorInvalid" | "errorNoStaff" | "errorIncorrect" | "errorSystem")}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <LoginButton />

                            <div className="text-center pb-2">
                                <p className="text-[10px] md:text-xs text-medical-green-600 uppercase tracking-widest font-bold flex items-center justify-center gap-2">
                                    <Keyboard className="w-4 h-4" />
                                    {t("security")}
                                </p>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
