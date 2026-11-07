'use client';

import * as React from 'react';
import { cn } from '../../utils/cn';
import { Button } from '../button/Button';
import { Input } from '../input/Input';

export type NewsletterProps = Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'title'> & {
  /** Headline for the signup block. */
  title: string;
  /** Supporting copy. */
  description?: string;
  /** Email placeholder. Default "you@example.com". */
  placeholder?: string;
  /** Submit button label. Default "Subscribe". */
  buttonLabel?: string;
  /** Visible or screen-reader label for the email field. Default "Email address". */
  label?: string;
  /** Success message. */
  successMessage?: string;
  /** Failure message used when onSubmit rejects. */
  errorMessage?: string;
  /** Consent or privacy copy shown under the form. */
  consent?: React.ReactNode;
  /** Submit handler. Omit for a presentational form. */
  onSubmit?: (email: string) => void | Promise<void>;
  /** Inline on desktop or always stacked. Default 'inline'. */
  layout?: 'inline' | 'stacked';
  /** Heading level. Default 2. */
  level?: 2 | 3;
};

type NewsletterStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * Newsletter capture block with pending, success and failure states. The
 * component owns only the email field and status; the caller owns the network
 * request, CRM and double opt-in.
 */
export const Newsletter = React.forwardRef<HTMLFormElement, NewsletterProps>(function Newsletter(
  {
    title,
    description,
    placeholder = 'you@example.com',
    buttonLabel = 'Subscribe',
    label = 'Email address',
    successMessage = 'Thanks. Check your inbox to confirm.',
    errorMessage = 'Something went wrong. Please try again.',
    consent,
    onSubmit,
    layout = 'inline',
    level = 2,
    className,
    ...props
  },
  ref
) {
  const id = React.useId();
  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState<NewsletterStatus>('idle');
  const Heading = `h${level}` as 'h2' | 'h3';

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!onSubmit) return;
    setStatus('loading');
    try {
      await onSubmit(email);
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="w-full">
      <Heading className="text-2xl font-semibold tracking-tight">{title}</Heading>
      {description && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>}
      <form ref={ref} onSubmit={handleSubmit} className={cn('mt-5', className)} {...props}>
        <div className={cn('flex gap-2', layout === 'inline' ? 'flex-col sm:flex-row' : 'flex-col')}>
          <label htmlFor={id} className="sr-only">
            {label}
          </label>
          <Input
            id={id}
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={placeholder}
            disabled={status === 'loading'}
            className="sm:flex-1"
          />
          <Button type="submit" loading={status === 'loading'} className="shrink-0">
            {buttonLabel}
          </Button>
        </div>
        {consent && <div className="mt-3 text-xs leading-relaxed text-muted-foreground">{consent}</div>}
        <div aria-live="polite" className="mt-2 min-h-5 text-sm">
          {status === 'success' && <p className="text-success">{successMessage}</p>}
          {status === 'error' && (
            <p role="alert" className="text-destructive">
              {errorMessage}
            </p>
          )}
        </div>
      </form>
    </div>
  );
});
