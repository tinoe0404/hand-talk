import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist, CacheFirst, NetworkFirst } from "serwist";

// This declares the self variable as a SerwistGlobalConfig
declare global {
    interface WorkerGlobalScope extends SerwistGlobalConfig {
        __SW_MANIFEST: (string | PrecacheEntry)[] | undefined;
    }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
    precacheEntries: self.__SW_MANIFEST,
    skipWaiting: true,
    clientsClaim: true,
    navigationPreload: true,
    runtimeCaching: [
        ...defaultCache,
        // CLINICAL ASSET CACHE: Videos and Fonts
        {
            matcher: /\.(?:mp4|webm|woff2|woff|ttf|otf)$/i,
            handler: new CacheFirst({
                cacheName: "clinical-assets-v1",
                plugins: [
                    {
                        cacheWillUpdate: async ({ response }) => {
                            if (response && response.status === 200) {
                                return response;
                            }
                            return null;
                        },
                    },
                ],
            }),
        },
        // CLINICAL LOGS: NetworkFirst to ensure audit trail integrity
        {
            matcher: /^\/api\/logs/i,
            handler: new NetworkFirst({
                cacheName: "clinical-audit-cache",
                networkTimeoutSeconds: 3,
            }),
        }
    ],
});

serwist.addEventListeners();
