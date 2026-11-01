import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStringWithWarnings, testSSRCompatibility, testRSCCompatibility } from '../../test/ssr-test-utils';
import { Button } from './Button';

describe('Button SSR/RSC Compatibility', () => {
  it('renders correctly in SSR', () => {
    const { html, errors } = renderToStringWithWarnings(<Button>Click me</Button>);
    expect(errors).toHaveLength(0);
    expect(html).toContain('Click me');
    expect(html).toContain('class=');
  });

  it('passes SSR compatibility check', () => {
    const result = testSSRCompatibility(<Button>Test</Button>);
    expect(result.html).toContain('Test');
  });

  it('passes RSC compatibility check', () => {
    const result = testRSCCompatibility(<Button>Test</Button>);
    expect(result.html).toContain('Test');
  });

  it('renders without warnings in SSR', () => {
    const { warnings, errors } = renderToStringWithWarnings(<Button>Test</Button>);
    expect(errors).toHaveLength(0);
    // Should not have RSC-incompatible warnings
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

  it('renders correctly with different variants', () => {
    const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const;
    variants.forEach(variant => {
      const { html, errors } = renderToStringWithWarnings(<Button variant={variant}>Test</Button>);
      expect(errors).toHaveLength(0);
      expect(html).toContain('Test');
    });
  });

  it('renders correctly with size variants', () => {
    const sizes = ['sm', 'default', 'lg', 'icon'] as const;
    sizes.forEach(size => {
      const { html, errors } = renderToStringWithWarnings(<Button size={size}>Test</Button>);
      expect(errors).toHaveLength(0);
      expect(html).toContain('Test');
    });
  });
});