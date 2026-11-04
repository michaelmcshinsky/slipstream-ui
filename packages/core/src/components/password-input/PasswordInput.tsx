'use client';

import * as React from 'react';
import { cn } from '../../utils/cn';
import { Button } from '../button/Button';
import { Input, type InputProps } from '../input/Input';

export type PasswordInputProps = Omit<InputProps, 'type'> & {
  /** Accessible labels for the visibility toggle. */
  showLabel?: string;
  hideLabel?: string;
};

/**
 * Password field with a show/hide toggle. The toggle is a real button with
 * pressed state, so keyboard and screen-reader users can reveal the value
 * without losing the focused field.
 */
export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput(
  { className, showLabel = 'Show password', hideLabel = 'Hide password', ...props },
  ref
) {
  const [visible, setVisible] = React.useState(false);

  return (
    <div className={cn('relative flex items-center', className)}>
      <Input ref={ref} type={visible ? 'text' : 'password'} className="pr-24" {...props} />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        aria-pressed={visible}
        aria-label={visible ? hideLabel : showLabel}
        onClick={() => setVisible((current) => !current)}
        className="absolute right-1 h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
      >
        {visible ? 'Hide' : 'Show'}
      </Button>
    </div>
  );
});
