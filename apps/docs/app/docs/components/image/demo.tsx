'use client';

import { Image } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

/**
 * Inline SVG placeholder so the docs preview renders without a network call.
 * A real consumer would point `fallbackSrc` at generated placeholder art.
 */
const PLACEHOLDER =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360'%3E%3Crect width='640' height='360' fill='%23e5e7eb'/%3E%3Cpath d='M0 300 L200 140 L340 260 L470 180 L640 300 L640 360 L0 360 Z' fill='%239ca3af'/%3E%3C/svg%3E";

const BROKEN = '/images/does-not-exist.jpg';

export default function ImagePage() {
  return (
    <ComponentPage
      id="image"
      title="Image"
      description="Resilient image with a two-step fallback chain, intrinsic dimensions and an LCP priority flag."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'src', type: 'string', description: 'Primary image URL. Hotlinked sources are expected.' },
        { name: 'alt', type: 'string', description: 'Required: describes the image content, not the component.' },
        {
          name: 'fallbackSrc',
          type: 'string',
          description: 'Second URL tried before the fallback node, such as generated placeholder art.',
        },
        {
          name: 'fallback',
          type: 'React.ReactNode',
          description: 'Content rendered when every URL has failed (icon, initials, empty panel).',
        },
        {
          name: 'priority',
          type: 'boolean',
          defaultValue: 'false',
          description: 'Load eagerly and fetch at high priority for the one above-the-fold image.',
        },
        {
          name: 'width',
          type: 'number',
          defaultValue: '1200',
          description: 'Intrinsic width, always emitted so the browser reserves space.',
        },
        {
          name: 'height',
          type: 'number',
          defaultValue: '630',
          description: 'Intrinsic height, always emitted so the browser reserves space.',
        },
        { name: 'className', type: 'string', description: 'Classes for the image.' },
        { name: 'imgClassName', type: 'string', description: 'Extra classes merged after className.' },
        { name: 'style', type: 'React.CSSProperties', description: 'Inline styles for the image.' },
      ]}
      accessibility={[
        'alt is required by the type; describe the image, not the component.',
        'Intrinsic width and height are always emitted, so a failed or slow image never shifts the layout.',
        'Only the priority image loads eagerly; every other image is lazy and decodes asynchronously.',
        'Fallback content should carry the same information as the image, not a second description.',
        'Set alt="" on a decorative image whose fallback already shows the message.',
      ]}
    >
      <DemoCard
        title="Fallback chain"
        preview={
          <div className="flex w-full flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <p className="mb-2 text-xs font-medium text-muted-foreground">Broken src, fallbackSrc</p>
              <Image
                src={BROKEN}
                fallbackSrc={PLACEHOLDER}
                alt="Ballroom competition floor"
                width={640}
                height={360}
                className="h-auto w-full rounded-lg border border-border"
              />
            </div>
            <div className="flex-1">
              <p className="mb-2 text-xs font-medium text-muted-foreground">Every URL failed</p>
              <Image
                src={BROKEN}
                alt=""
                fallback={
                  <div className="flex h-[180px] w-full items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                    No image available
                  </div>
                }
              />
            </div>
          </div>
        }
        code={`<Image
  src={event.imageUrl}
  fallbackSrc="/images/event-placeholder.svg"
  alt={event.name}
  width={1200}
  height={630}
  className="h-auto w-full rounded-lg"
/>

{/* Nothing left to try: render consumer content instead */}
<Image
  src={event.imageUrl}
  alt=""
  fallback={<EmptyPanel>No image available</EmptyPanel>}
/>`}
        usage={`import { Image } from '@slipstream-ui/core';

<Image src="/cover.jpg" fallbackSrc="/placeholder.svg" alt="Cover" />`}
      />

      <DemoCard
        title="Dimensions and priority"
        preview={
          <div className="w-full max-w-md">
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Above-the-fold hero: priority, explicit 16:9 box
            </p>
            <Image
              src={PLACEHOLDER}
              alt="Placeholder cover art"
              priority
              width={640}
              height={360}
              className="h-auto w-full rounded-lg border border-border"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              The width and height attributes reserve the 16:9 box before the file arrives, so nothing moves.
            </p>
          </div>
        }
        code={`<Image
  src={hero.imageUrl}
  alt={hero.title}
  priority
  width={1200}
  height={675}
  className="h-auto w-full"
/>`}
      />
    </ComponentPage>
  );
}
