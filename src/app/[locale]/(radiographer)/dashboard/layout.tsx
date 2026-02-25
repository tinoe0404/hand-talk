import { BottomNav } from "@/components/dashboard/bottom-nav";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-[100dvh] bg-clinical-offwhite overflow-hidden">
            <main className="flex-1 relative overflow-y-auto w-full pb-16">
                {children}
            </main>
            <BottomNav />
        </div>
    );
}
