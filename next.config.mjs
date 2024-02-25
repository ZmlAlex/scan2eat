import { withAxiom } from "next-axiom";
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/libs/nextIntl/i18n.ts");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    // TODO: REMOVE WHEN MOCK WILL BE REPLACED
    domains: [
      "imageproxy.wolt.com",
      "res.cloudinary.com",
      "upload.wikimedia.org",
    ],
  },
  experimental: {
    scrollRestoration: true,
  },
};

export default withNextIntl(withAxiom(config));
