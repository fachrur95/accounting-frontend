/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

import withPWA from "next-pwa";

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    // domains: ["lh3.googleusercontent.com", "res.cloudinary.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  /**
   * If you are using `appDir` then you must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  /* eslint: {
    ignoreDuringBuilds: true,
  }, */
  /* modularizeImports: {
    "@mui/icons-material": {
      transform: "@mui/icons-material/{{member}}",
    },
    // TODO: Consider enabling modularizeImports for material when https://github.com/mui/material-ui/issues/36218 is resolved
    // '@mui/material': {
    //   transform: '@mui/material/{{member}}',
    // },
  }, */
  experimental: {
    webpackBuildWorker: true,
    // esmExternals: false,
  },
};

const nextConfig = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV !== "production",
})(config);

export default nextConfig;
