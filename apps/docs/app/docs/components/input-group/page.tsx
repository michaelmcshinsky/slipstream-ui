import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'InputGroup',
  description:
    'Composite input shell with flush left/right addons (icons, units, buttons) behind one outer outline; the nested field sheds its own border.',
};

export default function Page() {
  return <Demo />;
}
