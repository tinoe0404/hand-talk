import { BottomNav } from "@/components/dashboard/bottom-nav";
import { AutoLogoutProvider } from "@/components/auth/auto-logout-provider";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AutoLogoutProvider>
            <div className="flex flex-col min-h-[100dvh] bg-clinical-offwhite overflow-hidden">
                <main className="flex-1 relative overflow-y-auto w-full pb-16">
                    {children}
                </main>
                <BottomNav />
            </div>
        </AutoLogoutProvider>
    );
}
