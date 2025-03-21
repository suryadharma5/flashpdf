import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./app/i18n/request.ts');
 
module.exports = withNextIntl(nextConfig);


export default nextConfig;
