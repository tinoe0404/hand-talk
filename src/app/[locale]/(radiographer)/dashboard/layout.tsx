import Sidebar from "@/components/dashboard/sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-clinical-offwhite overflow-hidden">
            {/* Clinic sidebar with medical-grade navigation */}
            <Sidebar />

            {/* Main clinical workspace */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-14 md:h-16 bg-white border-b border-medical-green-100 flex items-center justify-between px-4 md:px-8 shrink-0">
                    <div className="flex items-center gap-4 ml-10 md:ml-0">
                        <span className="text-xs md:text-sm font-semibold text-medical-green-600 bg-medical-green-50 px-3 py-1 rounded-full uppercase tracking-wider">
                            Clinical Session Active
                        </span>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                    <div className="max-w-7xl mx-auto h-full">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
