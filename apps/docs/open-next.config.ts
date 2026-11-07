import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/**
 * OpenNext adapter for Cloudflare Workers.
 *
 * HOSTING.md lists the docs app under Cloudflare Pages, but the App Router
 * reads locale cookies in `app/layout.tsx` and `app/changelog/page.tsx`, which
 * forces dynamic rendering. A static export is therefore not possible, so the
 * docs are served from a Worker instead. Same Cloudflare account, same deploy
 * flow, no extra vendor.
 */
export default defineCloudflareConfig({});
