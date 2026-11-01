/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@slipstream-ui/core', '@slipstream-ui/ai', '@slipstream-ui/themes'],
  async redirects() {
    return [
      // Old/alternate changelog URL — keep external links from 404ing.
      { source: '/docs/changelog', destination: '/changelog', permanent: true },
    ];
  },
};

module.exports = nextConfig;
