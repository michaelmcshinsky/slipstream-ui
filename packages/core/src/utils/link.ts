import type { ElementType } from 'react';

/**
 * Shared props for components that can render a destination through a
 * router-aware link element. `linkComponent` swaps the underlying element
 * (Next `Link`, react-router `Link`); `linkHrefProp` names the prop that
 * carries the destination on that element (`href` or `to`).
 */
export type LinkLikeProps = {
  /** Custom link element for routers (Next Link, react-router Link). */
  linkComponent?: ElementType;
  /** Prop used to pass the destination to `linkComponent`. */
  linkHrefProp?: 'href' | 'to';
};

/** Props object carrying a destination for `linkComponent`/`linkHrefProp`. */
export function linkDestination(href: string, linkHrefProp: 'href' | 'to' = 'href') {
  return linkHrefProp === 'to' ? { to: href } : { href };
}
