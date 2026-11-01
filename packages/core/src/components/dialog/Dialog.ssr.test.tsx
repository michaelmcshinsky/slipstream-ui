import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStringWithWarnings } from '../../test/ssr-test-utils';
import { Dialog } from './Dialog';

describe('Dialog SSR/RSC Compatibility', () => {
  it('renders null in SSR when closed (createPortal requires DOM)', () => {
    const { html, errors } = renderToStringWithWarnings(
      <Dialog
        open={false}
        onOpenChange={() => {}}
        title="Title"
        description="Description"
      >
        <p>Content</p>
      </Dialog>
    );
    expect(errors).toHaveLength(0);
    // Dialog returns null when closed (createPortal requires DOM)
    expect(html).toBe('');
  });
});