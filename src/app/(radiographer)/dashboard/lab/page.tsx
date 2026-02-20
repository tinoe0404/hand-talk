import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Hand, AlertTriangle, CheckCircle2 } from "lucide-react";

/**
 * Component Lab
 * Verification page to ensure clinical components are rendering 
 * according to safety and design standards.
 */
export default function ComponentLab() {
    return (
        <div className="min-h-screen bg-clinical-offwhite p-10 space-y-12">
            <section className="space-y-6">
                <h2 className="text-3xl font-bold text-medical-green-900 border-b-2 border-medical-green-200 pb-2">
                    Clinical Buttons (48px Min Touch Target)
                </h2>
                <div className="flex flex-wrap gap-6 items-center">
                    <Button variant="primary">Primary Radiographer</Button>
                    <Button variant="secondary">Secondary Action</Button>
                    <Button variant="outline">Outline Action</Button>
                    <Button variant="ghost">Ghost Button</Button>
                    <Button variant="link">Link Style</Button>
                    <Button size="icon" variant="primary">
                        <Hand className="w-6 h-6" />
                    </Button>
                </div>
            </section>

            <section className="space-y-6">
                <h2 className="text-3xl font-bold text-medical-green-900 border-b-2 border-medical-green-200 pb-2">
                    Patient & Emergency Variants
                </h2>
                <div className="flex flex-wrap gap-8 items-center bg-patient-bg p-8 rounded-card">
                    <Button variant="patient" size="xl">Patient Instruction</Button>
                    <Button variant="emergency" size="xl" className="shadow-alert-glow">
                        <AlertTriangle className="w-8 h-8 mr-2" />
                        EMERGENCY STOP
                    </Button>
                </div>
            </section>

            <section className="space-y-6">
                <h2 className="text-3xl font-bold text-medical-green-900 border-b-2 border-medical-green-200 pb-2">
                    Clinical Cards & Inputs
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Radiographer Login</CardTitle>
                            <CardDescription>Enter your 4-digit clinical PIN to start.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Input type="password" placeholder="Enter PIN" maxLength={4} />
                            <Button className="w-full">Authorize Session</Button>
                        </CardContent>
                        <CardFooter className="text-xs text-medical-green-600 italic">
                            * Clinical authentication session expires in 8 hours.
                        </CardFooter>
                    </Card>

                    <Card className="bg-medical-green-50 border-medical-green-200">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="text-medical-green-600" />
                                <CardTitle>Session Active</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-medical-green-800">
                                Patient communication bridge is operational. Gesture detection running
                                fully in-browser.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
}
