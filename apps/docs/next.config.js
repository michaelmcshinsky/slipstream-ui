/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@slipstream-ui/core', '@slipstream-ui/ai', '@slipstream-ui/themes'],
};

module.exports = nextConfig;
