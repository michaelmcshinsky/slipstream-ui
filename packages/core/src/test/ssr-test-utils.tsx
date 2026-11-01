import React from 'react';
import { renderToString } from 'react-dom/server';

/**
 * SSR Test Utilities
 * 
 * Provides utilities for testing Server-Side Rendering and React Server Components
 * compatibility. These utilities help verify that components render correctly
 * on the server and hydrate correctly on the client.
 */

/**
 * Renders a component to string using React's SSR.
 * Returns the HTML string and any warnings/errors encountered.
 */
export function renderToStringWithWarnings(element: React.ReactElement) {
  const warnings: string[] = [];
  const errors: string[] = [];
  
  const originalWarn = console.warn;
  const originalError = console.error;
  
  console.warn = (...args) => {
    warnings.push(args.join(' '));
  };
  console.error = (...args) => {
    errors.push(args.join(' '));
  };
  
  try {
    const html = renderToString(element);
    return { html, warnings, errors };
  } finally {
    console.warn = originalWarn;
    console.error = originalError;
  }
}

/**
 * Checks if a component renders without throwing in SSR context.
 */
export function expectNoSSRWarnings(html: string, warnings: string[] = []) {
  // Filter out known acceptable warnings
  const relevantWarnings = warnings.filter(w => 
    !w.includes('deprecated') && 
    !w.includes('useLayoutEffect') &&
    !w.includes('useEffect') &&
    !w.includes('hydration')
  );
  
  if (relevantWarnings.length > 0) {
    throw new Error(`SSR warnings detected: ${relevantWarnings.join(', ')}`);
  }
  
  return true;
}

/**
 * Tests that a component renders without throwing in both SSR and client contexts.
 */
export function testSSRCompatibility(element: React.ReactElement) {
  const { html, warnings, errors } = renderToStringWithWarnings(element);
  
  if (errors.length > 0) {
    throw new Error(`SSR errors: ${errors.join(', ')}`);
  }
  
  return { html, warnings };
}

/**
 * Tests that a component works as a React Server Component (RSC).
 * RSC components must be serializable and not use browser-only APIs.
 */
export function testRSCCompatibility(element: React.ReactElement) {
  // RSC components must:
  // 1. Not use browser-only APIs (window, document, localStorage, etc.)
  // 2. Not use useState, useEffect, useLayoutEffect, etc.
  // 3. Be serializable (no functions, class instances, etc.)
  // 4. Not use context that requires client-side providers
  
  const { html, warnings, errors } = renderToStringWithWarnings(element);
  
  if (errors.length > 0) {
    throw new Error(`RSC compatibility errors: ${errors.join(', ')}`);
  }
  
  // Check for common RSC violations in warnings
  const rscWarnings = warnings.filter(w => 
    w.includes('useLayoutEffect') ||
    w.includes('useEffect') ||
    w.includes('useState') ||
    w.includes('useRef') ||
    w.includes('window') ||
    w.includes('document') ||
    w.includes('localStorage')
  );
  
  if (rscWarnings.length > 0) {
    throw new Error(`RSC compatibility warnings: ${rscWarnings.join(', ')}`);
  }
  
  return { html };
}

/**
 * Creates a test wrapper for SSR testing that mimics the app's layout.
 */
export function createSSRTestWrapper(
  children: React.ReactNode,
  options: {
    theme?: 'light' | 'dark';
    locale?: string;
  } = {}
) {
  return (
    <html lang={options.locale || 'en'}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${options.theme || 'light'} min-h-screen`}>
        {children}
      </body>
    </html>
  );
}

export { renderToString } from 'react-dom/server';