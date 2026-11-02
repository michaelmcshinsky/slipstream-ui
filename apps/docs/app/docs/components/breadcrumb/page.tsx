import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: "Breadcrumb",
  description: "Navigation breadcrumb trail with links and current-page indicator.",
};

export default function Page() {
  return <Demo />;
}
