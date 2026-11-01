import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStringWithWarnings, testSSRCompatibility, testRSCCompatibility } from '../../test/ssr-test-utils';
import { Badge } from './Badge';

describe('Badge SSR/RSC Compatibility', () => {
  it('renders correctly in SSR', () => {
    const { html, errors } = renderToStringWithWarnings(<Badge>New</Badge>);
    expect(errors).toHaveLength(0);
    expect(html).toContain('New');
  });

  it('passes SSR compatibility check', () => {
    const result = testSSRCompatibility(<Badge>New</Badge>);
    expect(result.html).toContain('New');
  });

  it('passes RSC compatibility check', () => {
    const result = testRSCCompatibility(<Badge>New</Badge>);
    expect(result.html).toContain('New');
  });

  it('renders without RSC-incompatible warnings', () => {
    const { warnings, errors } = renderToStringWithWarnings(<Badge>New</Badge>);
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

  it('renders correctly with all variants', () => {
    const variants = ['default', 'secondary', 'destructive', 'outline'] as const;
    variants.forEach(variant => {
      const { html, errors } = renderToStringWithWarnings(<Badge variant={variant}>Test</Badge>);
      expect(errors).toHaveLength(0);
      expect(html).toContain('Test');
    });
  });
});