/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@slipstream-ui/core', '@slipstream-ui/db'],
};
module.exports = nextConfig;
