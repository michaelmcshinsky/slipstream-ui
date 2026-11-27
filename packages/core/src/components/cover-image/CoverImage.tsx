import * as React from 'react';
import { cn } from '../../utils/cn';
import { Image } from '../image/Image';

export type CoverImageProps = {
  /** Cover URL. When absent or broken, the seeded fallback renders instead. */
  src?: string | null;
  /** Required: describes the image for assistive tech. */
  alt: string;
  /**
   * Aspect ratio: 'video' (16:9), 'square' (1:1), 'wide' (2:1), or any CSS
   * aspect-ratio value such as '16/9' or '4/3'.
   */
  aspect?: 'video' | 'square' | 'wide' | string;
  /** Stable key selecting the fallback gradient (e.g. entity slug). */
  seed?: string;
  /** Load eagerly and fetch at high priority for the LCP image. */
  priority?: boolean;
  /** Responsive `sizes` hint forwarded to the image. */
  sizes?: string;
  /** Custom fallback content; defaults to the seed-derived gradient. */
  fallback?: React.ReactNode;
  /** Optional mark centered on the default gradient (icon, monogram). */
  mark?: React.ReactNode;
  className?: string;
};

const aspectClasses = {
  video: 'aspect-video',
  square: 'aspect-square',
  wide: 'aspect-[2/1]',
} as const;

// Token-derived gradients: every entry uses theme variables so covers stay on
// the active palette in light and dark mode and pass the token audit.
const gradients = [
  'linear-gradient(135deg, hsl(var(--primary) / 0.18), hsl(var(--info) / 0.10))',
  'linear-gradient(135deg, hsl(var(--info) / 0.16), hsl(var(--primary) / 0.08))',
  'linear-gradient(135deg, hsl(var(--warning) / 0.14), hsl(var(--primary) / 0.10))',
  'linear-gradient(135deg, hsl(var(--success) / 0.14), hsl(var(--info) / 0.08))',
] as const;

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function seededGradient(seed: string): React.CSSProperties {
  return { backgroundImage: gradients[hashSeed(seed) % gradients.length] };
}

/**
 * Media cover with a deterministic placeholder: a fixed-aspect box that shows
 * the image when present and a seed-derived token gradient (plus optional
 * mark) when the entity has no art. Broken images degrade to the same
 * gradient through Image's fallback chain, so imageless grids still look
 * intentional.
 */
export function CoverImage({
  src,
  alt,
  aspect = 'video',
  seed,
  priority = false,
  sizes,
  fallback,
  mark,
  className,
}: CoverImageProps) {
  const preset = aspectClasses[aspect as keyof typeof aspectClasses];
  const aspectStyle =
    preset === undefined && typeof aspect === 'string' ? { aspectRatio: aspect } : undefined;

  const fallbackNode =
    fallback ?? (
      <div
        className="flex h-full w-full items-center justify-center"
        style={seededGradient(seed ?? alt)}
        aria-hidden="true"
      >
        {mark && <span className="text-muted-foreground [&_svg]:size-8">{mark}</span>}
      </div>
    );

  return (
    <div
      className={cn('relative overflow-hidden rounded-lg bg-muted', preset, className)}
      style={aspectStyle}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          priority={priority}
          sizes={sizes}
          fallback={fallbackNode}
          className="h-full w-full object-cover"
        />
      ) : (
        fallbackNode
      )}
    </div>
  );
}

CoverImage.displayName = 'CoverImage';
