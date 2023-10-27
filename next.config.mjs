import { withAxiom } from "next-axiom";
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  /**
   * If you have `experimental: { appDir: true }` set, then you must comment the below `i18n` config
   * out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["english", "russian"],
    defaultLocale: "english",
  },
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
    swcPlugins: [
      [
        "next-superjson-plugin",
        {
          excluded: [],
        },
      ],
    ],
  },
};

export default withAxiom(config);
