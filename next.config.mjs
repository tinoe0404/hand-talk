import withSerwistInit from "@serwist/next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const withSerwist = withSerwistInit({
    swSrc: "src/sw.ts",
    swDest: "public/sw.js",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Your existing Next.js config
};

export default withSerwist(withNextIntl(nextConfig));
