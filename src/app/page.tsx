import Link from "next/link";
import { Stethoscope, Shield, Users, Activity } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-clinical-white">
      <div className="w-full max-w-4xl space-y-12 text-center">
        <header className="space-y-4">
          <div className="flex justify-center mb-6">
            <div className="bg-medical-green-500 p-4 rounded-clinical shadow-clinical-lg">
              <Stethoscope className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-medical-green-900 sm:text-6xl">
            Hand Talk
          </h1>
          <p className="text-xl text-medical-green-700 italic">
            Clinical Communication Bridge
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <Link
            href="/dashboard"
            className="group relative flex flex-col items-center p-8 bg-white border-2 border-medical-green-100 rounded-card shadow-clinical hover:border-medical-green-500 transition-all duration-300"
          >
            <Users className="w-10 h-10 mb-4 text-medical-green-600 group-hover:scale-110 transition-transform" />
            <h2 className="text-2xl font-semibold text-medical-green-900">Radiographer Portal</h2>
            <p className="mt-2 text-medical-green-600">Access session controls and history</p>
          </Link>

          <Link
            href="/instructions"
            className="group relative flex flex-col items-center p-8 bg-patient-bg border-2 border-patient-border rounded-card shadow-clinical hover:border-patient-accent transition-all duration-300"
          >
            <Activity className="w-10 h-10 mb-4 text-patient-accent group-hover:scale-110 transition-transform" />
            <h2 className="text-2xl font-semibold text-patient-text">Patient Display</h2>
            <p className="mt-2 text-patient-muted">Real-time instruction loop</p>
          </Link>
        </div>

        <footer className="pt-12 flex justify-center gap-8 text-medical-green-500 text-sm font-medium">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>WCAG 2.1 AAA Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <span>Real-time Gesture Detection</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
