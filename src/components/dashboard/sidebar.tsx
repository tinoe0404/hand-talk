"use client";

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    History,
    Settings,
    LogOut,
    User,
    Menu,
    X
} from 'lucide-react';
import { logoutAction } from '@/lib/auth-actions';
import LanguageSwitcher from '../language-switcher';
import { useState } from 'react';

const navItems = [
    {
        href: '/dashboard',
        icon: LayoutDashboard,
        labelKey: 'title'
    },
    {
        href: '/dashboard/history',
        icon: History,
        labelKey: 'history'
    },
    {
        href: '/dashboard/settings',
        icon: Settings,
        labelKey: 'settings'
    }
];

export default function Sidebar() {
    const t = useTranslations('Dashboard');
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile hamburger toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-3 left-3 z-[70] md:hidden bg-medical-green-900 text-white p-2.5 rounded-xl shadow-clinical-md"
                aria-label={isOpen ? "Close menu" : "Open menu"}
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Mobile backdrop overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[55] md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "w-64 bg-medical-green-900 text-white flex flex-col h-full shadow-clinical-lg shrink-0 z-[60] transition-transform duration-300",
                // Mobile: off-canvas drawer, Desktop: always visible
                "fixed md:relative",
                isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            )}>
                <div className="p-6 border-b border-medical-green-800">
                    <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
                        <div className="w-8 h-8 bg-medical-green-500 rounded-lg flex items-center justify-center">
                            HT
                        </div>
                        Hand Talk
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-clinical font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-medical-green-500 text-white shadow-md"
                                        : "text-medical-green-100 hover:bg-medical-green-800 hover:text-white"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                {t(item.labelKey)}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 space-y-4 border-t border-medical-green-800">
                    <div className="flex items-center justify-between px-2">
                        <LanguageSwitcher />
                    </div>

                    <form action={logoutAction}>
                        <button
                            type="submit"
                            className="w-full flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-red-900/30 hover:text-red-100 rounded-clinical font-medium transition-all duration-200"
                        >
                            <LogOut className="w-5 h-5" />
                            {t('logout')}
                        </button>
                    </form>

                    <div className="px-4 py-3 bg-medical-green-950/50 rounded-clinical flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-medical-green-700 flex items-center justify-center">
                            <User className="w-4 h-4 text-medical-green-100" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs font-semibold text-medical-green-100 truncate">Radiographer</p>
                            <p className="text-[10px] text-medical-green-400">Clinical Staff</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
