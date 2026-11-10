import { npmPackageUrl } from '@/lib/site';

export type PackageLinkProps = {
  /** npm package name, e.g. `@slipstream-ui/core`. */
  name: string;
  className?: string;
};

/**
 * Inline package name linked to its npm page. Package names are how consumers
 * verify a published artifact, so prose mentions link out the same way the
 * install commands reference them.
 *
 * Server component: `cn()` lives in the client bundle, so the class list is a
 * plain template string here.
 */
export function PackageLink({ name, className }: PackageLinkProps) {
  return (
    <a
      href={npmPackageUrl(name)}
      target="_blank"
      rel="noopener noreferrer"
      className={`font-semibold text-foreground underline underline-offset-2 transition-colors hover:text-primary${className ? ` ${className}` : ''}`}
    >
      {name}
      <span className="sr-only"> on npm (opens in a new tab)</span>
    </a>
  );
}
