/**
 * Slipstream brand mark — a streamlined "S" suggesting speed and flow.
 * Used in the navbar, footer, and as the basis for the favicon.
 */
export function SlipstreamIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Stylised slipstream S: three tapered speed lines curving into an S */}
      <path
        d="M24 8c-2-2.5-5.5-4-10-4C8.5 4 4 7 4 11.5c0 3.5 2.5 5.5 7 6.5l4 1c2.5.6 3.5 1.4 3.5 2.8 0 1.8-1.8 3-5 3-3.5 0-6-1.5-8-4"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Trailing speed lines */}
      <path
        d="M20 14h8M22 19h6M24 24h4"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}
