"use client";

import { useFormState, useFormStatus } from "react-dom";
import { loginAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert, Loader2, Keyboard } from "lucide-react";

function LoginButton() {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            className="w-full h-[64px] text-xl font-bold"
            disabled={pending}
        >
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Authorizing...
                </>
            ) : (
                "Access Dashboard"
            )}
        </Button>
    );
}

export default function LoginPage() {
    const [state, formAction] = useFormState(loginAction, null);

    return (
        <main className="min-h-screen flex items-center justify-center bg-clinical-offwhite p-6">
            <Card className="w-full max-w-md shadow-clinical-lg border-2 border-medical-green-100">
                <CardHeader className="text-center space-y-2">
                    <div className="flex justify-center mb-2">
                        <div className="bg-medical-green-50 p-4 rounded-full">
                            <ShieldAlert className="w-10 h-10 text-medical-green-600" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-bold text-medical-green-900">
                        Radiographer Portal
                    </CardTitle>
                    <CardDescription className="text-lg">
                        Enter your 4-digit PIN to authorize clinical session
                    </CardDescription>
                </CardHeader>
                <CardContent>
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
                                    placeholder="● ● ● ●"
                                    required
                                    className="text-center text-4xl tracking-[1rem] h-[80px] font-bold border-2 focus:ring-medical-green-500"
                                />
                            </div>

                            {state?.error && (
                                <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 text-red-700 rounded-clinical animate-in fade-in slide-in-from-top-1">
                                    <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                                    <p className="text-sm font-medium">{state.error}</p>
                                </div>
                            )}
                        </div>

                        <LoginButton />

                        <div className="text-center">
                            <p className="text-xs text-medical-green-600 uppercase tracking-widest font-semibold flex items-center justify-center gap-2">
                                <Keyboard className="w-4 h-4" />
                                Medical Grade Security
                            </p>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </main>
    );
}
