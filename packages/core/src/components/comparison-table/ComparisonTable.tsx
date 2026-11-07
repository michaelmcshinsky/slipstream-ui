import * as React from 'react';
import { cn } from '../../utils/cn';

export type ComparisonColumn = {
  /** Column heading (e.g. "With an advisor"). */
  label: string;
  /** Visually emphasize this column. */
  highlight?: boolean;
};

export type ComparisonRow = {
  /** Capability or criterion shown in the first column. */
  feature: string;
  /** One value per column: boolean for included/not included, string for free text. */
  values: Array<string | boolean>;
  /** Optional supporting line under the feature. */
  hint?: string;
};

export type ComparisonTableProps = React.HTMLAttributes<HTMLTableElement> & {
  /** Comparison columns, excluding the feature column. */
  columns: ComparisonColumn[];
  /** Feature rows with one value per column. */
  rows: ComparisonRow[];
  /** Accessible caption. Default "Comparison". */
  caption?: string;
  /** Heading for the feature column. Default "Feature". */
  featureLabel?: string;
  /** Screen-reader labels for boolean cells. */
  valueLabels?: { yes?: string; no?: string };
};

function CheckMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mx-auto h-5 w-5 text-success"
    >
      <path d="m4 10.5 4 4 8-9" />
    </svg>
  );
}

function DashMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      className="mx-auto h-5 w-5 text-muted-foreground/60"
    >
      <path d="M5 10h10" />
    </svg>
  );
}

/**
 * Marketing comparison table for "us vs. them" or "with an advisor vs. on
 * your own" sections. Boolean cells render a check or dash plus screen-reader
 * text, so the comparison never relies on color or glyph alone.
 */
export const ComparisonTable = React.forwardRef<HTMLTableElement, ComparisonTableProps>(
  function ComparisonTable(
    {
      columns,
      rows,
      caption = 'Comparison',
      featureLabel = 'Feature',
      valueLabels,
      className,
      ...props
    },
    ref
  ) {
    const yes = valueLabels?.yes ?? 'Included';
    const no = valueLabels?.no ?? 'Not included';

    return (
      <div className="w-full overflow-x-auto rounded-xl border border-border bg-card">
        <table ref={ref} className={cn('w-full border-collapse text-sm', className)} {...props}>
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="min-w-48 px-5 py-4 text-left font-medium text-muted-foreground">
                {featureLabel}
              </th>
              {columns.map((column) => (
                <th
                  key={column.label}
                  scope="col"
                  className={cn(
                    'min-w-40 px-5 py-4 text-center font-semibold',
                    column.highlight && 'bg-primary/10 text-primary'
                  )}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.feature} className="border-b border-border last:border-b-0">
                <th scope="row" className="px-5 py-4 text-left font-medium">
                  {row.feature}
                  {row.hint && <span className="mt-1 block text-xs font-normal text-muted-foreground">{row.hint}</span>}
                </th>
                {columns.map((column, index) => {
                  const value = row.values[index];
                  return (
                    <td
                      key={`${row.feature}-${column.label}`}
                      className={cn('px-5 py-4 text-center align-middle', column.highlight && 'bg-primary/5')}
                    >
                      {typeof value === 'boolean' ? (
                        <>
                          {value ? <CheckMark /> : <DashMark />}
                          <span className="sr-only">{value ? yes : no}</span>
                        </>
                      ) : (
                        <span>{value ?? ''}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
);
