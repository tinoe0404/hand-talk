import { getRequestConfig } from 'next-intl/server';
import { routing } from '../routing';

import { AbstractIntlMessages } from 'next-intl';

export default getRequestConfig(async ({ requestLocale }) => {
    // Await the locale from the request (next-intl v4 API)
    const requested = await requestLocale;

    // Validate that the incoming `locale` parameter is valid
    const validLocale = (routing.locales as readonly string[]).includes(requested ?? '')
        ? requested
        : routing.defaultLocale;

    const messages = (await import(`../../messages/${validLocale}.json`)).default as AbstractIntlMessages;

    return {
        locale: validLocale as string,
        messages
    };
});
