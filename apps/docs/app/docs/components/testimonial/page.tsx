import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'Testimonial',
  description: 'Semantic written testimonial with quote, person, role, company, avatar and logo slots.',
};

export default function Page() {
  return <Demo />;
}
