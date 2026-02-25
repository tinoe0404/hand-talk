import { getPatientWithSessions } from "./actions";
import { PatientSessionHub } from "@/components/dashboard/patient-session-hub";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

export default async function PatientDashboardPage(props: {
    params: Promise<{ id: string; locale: string }>
}) {
    const params = await props.params;
    const { id, locale } = params;

    setRequestLocale(locale);

    const patient = await getPatientWithSessions(id);

    if (!patient) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <PatientSessionHub
                patientId={patient.id}
                patientName={patient.name}
                mrn={patient.mrn}
                sessions={patient.sessions}
            />
        </div>
    );
}
