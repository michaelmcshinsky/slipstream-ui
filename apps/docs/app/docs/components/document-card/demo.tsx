'use client';

import { DocumentCard } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

export default function Demo() {
  return (
    <>
      <DemoCard
        title="Project documents"
        preview={
          <div className="w-full space-y-3">
            <DocumentCard
              name="Q3-report.pdf"
              fileType="PDF"
              size="2.4 MB"
              updatedAt="Nov 1, 2026"
              onDownload={() => {}}
            />
            <DocumentCard
              name="contract-draft.pdf"
              fileType="PDF"
              size="8.1 MB"
              status="restricted"
              onDownload={() => {}}
            />
            <DocumentCard
              name="Contact-list.xlsx"
              fileType="XLSX"
              size="640 KB"
              status="pending"
            />
          </div>
        }
        code={`<DocumentCard
  name="Q3-report.pdf"
  fileType="PDF"
  size="2.4 MB"
  updatedAt="Nov 1, 2026"
  onDownload={download}
/>`}
        usage={`// Restricted and pending rows keep the metadata but disable download.
// Omit onDownload for a display-only row.`}
        types={`type DocumentStatus = 'available' | 'restricted' | 'pending';

type DocumentCardProps = {
  name: string;
  fileType: string;
  size?: string;
  updatedAt?: string;
  status?: DocumentStatus;
  onDownload?: () => void;
  downloadLabel?: string;
  icon?: React.ReactNode;
};`}
      />
    </>
  );
}
