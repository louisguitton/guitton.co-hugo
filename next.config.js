const { withContentlayer } = require("next-contentlayer");

/** @type {import('next').NextConfig} */
module.exports = withContentlayer()({
  reactStrictMode: true,
  images: {
    domains: ["guitton.co", "cdn.devdojo.com"],
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
});
