'use client';

import { CoverImage } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

export default function Demo() {
  return (
    <>
      <DemoCard
        title="Seeded placeholder grid"
        preview={
          <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3">
            {['fall-classic', 'winter-showcase', 'spring-competition', 'summer-series', 'holiday-ball', 'open-floor'].map(
              (slug) => (
                <CoverImage
                  key={slug}
                  alt={`${slug} event`}
                  seed={slug}
                  aspect="video"
                  sizes="(min-width: 640px) 33vw, 50vw"
                />
              )
            )}
          </div>
        }
        code={`{events.map((event) => (
  <CoverImage
    key={event.slug}
    src={event.imageUrl}
    alt={event.title}
    seed={event.slug}
    aspect="video"
    sizes="(min-width: 640px) 33vw, 50vw"
  />
))}`}
        usage={`// No src? The seed picks a stable token gradient per entity, so
// imageless grids still look intentional. Pass the slug, not the title.`}
        types={`type CoverImageProps = {
  src?: string | null;
  alt: string;
  aspect?: 'video' | 'square' | 'wide' | string; // or '16/10'
  seed?: string;
  priority?: boolean;
  sizes?: string;
  fallback?: React.ReactNode;   // defaults to seeded gradient
  mark?: React.ReactNode;       // icon/monogram on the gradient
  className?: string;
};`}
      />
      <DemoCard
        title="Aspects, marks and custom fallback"
        preview={
          <div className="flex w-full flex-wrap items-start gap-4">
            <CoverImage alt="Square" seed="sq" aspect="square" className="w-28" />
            <CoverImage alt="Wide" seed="wide" aspect="wide" className="w-56" />
            <CoverImage
              alt="Marked"
              seed="marked"
              aspect="video"
              className="w-56"
              mark={<span className="text-lg font-bold">UD</span>}
            />
            <CoverImage
              alt="Custom"
              seed="custom"
              aspect="video"
              className="w-56"
              fallback={<div className="flex h-full w-full items-center justify-center bg-muted text-sm text-muted-foreground">No artwork</div>}
            />
          </div>
        }
        code={`<CoverImage alt="Square" seed="sq" aspect="square" />
<CoverImage alt="Wide" seed="wide" aspect="wide" />
<CoverImage alt="Studio" seed="studio-1" mark={<StudioMark />} />
<CoverImage alt="Event" fallback={<EmptyArt />} />`}
        usage={`// aspect: 'video' 16:9, 'square' 1:1, 'wide' 2:1, or any CSS
// aspect-ratio value. mark sits on the gradient; fallback replaces it.`}
      />
    </>
  );
}
