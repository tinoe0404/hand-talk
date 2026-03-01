"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/navigation";
import { cn } from "@/lib/utils";
import { Users, History, Settings, LogOut } from "lucide-react";
import { logoutAction } from "@/lib/auth-actions";
import LanguageSwitcher from "@/components/language-switcher";
import { useSessionStore } from "@/store/useSessionStore";
import { useState } from "react";

const tabs = [
    { href: "/dashboard", icon: Users, labelKey: "title" as const, matchExact: true },
    { href: "/dashboard/history", icon: History, labelKey: "history" as const, matchExact: false },
] as const;

export function BottomNav() {
    const t = useTranslations("Dashboard");
    const pathname = usePathname();
    const { sessionId } = useSessionStore();
    const [showSettings, setShowSettings] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    // Hide nav when a session is active (fullscreen takeover)
    if (sessionId) {
        return null;
    }

    const isActive = (href: string, exact?: boolean) => {
        if (exact) {
            return pathname === href;
        }
        return pathname.startsWith(href);
    };

    return (
        <>
            {/* Settings sheet */}
            {showSettings && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90] animate-in fade-in duration-200"
                        onClick={() => setShowSettings(false)}
                    />
                    <div
                        className="fixed bottom-0 left-0 right-0 z-[95] bg-white rounded-t-3xl shadow-2xl p-6 pb-10 animate-in slide-in-from-bottom duration-300 space-y-5"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Settings"
                    >
                        <div className="w-10 h-1 bg-zinc-200 rounded-full mx-auto mb-2" />
                        <h3 className="text-lg font-black text-zinc-900">Settings</h3>

                        <div className="flex items-center justify-between py-3 border-b border-zinc-100">
                            <span className="text-sm font-bold text-zinc-600">Language</span>
                            <LanguageSwitcher />
                        </div>

                        {/* Logout with confirmation */}
                        {!showLogoutConfirm ? (
                            <button
                                type="button"
                                onClick={() => setShowLogoutConfirm(true)}
                                className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-red-50 text-red-600 border border-red-200 font-bold text-sm hover:bg-red-600 hover:text-white transition-all active:scale-95"
                            >
                                <LogOut className="w-4 h-4" />
                                {t("logout")}
                            </button>
                        ) : (
                            <div className="space-y-3 p-4 bg-red-50 border-2 border-red-200 rounded-xl animate-in fade-in duration-200">
                                <p className="text-sm font-bold text-red-800 text-center">
                                    Are you sure you want to log out?
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowLogoutConfirm(false)}
                                        className="flex-1 h-11 rounded-xl border-2 border-zinc-200 text-zinc-700 font-bold text-sm hover:bg-zinc-50 transition-all active:scale-95"
                                    >
                                        Cancel
                                    </button>
                                    <form action={logoutAction} className="flex-1">
                                        <button
                                            type="submit"
                                            className="w-full h-11 rounded-xl bg-red-600 text-white font-black text-sm hover:bg-red-700 transition-all active:scale-95"
                                        >
                                            Log Out
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Bottom tab bar */}
            <nav
                className="fixed bottom-0 left-0 right-0 z-[80] bg-white border-t border-zinc-200 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]"
                style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
                aria-label="Dashboard navigation"
            >
                <div className="flex items-stretch justify-around h-16 max-w-lg mx-auto">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const active = isActive(tab.href, tab.matchExact);
                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={cn(
                                    "flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors min-h-[48px]",
                                    active
                                        ? "text-medical-green-600"
                                        : "text-zinc-400 hover:text-zinc-600"
                                )}
                                aria-current={active ? "page" : undefined}
                            >
                                <Icon className={cn("w-6 h-6", active && "stroke-[2.5]")} />
                                <span className="text-[10px] font-bold uppercase tracking-wider">
                                    {t(tab.labelKey)}
                                </span>
                                {active && (
                                    <div className="absolute top-0 w-8 h-0.5 bg-medical-green-600 rounded-b-full" />
                                )}
                            </Link>
                        );
                    })}

                    {/* Settings tab (not a link, it opens a sheet) */}
                    <button
                        onClick={() => setShowSettings(true)}
                        className={cn(
                            "flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors min-h-[48px]",
                            showSettings
                                ? "text-medical-green-600"
                                : "text-zinc-400 hover:text-zinc-600"
                        )}
                    >
                        <Settings className="w-6 h-6" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                            Settings
                        </span>
                    </button>
                </div>
            </nav>
        </>
    );
}
