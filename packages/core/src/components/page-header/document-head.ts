/**
 * Router-agnostic document head descriptor.
 *
 * Build the metadata once, then let the consumer's router adapter apply it:
 *
 *   Next.js      -> return documentHead(...) from generateMetadata()
 *   Inertia      -> <Head title={head.title}><meta name="robots" ... /></Head>
 *   React Router -> <meta title={head.title} /> or a head manager
 *
 * No runtime dependency, no DOM access, safe in server components.
 */

export type DocumentHeadInput = {
  title: string;
  description?: string;
  canonical?: string;
  /** Emit `noindex, nofollow` instead of the default indexable pair. */
  noindex?: boolean;
};

export type DocumentHead = {
  title: string;
  description?: string;
  canonical?: string;
  robots: string;
};

export function documentHead({
  title,
  description,
  canonical,
  noindex = false,
}: DocumentHeadInput): DocumentHead {
  return {
    title,
    ...(description ? { description } : {}),
    ...(canonical ? { canonical } : {}),
    robots: noindex ? 'noindex, nofollow' : 'index, follow',
  };
}
