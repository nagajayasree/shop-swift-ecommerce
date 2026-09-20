console.log(
    "ENV CHECK:",
    Object.keys(process.env)
        .filter((k) => k.startsWith("NEXT_PUBLIC_"))
        .join(", ") || "(none)",
);

import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
    /* config options here */
    experimental: {
        rootParams: true,
    },
};

const withNextIntl = createNextIntlPlugin(
    // Specify a custom path here
    "./src/i18n/request.tsx",
);

export default withNextIntl(nextConfig);
