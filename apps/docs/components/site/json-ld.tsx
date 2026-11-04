type JsonLdProps = {
  /** A schema.org object from `@/lib/structured-data`. */
  data: Record<string, unknown>;
};

/**
 * Renders a JSON-LD block. `<` is escaped so a string value can never close
 * the script tag early (JSON.stringify alone does not).
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
