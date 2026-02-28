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
        // AI ENGINE CACHE: Ensure MediaPipe WASM files load reliably inside the worker
        {
            matcher: /^https:\/\/cdn\.jsdelivr\.net\/npm\/@mediapipe/i,
            handler: new CacheFirst({
                cacheName: "clinical-ai-engine-v1",
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
        },
        // IMPORTANT: defaultCache must be last! In dev mode, it contains a catch-all /.*/i matcher
        ...defaultCache,
    ],
});

serwist.addEventListeners();
