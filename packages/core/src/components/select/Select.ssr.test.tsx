import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStringWithWarnings, testSSRCompatibility, testRSCCompatibility } from '../../test/ssr-test-utils';
import { Select } from './Select';

describe('Select SSR/RSC Compatibility', () => {
  const options = [
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' },
    { value: 'c', label: 'Option C' },
  ];

  it('renders correctly in SSR', () => {
    const { html, errors } = renderToStringWithWarnings(
      <Select options={options} label="Choose" />
    );
    expect(errors).toHaveLength(0);
    expect(html).toContain('Choose');
  });

  it('passes SSR compatibility check', () => {
    const result = testSSRCompatibility(
      <Select options={options} label="Choose" />
    );
    expect(result.html).toContain('Choose');
  });

  it('passes RSC compatibility check', () => {
    const result = testRSCCompatibility(
      <Select options={options} label="Choose" />
    );
    expect(result.html).toContain('Choose');
  });

  it('renders without RSC-incompatible warnings', () => {
    const { warnings, errors } = renderToStringWithWarnings(
      <Select options={options} label="Choose" />
    );
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

  it('renders correctly with value', () => {
    const { html, errors } = renderToStringWithWarnings(
      <Select options={options} value="b" />
    );
    expect(errors).toHaveLength(0);
    expect(html).toContain('Option B');
  });

  it('renders correctly with disabled state', () => {
    const { html, errors } = renderToStringWithWarnings(
      <Select options={options} disabled />
    );
    expect(errors).toHaveLength(0);
    expect(html).toContain('disabled');
  });
});