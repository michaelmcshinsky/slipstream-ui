import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { I18nProvider, useI18n } from './react';

function Probe() {
  const { dir, locale, t } = useI18n();
  return (
    <span>
      {locale}:{dir}:{t('app.title')}
    </span>
  );
}

describe('I18nProvider', () => {
  it('renders translated text and direction on the server', () => {
    const html = renderToStaticMarkup(
      <I18nProvider locale="ar">
        <Probe />
      </I18nProvider>,
    );
    expect(html).toContain('ar:rtl:');
    expect(html).toContain('الذكاء');
  });

  it('throws when used outside the provider', () => {
    const original = console.error;
    console.error = () => undefined;
    try {
      expect(() => renderToStaticMarkup(<Probe />)).toThrow('useI18n must be used inside <I18nProvider>.');
    } finally {
      console.error = original;
    }
  });
});
