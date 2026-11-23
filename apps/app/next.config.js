/** @type {import('next').NextConfig} */

const isDevelopment = process.env.NODE_ENV !== 'production';

/**
 * Content Security Policy.
 *
 * Shipped as `Content-Security-Policy-Report-Only` first: Next injects inline
 * bootstrap scripts, so an enforced policy would need nonces threaded through
 * the App Router before it can be turned on without breaking hydration.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy-Report-Only', value: contentSecurityPolicy },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
  },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
];

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@slipstream-ui/core', '@slipstream-ui/db'],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  // Keep the Stripe SDK out of the server bundle; it is a declared runtime
  // dependency loaded by Node rather than a dynamic eval-based loader.
  experimental: {
    serverComponentsExternalPackages: ['stripe'],
  },
};
module.exports = nextConfig;
