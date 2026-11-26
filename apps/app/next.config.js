/** @type {import('next').NextConfig} */

const isDevelopment = process.env.NODE_ENV !== 'production';

/**
 * Content Security Policy - enforced, matching the docs site.
 *
 * `script-src` allows `'unsafe-inline'`, which covers Next's inline bootstrap
 * and the theme-init script in the root layout, so enforcement needs no
 * nonce threading. Dropping `'unsafe-inline'` for per-request nonces remains
 * a possible hardening follow-up (IMP-SEC-001/IMP-ENG-011/IMP-WEB-017).
 *
 * The Google origins cover the consent-gated GA4 tag used when
 * NEXT_PUBLIC_GA_MEASUREMENT_ID is configured for the app property.
 */
const googleAnalyticsOrigins = [
  'https://www.googletagmanager.com',
  'https://*.google-analytics.com',
  'https://*.analytics.google.com',
].join(' ');

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com${isDevelopment ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https://www.googletagmanager.com https://*.google-analytics.com`,
  "font-src 'self' data:",
  `connect-src 'self' ${googleAnalyticsOrigins}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
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
