import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Hand Talk - Clinical Bridge",
        short_name: "Hand Talk",
        description: "Medical-grade deaf patient communication bridge for radiotherapy.",
        start_url: "/",
        display: "standalone",
        background_color: "#FFFFFF",
        theme_color: "#2E7D32", // Medical Green
        icons: [
            {
                src: "/icons/icon-192x192.png",
                sizes: "192x192",
                type: "image/png",
                purpose: "any",
            },
            {
                src: "/icons/icon-512x512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "maskable",
            },
        ],
    };
}
