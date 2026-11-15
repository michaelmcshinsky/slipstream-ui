'use client';

import * as React from 'react';
import { cn } from '../../utils/cn';

export type ImageProps = {
  /** Primary image URL. Hotlinked sources are expected. */
  src: string;
  /** Required: describes the image, not the component. */
  alt: string;
  /** Second chance before the fallback node (e.g. generated placeholder art). */
  fallbackSrc?: string;
  /** Rendered when every URL has failed (icon, initials, empty panel). */
  fallback?: React.ReactNode;
  /** Load eagerly and fetch at high priority for the LCP image. */
  priority?: boolean;
  /** Intrinsic width; always emitted so the browser reserves space. */
  width?: number;
  /** Intrinsic height; always emitted so the browser reserves space. */
  height?: number;
  /** Classes for the image; merged with imgClassName. */
  className?: string;
  /** Classes for the image when a consumer wants to keep them separate. */
  imgClassName?: string;
  style?: React.CSSProperties;
};

/**
 * Resilient image: `src` -> `fallbackSrc` -> `fallback` node.
 *
 * Organizer images are hotlinked and occasionally 403, move, or die. Cards
 * must never show a broken-image box or shift layout when that happens, so
 * intrinsic dimensions are always rendered and only the priority image is
 * eager.
 */
export function Image({
  src,
  alt,
  fallbackSrc,
  fallback,
  priority = false,
  width = 1200,
  height = 630,
  className,
  imgClassName,
  style,
}: ImageProps) {
  const [stage, setStage] = React.useState<0 | 1 | 2>(0);

  const onError = () => setStage((current) => (current === 0 && fallbackSrc ? 1 : 2));
  const current = stage === 0 ? src : stage === 1 ? fallbackSrc : null;

  if (!current || stage === 2) return <>{fallback ?? null}</>;

  return (
    <img
      src={current}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      className={cn(className, imgClassName)}
      style={style}
      onError={onError}
    />
  );
}

Image.displayName = 'Image';
