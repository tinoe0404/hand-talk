import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing, Locale } from './routing';

import { AbstractIntlMessages } from 'next-intl';

export default getRequestConfig(async ({ locale }) => {
    // Validate that the incoming `locale` parameter is valid
    if (!routing.locales.includes(locale as Locale)) {
        notFound();
    }

    const messages = (await import(`../messages/${locale}.json`)).default as AbstractIntlMessages;

    return {
        locale: locale as string,
        messages
    };
});
