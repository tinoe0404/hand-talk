/**
 * Dashboard layout — intentionally minimal.
 * The dashboard page uses `position: fixed; inset: 0; height: 100dvh`
 * to own the full screen, so no wrapper chrome is needed here.
 */
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
