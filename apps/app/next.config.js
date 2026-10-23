/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@slipstream-ui/core', '@slipstream-ui/db'],
  // Keep the Stripe SDK out of the server bundle; it is a declared runtime
  // dependency loaded by Node (KC-038 replaces the old eval-based loader).
  experimental: {
    serverComponentsExternalPackages: ['stripe'],
  },
};
module.exports = nextConfig;
