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
        <PatientSessionHub
            patientId={patient.id}
            patientName={patient.name}
            mrn={patient.mrn}
            sessions={patient.sessions}
        />
    );
}
