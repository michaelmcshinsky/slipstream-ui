import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { I18nProvider } from '@slipstream-ui/i18n/react';
import { ChatShell } from './chat-shell';

function renderShell(locale: 'en' | 'ar' | 'es') {
  return render(
    <I18nProvider locale={locale}>
      <ChatShell />
    </I18nProvider>,
  );
}

describe('ChatShell localization', () => {
  it('renders the English empty state without axe violations', async () => {
    const { container } = renderShell('en');
    expect(screen.getByRole('heading', { name: /ai chat starter/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/ask the agent/i)).toBeInTheDocument();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders Arabic in RTL with translated copy', () => {
    renderShell('ar');
    expect(screen.getByRole('heading', { name: /مُبدئ محادثة الذكاء الاصطناعي/ })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/اطلب من الوكيل/)).toBeInTheDocument();
    expect(document.documentElement.dir).toBe('rtl');
  });

  it('renders Spanish copy', () => {
    renderShell('es');
    expect(screen.getByRole('heading', { name: /inicio de chat con ia/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/pide al agente/i)).toBeInTheDocument();
  });
});
