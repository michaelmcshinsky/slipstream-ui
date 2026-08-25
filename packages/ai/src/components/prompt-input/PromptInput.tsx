'use client';

import * as React from 'react';
import { Button } from '@slipstream-ui/core';
import { cn } from '@slipstream-ui/core';
import { AttachmentList } from '../attachment';
import type { AttachmentItem } from '../attachment';

export interface PromptInputProps {
  onSubmit: (value: string) => void;
  /** Called when the user requests to stop an in-flight generation. */
  onStop?: () => void;
  /** Files queued on the prompt; rendered as removable chips above the textarea. */
  attachments?: AttachmentItem[];
  onRemoveAttachment?: (attachment: AttachmentItem) => void;
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  autoFocus?: boolean;
  maxLength?: number;
  showSendButton?: boolean;
  sendButtonText?: string;
  stopButtonText?: string;
}

const PromptInput = React.forwardRef<HTMLTextAreaElement, PromptInputProps>(
  ({
    onSubmit,
    onStop,
    attachments,
    onRemoveAttachment,
    placeholder = 'Type your message...',
    disabled = false,
    isLoading = false,
    className,
    autoFocus = false,
    maxLength,
    showSendButton = true,
    sendButtonText = 'Send',
    stopButtonText = 'Stop generating',
    ...props
  }, ref) => {
    const [value, setValue] = React.useState('');
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    // Use the forwarded ref or internal ref
    React.useImperativeHandle(ref, () => textareaRef.current!);

    // Auto-focus on mount if requested
    React.useEffect(() => {
      if (autoFocus && textareaRef.current) {
        textareaRef.current.focus();
      }
    }, [autoFocus]);

    // Auto-resize textarea
    React.useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }, [value]);

    const canSubmit = Boolean(value.trim()) && !disabled && !isLoading;

    const handleSubmit = () => {
      const trimmedValue = value.trim();
      if (trimmedValue && !disabled && !isLoading) {
        onSubmit(trimmedValue);
        setValue('');
        // Reset height after clearing
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
        }
      }
    };

    const handleStop = () => {
      onStop?.();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    };

    return (
      <div className={cn('flex flex-col gap-2', className)} {...props}>
        {attachments && attachments.length > 0 && (
          <AttachmentList attachments={attachments} onRemove={onRemoveAttachment} />
        )}
        <div className="flex gap-2 items-end">
          <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          maxLength={maxLength}
          rows={1}
          className={cn(
            'flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'min-h-[40px] max-h-[200px] overflow-y-auto'
          )}
        />
        {showSendButton && (
          <Button
            onClick={isLoading && onStop ? handleStop : handleSubmit}
            disabled={isLoading && onStop ? false : !canSubmit || disabled}
            variant={isLoading && onStop ? 'outline' : 'default'}
            size="icon"
            type="button"
            aria-label={isLoading && onStop ? stopButtonText : sendButtonText}
          >
            {isLoading && onStop ? (
              <span aria-hidden="true">■</span>
            ) : (
              <span>→</span>
            )}
          </Button>
        )}
        </div>
      </div>
    );
  }
);
PromptInput.displayName = 'PromptInput';

export { PromptInput };
