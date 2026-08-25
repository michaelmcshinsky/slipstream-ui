'use client';

import * as React from 'react';
import { Button } from '@slipstream-ui/core';
import { cn } from '@slipstream-ui/core';
import { AttachmentList } from '../attachment';
import type { AttachmentItem } from '../attachment';

// ---------------------------------------------------------------------------
// Attachments hook: validation + state, reusable outside the input.
// ---------------------------------------------------------------------------

export interface UseAttachmentsOptions {
  /** File types to accept, e.g. "image/*" (HTML accept syntax). */
  accept?: string;
  /** Maximum number of queued files. */
  maxFiles?: number;
  /** Maximum size per file in bytes. */
  maxFileSize?: number;
  multiple?: boolean;
  onError?: (error: { code: 'max_files' | 'max_file_size' | 'accept'; message: string }) => void;
}

export interface UseAttachmentsResult {
  files: AttachmentItem[];
  add: (fileList: FileList | File[]) => void;
  remove: (id: string) => void;
  clear: () => void;
  openFileDialog: () => void;
  /** Hidden file input element; render it once somewhere in your tree. */
  input: React.ReactElement;
}

/**
 * Headless attachment queue with constraint validation.
 * Used internally by PromptInput and exported for custom composers.
 */
export function usePromptInputAttachments(options: UseAttachmentsOptions = {}): UseAttachmentsResult {
  const { accept, maxFiles, maxFileSize, multiple = true, onError } = options;
  const [files, setFiles] = React.useState<AttachmentItem[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const add = React.useCallback(
    (fileList: FileList | File[]) => {
      const incoming = Array.from(fileList);
      setFiles((prev) => {
        const next = [...prev];
        for (const file of incoming) {
          if (accept && !file.type.match(accept.replace(/\*/g, '.*'))) {
            onError?.({ code: 'accept', message: `"${file.name}" is not an accepted file type.` });
            continue;
          }
          if (maxFileSize && file.size > maxFileSize) {
            onError?.({
              code: 'max_file_size',
              message: `"${file.name}" exceeds the ${Math.round(maxFileSize / 1024)} KB limit.`,
            });
            continue;
          }
          if (maxFiles !== undefined && next.length >= maxFiles) {
            onError?.({ code: 'max_files', message: `At most ${maxFiles} files can be attached.` });
            break;
          }
          if (!multiple && next.length >= 1) {
            onError?.({ code: 'max_files', message: 'Only one file can be attached.' });
            break;
          }
          next.push({
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            name: file.name,
            size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
            type: file.type.split('/')[1]?.toUpperCase() ?? file.name.split('.').pop()?.toUpperCase(),
          });
        }
        return next;
      });
    },
    [accept, maxFileSize, maxFiles, multiple, onError]
  );

  const remove = React.useCallback((id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  }, []);

  const clear = React.useCallback(() => setFiles([]), []);

  const openFileDialog = React.useCallback(() => inputRef.current?.click(), []);

  const input = (
    <input
      ref={inputRef}
      type="file"
      hidden
      accept={accept}
      multiple={multiple}
      onChange={(event) => {
        if (event.target.files) add(event.target.files);
        event.target.value = '';
      }}
    />
  );

  return { files, add, remove, clear, openFileDialog, input };
}

// ---------------------------------------------------------------------------
// Speech recognition (Web Speech API), no-op where unsupported.
// ---------------------------------------------------------------------------

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
}

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

/** Web Speech API dictation; returns supported=false on unsupported browsers. */
export function useSpeechRecognition(onTranscript: (text: string) => void): {
  supported: boolean;
  isListening: boolean;
  toggle: () => void;
} {
  const [isListening, setIsListening] = React.useState(false);
  // Cast through unknown: Safari prefixes webkitSpeechRecognition.
  const Ctor =
    typeof window !== 'undefined'
      ? ((window as unknown as Record<string, SpeechRecognitionCtor | undefined>).SpeechRecognition ??
        (window as unknown as Record<string, SpeechRecognitionCtor | undefined>).webkitSpeechRecognition)
      : undefined;

  const recognitionRef = React.useRef<SpeechRecognitionLike | null>(null);

  const toggle = React.useCallback(() => {
    if (!Ctor) return;
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const recognition = new Ctor();
    recognition.lang = navigator.language || 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = Array.from({ length: event.results.length }, (_, i) => event.results[i][0].transcript).join(' ');
      onTranscript(transcript.trim());
    };
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [Ctor, isListening, onTranscript]);

  return { supported: Boolean(Ctor), isListening, toggle };
}

// ---------------------------------------------------------------------------
// Context shared by the compound primitives.
// ---------------------------------------------------------------------------

interface PromptInputContextValue {
  value: string;
  setValue: (value: string) => void;
  disabled: boolean;
  isLoading: boolean;
  canSubmit: boolean;
  submit: () => void;
  stop: () => void;
  hasStop: boolean;
  attachments: AttachmentItem[];
  removeAttachment: (id: string) => void;
  addFiles: (files: FileList | File[]) => void;
  openFilePicker: () => void;
  hiddenInput: React.ReactElement;
  dictate: { supported: boolean; isListening: boolean; toggle: () => void };
}

const PromptInputContext = React.createContext<PromptInputContextValue | null>(null);

function usePromptInputContext(): PromptInputContextValue {
  const context = React.useContext(PromptInputContext);
  if (!context) throw new Error('PromptInput primitives must be rendered inside <PromptInput>.');
  return context;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

export interface PromptInputProps {
  onSubmit: (value: string) => void;
  /** Called when the user requests to stop an in-flight generation. */
  onStop?: () => void;
  /**
   * Externally owned attachment queue. When omitted, PromptInput manages its
   * own queue with drag-and-drop + clipboard-paste support.
   */
  attachments?: AttachmentItem[];
  onRemoveAttachment?: (attachment: AttachmentItem) => void;
  /** Called whenever the managed attachment queue changes. */
  onAttachmentsChange?: (attachments: AttachmentItem[]) => void;
  /** Marks submission as failed; the send control reflects the error state. */
  hasError?: boolean;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxFileSize?: number;
  onAttachmentError?: UseAttachmentsOptions['onError'];
  /** Accept file drops anywhere on the document (default false). */
  globalDrop?: boolean;
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  autoFocus?: boolean;
  maxLength?: number;
  showSendButton?: boolean;
  sendButtonText?: string;
  stopButtonText?: string;
  children?: React.ReactNode;
}

const PromptInputRoot = React.forwardRef<HTMLTextAreaElement, PromptInputProps>(
  ({
    onSubmit,
    onStop,
    attachments: controlledAttachments,
    onRemoveAttachment,
    onAttachmentsChange,
    hasError = false,
    accept,
    multiple = true,
    maxFiles,
    maxFileSize,
    onAttachmentError,
    globalDrop = false,
    placeholder = 'Type your message...',
    disabled = false,
    isLoading = false,
    className,
    autoFocus = false,
    maxLength,
    showSendButton = true,
    sendButtonText = 'Send',
    stopButtonText = 'Stop generating',
    children,
    ...props
  }, ref) => {
    const [value, setValue] = React.useState('');
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    const managed = usePromptInputAttachments({ accept, maxFiles, maxFileSize, multiple, onError: onAttachmentError });

    // Notify consumers of managed-queue changes.
    const prevManagedCount = React.useRef(0);
    React.useEffect(() => {
      if (!controlledAttachments && managed.files.length !== prevManagedCount.current) {
        prevManagedCount.current = managed.files.length;
        onAttachmentsChange?.(managed.files);
      }
    }, [managed.files, controlledAttachments, onAttachmentsChange]);

    const activeAttachments = controlledAttachments ?? managed.files;

    // Auto-focus on mount if requested
    React.useEffect(() => {
      if (autoFocus && textareaRef.current) textareaRef.current.focus();
    }, [autoFocus]);

    // Merge forwarded ref with internal handle (auto-resize needs it).
    React.useImperativeHandle(ref, () => textareaRef.current!);

    // Auto-resize textarea
    React.useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }, [value]);

    // Global drop: opt-in document-level listener.
    React.useEffect(() => {
      if (!globalDrop || controlledAttachments) return;
      const prevent = (event: DragEvent) => event.preventDefault();
      const drop = (event: DragEvent) => {
        event.preventDefault();
        if (event.dataTransfer?.files.length) managed.add(event.dataTransfer.files);
      };
      document.addEventListener('dragover', prevent);
      document.addEventListener('drop', drop);
      return () => {
        document.removeEventListener('dragover', prevent);
        document.removeEventListener('drop', drop);
      };
    }, [globalDrop, controlledAttachments, managed]);

    const canSubmit = Boolean(value.trim()) && !disabled && !isLoading;

    const handleSubmit = () => {
      const trimmedValue = value.trim();
      if (!trimmedValue || disabled || isLoading) return;
      onSubmit(trimmedValue);
      setValue('');
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
      if (!controlledAttachments) managed.clear();
    };

    const handleStop = () => onStop?.();

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleSubmit();
      }
    };

    const dictate = useSpeechRecognition((transcript) =>
      setValue((current) => (current ? `${current} ${transcript}` : transcript))
    );

    const contextValue: PromptInputContextValue = {
      value,
      setValue,
      disabled,
      isLoading,
      canSubmit,
      submit: handleSubmit,
      stop: handleStop,
      hasStop: Boolean(onStop),
      attachments: activeAttachments,
      removeAttachment: (id) => (controlledAttachments ? onRemoveAttachment?.({ id } as AttachmentItem) : managed.remove(id)),
      addFiles: (files) => !controlledAttachments && managed.add(files),
      openFilePicker: managed.openFileDialog,
      hiddenInput: managed.input,
      dictate,
    };

    const showStop = isLoading && Boolean(onStop);
    const submitIcon = showStop ? '■' : hasError ? '⚠' : '→';
    const submitLabel = showStop ? stopButtonText : hasError ? 'Failed — check message' : sendButtonText;

    const textarea = (
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(event) => setValue(event.target.value)}
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
    );

    const sendButton = showSendButton ? (
      <Button
        onClick={showStop ? handleStop : handleSubmit}
        disabled={showStop ? false : !canSubmit || disabled}
        variant={showStop ? 'outline' : 'default'}
        size="icon"
        type="button"
        aria-label={submitLabel}
      >
        <span aria-hidden="true">{submitIcon}</span>
      </Button>
    ) : null;

    // Drop/paste surface wraps everything in both modes.
    const dropHandlers = controlledAttachments
      ? {}
      : {
          onDrop: (event: React.DragEvent) => {
            event.preventDefault();
            if (event.dataTransfer.files.length) managed.add(event.dataTransfer.files);
          },
          onPaste: (event: React.ClipboardEvent) => {
            const files = event.clipboardData?.files;
            if (files && files.length > 0) {
              event.preventDefault();
              managed.add(files);
            }
          },
        };

    return (
      <PromptInputContext.Provider value={contextValue}>
        <div className={cn('flex flex-col gap-2', className)} {...dropHandlers} {...props}>
          {activeAttachments.length > 0 && (
            <AttachmentList
              attachments={activeAttachments}
              onRemove={controlledAttachments ? onRemoveAttachment : (a) => managed.remove(a.id)}
            />
          )}

          {children ? (
            <>
              {children}
              {managed.input}
            </>
          ) : (
            <>
              <div className="flex gap-2 items-end">
                {textarea}
                {sendButton}
              </div>
              {managed.input}
            </>
          )}
        </div>
      </PromptInputContext.Provider>
    );
  }
);
PromptInputRoot.displayName = 'PromptInput';

// ---------------------------------------------------------------------------
// Compound primitives
// ---------------------------------------------------------------------------

/** Auto-resizing textarea bound to the prompt state. Accepts standard textarea props. */
const PromptInputTextarea = React.forwardRef<
  HTMLTextAreaElement,
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange'>
>(({ className, onKeyDown, ...props }, ref) => {
  const { value, setValue, disabled, isLoading, submit } = usePromptInputContext();
  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault();
          submit();
        }
        onKeyDown?.(event);
      }}
      disabled={disabled || isLoading}
      rows={1}
      className={cn(
        'flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm',
        'placeholder:text-muted-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'min-h-[40px]',
        className
      )}
      {...props}
    />
  );
});
PromptInputTextarea.displayName = 'PromptInputTextarea';

/** Status-aware submit control: send / stop / error icons chosen automatically. */
const PromptInputSubmit = React.forwardRef<HTMLButtonElement, { className?: string }>(({ className }, ref) => {
  const { canSubmit, isLoading, hasStop, submit, stop, disabled } = usePromptInputContext();
  return (
    <Button
      ref={ref}
      onClick={isLoading && hasStop ? stop : submit}
      disabled={isLoading && hasStop ? false : !canSubmit || disabled}
      variant={isLoading && hasStop ? 'outline' : 'default'}
      size="icon"
      type="button"
      aria-label={isLoading && hasStop ? 'Stop generating' : 'Send'}
      className={className}
    >
      <span aria-hidden="true">{isLoading && hasStop ? '■' : '→'}</span>
    </Button>
  );
});
PromptInputSubmit.displayName = 'PromptInputSubmit';

/** Toolbar row under the textarea. */
function PromptInputFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center justify-between gap-2 pt-1', className)} {...props} />;
}

/** Left-aligned group of tools inside a footer. */
function PromptInputTools({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center gap-1', className)} {...props} />;
}

/** Row above the textarea (attachments, hints). */
function PromptInputHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-1', className)} {...props} />;
}

/** Wrapper around the textarea row. */
function PromptInputBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex gap-2 items-end', className)} {...props} />;
}

export interface PromptInputButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Tooltip content; optionally includes a keyboard shortcut hint. */
  tooltip?: string | { content: React.ReactNode; shortcut?: string };
  active?: boolean;
}

/** Small toolbar button with optional tooltip and shortcut hint. */
const PromptInputButton = React.forwardRef<HTMLButtonElement, PromptInputButtonProps>(
  ({ tooltip, active = false, className, ...props }, ref) => {
    const tip = typeof tooltip === 'string' ? { content: tooltip } : tooltip;
    return (
      <span className="relative inline-flex group/tip">
        <button
          ref={ref}
          type="button"
          aria-pressed={active || undefined}
          className={cn(
            'inline-flex h-7 items-center gap-1 rounded-md border border-transparent px-2 text-xs text-muted-foreground transition-colors',
            'hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            active && 'border-border bg-muted text-foreground',
            className
          )}
          {...props}
        />
        {tip && (
          <span
            role="tooltip"
            className="pointer-events-none absolute bottom-full left-0 mb-1 z-10 flex items-center gap-1 whitespace-nowrap rounded border border-border bg-popover px-2 py-0.5 text-[11px] text-popover-foreground opacity-0 shadow-sm transition-opacity group-hover/tip:opacity-100"
          >
            {tip.content}
            {tip.shortcut && <kbd className="rounded bg-muted px-1 font-mono">{tip.shortcut}</kbd>}
          </span>
        )}
      </span>
    );
  }
);
PromptInputButton.displayName = 'PromptInputButton';

/** Dictation toggle using the Web Speech API; hidden when unsupported. */
function PromptInputActionDictate({ labels }: { labels?: { start?: string; stop?: string } }) {
  const { dictate } = usePromptInputContext();
  if (!dictate.supported) return null;
  return (
    <PromptInputButton
      onClick={dictate.toggle}
      active={dictate.isListening}
      tooltip={{ content: dictate.isListening ? labels?.stop ?? 'Stop dictating' : labels?.start ?? 'Dictate' }}
      aria-label={dictate.isListening ? labels?.stop ?? 'Stop dictation' : labels?.start ?? 'Start dictation'}
    >
      <span aria-hidden="true">🎙</span>
    </PromptInputButton>
  );
}

/** Opens the managed file picker with configured constraints. */

/** Opens the managed file picker with configured constraints. */
function PromptInputActionAddAttachments({ label = 'Add photos or files' }: { label?: string }) {
  const { openFilePicker } = usePromptInputContext();
  return (
    <PromptInputButton onClick={openFilePicker}>
      <span aria-hidden="true">＋</span>
      <span>{label}</span>
    </PromptInputButton>
  );
}

export {
  PromptInputRoot as PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
  PromptInputFooter,
  PromptInputTools,
  PromptInputHeader,
  PromptInputBody,
  PromptInputButton,
  PromptInputActionDictate,
  PromptInputActionAddAttachments,
};
