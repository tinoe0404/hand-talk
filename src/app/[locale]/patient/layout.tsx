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
        </div>
    );
}
