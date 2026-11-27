'use client';

import { MediaCard } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

const events = [
  {
    slug: 'fall-classic',
    title: 'Fall Classic',
    description: 'Two days of waltz, foxtrot and Viennese across six heats.',
    meta: 'Mar 14–15 · Salt Lake City Convention Center',
    chips: [
      { label: 'Registration open', variant: 'outline-success' as const, dot: true },
      { label: 'Pro/Am', variant: 'outline' as const },
    ],
  },
  {
    slug: 'winter-showcase',
    title: 'Winter Showcase',
    description: 'An evening of performances open to all levels.',
    meta: 'Feb 7 · Studio Theater',
    chips: [{ label: 'Almost full', variant: 'outline-warning' as const, dot: true }],
  },
  {
    slug: 'open-floor',
    title: 'Open Floor Social',
    description: 'Drop-in practice with a live band until midnight.',
    meta: 'Every Friday · Main Hall',
    chips: [{ label: 'Weekly', variant: 'outline-info' as const }],
  },
];

export default function Demo() {
  return (
    <>
      <DemoCard
        title="Event grid with seeded covers"
        preview={
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
            {events.map((event) => (
              <MediaCard
                key={event.slug}
                href={`/events/${event.slug}`}
                title={event.title}
                description={event.description}
                cover={{ alt: `${event.title} cover`, seed: event.slug, aspect: 'video' }}
                meta={event.meta}
                chips={event.chips}
                footer="Details →"
              />
            ))}
          </div>
        }
        code={`{events.map((event) => (
  <MediaCard
    key={event.slug}
    href={event.href}
    title={event.title}
    description={event.summary}
    cover={{ src: event.imageUrl, alt: event.title, seed: event.slug }}
    meta={event.date + ' · ' + event.venue}
    chips={[{ label: 'Open', variant: 'outline-success', dot: true }]}
    footer="Details →"
  />
))}`}
        usage={`// No imageUrl? The seed picks a stable token gradient per event,
// so imageless grids still look intentional.`}
        types={`type MediaCardProps = {
  title: string;
  description?: React.ReactNode;
  href?: string;                    // whole card becomes one link
  cover?: CoverImageProps;          // src, alt, aspect, seed, mark…
  meta?: React.ReactNode;           // "Mar 14 · Salt Lake City"
  chips?: { label: string; variant?: BadgeVariant; dot?: boolean }[];
  footer?: React.ReactNode;         // non-interactive when href is set
  layout?: 'vertical' | 'row';
  linkComponent?: React.ElementType;
  linkHrefProp?: 'href' | 'to';
};`}
      />
      <DemoCard
        title="Row layout and real cover art"
        preview={
          <div className="flex w-full flex-col gap-4">
            <MediaCard
              layout="row"
              href="/articles/first-competition"
              title="Your first competition: a studio guide"
              description="What to expect from check-in to the final waltz."
              cover={{ alt: 'Article cover', seed: 'first-competition', aspect: 'square' }}
              meta="Read time 6 min"
            />
            <MediaCard
              layout="row"
              href="/events/fall-classic"
              title="Fall Classic"
              description="Two days of waltz, foxtrot and Viennese."
              meta="Mar 14–15 · Salt Lake City"
              cover={{
                src: '/ballroom.jpg',
                alt: 'Fall Classic cover',
                aspect: 'video',
              }}
              chips={[{ label: 'Open', variant: 'outline-success', dot: true }]}
            />
          </div>
        }
        code={`<MediaCard
  layout="row"
  href={article.href}
  title={article.title}
  cover={{ src: article.imageUrl, alt: article.title, seed: article.slug, aspect: 'square' }}
  meta={article.readTime}
/>

// Real art works too — broken images fall back to the seeded gradient.`}
        usage={`// layout="row" keeps a fixed-width cover beside the content —
// good for search results and compact lists.`}
      />
    </>
  );
}
