interface PropsTableProps {
  rows: {
    name: string;
    type: string;
    defaultValue?: string;
    description: string;
  }[];
}

/** Shared props reference table used by every component docs page. */
export function PropsTable({ rows }: PropsTableProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="text-left p-3">Prop</th>
            <th className="text-left p-3">Type</th>
            <th className="text-left p-3">Default</th>
            <th className="text-left p-3">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-t">
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
