import Sidebar from "@/components/dashboard/sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-clinical-offwhite overflow-hidden">
            <Sidebar />
            <main className="flex-1 relative overflow-y-auto w-full h-full">
                {children}
            </main>
        </div>
    );
}
