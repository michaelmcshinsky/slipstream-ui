import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'PasswordInput',
  description:
    'Password field with an accessible show/hide toggle (aria-pressed), built on Input.',
};

export default function Page() {
  return <Demo />;
}
