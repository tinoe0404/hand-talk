export default function PatientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-black text-white overflow-hidden flex flex-col">
            {/* 
        High-Contrast Clinical Shell for Patients. 
        Black background minimizes light pollution in the treatment room.
      */}
            <div className="flex-1 flex flex-col">
                {children}
            </div>

            {/* 
        Persistent Safety Footer
      */}
            <footer className="h-16 bg-medical-green-950/80 border-t border-medical-green-800 px-10 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-medical-green-500 animate-pulse" />
                    <span className="text-sm font-bold text-medical-green-100 uppercase tracking-widest">
                        Clinical Connection Secure
                    </span>
                </div>
                <div className="text-xs text-medical-green-400 font-medium">
                    Authorised medical monitoring active.
                </div>
            </footer>
        </div>
    );
}
