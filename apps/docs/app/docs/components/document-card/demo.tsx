'use client';

import { DocumentCard } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function DocumentCardPage() {
  return (
    <ComponentPage
      id="document-card"
      title="DocumentCard"
      description="Document row with file metadata, access status and an optional download action."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'name', type: 'string', defaultValue: 'required', description: 'File name.' },
        { name: 'fileType', type: 'string', defaultValue: 'required', description: 'Short file type label, such as PDF or XLSX.' },
        { name: 'size', type: 'string', description: 'Human-readable file size.' },
        { name: 'updatedAt', type: 'string', description: 'Updated date or relative time.' },
        { name: 'status', type: "'available' | 'restricted' | 'pending'", defaultValue: "'available'", description: 'Access state.' },
        { name: 'onDownload', type: '() => void', description: 'Download handler; omit for a display-only row.' },
        { name: 'downloadLabel', type: 'string', defaultValue: "'Download'", description: 'Download button label.' },
        { name: 'icon', type: 'ReactNode', description: 'Custom file icon slot.' },
      ]}
      accessibility={[
        'The download button is named Download <file name>.',
        'Status is a text badge; restricted downloads are disabled.',
      ]}
    >
      <DemoCard
        title="Deal room documents"
        preview={
          <div className="w-full space-y-3">
            <DocumentCard
              name="Q3-financials.pdf"
              fileType="PDF"
              size="2.4 MB"
              updatedAt="Nov 1, 2026"
              onDownload={() => {}}
            />
            <DocumentCard
              name="CIM-draft.pdf"
              fileType="PDF"
              size="8.1 MB"
              status="restricted"
              onDownload={() => {}}
            />
            <DocumentCard
              name="Buyer-list.xlsx"
              fileType="XLSX"
              size="640 KB"
              status="pending"
            />
          </div>
        }
        code={`<DocumentCard
  name="Q3-financials.pdf"
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
    </ComponentPage>
  );
}
