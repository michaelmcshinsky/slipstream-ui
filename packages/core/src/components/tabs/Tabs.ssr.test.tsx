import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStringWithWarnings, testSSRCompatibility, testRSCCompatibility } from '../../test/ssr-test-utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs';

describe('Tabs SSR/RSC Compatibility', () => {
  it('renders correctly in SSR with default value', () => {
    const { html, errors } = renderToStringWithWarnings(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );
    expect(errors).toHaveLength(0);
    expect(html).toContain('Tab 1');
    expect(html).toContain('Tab 2');
    expect(html).toContain('Content 1');
  });

  it('passes SSR compatibility check', () => {
    const result = testSSRCompatibility(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content</TabsContent>
      </Tabs>
    );
    expect(result.html).toContain('Tab 1');
  });

  it('passes RSC compatibility check', () => {
    const result = testRSCCompatibility(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content</TabsContent>
      </Tabs>
    );
    expect(result.html).toContain('Tab 1');
  });

  it('renders without RSC-incompatible warnings', () => {
    const { warnings, errors } = renderToStringWithWarnings(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content</TabsContent>
      </Tabs>
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

  it('renders correctly with controlled value', () => {
    const { html, errors } = renderToStringWithWarnings(
      <Tabs value="tab2" onValueChange={() => {}}>
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );
    expect(errors).toHaveLength(0);
    expect(html).toContain('Tab 2');
  });
});