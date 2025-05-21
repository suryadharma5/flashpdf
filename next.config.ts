import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

// eslint-disable-next-line @typescript-eslint/no-require-imports
const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin("./app/i18n/request.ts");

module.exports = withNextIntl(nextConfig);

export default nextConfig;
