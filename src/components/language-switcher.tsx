"use client";

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/navigation';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

/**
 * Clinical Language Toggle
 * High-contrast switcher for Radiographer and Patient interfaces.
 * Supports English (en) and Zulu (zu).
 */
export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    function onLanguageChange() {
        const nextLocale = locale === 'en' ? 'zu' : 'en';
        router.replace(pathname, { locale: nextLocale });
    }

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={onLanguageChange}
            className="flex items-center gap-2 border-2 border-medical-green-200 bg-white hover:bg-medical-green-50 text-medical-green-700 font-bold px-4 h-[48px] rounded-clinical shadow-sm transition-all active:scale-95"
        >
            <Languages className="w-5 h-5" />
            <span className="uppercase tracking-wider">
                {locale === 'en' ? 'Zulu' : 'English'}
            </span>
        </Button>
    );
}
