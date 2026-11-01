import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStringWithWarnings, testSSRCompatibility, testRSCCompatibility } from '../../test/ssr-test-utils';
import { Input } from './Input';

describe('Input SSR/RSC Compatibility', () => {
  it('renders correctly in SSR', () => {
    const { html, errors } = renderToStringWithWarnings(
      <Input placeholder="Enter text" />
    );
    expect(errors).toHaveLength(0);
    expect(html).toContain('placeholder="Enter text"');
  });

  it('passes SSR compatibility check', () => {
    const result = testSSRCompatibility(<Input placeholder="Email" />);
    expect(result.html).toContain('placeholder="Email"');
  });

  it('passes RSC compatibility check', () => {
    const result = testRSCCompatibility(<Input placeholder="Email" />);
    expect(result.html).toContain('placeholder="Email"');
  });

  it('renders without RSC-incompatible warnings', () => {
    const { warnings, errors } = renderToStringWithWarnings(<Input placeholder="Email" />);
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

  it('renders correctly with different types', () => {
    const types = ['text', 'email', 'password', 'number', 'tel', 'url'] as const;
    types.forEach(type => {
      const { html, errors } = renderToStringWithWarnings(<Input type={type} />);
      expect(errors).toHaveLength(0);
      expect(html).toContain(`type="${type}"`);
    });
  });

  it('renders correctly with disabled state', () => {
    const { html, errors } = renderToStringWithWarnings(
      <Input placeholder="Disabled" disabled />
    );
    expect(errors).toHaveLength(0);
    expect(html).toContain('disabled');
  });

  it('renders correctly with required attribute', () => {
    const { html, errors } = renderToStringWithWarnings(
      <Input required />
    );
    expect(errors).toHaveLength(0);
    expect(html).toContain('required');
  });

  it('renders correctly with value', () => {
    const { html, errors } = renderToStringWithWarnings(
      <Input value="test value" readOnly />
    );
    expect(errors).toHaveLength(0);
    expect(html).toContain('value="test value"');
    expect(html).toContain('readonly');
  });
});