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
        href: '/dashboard/lab',
        icon: Settings,
        labelKey: 'lab',
        internal: true
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
                className="fixed top-3 left-3 z-[70] md:hidden bg-medical-green-900 text-white p-2.5 rounded-xl shadow-clinical-md border border-medical-green-700/50"
                aria-label={isOpen ? "Close menu" : "Open menu"}
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Mobile backdrop overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] md:hidden animate-in fade-in duration-300"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "w-64 bg-medical-green-900 text-white flex flex-col h-full shadow-clinical-2xl shrink-0 z-[60] transition-transform duration-500 ease-in-out",
                // Mobile: off-canvas drawer, Desktop: always visible
                "fixed md:relative",
                isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            )}>
                {/* Branding Section */}
                <div className="p-8 border-b border-medical-green-800/50 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-medical-green-800/20 to-transparent pointer-none" />
                    <h1 className="text-2xl font-black tracking-tight flex items-center gap-3 relative z-10">
                        <div className="w-10 h-10 bg-medical-green-500 rounded-2xl flex items-center justify-center shadow-lg shadow-medical-green-500/20 group-hover:scale-110 transition-transform duration-300">
                            <span className="text-white font-black text-lg">HT</span>
                        </div>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-medical-green-200">
                            Hand Talk
                        </span>
                    </h1>
                </div>

                <nav className="flex-1 p-5 space-y-1.5 overflow-y-auto">
                    <p className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-medical-green-400 mb-2">
                        Clinical Suite
                    </p>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 group",
                                    isActive
                                        ? "bg-medical-green-500 text-white shadow-lg shadow-medical-green-500/20 scale-[1.02]"
                                        : "text-medical-green-100/70 hover:bg-medical-green-800/50 hover:text-white"
                                )}
                            >
                                <Icon className={cn(
                                    "w-5 h-5 transition-transform duration-300",
                                    isActive ? "scale-110" : "group-hover:scale-110"
                                )} />
                                <span className="text-sm">{t(item.labelKey)}</span>
                                {item.internal && (
                                    <span className="ml-auto text-[8px] px-1.5 py-0.5 rounded-full bg-medical-green-700/50 text-medical-green-300 border border-medical-green-600/30">
                                        INT
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-5 space-y-5 border-t border-medical-green-800/50 bg-medical-green-950/20">
                    <div className="flex items-center justify-between px-2">
                        <span className="text-[10px] font-bold text-medical-green-400 uppercase tracking-widest">Interface</span>
                        <LanguageSwitcher />
                    </div>

                    <div className="px-4 py-4 bg-medical-green-900/40 rounded-3xl border border-medical-green-800/50 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-medical-green-700 to-medical-green-600 flex items-center justify-center shadow-inner">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-black text-white truncate">Radiographer</p>
                                <p className="text-[10px] font-bold text-medical-green-400 uppercase tracking-tighter">Clinical Staff</p>
                            </div>
                        </div>

                        <form action={logoutAction}>
                            <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-red-300 bg-red-900/10 hover:bg-red-600 hover:text-white border border-red-900/20 rounded-xl text-xs font-black transition-all duration-300 active:scale-95"
                            >
                                <LogOut className="w-4 h-4" />
                                {t('logout')}
                            </button>
                        </form>
                    </div>
                </div>
            </aside>
        </>
    );
}
