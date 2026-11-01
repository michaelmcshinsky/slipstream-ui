import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStringWithWarnings, testSSRCompatibility, testRSCCompatibility } from '../../test/ssr-test-utils';
import { Switch } from './Switch';

describe('Switch SSR/RSC Compatibility', () => {
  it('renders correctly in SSR', () => {
    const { html, errors } = renderToStringWithWarnings(<Switch />);
    expect(errors).toHaveLength(0);
    expect(html).toContain('role="switch"');
  });

  it('passes SSR compatibility check', () => {
    const result = testSSRCompatibility(<Switch />);
    expect(result.html).toContain('role="switch"');
  });

  it('passes RSC compatibility check', () => {
    const result = testRSCCompatibility(<Switch />);
    expect(result.html).toContain('role="switch"');
  });

  it('renders without RSC-incompatible warnings', () => {
    const { warnings, errors } = renderToStringWithWarnings(<Switch />);
    expect(errors).toHaveLength(0);
    const rscWarnings = warnings.filter(w => 
      w.includes('useLayoutEffect') || 
      w.includes('useEffect') ||
      w.includes('useState') ||
      w.includes('useRef') ||
      w.includes('window') ||
      w.includes('document') ||
      w.includes('localStorage')
    );
    expect(rscWarnings).toHaveLength(0);
  });

  it('renders correctly when checked', () => {
    const { html, errors } = renderToStringWithWarnings(<Switch checked />);
    expect(errors).toHaveLength(0);
    expect(html).toContain('aria-checked="true"');
  });

  it('renders correctly with disabled state', () => {
    const { html, errors } = renderToStringWithWarnings(<Switch disabled />);
    expect(errors).toHaveLength(0);
    expect(html).toContain('disabled');
  });
});