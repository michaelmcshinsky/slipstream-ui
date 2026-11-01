import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStringWithWarnings, testSSRCompatibility, testRSCCompatibility } from '../../test/ssr-test-utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card';

describe('Card SSR/RSC Compatibility', () => {
  it('renders correctly in SSR', () => {
    const { html, errors } = renderToStringWithWarnings(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    );
    expect(errors).toHaveLength(0);
    expect(html).toContain('Title');
    expect(html).toContain('Description');
    expect(html).toContain('Content');
    expect(html).toContain('Footer');
  });

  it('passes SSR compatibility check', () => {
    const result = testSSRCompatibility(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
        </CardHeader>
        <CardContent>Content</CardContent>
      </Card>
    );
    expect(result.html).toContain('Title');
    expect(result.html).toContain('Content');
  });

  it('passes RSC compatibility check', () => {
    const result = testRSCCompatibility(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
        </CardHeader>
        <CardContent>Content</CardContent>
      </Card>
    );
    expect(result.html).toContain('Title');
    expect(result.html).toContain('Content');
  });

  it('renders without RSC-incompatible warnings', () => {
    const { warnings, errors } = renderToStringWithWarnings(
      <Card>
        <CardContent>Content</CardContent>
      </Card>
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

  it('renders CardHeader correctly', () => {
    const { html, errors } = renderToStringWithWarnings(
      <CardHeader>
        <CardTitle>Title</CardTitle>
        <CardDescription>Description</CardDescription>
      </CardHeader>
    );
    expect(errors).toHaveLength(0);
    expect(html).toContain('Title');
    expect(html).toContain('Description');
  });

  it('renders CardContent correctly', () => {
    const { html, errors } = renderToStringWithWarnings(
      <CardContent>Content here</CardContent>
    );
    expect(errors).toHaveLength(0);
    expect(html).toContain('Content here');
  });

  it('renders CardFooter correctly', () => {
    const { html, errors } = renderToStringWithWarnings(
      <CardFooter>Footer content</CardFooter>
    );
    expect(errors).toHaveLength(0);
    expect(html).toContain('Footer content');
  });
});