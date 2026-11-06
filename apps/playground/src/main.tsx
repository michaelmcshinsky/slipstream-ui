import React from 'react';
import ReactDOM from 'react-dom/client';
import { resolveLocale } from '@slipstream-ui/i18n';
import { I18nProvider } from '@slipstream-ui/i18n/react';
import App from './App';
import './index.css';

const locale = resolveLocale(window.localStorage.getItem('slipstream-locale'));

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <I18nProvider locale={locale}>
      <App />
    </I18nProvider>
  </React.StrictMode>
);
