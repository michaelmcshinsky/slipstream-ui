'use client';

import { useI18n } from '@slipstream-ui/i18n/react';

type PropsTableProps = {
  rows: {
    name: string;
    type: string;
    defaultValue?: string;
    description: string;
  }[];
};

/** Shared props reference table used by every component docs page. */
export function PropsTable({ rows }: PropsTableProps) {
  const { t } = useI18n();

  return (
    // Scroll horizontally instead of clipping: four columns with long type
    // signatures are unreadable when squeezed onto a phone width.
    <div className="overflow-x-auto rounded-lg border border-border bg-card text-card-foreground">
      <table className="w-full text-sm">
        <thead className="bg-muted text-foreground">
          <tr>
            <th className="p-3 text-left font-medium">{t('site.props.prop')}</th>
            <th className="p-3 text-left font-medium">{t('site.props.type')}</th>
            <th className="p-3 text-left font-medium">{t('site.props.default')}</th>
            <th className="p-3 text-left font-medium">{t('site.props.description')}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-t border-border">
              <td className="p-3 font-mono text-xs">{row.name}</td>
              <td className="p-3 text-xs">{row.type}</td>
              <td className="p-3 font-mono text-xs">{row.defaultValue ?? '—'}</td>
              <td className="p-3 text-xs">{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
