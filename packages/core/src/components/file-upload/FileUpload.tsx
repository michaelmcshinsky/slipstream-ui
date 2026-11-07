'use client';

import * as React from 'react';
import { cn } from '../../utils/cn';

export type FileUploadProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> & {
  /** Controlled selection. */
  files?: File[];
  /** Initial selection when uncontrolled. */
  defaultFiles?: File[];
  /** Fired whenever the list changes (add, remove, drop, clear). */
  onFilesChange?: (files: File[]) => void;
  /** Drag-and-drop area copy. */
  label?: string;
  hint?: string;
  /** Accessible label for the selected-files list. Default 'Selected files'. */
  selectedFilesLabel?: string;
  /** Accessible label for a file's remove button. Default `Remove <name>`. */
  removeLabel?: (file: File) => string;
  /** Accessible label for a file's upload progress. Default `Uploading <name>`. */
  uploadingLabel?: (file: File) => string;
  /** Per-file progress (0-100) keyed by file name, rendered as a bar. */
  progress?: Record<string, number>;
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Drag-and-drop file picker with a removable list. The native input drives
 * selection (keyboard + mobile camera/file dialogs); the drop zone is a
 * progressive enhancement. Files are plain `File` objects, so you own the
 * upload transport and can render progress per file.
 */
export const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(function FileUpload(
  {
    files,
    defaultFiles,
    onFilesChange,
    label = 'Drop files here or click to browse',
    hint,
    selectedFilesLabel = 'Selected files',
    removeLabel = (file: File) => `Remove ${file.name}`,
    uploadingLabel = (file: File) => `Uploading ${file.name}`,
    progress,
    multiple = true,
    accept,
    disabled,
    className,
    id,
    ...props
  },
  ref
) {
  const [internal, setInternal] = React.useState<File[]>(defaultFiles ?? []);
  const [dragging, setDragging] = React.useState(false);
  const current = files ?? internal;
  const generatedId = React.useId();
  const inputId = id ?? generatedId;

  const commit = (next: File[]) => {
    if (files === undefined) setInternal(next);
    onFilesChange?.(next);
  };

  const add = (incoming: FileList | null) => {
    if (!incoming || incoming.length === 0) return;
    const list = Array.from(incoming);
    commit(multiple ? [...current, ...list] : list.slice(0, 1));
  };

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div
        onDragOver={(event) => {
          if (disabled) return;
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          if (disabled) return;
          event.preventDefault();
          setDragging(false);
          add(event.dataTransfer.files);
        }}
        className={cn(
          'rounded-lg border border-dashed border-border p-6 text-center transition-colors',
          dragging && 'border-primary bg-primary/5',
          disabled && 'opacity-50'
        )}
      >
        <label htmlFor={inputId} className={cn('block text-sm', disabled ? 'cursor-not-allowed' : 'cursor-pointer')}>
          {label}
          <input
            ref={ref}
            id={inputId}
            type="file"
            multiple={multiple}
            accept={accept}
            disabled={disabled}
            className="sr-only"
            onChange={(event) => {
              add(event.target.files);
              event.target.value = '';
            }}
            {...props}
          />
        </label>
        <p className="mt-1 text-xs text-muted-foreground">
          {hint ?? (accept ? `Accepted: ${accept}` : 'Any file type')}
        </p>
      </div>

      {current.length > 0 && (
        <ul aria-label={selectedFilesLabel} className="space-y-2">
          {current.map((file) => (
            <li key={file.name} className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2">
              <div className="min-w-0">
                <p className="truncate text-sm">{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
                {progress?.[file.name] !== undefined && (
                  <div
                    role="progressbar"
                    aria-valuenow={progress[file.name]}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={uploadingLabel(file)}
                    className="mt-1 h-1.5 w-40 overflow-hidden rounded-full bg-muted"
                  >
                    <div className="h-full bg-primary" style={{ width: `${progress[file.name]}%` }} />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => commit(current.filter((entry) => entry.name !== file.name))}
                aria-label={removeLabel(file)}
                className="rounded p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});
