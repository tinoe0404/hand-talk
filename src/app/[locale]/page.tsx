import { Link } from "@/navigation";
import Image from "next/image";
import {
  Stethoscope,
  Shield,
  Hand,
  Zap,
  Globe,
  Clock,
  ChevronRight
} from "lucide-react";

/**
 * Hand Talk Landing Page — Premium Clinical Experience
 * Refined to reflect the single-dashboard architecture.
 */
export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8fafc] flex flex-col items-center selection:bg-medical-green-100 selection:text-medical-green-900 overflow-x-hidden">

      {/* ── TOP NAVIGATION ──────────────────────────────────────── */}
      <nav className="w-full h-14 md:h-20 border-b border-zinc-100 bg-white/50 backdrop-blur-md flex items-center justify-between px-3 md:px-12 sticky top-0 z-50" aria-label="Main navigation">
        <div className="flex items-center gap-1.5 md:gap-2">
          <div className="bg-medical-green-600 p-1 md:p-1.5 rounded-lg shadow-lg shadow-medical-green-100">
            <Stethoscope className="w-3.5 h-3.5 md:w-5 md:h-5 text-white" />
          </div>
          <span className="text-base md:text-xl font-black text-zinc-900 tracking-tighter uppercase whitespace-nowrap">Hand Talk</span>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/dashboard">
            <button className="h-11 px-4 md:px-6 rounded-xl bg-zinc-900 text-white text-xs md:text-sm font-bold hover:bg-zinc-800 transition-colors">
              Clinical Portal
            </button>
          </Link>
        </div>
      </nav>

      {/* ── HERO SECTION ────────────────────────────────────────── */}
      <section className="w-full max-w-7xl px-4 md:px-6 pt-10 md:pt-20 pb-10 md:pb-16 flex flex-col items-center text-center space-y-5 md:space-y-8">

        <h1 className="text-3xl sm:text-4xl md:text-7xl font-black tracking-tight text-zinc-900 leading-[1.1] md:leading-[1.1]">
          Clinical Communication{" "}
          <span className="block md:inline text-medical-green-600 bg-clip-text">Sign Language Bridge</span>
        </h1>

        <p className="max-w-md md:max-w-2xl text-base md:text-2xl text-zinc-500 font-medium leading-relaxed md:leading-relaxed">
          The specialized platform for radiotherapy teams to communicate effectively with d/Deaf and hard-of-hearing patients.
        </p>

        <div className="pt-2 md:pt-6">
          <Link href="/dashboard">
            <button className="group relative h-12 md:h-16 px-6 md:px-10 rounded-xl md:rounded-2xl bg-medical-green-600 text-base md:text-xl font-black shadow-xl shadow-medical-green-200 hover:bg-medical-green-700 hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-2 md:gap-3">
              Open Treatment Dashboard
              <ChevronRight className="w-4 h-4 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <p className="mt-3 md:mt-4 text-[11px] md:text-sm font-bold text-zinc-500 uppercase tracking-widest">
            Clinical Authorization Required
          </p>
        </div>
      </section>

      {/* ── INTERFACE PREVIEW ────────────────────────────────────── */}
      <section className="w-full max-w-5xl px-4 md:px-6 relative mb-16 md:mb-24">
        <div className="relative aspect-video rounded-3xl md:rounded-[2.5rem] bg-zinc-200 shadow-2xl overflow-hidden border-4 md:border-8 border-white group">
          <div className="absolute inset-0 bg-gradient-to-br from-medical-green-500/10 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center font-bold text-zinc-400">
            <Image
              src="/landing-mockup.png"
              alt="Hand Talk Dashboard Preview showing the split-screen clinical interface with patient instructions and radiographer controls"
              fill
              sizes="(max-width: 768px) 100vw, 80vw"
              priority
              className="object-cover opacity-90 group-hover:scale-105 transition-all duration-1000"
            />
          </div>
        </div>
      </section>
      {/* ── FEATURES GRID ────────────────────────────────────────── */}
      <section className="w-full max-w-7xl px-6 pb-20 md:pb-32 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

        <div className="p-6 md:p-8 bg-white rounded-2xl md:rounded-card border border-zinc-100 shadow-sm hover:shadow-xl transition-all duration-300">
          <div className="bg-blue-50 w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6">
            <Zap className="w-6 h-6 md:w-7 md:h-7 text-blue-600" />
          </div>
          <h3 className="text-xl md:text-2xl font-black text-zinc-900 mb-2 md:mb-3 uppercase tracking-tight">Real-time Feedback</h3>
          <p className="text-sm md:text-base text-zinc-500 font-medium leading-relaxed">
            Instantly see patient hand signals on your screen. Be alerted immediately if they are in pain or need to pause.
          </p>
        </div>

        <div className="p-6 md:p-8 bg-white rounded-2xl md:rounded-card border border-zinc-100 shadow-sm hover:shadow-xl transition-all duration-300">
          <div className="bg-emerald-50 w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6">
            <Globe className="w-6 h-6 md:w-7 md:h-7 text-emerald-600" />
          </div>
          <h3 className="text-xl md:text-2xl font-black text-zinc-900 mb-2 md:mb-3 uppercase tracking-tight">Native Sign Language</h3>
          <p className="text-sm md:text-base text-zinc-500 font-medium leading-relaxed">
            Professional orientation and treatment videos in native sign language, designed for clear patient understanding.
          </p>
        </div>

        <div className="p-6 md:p-8 bg-white rounded-2xl md:rounded-card border border-zinc-100 shadow-sm hover:shadow-xl transition-all duration-300">
          <div className="bg-purple-50 w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6">
            <Shield className="w-6 h-6 md:w-7 md:h-7 text-purple-600" />
          </div>
          <h3 className="text-xl md:text-2xl font-black text-zinc-900 mb-2 md:mb-3 uppercase tracking-tight">Offline Reliability</h3>
          <p className="text-sm md:text-base text-zinc-500 font-medium leading-relaxed">
            Optimized for lead-shielded rooms. The system works with 100% reliability even without an internet connection.
          </p>
        </div>

      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer className="w-full py-12 border-t border-zinc-200 flex flex-col items-center gap-6">
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-8 text-zinc-500 font-black text-xs uppercase tracking-[0.2em]">
          <span className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5" /> WCAG 2.1 AAA
          </span>
          <span className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" /> HL7 READY
          </span>
          <span className="flex items-center gap-2">
            <Hand className="w-3.5 h-3.5" /> GESTURE+ ENABLED
          </span>
        </div>
        <p className="text-zinc-400 text-xs">© 2026 Hand Talk Clinical Systems. All rights reserved.</p>
      </footer>

    </main>
  );
}
