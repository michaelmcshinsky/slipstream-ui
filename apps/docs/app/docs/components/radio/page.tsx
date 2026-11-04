import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: "Radio",
  description: "Native radio buttons grouped for mutually exclusive choices.",
};

export default function Page() {
  return <Demo />;
}
